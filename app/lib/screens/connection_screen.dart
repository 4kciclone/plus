import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lucide_icons/lucide_icons.dart';
import '../services/api_service.dart';

final speedtestProvider = FutureProvider<Map<String, dynamic>>((ref) async {
  final res = await ref.read(apiProvider).post('/speedtest/start');
  return res.data;
});

class ConnectionScreen extends ConsumerWidget {
  const ConnectionScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final speedtestOpt = ref.watch(speedtestProvider);
    final colors = Theme.of(context).colorScheme;

    return Scaffold(
      appBar: AppBar(
        title: const Row(
          children: [
            Hero(tag: 'hero-Speedtest', child: Icon(LucideIcons.gauge, color: Colors.white)),
            SizedBox(width: 12),
            Text('Minha Conexão', style: TextStyle(fontWeight: FontWeight.bold)),
          ],
        ),
        backgroundColor: Colors.transparent,
        centerTitle: true,
      ),
      body: speedtestOpt.when(
        loading: () => const Center(child: CircularProgressIndicator(color: Color(0xFFFF0080))),
        error: (err, stack) => Center(child: Text('Erro: $err')),
        data: (data) {
           return Padding(
             padding: const EdgeInsets.all(24.0),
             child: Column(
               children: [
                 // Top indicator
                 Center(
                   child: Container(
                     width: 250,
                     height: 250,
                     decoration: BoxDecoration(
                       shape: BoxShape.circle,
                       border: Border.all(color: colors.primary.withOpacity(0.3), width: 8),
                       color: colors.surface,
                     ),
                     child: Column(
                       mainAxisAlignment: MainAxisAlignment.center,
                       children: [
                         const Icon(LucideIcons.gauge, size: 40, color: Colors.white),
                         const SizedBox(height: 16),
                         Text(
                           '${data["ping"]} ms',
                           style: const TextStyle(fontSize: 48, fontWeight: FontWeight.w900, color: Colors.white),
                         ),
                         Text('PING', style: TextStyle(color: Colors.white.withOpacity(0.5), letterSpacing: 2, fontWeight: FontWeight.bold)),
                       ],
                     ),
                   ),
                 ),
                 const SizedBox(height: 40),
                 
                 // Stats row
                 Row(
                   children: [
                     Expanded(
                       child: _StatCard(
                          icon: LucideIcons.arrowDownCircle, 
                          color: Colors.blueAccent, 
                          title: 'DOWNLOAD', 
                          value: '${data["downloadMbps"]} Mbps'
                       ),
                     ),
                     const SizedBox(width: 16),
                     Expanded(
                       child: _StatCard(
                          icon: LucideIcons.arrowUpCircle, 
                          color: Colors.purpleAccent, 
                          title: 'UPLOAD', 
                          value: '${data["uploadMbps"]} Mbps'
                       ),
                     ),
                   ],
                 ),
                 
                 const Spacer(),
                 
                 // Refazer Teste
                 SizedBox(
                   width: double.infinity,
                   child: OutlinedButton(
                     style: OutlinedButton.styleFrom(
                       padding: const EdgeInsets.symmetric(vertical: 20),
                       side: BorderSide(color: colors.primary),
                       shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                     ),
                     onPressed: () => ref.invalidate(speedtestProvider),
                     child: const Text('REFAZER TESTE', style: TextStyle(fontWeight: FontWeight.bold, letterSpacing: 1)),
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
  final Color color;
  final String title;
  final String value;

  const _StatCard({required this.icon, required this.color, required this.title, required this.value});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: Theme.of(context).colorScheme.surface,
        borderRadius: BorderRadius.circular(20),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Icon(icon, color: color, size: 28),
          const SizedBox(height: 12),
          Text(title, style: TextStyle(color: Colors.white.withOpacity(0.5), fontSize: 12, fontWeight: FontWeight.bold, letterSpacing: 1)),
          const SizedBox(height: 4),
          Text(value, style: const TextStyle(color: Colors.white, fontSize: 20, fontWeight: FontWeight.w900)),
        ],
      ),
    );
  }
}
