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
                    rows: clients.expand<DataRow>((c) {
                      final subs = c['subscriptions'] as List<dynamic>? ?? [];
                      if (subs.isEmpty) {
                        return [
                          DataRow(
                            cells: [
                              DataCell(Text(c['name'] ?? 'Sem Nome')),
                              DataCell(Text(c['cpf'] ?? 'Sem CPF')),
                              const DataCell(Text('Nenhum')),
                              DataCell(
                                Container(
                                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                                  decoration: BoxDecoration(color: Colors.grey.withOpacity(0.1), borderRadius: BorderRadius.circular(8)),
                                  child: const Text('SEM PLANO', style: TextStyle(color: Colors.grey, fontSize: 12, fontWeight: FontWeight.bold)),
                                ),
                              ),
                              const DataCell(Text('-')),
                            ],
                          )
                        ];
                      }

                      return subs.map((sub) {
                        final isActive = sub['status'] == 'ACTIVE';
                        final statusStr = sub['status'] ?? 'INACTIVE';
                        final planStr = sub['plan'] != null ? sub['plan']['name'] : 'Nenhum';

                        final statusColor = statusStr == 'ACTIVE' ? Colors.green
                            : statusStr == 'SCHEDULED' ? Colors.blue
                            : statusStr == 'AWAITING_SCHEDULE' ? Colors.deepPurple
                            : statusStr == 'CANCELLED' ? Colors.grey
                            : Colors.orange;
                        final statusLabel = statusStr == 'AWAITING_SCHEDULE' ? 'AGUARDANDO CLIENTE' 
                            : statusStr == 'SCHEDULED' ? 'AGENDADO'
                            : statusStr;

                        return DataRow(
                          cells: [
                            DataCell(Text(c['name'] ?? 'Sem Nome')),
                            DataCell(Text(c['cpf'] ?? 'Sem CPF')),
                            DataCell(Text(planStr)),
                            DataCell(
                              Container(
                                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                                decoration: BoxDecoration(
                                  color: statusColor.withOpacity(0.1),
                                  borderRadius: BorderRadius.circular(8),
                                ),
                                child: Text(
                                  statusLabel,
                                  style: TextStyle(color: statusColor, fontSize: 12, fontWeight: FontWeight.bold),
                                ),
                              ),
                            ),
                            DataCell(
                              Row(
                                children: [
                                  if (statusStr == 'PENDING_INSTALL')
                                    IconButton(
                                      icon: const Icon(LucideIcons.calendarCheck, size: 18, color: Colors.green),
                                      tooltip: 'Propor Horários de Instalação',
                                      onPressed: () => _showInstallationWizard(context, ref, sub['id'], c['name'] ?? 'Cliente'),
                                    )
                                  else if (statusStr == 'SCHEDULED')
                                    Tooltip(
                                      message: sub['installationTime'] ?? '',
                                      child: const Icon(LucideIcons.checkCircle, size: 18, color: Colors.blue),
                                    )
                                  else if (statusStr == 'AWAITING_SCHEDULE')
                                    const Tooltip(
                                      message: 'Aguardando cliente escolher horário',
                                      child: Icon(LucideIcons.clock, size: 18, color: Colors.deepPurple),
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
                      });
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
    final slots = <String>[];
    DateTime selectedDate = DateTime.now().add(const Duration(days: 1));
    String selectedRange = '09h-12h';
    final ranges = ['09h-12h', '12h-15h', '15h-18h'];

    showDialog(
      context: context,
      builder: (ctx) => StatefulBuilder(
        builder: (ctx, setState) => AlertDialog(
          title: Text('Propor Horários - $clientName'),
          content: SizedBox(
            width: 450,
            child: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text('Adicione os horários disponíveis para instalação. O cliente escolherá o melhor.', style: TextStyle(fontSize: 13)),
                const SizedBox(height: 16),
                Row(
                  children: [
                    Expanded(
                      child: InkWell(
                        onTap: () async {
                          final picked = await showDatePicker(
                            context: ctx,
                            initialDate: selectedDate,
                            firstDate: DateTime.now(),
                            lastDate: DateTime.now().add(const Duration(days: 60)),
                          );
                          if (picked != null) setState(() => selectedDate = picked);
                        },
                        child: InputDecorator(
                          decoration: const InputDecoration(labelText: 'Data', border: OutlineInputBorder(), isDense: true),
                          child: Text('${selectedDate.day.toString().padLeft(2,'0')}/${selectedDate.month.toString().padLeft(2,'0')}'),
                        ),
                      ),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: DropdownButtonFormField<String>(
                        value: selectedRange,
                        decoration: const InputDecoration(labelText: 'Intervalo', border: OutlineInputBorder(), isDense: true),
                        items: ranges.map((r) => DropdownMenuItem(value: r, child: Text(r))).toList(),
                        onChanged: (v) => setState(() => selectedRange = v!),
                      ),
                    ),
                    const SizedBox(width: 8),
                    IconButton(
                      icon: const Icon(LucideIcons.plusCircle, color: Colors.green),
                      tooltip: 'Adicionar horário',
                      onPressed: () {
                        final label = '${selectedDate.day.toString().padLeft(2,'0')}/${selectedDate.month.toString().padLeft(2,'0')} $selectedRange';
                        if (!slots.contains(label)) {
                          setState(() => slots.add(label));
                        }
                      },
                    ),
                  ],
                ),
                const SizedBox(height: 12),
                if (slots.isNotEmpty) ...[
                  const Text('Horários propostos:', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 12)),
                  const SizedBox(height: 8),
                  Wrap(
                    spacing: 8,
                    runSpacing: 6,
                    children: slots.map((s) => Chip(
                      label: Text(s, style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold)),
                      backgroundColor: Colors.green.shade50,
                      deleteIcon: const Icon(Icons.close, size: 16),
                      onDeleted: () => setState(() => slots.remove(s)),
                    )).toList(),
                  ),
                ],
              ],
            ),
          ),
          actions: [
            TextButton(onPressed: () => Navigator.pop(ctx), child: const Text('Cancelar')),
            ElevatedButton(
              onPressed: slots.isEmpty ? null : () async {
                Navigator.pop(ctx);
                try {
                  await ref.read(apiServiceProvider).sendInstallationOptions(subscriptionId, slots);
                  if (context.mounted) {
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(content: Text('Opções enviadas ao cliente com sucesso!'), backgroundColor: Colors.green),
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
              child: const Text('Enviar Opções ao Cliente'),
            ),
          ],
        ),
      ),
    );
  }
}
