import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'dart:ui';
import '../services/api_service.dart';
import '../utils/app_styles.dart';

final scmProvider = FutureProvider.autoDispose((ref) async {
  final res = await ref.read(apiProvider).get('/contracts/scm');
  return res.data;
});

final equipmentProvider = FutureProvider.autoDispose((ref) async {
  final res = await ref.read(apiProvider).get('/contracts/equipment');
  return res.data;
});

class ContractsScreen extends ConsumerWidget {
  const ContractsScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final scmOpt = ref.watch(scmProvider);
    final eqOpt = ref.watch(equipmentProvider);

    return Scaffold(
      backgroundColor: AppStyles.darkBg,
      appBar: AppBar(
        title: Text('Gestão de Ativos Ultra', style: GoogleFonts.sora(fontWeight: FontWeight.bold)),
      ),
      body: Stack(
        children: [
          // Background Glow
          Positioned(
            bottom: -50, left: -50,
            child: ImageFiltered(
              imageFilter: ImageFilter.blur(sigmaX: 80, sigmaY: 80),
              child: Container(
                width: 250, height: 250,
                decoration: BoxDecoration(
                  color: AppStyles.primaryMagenta.withOpacity(0.05),
                  shape: BoxShape.circle,
                ),
              ),
            ),
          ),

          SingleChildScrollView(
            padding: const EdgeInsets.all(24),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                _buildSectionHeader('CONTRATOS LEGAIS'),
                const SizedBox(height: 16),
                
                scmOpt.when(
                  loading: () => const Center(child: CircularProgressIndicator(color: AppStyles.primaryMagenta)),
                  error: (err, _) => Text('Erro: $err', style: const TextStyle(color: Colors.red)),
                  data: (data) => _buildDocumentCard(
                    context,
                    title: data['title'] ?? 'Contrato de Adesão SCM',
                    subtitle: 'Vigente desde ${data['issuedAt'] != null ? DateTime.parse(data['issuedAt']).year : '2024'}',
                    icon: LucideIcons.fileSignature,
                    onTap: () => _simulateDownload(context),
                  ),
                ),

                const SizedBox(height: 48),
                _buildSectionHeader('EQUIPAMENTOS EM COMODATO'),
                const SizedBox(height: 16),
                
                eqOpt.when(
                  loading: () => const Center(child: CircularProgressIndicator(color: AppStyles.primaryMagenta)),
                  error: (err, _) => Text('Erro: $err', style: const TextStyle(color: Colors.red)),
                  data: (data) => Column(
                    children: [
                      _buildDocumentCard(
                        context,
                        title: 'Termo de Responsabilidade',
                        subtitle: 'Plano: ${data['planName']}',
                        icon: LucideIcons.shieldCheck,
                        onTap: () => _simulateDownload(context),
                      ),
                      const SizedBox(height: 32),
                      if (data['equipmentList'] != null)
                        ...List.generate(data['equipmentList'].length, (index) {
                          final item = data['equipmentList'][index];
                          return _buildEquipmentTile(item);
                        })
                    ],
                  ),
                ),
                const SizedBox(height: 40),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildSectionHeader(String title) {
    return Text(
      title, 
      style: GoogleFonts.sora(fontSize: 10, fontWeight: FontWeight.w900, color: Colors.white24, letterSpacing: 1.5),
    ).animate().fadeIn();
  }

  Widget _buildDocumentCard(BuildContext context, {required String title, required String subtitle, required IconData icon, required VoidCallback onTap}) {
    return GestureDetector(
      onTap: onTap,
      child: GlassCard(
        padding: const EdgeInsets.all(20),
        child: Row(
          children: [
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: AppStyles.primaryMagenta.withOpacity(0.1),
                borderRadius: BorderRadius.circular(14),
                border: Border.all(color: AppStyles.primaryMagenta.withOpacity(0.1)),
              ),
              child: Icon(icon, color: AppStyles.primaryMagenta, size: 24),
            ),
            const SizedBox(width: 16),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(title, style: GoogleFonts.sora(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 13)),
                  const SizedBox(height: 4),
                  Text(subtitle, style: GoogleFonts.dmSans(color: Colors.white38, fontSize: 12)),
                ],
              ),
            ),
            const Icon(LucideIcons.download, color: Colors.white24, size: 18),
          ],
        ),
      ),
    ).animate().fadeIn().moveX(begin: -10, end: 0);
  }

  Widget _buildEquipmentTile(Map<String, dynamic> item) {
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      child: GlassCard(
        padding: const EdgeInsets.all(18),
        opacity: 0.03,
        child: Row(
          children: [
            Container(
              width: 44, height: 44,
              decoration: BoxDecoration(
                color: Colors.white.withOpacity(0.05),
                borderRadius: BorderRadius.circular(12),
              ),
              child: const Icon(LucideIcons.router, color: Colors.white38, size: 20),
            ),
            const SizedBox(width: 16),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    item['type'] ?? 'Router ONU Fiber', 
                    style: GoogleFonts.sora(color: Colors.white, fontWeight: FontWeight.w700, fontSize: 13)
                  ),
                  const SizedBox(height: 4),
                  Row(
                    children: [
                       Text(
                         'MAC:', 
                         style: GoogleFonts.dmSans(color: Colors.white24, fontSize: 11, fontWeight: FontWeight.bold)
                       ),
                       const SizedBox(width: 6),
                       Text(
                         item['mac'] ?? 'AA:BB:CC:00:11:22', 
                         style: GoogleFonts.dmSans(color: Colors.white54, fontSize: 11)
                       ),
                    ],
                  ),
                ],
              ),
            ),
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
              decoration: BoxDecoration(
                color: const Color(0xFF00E676).withOpacity(0.1),
                borderRadius: BorderRadius.circular(8),
              ),
              child: Text(
                'ATIVO', 
                style: GoogleFonts.sora(color: const Color(0xFF00E676), fontWeight: FontWeight.w900, fontSize: 8),
              ),
            ),
          ],
        ),
      ),
    ).animate().fadeIn(delay: 200.ms);
  }

  void _simulateDownload(BuildContext context) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        content: GlassCard(
          padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 14),
          radius: 12,
          child: Row(
            children: [
              const Icon(LucideIcons.loader, color: AppStyles.primaryMagenta, size: 18).animate(onPlay:(c)=>c.repeat()).rotate(),
              const SizedBox(width: 12),
              Text(
                'Baixando PDF Seguro...', 
                style: GoogleFonts.sora(color: Colors.white, fontWeight: FontWeight.w700, fontSize: 12)
              ),
            ],
          ),
        ),
        duration: const Duration(seconds: 2),
      ),
    );
  }
}
