import { Router, Request, Response } from "express";
import { authMiddleware } from "../middleware/auth";
import { LunaRagService } from "../services/lunaRagService";

const router = Router();

// ============================================================
// DIAGNOSTIC TOOLS — run server-side before calling the AI
// In production, replace these stubs with real API calls:
//   - Zabbix REST API for check_network_status
//   - GenieACS API for check_router_status and reboot_router
//   - OLT SNMP/API for check_optical_signal
// ============================================================

interface DiagnosticResult {
  invoice: { has_overdue: boolean; amount: number | null };
  network: { has_incident: boolean; message: string };
  optical: { rx_power_dbm: number; status: "ok" | "warning" | "critical"; comment: string };
  router: {
    online: boolean; uptime_hours: number;
    rx_speed_mbps: number; connected_devices: number;
    wifi_2g_signal_dbm: number; wifi_5g_signal_dbm: number;
  };
}

async function runDiagnostics(_clientId: string, _cpf: string, _macAddress: string, _region: string): Promise<DiagnosticResult> {
  // TODO: Replace each stub below with real API calls

  // 1. Check overdue invoices (real: Prisma DB query by CPF)
  const invoice = { has_overdue: false, amount: null };

  // 2. Check Zabbix for regional incident
  const network = { has_incident: false, message: "Sem incidentes detectados na região" };

  // 3. Check OLT optical signal via SNMP
  const rxPower = -21.5;
  const optical = {
    rx_power_dbm: rxPower,
    status: (rxPower < -27 ? "critical" : rxPower < -24 ? "warning" : "ok") as "ok" | "warning" | "critical",
    comment: rxPower < -27 ? "Sinal crítico — possível corte de fibra" : rxPower < -24 ? "Sinal fraco — possível dobra no cabo" : "Sinal óptico normal",
  };

  // 4. Check router via TR-069/GenieACS
  const router = {
    online: true,
    uptime_hours: 48,
    rx_speed_mbps: 492,
    connected_devices: 7,
    wifi_2g_signal_dbm: -62,
    wifi_5g_signal_dbm: -55,
  };

  return { invoice, network, optical, router };
}

function buildDiagnosticContext(d: DiagnosticResult, subject: string): string {
  const lines = [
    `=== RESULTADO DO DIAGNÓSTICO AUTOMÁTICO ===`,
    `Assunto: ${subject}`,
    ``,
    `1. FATURA: ${d.invoice.has_overdue ? `⚠️ INADIMPLENTE — R$ ${d.invoice.amount}` : "✅ Em dia, sem bloqueio"}`,
    `2. REDE REGIONAL: ${d.network.has_incident ? `⚠️ INCIDENTE: ${d.network.message}` : "✅ " + d.network.message}`,
    `3. SINAL DA FIBRA (OLT): ${d.optical.status === "ok" ? "✅" : "⚠️"} ${d.optical.rx_power_dbm} dBm — ${d.optical.comment}`,
    `4. ROTEADOR (TR-069): ${d.router.online ? "✅ Online" : "❌ Offline"}`,
    `   - Velocidade chegando: ${d.router.rx_speed_mbps} Mbps`,
    `   - Dispositivos conectados: ${d.router.connected_devices}`,
    `   - Wi-Fi 2.4GHz: ${d.router.wifi_2g_signal_dbm} dBm`,
    `   - Wi-Fi 5GHz: ${d.router.wifi_5g_signal_dbm} dBm`,
    `==========================================`,
  ];
  return lines.join("\n");
}

// POST /chat
router.post("/", authMiddleware, async (req: Request, res: Response) => {
  type ChatMessage = { role: string; content: string };
  const { messages, context } = req.body as {
    messages: ChatMessage[];
    context: {
      subject: string; userName: string;
      clientId: string; cpf: string;
      region: string; macAddress: string;
    };
  };

  if (!messages || !Array.isArray(messages)) {
    res.status(400).json({ error: "messages é obrigatório" });
    return;
  }

  try {
    // 1. Run all diagnostics BEFORE calling the AI
    const diagnostics = await runDiagnostics(
      context?.clientId || "001",
      context?.cpf || "000.000.000-00",
      context?.macAddress || "AA:BB:CC:DD:EE:FF",
      context?.region || "Centro",
    );

    const diagContext = buildDiagnosticContext(diagnostics, context?.subject || "problema técnico");

    // 2. Delegate Semantic Search and NIM Inference to the RAG Service
    const userMessage = messages[messages.length - 1].content;
    const history = messages.slice(0, -1);
    
    // The RAG Service handles embedding generation, cosine similarity, and LLM inference
    const replyRaw = await LunaRagService.ask(userMessage, history, diagContext);
    
    // 3. Parse internal mechanics (Ticket Escalation logic)
    const openTicket = replyRaw.includes("ABRIR_CHAMADO");
    const safeReply = replyRaw.replace("ABRIR_CHAMADO", "").trim();

    res.json({ reply: safeReply, openTicket });
  } catch (err) {
    console.error("Chat error:", err);
    res.status(500).json({ error: "Erro interno ao processar mensagem." });
  }
});

export default router;
