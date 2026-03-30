import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lucide_icons/lucide_icons.dart';
import '../services/api_service.dart';

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
    final colors = Theme.of(context).colorScheme;
    final scmOpt = ref.watch(scmProvider);
    final eqOpt = ref.watch(equipmentProvider);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Documentos e Equipamentos', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(24),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('Meus Contratos Legais', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: colors.onSurface)),
            const SizedBox(height: 16),
            
            // SCM Contract
            scmOpt.when(
              loading: () => const Center(child: CircularProgressIndicator()),
              error: (err, _) => Text('Erro ao carregar termo: $err', style: const TextStyle(color: Colors.red)),
              data: (data) => _DocumentCard(
                title: data['title'] ?? 'Contrato de Adesão',
                subtitle: 'Gerado em: ${data['issuedAt'] != null ? DateTime.parse(data['issuedAt']).toLocal().toString().split(' ')[0] : '-'}',
                icon: LucideIcons.fileText,
                colors: colors,
                onTap: () => _simulateDownload(context),
              ),
            ),

            const SizedBox(height: 32),
            Text('Termos de Comodato', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: colors.onSurface)),
            const SizedBox(height: 16),
            
            // Equipment Contract
            eqOpt.when(
              loading: () => const Center(child: CircularProgressIndicator()),
              error: (err, _) => Text('Erro ao carregar equipamentos: $err', style: const TextStyle(color: Colors.red)),
              data: (data) => Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  _DocumentCard(
                    title: data['title'] ?? 'Termo de Comodato de Equipamentos',
                    subtitle: 'Vinculado ao plano: ${data['planName']}',
                    icon: LucideIcons.router,
                    colors: colors,
                    onTap: () => _simulateDownload(context),
                  ),
                  const SizedBox(height: 16),
                  if (data['equipmentList'] != null)
                    ...List.generate(data['equipmentList'].length, (index) {
                      final item = data['equipmentList'][index];
                      return Container(
                        margin: const EdgeInsets.only(bottom: 12),
                        padding: const EdgeInsets.all(16),
                        decoration: BoxDecoration(
                          color: Colors.grey.shade50,
                          borderRadius: BorderRadius.circular(16),
                          border: Border.all(color: Colors.grey.shade200),
                        ),
                        child: Row(
                          children: [
                            const Icon(LucideIcons.hardDrive, color: Colors.grey),
                            const SizedBox(width: 16),
                            Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(item['type'] ?? 'Equipamento', style: const TextStyle(fontWeight: FontWeight.bold)),
                                  const SizedBox(height: 4),
                                  Text('MAC: ${item['mac'] ?? 'N/A'}', style: TextStyle(color: Colors.grey.shade600, fontSize: 12)),
                                ],
                              ),
                            )
                          ],
                        ),
                      );
                    })
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  void _simulateDownload(BuildContext context) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: const Row(
          children: [
            Icon(LucideIcons.downloadCloud, color: Colors.white),
            SizedBox(width: 12),
            Text('Baixando PDF Seguro...', style: TextStyle(fontWeight: FontWeight.bold)),
          ],
        ),
        backgroundColor: Theme.of(context).colorScheme.primary,
        behavior: SnackBarBehavior.floating,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      ),
    );
  }
}

class _DocumentCard extends StatelessWidget {
  final String title;
  final String subtitle;
  final IconData icon;
  final ColorScheme colors;
  final VoidCallback onTap;

  const _DocumentCard({required this.title, required this.subtitle, required this.icon, required this.colors, required this.onTap});

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(20),
      child: Container(
        padding: const EdgeInsets.all(20),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(20),
          border: Border.all(color: Colors.grey.shade200),
          boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.02), blurRadius: 10, offset: const Offset(0, 4))],
        ),
        child: Row(
          children: [
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(color: colors.primary.withOpacity(0.1), shape: BoxShape.circle),
              child: Icon(icon, color: colors.primary),
            ),
            const SizedBox(width: 16),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(title, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
                  const SizedBox(height: 4),
                  Text(subtitle, style: TextStyle(color: Colors.grey.shade600, fontSize: 12)),
                ],
              ),
            ),
            const Icon(LucideIcons.download, color: Colors.grey, size: 20),
          ],
        ),
      ),
    );
  }
}
