import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'dart:ui';
import '../services/api_service.dart';
import '../utils/app_styles.dart';

final speedtestProvider = FutureProvider.autoDispose<Map<String, dynamic>>((ref) async {
  final dio = ref.read(apiProvider);
  
  // 1. Measure Ping
  final pingStart = Stopwatch()..start();
  await dio.get('/speedtest/ping');
  pingStart.stop();
  final ping = pingStart.elapsedMilliseconds;

  // 2. Measure Download (5MB payload)
  final dlStart = Stopwatch()..start();
  await dio.get('/speedtest/download?size=5');
  dlStart.stop();
  final double dlSeconds = dlStart.elapsedMilliseconds / 1000.0;
  final double downloadMbps = (5.0 * 8.0) / (dlSeconds > 0 ? dlSeconds : 0.1);

  // 3. Measure Upload (Mocked upload buffer stream for safety, 1MB)
  final uploadData = List.filled(1024 * 1024, 0).join();
  final ulStart = Stopwatch()..start();
  await dio.post('/speedtest/upload', data: uploadData);
  ulStart.stop();
  final double ulSeconds = ulStart.elapsedMilliseconds / 1000.0;
  final double uploadMbps = (1.0 * 8.0) / (ulSeconds > 0 ? ulSeconds : 0.1);

  return {
    "ping": ping,
    "downloadMbps": double.parse(downloadMbps.toStringAsFixed(1)),
    "uploadMbps": double.parse(uploadMbps.toStringAsFixed(1)),
  };
});

class ConnectionScreen extends ConsumerWidget {
  const ConnectionScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final speedtestOpt = ref.watch(speedtestProvider);

    return Scaffold(
      backgroundColor: AppStyles.darkBg,
      appBar: AppBar(
        title: Text('Diagnóstico Ultra', style: GoogleFonts.sora(fontWeight: FontWeight.bold)),
      ),
      body: Stack(
        children: [
          // Background Glow
          Positioned(
            top: 100, left: MediaQuery.of(context).size.width / 2 - 150,
            child: Container(
              width: 300, height: 300,
              decoration: BoxDecoration(
                color: AppStyles.primaryMagenta.withOpacity(0.05),
                shape: BoxShape.circle,
                filter: ImageFilter.blur(sigmaX: 80, sigmaY: 80),
              ),
            ),
          ),

          speedtestOpt.when(
            loading: () => _buildLoadingState(),
            error: (err, stack) => Center(child: Text('Falha na fibra: $err', style: const TextStyle(color: Colors.red))),
            data: (data) {
               return Padding(
                 padding: const EdgeInsets.all(24.0),
                 child: Column(
                   children: [
                     const SizedBox(height: 40),
                     
                     // Central Ping Gauge
                     _buildPingGauge(data["ping"]),
                     
                     const SizedBox(height: 60),
                     
                     // Stats Grid
                     Row(
                       children: [
                         Expanded(
                           child: _StatGlassCard(
                              icon: LucideIcons.arrowDownCircle, 
                              color: AppStyles.primaryMagenta, 
                              title: 'DOWNLOAD', 
                              value: '${data["downloadMbps"]}',
                              unit: 'Mbps'
                           ),
                         ),
                         const SizedBox(width: 16),
                         Expanded(
                           child: _StatGlassCard(
                              icon: LucideIcons.arrowUpCircle, 
                              color: const Color(0xFF00D1FF), 
                              title: 'UPLOAD', 
                              value: '${data["uploadMbps"]}',
                              unit: 'Mbps'
                           ),
                         ),
                       ],
                     ),
                     
                     const Spacer(),
                     
                     // Action Button
                     Container(
                       width: double.infinity,
                       height: 60,
                       decoration: BoxDecoration(
                         gradient: AppStyles.primaryGradient,
                         borderRadius: BorderRadius.circular(16),
                         boxShadow: [
                           BoxShadow(color: AppStyles.primaryMagenta.withOpacity(0.2), blurRadius: 15, offset: const Offset(0, 5)),
                         ],
                       ),
                       child: ElevatedButton.icon(
                         style: ElevatedButton.styleFrom(
                           backgroundColor: Colors.transparent,
                           shadowColor: Colors.transparent,
                           foregroundColor: Colors.white,
                           shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                         ),
                         onPressed: () => ref.invalidate(speedtestProvider),
                         icon: const Icon(LucideIcons.refreshCcw, size: 20),
                         label: Text('TESTAR CONEXÃO', style: GoogleFonts.sora(fontWeight: FontWeight.w800, fontSize: 14)),
                       ),
                     ).animate().fadeIn(delay: 600.ms),
                     const SizedBox(height: 24),
                   ],
                 ),
               );
            },
          ),
        ],
      ),
    );
  }

  Widget _buildLoadingState() {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          SizedBox(
            width: 120, height: 120,
            child: Stack(
              alignment: Alignment.center,
              children: [
                CircularProgressIndicator(
                  strokeWidth: 2, 
                  color: AppStyles.primaryMagenta.withOpacity(0.2)
                ),
                const Icon(LucideIcons.zap, color: AppStyles.primaryMagenta, size: 40)
                    .animate(onPlay: (c) => c.repeat())
                    .shimmer(duration: 2.seconds)
                    .scale(begin: const Offset(0.8, 0.8), end: const Offset(1.2, 1.2), curve: Curves.easeInOut),
              ],
            ),
          ),
          const SizedBox(height: 32),
          Text(
            'Medindo canais óticos...', 
            style: GoogleFonts.sora(color: Colors.white, fontWeight: FontWeight.bold),
          ),
          const SizedBox(height: 8),
          Text(
            'Detectando latência mínima', 
            style: GoogleFonts.dmSans(color: Colors.white38, fontSize: 12),
          ),
        ],
      ),
    );
  }

  Widget _buildPingGauge(int ping) {
    return Column(
      children: [
        AppStyles.glassEffect(
          radius: 120,
          child: Container(
            width: 240, height: 240,
            decoration: BoxDecoration(
              shape: BoxShape.circle,
              color: Colors.white.withOpacity(0.03),
              border: Border.all(color: AppStyles.primaryMagenta.withOpacity(0.1)),
            ),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                const Icon(LucideIcons.activity, size: 28, color: AppStyles.primaryMagenta)
                    .animate(onPlay: (c) => c.repeat())
                    .fade(duration: 1.seconds),
                const SizedBox(height: 12),
                Text(
                  '$ping',
                  style: GoogleFonts.sora(fontSize: 64, fontWeight: FontWeight.w900, color: Colors.white, letterSpacing: -2),
                ).animate().scale(duration: 400.ms, curve: Curves.backOut),
                Text(
                  'MS / PING', 
                  style: GoogleFonts.sora(color: Colors.white38, letterSpacing: 2, fontSize: 10, fontWeight: FontWeight.w900),
                ),
              ],
            ),
          ),
        ),
        const SizedBox(height: 24),
        Container(
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
          decoration: BoxDecoration(
            color: const Color(0xFF00E676).withOpacity(0.1),
            borderRadius: BorderRadius.circular(20),
          ),
          child: Text(
            'ESTÁVEL', 
            style: GoogleFonts.sora(color: const Color(0xFF00E676), fontWeight: FontWeight.w900, fontSize: 10, letterSpacing: 1),
          ),
        ).animate().fadeIn(delay: 300.ms),
      ],
    );
  }
}

class _StatGlassCard extends StatelessWidget {
  final IconData icon;
  final Color color;
  final String title;
  final String value;
  final String unit;

  const _StatGlassCard({
    required this.icon, 
    required this.color, 
    required this.title, 
    required this.value,
    required this.unit,
  });

  @override
  Widget build(BuildContext context) {
    return GlassCard(
      padding: const EdgeInsets.all(24),
      radius: 24,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            padding: const EdgeInsets.all(10),
            decoration: BoxDecoration(
              color: color.withOpacity(0.1),
              borderRadius: BorderRadius.circular(12),
            ),
            child: Icon(icon, color: color, size: 24),
          ),
          const SizedBox(height: 20),
          Text(
            title, 
            style: GoogleFonts.sora(color: Colors.white38, fontSize: 9, fontWeight: FontWeight.w900, letterSpacing: 1),
          ),
          const SizedBox(height: 6),
          Row(
            crossAxisAlignment: CrossAxisAlignment.baseline,
            textBaseline: TextBaseline.alphabetic,
            children: [
              Text(
                value, 
                style: GoogleFonts.sora(color: Colors.white, fontSize: 28, fontWeight: FontWeight.w900),
              ),
              const SizedBox(width: 4),
              Text(
                unit, 
                style: GoogleFonts.dmSans(color: Colors.white24, fontSize: 12, fontWeight: FontWeight.bold),
              ),
            ],
          ),
        ],
      ),
    ).animate().fadeIn(delay: 400.ms).moveY(begin: 20, end: 0);
  }
}
