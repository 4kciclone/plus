import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'dart:convert';
import '../services/api_service.dart';
import '../utils/app_styles.dart';

final ticketsProvider = FutureProvider.autoDispose<List<dynamic>>((ref) async {
  final res = await ref.read(apiProvider).get('/tickets/my');
  return res.data;
});

class SupportScreen extends ConsumerWidget {
  const SupportScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final ticketsOpt = ref.watch(ticketsProvider);

    return Scaffold(
      backgroundColor: AppStyles.darkBg,
      appBar: AppBar(
        title: Text('Suporte Técnico', style: GoogleFonts.sora(fontWeight: FontWeight.bold)),
      ),
      body: Stack(
        children: [
          // Radial glow behind Luna card
          Positioned(
            top: 20, left: -40,
            child: Container(
              width: 300, height: 300,
              decoration: BoxDecoration(
                color: AppStyles.primaryMagenta.withOpacity(0.1),
                shape: BoxShape.circle,
                filter: ImageFilter.blur(sigmaX: 50, sigmaY: 50),
              ),
            ),
          ),

          Padding(
            padding: const EdgeInsets.all(24.0),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                // Luna AI Premium Banner
                _buildLunaHero(context),
                
                const SizedBox(height: 48),
                
                Text(
                  'CHAMADOS EM ABERTO', 
                  style: GoogleFonts.sora(fontSize: 11, fontWeight: FontWeight.w900, color: Colors.white38, letterSpacing: 1.5),
                ),
                const SizedBox(height: 16),
                
                Expanded(
                  child: ticketsOpt.when(
                    loading: () => const Center(child: CircularProgressIndicator(color: AppStyles.primaryMagenta)),
                    error: (err, stack) => Center(child: Text('Erro: $err', style: const TextStyle(color: Colors.red))),
                    data: (tickets) {
                      if (tickets.isEmpty) return _buildEmptyState();
                      return ListView.separated(
                        itemCount: tickets.length,
                        separatorBuilder: (_, __) => const SizedBox(height: 16),
                        itemBuilder: (context, index) {
                          final t = tickets[index];
                          return _buildTicketCard(context, ref, t);
                        },
                      );
                    },
                  ),
                )
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildLunaHero(BuildContext context) {
    return GlassCard(
      padding: const EdgeInsets.all(32),
      child: Column(
        children: [
           Container(
             padding: const EdgeInsets.all(16),
             decoration: BoxDecoration(
               shape: BoxShape.circle,
               color: Colors.white.withOpacity(0.05),
               border: Border.all(color: AppStyles.primaryMagenta.withOpacity(0.3)),
               boxShadow: [
                 BoxShadow(color: AppStyles.primaryMagenta.withOpacity(0.2), blurRadius: 20),
               ],
             ),
             child: const Icon(LucideIcons.sparkles, size: 40, color: AppStyles.primaryMagenta)
                 .animate(onPlay: (c) => c.repeat())
                 .shimmer(duration: 2.seconds, color: Colors.white)
                 .shake(hz: 2, curve: Curves.easeInOut),
           ),
           const SizedBox(height: 24),
           Text(
             'Ajudante Virtual Luna', 
             style: GoogleFonts.sora(color: Colors.white, fontSize: 24, fontWeight: FontWeight.w900),
           ),
           const SizedBox(height: 8),
           Text(
             'Diagnóstico de rede via IA e suporte em tempo real.', 
             textAlign: TextAlign.center, 
             style: GoogleFonts.dmSans(color: Colors.white54, fontSize: 13),
           ),
           const SizedBox(height: 32),
           Container(
             height: 54,
             width: double.infinity,
             decoration: BoxDecoration(
               gradient: AppStyles.primaryGradient,
               borderRadius: BorderRadius.circular(16),
               boxShadow: [
                 BoxShadow(color: AppStyles.primaryMagenta.withOpacity(0.2), blurRadius: 10, offset: const Offset(0, 4)),
               ],
             ),
             child: ElevatedButton.icon(
               onPressed: () => context.push('/luna_chat'),
               icon: const Icon(LucideIcons.messageSquare, size: 18),
               label: Text('INICIAR CHAT ULTRA', style: GoogleFonts.sora(fontWeight: FontWeight.w800, fontSize: 13)),
               style: ElevatedButton.styleFrom(
                 backgroundColor: Colors.transparent,
                 shadowColor: Colors.transparent,
                 foregroundColor: Colors.white,
                 shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
               ),
             ),
           ),
        ],
      ),
    ).animate().fadeIn().scale(begin: const Offset(0.95, 0.95));
  }

  Widget _buildEmptyState() {
    return Center(
      child: Text(
        'Nenhum chamado registrado.', 
        style: GoogleFonts.dmSans(color: Colors.white24, fontWeight: FontWeight.bold),
      ),
    );
  }

  Widget _buildTicketCard(BuildContext context, WidgetRef ref, Map<String, dynamic> t) {
    return GlassCard(
      padding: const EdgeInsets.all(24),
      radius: 24,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Expanded(
                child: Text(
                  t['subject'], 
                  style: GoogleFonts.sora(color: Colors.white, fontWeight: FontWeight.w900, fontSize: 16),
                ),
              ),
              _buildStatusBadge(t['status']),
            ],
          ),
          const SizedBox(height: 12),
          Text(
            t['message'], 
            maxLines: 2, 
            overflow: TextOverflow.ellipsis, 
            style: GoogleFonts.dmSans(color: Colors.white54, fontSize: 13, height: 1.5),
          ),
          
          if (t['status'] == 'WAITING_USER' && t['visitOptions'] != null)
            Padding(
              padding: const EdgeInsets.only(top: 24),
              child: Container(
                padding: const EdgeInsets.all(20),
                decoration: BoxDecoration(
                  color: Colors.white.withOpacity(0.02), 
                  borderRadius: BorderRadius.circular(20),
                  border: Border.all(color: Colors.white.withOpacity(0.05)),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        const Icon(LucideIcons.calendar, color: Color(0xFFFFAB40), size: 16),
                        const SizedBox(width: 8),
                        Text(
                          'AGENDAR VISITA TÉCNICA', 
                          style: GoogleFonts.sora(color: const Color(0xFFFFAB40), fontWeight: FontWeight.w900, fontSize: 10, letterSpacing: 1),
                        ),
                      ],
                    ),
                    const SizedBox(height: 16),
                    Wrap(
                      spacing: 10, runSpacing: 10,
                      children: _parseOptions(t['visitOptions']).map<Widget>((opt) {
                        return GestureDetector(
                          onTap: () {
                            // Logic for scheduling
                          },
                          child: Container(
                            padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                            decoration: BoxDecoration(
                              borderRadius: BorderRadius.circular(10),
                              border: Border.all(color: Colors.white.withOpacity(0.1)),
                            ),
                            child: Text(
                              opt, 
                              style: GoogleFonts.dmSans(color: Colors.white, fontSize: 12, fontWeight: FontWeight.bold),
                            ),
                          ),
                        );
                      }).toList(),
                    ),
                  ],
                ),
              ),
            ).animate().fadeIn(delay: 200.ms),
        ],
      ),
    ).animate().fadeIn().moveX(begin: -10, end: 0);
  }

  Widget _buildStatusBadge(String status) {
    Color color = AppStyles.primaryMagenta;
    String label = status;

    if (status == 'WAITING_USER') { color = const Color(0xFFFFAB40); label = 'ATENÇÃO'; }
    if (status == 'SCHEDULED') { color = const Color(0xFF00E676); label = 'AGENDADO'; }
    if (status == 'RESOLVED') { color = Colors.white24; label = 'CONCLUÍDO'; }

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
      decoration: BoxDecoration(
        color: color.withOpacity(0.1), 
        borderRadius: BorderRadius.circular(8),
        border: Border.all(color: color.withOpacity(0.2)),
      ),
      child: Text(
        label, 
        style: GoogleFonts.sora(color: color, fontSize: 9, fontWeight: FontWeight.w900, letterSpacing: 1),
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

// Support for blur
import 'dart:ui';
