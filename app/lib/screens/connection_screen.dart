import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lucide_icons/lucide_icons.dart';
import '../services/api_service.dart';

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
    final colors = Theme.of(context).colorScheme;

    return Scaffold(
      appBar: AppBar(
        title: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(LucideIcons.gauge, color: colors.primary),
            const SizedBox(width: 8),
            const Text('Diagnóstico de Rede'),
          ],
        ),
      ),
      body: speedtestOpt.when(
        loading: () => Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              CircularProgressIndicator(color: colors.primary),
              const SizedBox(height: 24),
              Text('Analisando sinal em tempo real...', style: TextStyle(color: colors.primary, fontWeight: FontWeight.bold)),
            ],
          )
        ),
        error: (err, stack) => Center(child: Text('Falha ao medir a rede: $err', style: const TextStyle(color: Colors.red))),
        data: (data) {
           return Padding(
             padding: const EdgeInsets.all(24.0),
             child: Column(
               children: [
                 // Top indicator (Corporate Light Design)
                 Center(
                   child: Container(
                     width: 240,
                     height: 240,
                     decoration: BoxDecoration(
                       shape: BoxShape.circle,
                       color: Colors.white,
                       boxShadow: [
                         BoxShadow(color: colors.primary.withOpacity(0.1), blurRadius: 40, offset: const Offset(0, 10)),
                       ]
                     ),
                     child: Column(
                       mainAxisAlignment: MainAxisAlignment.center,
                       children: [
                         Icon(LucideIcons.wifi, size: 40, color: colors.primary),
                         const SizedBox(height: 16),
                         Text(
                           '${data["ping"]} ms',
                           style: TextStyle(fontSize: 48, fontWeight: FontWeight.w900, color: colors.onSurface),
                         ),
                         Text('LATÊNCIA (PING)', style: TextStyle(color: Colors.grey.shade600, letterSpacing: 1.5, fontSize: 12, fontWeight: FontWeight.bold)),
                       ],
                     ),
                   ),
                 ),
                 const SizedBox(height: 48),
                 
                 // Stats row
                 Row(
                   children: [
                     Expanded(
                       child: _StatCard(
                          icon: LucideIcons.arrowDownCircle, 
                          iconColor: colors.primary, 
                          title: 'DOWNLOAD', 
                          value: '${data["downloadMbps"]} Mbps'
                       ),
                     ),
                     const SizedBox(width: 16),
                     Expanded(
                       child: _StatCard(
                          icon: LucideIcons.arrowUpCircle, 
                          iconColor: colors.secondary, 
                          title: 'UPLOAD', 
                          value: '${data["uploadMbps"]} Mbps'
                       ),
                     ),
                   ],
                 ),
                 
                 const Spacer(),
                 
                 SizedBox(
                   width: double.infinity,
                   height: 56,
                   child: ElevatedButton.icon(
                     style: ElevatedButton.styleFrom(
                       backgroundColor: colors.primary,
                       foregroundColor: Colors.white,
                       shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                       elevation: 0,
                     ),
                     onPressed: () => ref.invalidate(speedtestProvider),
                     icon: const Icon(LucideIcons.refreshCw, size: 20),
                     label: const Text('Executar Novo Teste', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
                   ),
                 ),
               ],
             ),
           );
        },
      ),
    );
  }
}

class _StatCard extends StatelessWidget {
  final IconData icon;
  final Color iconColor;
  final String title;
  final String value;

  const _StatCard({required this.icon, required this.iconColor, required this.title, required this.value});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: Colors.grey.shade200),
        boxShadow: [
          BoxShadow(color: Colors.black.withOpacity(0.02), blurRadius: 10, offset: const Offset(0, 4)),
        ]
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Icon(icon, color: iconColor, size: 28),
          const SizedBox(height: 12),
          Text(title, style: TextStyle(color: Colors.grey.shade600, fontSize: 11, fontWeight: FontWeight.bold, letterSpacing: 1)),
          const SizedBox(height: 4),
          Text(value, style: TextStyle(color: Theme.of(context).colorScheme.onSurface, fontSize: 22, fontWeight: FontWeight.w900)),
        ],
      ),
    );
  }
}
