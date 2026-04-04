import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:flutter_animate/flutter_animate.dart';
import '../services/api_service.dart';
import '../utils/app_styles.dart';

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
    final noticesOpt = ref.watch(notificationsProvider);

    return Scaffold(
      backgroundColor: AppStyles.darkBg,
      appBar: AppBar(
        title: Text('Notificações Ultra', style: GoogleFonts.sora(fontWeight: FontWeight.bold)),
      ),
      body: noticesOpt.when(
        loading: () => const Center(child: CircularProgressIndicator(color: AppStyles.primaryMagenta)),
        error: (err, _) => Center(child: Text('Erro: $err', style: const TextStyle(color: Colors.red))),
        data: (notices) {
          if (notices.isEmpty) {
            return _buildEmptyState();
          }

          return RefreshIndicator(
            backgroundColor: AppStyles.darkBg,
            color: AppStyles.primaryMagenta,
            onRefresh: () async => ref.invalidate(notificationsProvider),
            child: ListView.separated(
              padding: const EdgeInsets.all(24),
              itemCount: notices.length,
              separatorBuilder: (_, __) => const SizedBox(height: 16),
              itemBuilder: (context, index) {
                final n = notices[index];
                final isRead = n['read'] == true;
                
                IconData iconData = LucideIcons.bell;
                Color iconColor = AppStyles.primaryMagenta;
                if (n['type'] == 'MAINTENANCE') {
                  iconData = LucideIcons.alertTriangle;
                  iconColor = const Color(0xFFFFAB40);
                } else if (n['type'] == 'BILLING') {
                  iconData = LucideIcons.receipt;
                  iconColor = const Color(0xFFFF5252);
                }

                return GestureDetector(
                  onTap: isRead ? null : () => _markAsRead(ref, n['id']),
                  child: GlassCard(
                    padding: const EdgeInsets.all(20),
                    opacity: isRead ? 0.03 : 0.08,
                    child: Row(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Container(
                          padding: const EdgeInsets.all(12),
                          decoration: BoxDecoration(
                            color: iconColor.withOpacity(0.1), 
                            borderRadius: BorderRadius.circular(12),
                          ),
                          child: Icon(iconData, color: iconColor, size: 22),
                        ),
                        const SizedBox(width: 16),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                n['title'], 
                                style: GoogleFonts.sora(
                                  fontWeight: isRead ? FontWeight.w600 : FontWeight.w900, 
                                  fontSize: 15, 
                                  color: isRead ? Colors.white70 : Colors.white
                                )
                              ),
                              const SizedBox(height: 6),
                              Text(
                                n['message'], 
                                style: GoogleFonts.dmSans(
                                  color: isRead ? Colors.white38 : Colors.white54, 
                                  fontSize: 13, 
                                  height: 1.4
                                )
                              ),
                            ],
                          ),
                        ),
                        if (!isRead)
                          Container(
                            width: 10, height: 10,
                            margin: const EdgeInsets.only(top: 6),
                            decoration: const BoxDecoration(
                              color: AppStyles.primaryMagenta, 
                              shape: BoxShape.circle,
                              boxShadow: [
                                BoxShadow(color: AppStyles.primaryMagenta, blurRadius: 8),
                              ]
                            ),
                          ).animate(onPlay: (c) => c.repeat()).fade(duration: 800.ms),
                      ],
                    ),
                  ),
                ).animate().fadeIn(delay: (index * 50).ms).moveX(begin: 10, end: 0);
              },
            ),
          );
        }
      ),
    );
  }

  Widget _buildEmptyState() {
    return Center(
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(LucideIcons.bellOff, size: 80, color: Colors.white10),
          const SizedBox(height: 24),
          Text(
            'Tudo limpo por aqui.', 
            style: GoogleFonts.sora(color: Colors.white38, fontSize: 16, fontWeight: FontWeight.bold)
          ),
        ],
      ),
    ).animate().fadeIn();
  }
}
