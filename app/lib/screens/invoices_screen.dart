import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lucide_icons/lucide_icons.dart';
import '../services/api_service.dart';

final invoicesProvider = FutureProvider<List<dynamic>>((ref) async {
  final res = await ref.read(apiProvider).get('/invoices/my');
  return res.data;
});

class InvoicesScreen extends ConsumerWidget {
  const InvoicesScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final invoicesOpt = ref.watch(invoicesProvider);
    final colors = Theme.of(context).colorScheme;

    return Scaffold(
      appBar: AppBar(
        title: const Row(
          children: [
            Hero(tag: 'hero-Faturas', child: Icon(LucideIcons.receipt, color: Colors.white)),
            SizedBox(width: 12),
            Text('Minhas Faturas', style: TextStyle(fontWeight: FontWeight.bold)),
          ],
        ),
        backgroundColor: Colors.transparent,
      ),
      body: invoicesOpt.when(
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (err, stack) => Center(child: Text('Erro: $err')),
        data: (invoices) {
          if (invoices.isEmpty) {
            return Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(LucideIcons.checkCircle, size: 60, color: colors.primary.withOpacity(0.5)),
                  const SizedBox(height: 16),
                  const Text('Tudo em dia!', style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold)),
                  Text('Você não tem faturas no momento.', style: TextStyle(color: Colors.white.withOpacity(0.6))),
                ],
              ),
            );
          }
          return ListView.separated(
            padding: const EdgeInsets.all(24),
            itemCount: invoices.length,
            separatorBuilder: (_, __) => const SizedBox(height: 16),
            itemBuilder: (context, index) {
              final inv = invoices[index];
              final isPending = inv['status'] == 'PENDING';
              return Container(
                padding: const EdgeInsets.all(24),
                decoration: BoxDecoration(
                  color: colors.surface,
                  borderRadius: BorderRadius.circular(20),
                  border: Border.all(color: isPending ? colors.primary.withOpacity(0.3) : Colors.transparent),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text(
                          'R\$ ${inv['amount'].toStringAsFixed(2).replaceFirst('.', ',')}',
                          style: const TextStyle(fontSize: 24, fontWeight: FontWeight.w900),
                        ),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                          decoration: BoxDecoration(
                            color: isPending ? Colors.orange.withOpacity(0.2) : Colors.green.withOpacity(0.2),
                            borderRadius: BorderRadius.circular(12),
                          ),
                          child: Text(
                            isPending ? 'Pendente' : 'Pago',
                            style: TextStyle(
                              color: isPending ? Colors.orangeAccent : Colors.greenAccent,
                              fontSize: 10,
                              fontWeight: FontWeight.bold,
                              letterSpacing: 1,
                            ),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 8),
                    Text(
                      'Vencimento: ${DateTime.parse(inv['dueDate']).day.toString().padLeft(2, '0')}/${DateTime.parse(inv['dueDate']).month.toString().padLeft(2, '0')}/${DateTime.parse(inv['dueDate']).year}',
                      style: TextStyle(color: Colors.white.withOpacity(0.6)),
                    ),
                    if (isPending && inv['pixCode'] != null) ...[
                      const SizedBox(height: 20),
                      ElevatedButton.icon(
                        onPressed: () {},
                        icon: const Icon(LucideIcons.copy, size: 16),
                        label: const Text('COPIAR PIX'),
                        style: ElevatedButton.styleFrom(
                          backgroundColor: colors.primary,
                          foregroundColor: Colors.white,
                          minimumSize: const Size(double.infinity, 48),
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                        ),
                      ),
                    ],
                  ],
                ),
              );
            },
          );
        },
      ),
    );
  }
}
