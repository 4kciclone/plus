import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lucide_icons/lucide_icons.dart';
import '../services/api_service.dart';

class FinanceScreen extends ConsumerWidget {
  const FinanceScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final colors = Theme.of(context).colorScheme;

    final invoicesAsync = ref.watch(financeProvider);

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            const Text('Tesouraria & Inadimplência', style: TextStyle(fontSize: 28, fontWeight: FontWeight.bold)),
            ElevatedButton.icon(
              onPressed: () {
                ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Disparando Pix e Boletos via WhatsApp (Mock)...')));
              },
              icon: const Icon(LucideIcons.send),
              label: const Text('Disparar Cobranças em Lote (WhatsApp)'),
              style: ElevatedButton.styleFrom(
                backgroundColor: Colors.green,
                foregroundColor: Colors.white,
                padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
              ),
            ),
          ],
        ),
        const SizedBox(height: 24),
        Expanded(
          child: Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Lista de Inadimplentes
              Expanded(
                flex: 2,
                child: Card(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Padding(
                        padding: EdgeInsets.all(20.0),
                        child: Text('Clientes com Atraso', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
                      ),
                      const Divider(height: 1),
                      Expanded(
                        child: invoicesAsync.when(
                          loading: () => const Center(child: CircularProgressIndicator()),
                          error: (err, stack) => Center(child: Text('Erro ao carregar: $err')),
                          data: (allInvoices) {
                            final unpaidInvoices = allInvoices.where((i) => i['paid'] == false).toList();
                            if (unpaidInvoices.isEmpty) {
                              return const Center(child: Text('Nenhuma inadimplência pendente.'));
                            }
                            return ListView.separated(
                              itemCount: unpaidInvoices.length,
                              separatorBuilder: (_, __) => const Divider(height: 1),
                              itemBuilder: (context, index) {
                                final d = unpaidInvoices[index];
                                final dueDate = DateTime.parse(d['dueDate']);
                                final diff = DateTime.now().difference(dueDate).inDays;
                                final daysOverdue = diff > 0 ? diff : 0;
                                final isCritical = daysOverdue > 15;
                                
                                return ListTile(
                                  contentPadding: const EdgeInsets.symmetric(horizontal: 20, vertical: 8),
                                  leading: CircleAvatar(
                                    backgroundColor: isCritical ? Colors.red.withOpacity(0.1) : Colors.orange.withOpacity(0.1),
                                    child: Icon(LucideIcons.user, color: isCritical ? Colors.red : Colors.orange),
                                  ),
                                  title: Text(d['user']['name'] as String, style: const TextStyle(fontWeight: FontWeight.bold)),
                                  subtitle: Text('CPF: ${d['user']['cpf']}'),
                                  trailing: Column(
                                    mainAxisAlignment: MainAxisAlignment.center,
                                    crossAxisAlignment: CrossAxisAlignment.end,
                                    children: [
                                      Text('R\$ ${d['amount'].toStringAsFixed(2)}', style: const TextStyle(fontWeight: FontWeight.w900, fontSize: 16)),
                                      Text('$daysOverdue dias de atraso', style: TextStyle(color: isCritical ? Colors.red : Colors.orange, fontSize: 12, fontWeight: FontWeight.bold)),
                                    ],
                                  ),
                                );
                              },
                            );
                          },
                        ),
                      ),
                    ],
                  ),
                ),
              ),
              const SizedBox(width: 24),
              // Configurações do Motor de Corte
              Expanded(
                flex: 1,
                child: Card(
                  child: Padding(
                    padding: const EdgeInsets.all(24.0),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Row(
                          children: [
                            Icon(LucideIcons.settings, color: Colors.grey),
                            SizedBox(width: 8),
                            Text('Motor de Bloqueio Automático', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
                          ],
                        ),
                        const SizedBox(height: 24),
                        const Text('Dias para Bloqueio no Radius (MikroTik):', style: TextStyle(fontSize: 12)),
                        const SizedBox(height: 8),
                        TextFormField(
                          initialValue: '15',
                          decoration: const InputDecoration(border: OutlineInputBorder(), suffixText: 'dias'),
                          keyboardType: TextInputType.number,
                        ),
                        const SizedBox(height: 16),
                        SwitchListTile(
                          contentPadding: EdgeInsets.zero,
                          title: const Text('Bloquear conexões na OLT?'),
                          value: true,
                          onChanged: (val) {},
                          activeColor: colors.primary,
                        ),
                        const Spacer(),
                        SizedBox(
                          width: double.infinity,
                          child: OutlinedButton(
                            onPressed: () {},
                            style: OutlinedButton.styleFrom(
                              padding: const EdgeInsets.symmetric(vertical: 16),
                              side: BorderSide(color: colors.primary),
                            ),
                            child: const Text('Salvar Parâmetros'),
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }
}
