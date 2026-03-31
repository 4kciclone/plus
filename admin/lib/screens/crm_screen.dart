import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lucide_icons/lucide_icons.dart';
import '../services/api_service.dart';

class CrmScreen extends ConsumerWidget {
  const CrmScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final colors = Theme.of(context).colorScheme;

    final clientsAsync = ref.watch(crmProvider);

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            const Text('CRM de Assinantes', style: TextStyle(fontSize: 28, fontWeight: FontWeight.bold)),
            ElevatedButton.icon(
              onPressed: () {},
              icon: const Icon(LucideIcons.userPlus),
              label: const Text('Novo Assinante'),
              style: ElevatedButton.styleFrom(
                backgroundColor: colors.primary,
                foregroundColor: Colors.white,
                padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
              ),
            ),
          ],
        ),
        const SizedBox(height: 24),
        Expanded(
          child: Card(
            child: clientsAsync.when(
              loading: () => const Center(child: CircularProgressIndicator()),
              error: (err, stack) => Center(child: Text('Erro ao carregar CRM: $err')),
              data: (clients) => SingleChildScrollView(
                scrollDirection: Axis.horizontal,
                child: ConstrainedBox(
                  constraints: BoxConstraints(minWidth: MediaQuery.of(context).size.width - 300),
                  child: DataTable(
                    headingRowColor: WidgetStateProperty.all(colors.surface),
                    columns: const [
                      DataColumn(label: Text('Nome', style: TextStyle(fontWeight: FontWeight.bold))),
                      DataColumn(label: Text('CPF', style: TextStyle(fontWeight: FontWeight.bold))),
                      DataColumn(label: Text('Plano', style: TextStyle(fontWeight: FontWeight.bold))),
                      DataColumn(label: Text('Status', style: TextStyle(fontWeight: FontWeight.bold))),
                      DataColumn(label: Text('Ações', style: TextStyle(fontWeight: FontWeight.bold))),
                    ],
                    rows: clients.map((c) {
                      final subs = c['subscriptions'] as List<dynamic>? ?? [];
                      final sub = subs.isNotEmpty ? subs.first : null;
                      final isActive = sub != null && sub['status'] == 'ACTIVE';
                      final statusStr = sub != null ? sub['status'] : 'INACTIVE';
                      final planStr = sub != null && sub['plan'] != null ? sub['plan']['name'] : 'Nenhum';

                      return DataRow(
                        cells: [
                          DataCell(Text(c['name'] ?? 'Sem Nome')),
                          DataCell(Text(c['cpf'] ?? 'Sem CPF')),
                          DataCell(Text(planStr)),
                          DataCell(
                            Container(
                              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                              decoration: BoxDecoration(
                                color: isActive ? Colors.green.withOpacity(0.1) : Colors.orange.withOpacity(0.1),
                                borderRadius: BorderRadius.circular(8),
                              ),
                              child: Text(
                                statusStr,
                                style: TextStyle(color: isActive ? Colors.green : Colors.orange, fontSize: 12, fontWeight: FontWeight.bold),
                              ),
                            ),
                          ),
                          DataCell(
                            Row(
                              children: [
                                if (statusStr == 'PENDING_INSTALL')
                                  IconButton(
                                    icon: const Icon(LucideIcons.calendarCheck, size: 18, color: Colors.green),
                                    tooltip: 'Agendar Instalação e Ativar',
                                    onPressed: () => _showInstallationWizard(context, ref, sub['id'], c['name'] ?? 'Cliente'),
                                  )
                                else ...[
                                  IconButton(icon: const Icon(LucideIcons.edit, size: 18), onPressed: () {}),
                                  IconButton(
                                    icon: const Icon(LucideIcons.userX, size: 18, color: Colors.red),
                                    tooltip: 'Cancelamento Inteligente',
                                    onPressed: () => _showCancellationWizard(context, c['name'] ?? 'Cliente'),
                                  ),
                                ],
                              ],
                            ),
                          ),
                        ],
                      );
                    }).toList(),
                  ),
                ),
              ),
            ),
          ),
        ),
      ],
    );
  }

  void _showCancellationWizard(BuildContext context, String clientName) {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        title: Text('Cancelar Assinatura - $clientName'),
        content: SizedBox(
          width: 500,
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              const Text('O sistema verificará multas contratuais e agendará o recolhimento do equipamento com o técnico.'),
              const SizedBox(height: 16),
              TextField(
                decoration: const InputDecoration(labelText: 'Motivo do Cancelamento', border: OutlineInputBorder()),
                maxLines: 3,
              ),
              const SizedBox(height: 16),
              const ListTile(
                leading: Icon(LucideIcons.alertTriangle, color: Colors.orange),
                title: Text('Aviso de Multa: R\$ 240,00', style: TextStyle(fontWeight: FontWeight.bold, color: Colors.orange)),
                subtitle: Text('Faltam 4 meses para o fim da fidelidade.'),
              ),
            ],
          ),
        ),
        actions: [
          TextButton(onPressed: () => Navigator.pop(ctx), child: const Text('Voltar')),
          ElevatedButton(
            onPressed: () => Navigator.pop(ctx),
            style: ElevatedButton.styleFrom(backgroundColor: Colors.red, foregroundColor: Colors.white),
            child: const Text('Confirmar Bloqueio e Cancelamento'),
          ),
        ],
      ),
    );
  }

  void _showInstallationWizard(BuildContext context, WidgetRef ref, String subscriptionId, String clientName) {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        title: Text('Agendar Instalação - $clientName'),
        content: SizedBox(
          width: 400,
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              const Text('Ao confirmar, a assinatura mudará para Ativa e o equipamento será provisionado na OLT central.'),
              const SizedBox(height: 16),
              const ListTile(
                leading: Icon(LucideIcons.checkCircle, color: Colors.green),
                title: Text('Status da Fibra: Disponível', style: TextStyle(fontWeight: FontWeight.bold, color: Colors.green)),
                subtitle: Text('Há portas livres na CTO mais próxima.'),
              ),
            ],
          ),
        ),
        actions: [
          TextButton(onPressed: () => Navigator.pop(ctx), child: const Text('Cancelar')),
          ElevatedButton(
            onPressed: () async {
              Navigator.pop(ctx);
              try {
                await ref.read(apiServiceProvider).updateSubscriptionStatus(subscriptionId, 'ACTIVE');
                if (context.mounted) {
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(content: Text('Instalação Agendada e Plano Ativado com Sucesso!'), backgroundColor: Colors.green),
                  );
                }
                ref.invalidate(crmProvider);
              } catch (e) {
                if (context.mounted) {
                  ScaffoldMessenger.of(context).showSnackBar(
                    SnackBar(content: Text('Erro: $e'), backgroundColor: Colors.red),
                  );
                }
              }
            },
            style: ElevatedButton.styleFrom(backgroundColor: Colors.green, foregroundColor: Colors.white),
            child: const Text('Confirmar Instalação'),
          ),
        ],
      ),
    );
  }
}
