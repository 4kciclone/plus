import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:go_router/go_router.dart';
import 'dart:convert';
import '../services/api_service.dart';

final ticketsProvider = FutureProvider.autoDispose<List<dynamic>>((ref) async {
  final res = await ref.read(apiProvider).get('/tickets/my');
  return res.data;
});

class SupportScreen extends ConsumerWidget {
  const SupportScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final ticketsOpt = ref.watch(ticketsProvider);
    final colors = Theme.of(context).colorScheme;

    return Scaffold(
      appBar: AppBar(
        title: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Hero(tag: 'hero-Suporte', child: Icon(LucideIcons.headphones, color: colors.primary)),
            const SizedBox(width: 12),
            const Text('Suporte Técnico', style: TextStyle(fontWeight: FontWeight.bold)),
          ],
        ),
      ),
      body: Padding(
        padding: const EdgeInsets.all(24.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            // Luna AI Banner
            Container(
              padding: const EdgeInsets.all(24),
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  colors: [colors.primary, const Color(0xFFC5007E)],
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                ),
                borderRadius: BorderRadius.circular(24),
              ),
              child: Column(
                children: [
                   const CircleAvatar(
                     radius: 30,
                     backgroundColor: Colors.white,
                     child: Text('🤖', style: TextStyle(fontSize: 30)),
                   ),
                   const SizedBox(height: 16),
                   const Text('Falar com a Luna', style: TextStyle(color: Colors.white, fontSize: 22, fontWeight: FontWeight.w900)),
                   const SizedBox(height: 8),
                   Text('Diagnóstico de rede instantâneo com Inteligência Artificial.', textAlign: TextAlign.center, style: TextStyle(color: Colors.white.withOpacity(0.9))),
                   const SizedBox(height: 20),
                   ElevatedButton.icon(
                     onPressed: () => context.push('/luna_chat'),
                     icon: const Icon(LucideIcons.messageCircle, color: Color(0xFFFF0080)),
                     label: const Text('Iniciar Chat', style: TextStyle(color: Color(0xFFFF0080), fontWeight: FontWeight.bold)),
                     style: ElevatedButton.styleFrom(backgroundColor: Colors.white),
                   )
                ],
              ),
            ),
            
            const SizedBox(height: 32),
            const Text('Meus Chamados', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
            const SizedBox(height: 16),
            
            Expanded(
              child: ticketsOpt.when(
                loading: () => const Center(child: CircularProgressIndicator()),
                error: (err, stack) => Center(child: Text('Erro: $err')),
                data: (tickets) {
                  if (tickets.isEmpty) return const Center(child: Text('Nenhum chamado aberto.'));
                  return ListView.separated(
                    itemCount: tickets.length,
                    separatorBuilder: (_, __) => const SizedBox(height: 16),
                    itemBuilder: (context, index) {
                      final t = tickets[index];
                      return Container(
                        padding: const EdgeInsets.all(20),
                        decoration: BoxDecoration(
                          color: Colors.white, 
                          borderRadius: BorderRadius.circular(20),
                          border: Border.all(color: Colors.grey.shade200),
                          boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.02), blurRadius: 10, offset: const Offset(0, 4))],
                        ),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Row(
                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                              children: [
                                Expanded(child: Text(t['subject'], style: TextStyle(color: colors.onSurface, fontWeight: FontWeight.w900, fontSize: 16))),
                                _StatusBadge(status: t['status']),
                              ],
                            ),
                            const SizedBox(height: 8),
                            Text(t['message'], maxLines: 2, overflow: TextOverflow.ellipsis, style: TextStyle(color: Colors.grey.shade600)),
                            
                            if (t['status'] == 'WAITING_USER' && t['visitOptions'] != null)
                              Padding(
                                padding: const EdgeInsets.only(top: 16),
                                child: Container(
                                  padding: const EdgeInsets.all(16),
                                  decoration: BoxDecoration(color: Colors.orange.withOpacity(0.1), borderRadius: BorderRadius.circular(16)),
                                  child: Column(
                                    crossAxisAlignment: CrossAxisAlignment.start,
                                    children: [
                                      const Text('Agendar Visita Técnica:', style: TextStyle(color: Colors.orangeAccent, fontWeight: FontWeight.bold)),
                                      const SizedBox(height: 12),
                                      Wrap(
                                        spacing: 8, runSpacing: 8,
                                        children: _parseOptions(t['visitOptions']).map<Widget>((opt) {
                                          return ActionChip(
                                            label: Text(opt, style: const TextStyle(fontSize: 12)),
                                            backgroundColor: Colors.transparent,
                                            side: const BorderSide(color: Colors.orangeAccent),
                                            onPressed: () {
                                              // TODO: send PUT /tickets/:id/visit
                                            },
                                          );
                                        }).toList(),
                                      ),
                                    ],
                                  ),
                                ),
                              ),
                          ],
                        ),
                      );
                    },
                  );
                },
              ),
            )
          ],
        ),
      ),
    );
  }

  List<String> _parseOptions(String? val) {
    if (val == null) return [];
    try {
      final List l = jsonDecode(val);
      return l.map((e) => e.toString()).toList();
    } catch (e) { return []; }
  }
}

class _StatusBadge extends StatelessWidget {
  final String status;
  const _StatusBadge({required this.status});

  @override
  Widget build(BuildContext context) {
    Color bg = Colors.blue.withOpacity(0.1);
    Color fg = Colors.blue.shade700;
    String label = status;

    if (status == 'WAITING_USER') { bg = Colors.orange.withOpacity(0.1); fg = Colors.orange.shade800; label = 'Ação Necessária'; }
    if (status == 'SCHEDULED') { bg = Colors.green.withOpacity(0.1); fg = Colors.green.shade800; label = 'Agendado'; }
    if (status == 'RESOLVED') { bg = Colors.grey.shade100; fg = Colors.grey.shade600; label = 'Resolvido'; }

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
      decoration: BoxDecoration(color: bg, borderRadius: BorderRadius.circular(12)),
      child: Text(label, style: TextStyle(color: fg, fontSize: 10, fontWeight: FontWeight.w900, letterSpacing: 1)),
    );
  }
}
