import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lucide_icons/lucide_icons.dart';
import '../services/api_service.dart';

final notificationsProvider = FutureProvider.autoDispose<List<dynamic>>((ref) async {
  final res = await ref.read(apiProvider).get('/notifications');
  return res.data;
});

class NotificationsScreen extends ConsumerWidget {
  const NotificationsScreen({super.key});

  Future<void> _markAsRead(WidgetRef ref, String id) async {
    try {
      await ref.read(apiProvider).patch('/notifications/$id/read');
      ref.invalidate(notificationsProvider);
    } catch (_) {}
  }

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final colors = Theme.of(context).colorScheme;
    final noticesOpt = ref.watch(notificationsProvider);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Notificações', style: TextStyle(fontWeight: FontWeight.bold)),
      ),
      body: noticesOpt.when(
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (err, _) => Center(child: Text('Erro ao carregar avisos: $err', style: const TextStyle(color: Colors.red))),
        data: (notices) {
          if (notices.isEmpty) {
            return Center(
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Icon(LucideIcons.bellOff, size: 64, color: Colors.grey.shade300),
                  const SizedBox(height: 16),
                  Text('Tudo tranquilo por aqui.', style: TextStyle(color: Colors.grey.shade500, fontSize: 16)),
                ],
              ),
            );
          }

          return RefreshIndicator(
            onRefresh: () async => ref.invalidate(notificationsProvider),
            child: ListView.separated(
              padding: const EdgeInsets.all(24),
              itemCount: notices.length,
              separatorBuilder: (_, __) => const SizedBox(height: 16),
              itemBuilder: (context, index) {
                final n = notices[index];
                final isRead = n['read'] == true;
                
                IconData iconData = LucideIcons.bell;
                Color iconColor = colors.primary;
                if (n['type'] == 'MAINTENANCE') {
                  iconData = LucideIcons.alertTriangle;
                  iconColor = Colors.orange;
                } else if (n['type'] == 'BILLING') {
                  iconData = LucideIcons.receipt;
                  iconColor = Colors.red;
                }

                return InkWell(
                  onTap: isRead ? null : () => _markAsRead(ref, n['id']),
                  borderRadius: BorderRadius.circular(20),
                  child: Container(
                    padding: const EdgeInsets.all(20),
                    decoration: BoxDecoration(
                      color: isRead ? Colors.white : blueTint(colors.primary, 0.05),
                      borderRadius: BorderRadius.circular(20),
                      border: Border.all(color: isRead ? Colors.grey.shade200 : colors.primary.withOpacity(0.3)),
                      boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.02), blurRadius: 10, offset: const Offset(0, 4))],
                    ),
                    child: Row(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Container(
                          padding: const EdgeInsets.all(12),
                          decoration: BoxDecoration(color: iconColor.withOpacity(0.1), shape: BoxShape.circle),
                          child: Icon(iconData, color: iconColor, size: 24),
                        ),
                        const SizedBox(width: 16),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(n['title'], style: TextStyle(fontWeight: isRead ? FontWeight.bold : FontWeight.w900, fontSize: 15, color: colors.onSurface)),
                              const SizedBox(height: 6),
                              Text(n['message'], style: TextStyle(color: Colors.grey.shade600, fontSize: 13, height: 1.4)),
                            ],
                          ),
                        ),
                        if (!isRead)
                          Container(
                            width: 10, height: 10,
                            margin: const EdgeInsets.only(top: 6),
                            decoration: BoxDecoration(color: colors.secondary, shape: BoxShape.circle),
                          )
                      ],
                    ),
                  ),
                );
              },
            ),
          );
        }
      ),
    );
  }

  Color blueTint(Color c, double opacity) => c.withOpacity(opacity);
}
