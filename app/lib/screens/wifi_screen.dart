import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:go_router/go_router.dart';
import '../services/api_service.dart';

final wifiConfigProvider = FutureProvider.autoDispose<Map<String, dynamic>>((ref) async {
  final res = await ref.read(apiProvider).get('/wifi');
  return res.data;
});

class WifiScreen extends ConsumerWidget {
  const WifiScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final colors = Theme.of(context).colorScheme;
    final wifiOpt = ref.watch(wifiConfigProvider);

    return Scaffold(
      appBar: AppBar(
        title: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Hero(tag: 'hero-Meu Wi-Fi', child: Icon(LucideIcons.router, color: colors.primary)),
            const SizedBox(width: 12),
            const Text('Meu Wi-Fi', style: TextStyle(fontWeight: FontWeight.bold)),
          ],
        ),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(24),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Status do Roteador
            Center(
              child: Column(
                children: [
                  Container(
                    padding: const EdgeInsets.all(24),
                    decoration: BoxDecoration(
                      shape: BoxShape.circle,
                      color: colors.primary.withOpacity(0.05),
                    ),
                    child: Icon(LucideIcons.router, size: 60, color: colors.primary),
                  ),
                  const SizedBox(height: 16),
                  Text('Roteador Principal', style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold, color: colors.onSurface)),
                  const SizedBox(height: 8),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                    decoration: BoxDecoration(
                      color: Colors.green.withOpacity(0.1),
                      borderRadius: BorderRadius.circular(16),
                    ),
                    child: Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Icon(LucideIcons.checkCircle, color: Colors.green.shade700, size: 14),
                        const SizedBox(width: 8),
                        Text('Online via Fibra', style: TextStyle(color: Colors.green.shade700, fontWeight: FontWeight.bold, fontSize: 12)),
                      ],
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 24),
            
            // Radar AR Button Edge-to-Edge
            SizedBox(
              width: double.infinity,
              height: 56,
              child: ElevatedButton.icon(
                onPressed: () => context.push('/radar'),
                style: ElevatedButton.styleFrom(
                  backgroundColor: colors.primary,
                  foregroundColor: Colors.white,
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                  elevation: 0,
                ),
                icon: const Icon(LucideIcons.scanLine, size: 22),
                label: const Text('Mapa de Sinal 3D', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
              ),
            ),
            
            const SizedBox(height: 48),

            // Gerenciamento de Senha (REAL DB)
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text('Rede Principal', style: TextStyle(fontSize: 15, fontWeight: FontWeight.bold, color: Colors.grey.shade600, letterSpacing: 1.5)),
                TextButton.icon(
                  onPressed: wifiOpt.isLoading ? null : () {
                    if (wifiOpt.value != null) {
                      _showEditWifiDialog(context, ref, wifiOpt.value!['ssid'], wifiOpt.value!['password']);
                    }
                  },
                  icon: Icon(LucideIcons.edit2, size: 16, color: colors.primary),
                  label: Text('Editar', style: TextStyle(color: colors.primary)),
                ),
              ],
            ),
            const SizedBox(height: 8),
            Container(
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(20),
                border: Border.all(color: Colors.grey.shade200),
                boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.02), blurRadius: 10, offset: const Offset(0, 4))],
              ),
              child: wifiOpt.when(
                loading: () => const Padding(padding: EdgeInsets.all(32), child: Center(child: CircularProgressIndicator())),
                error: (err, _) => Padding(padding: const EdgeInsets.all(24), child: Center(child: Text('Erro: $err', style: const TextStyle(color: Colors.red)))),
                data: (wifiData) {
                  return Padding(
                    padding: const EdgeInsets.all(24.0),
                    child: Column(
                      children: [
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text('Nome da Rede (SSID)', style: TextStyle(color: Colors.grey.shade500, fontSize: 12, fontWeight: FontWeight.bold)),
                                const SizedBox(height: 4),
                                Text(wifiData['ssid'] ?? 'Desconhecido', style: TextStyle(fontSize: 16, fontWeight: FontWeight.w900, color: colors.onSurface)),
                              ],
                            ),
                            Icon(LucideIcons.wifi, color: colors.primary),
                          ],
                        ),
                        const Padding(
                          padding: EdgeInsets.symmetric(vertical: 16.0),
                          child: Divider(height: 1),
                        ),
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text('Senha', style: TextStyle(color: Colors.grey.shade500, fontSize: 12, fontWeight: FontWeight.bold)),
                                const SizedBox(height: 4),
                                Text('********', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold, letterSpacing: 2, color: colors.onSurface)),
                              ],
                            ),
                            IconButton(onPressed: () {}, icon: Icon(LucideIcons.eyeOff, color: Colors.grey.shade400, size: 20)),
                          ],
                        ),
                      ],
                    ),
                  );
                }
              ),
            ),
            const SizedBox(height: 24),
            
            // Guest Wi-Fi Button
            SizedBox(
              width: double.infinity,
              height: 64,
              child: OutlinedButton.icon(
                onPressed: () => _showGuestWifiDialog(context),
                style: OutlinedButton.styleFrom(
                  side: BorderSide(color: colors.primary.withOpacity(0.2)),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
                  backgroundColor: colors.primary.withOpacity(0.02),
                  elevation: 0,
                ),
                icon: Icon(LucideIcons.partyPopper, size: 24, color: colors.secondary),
                label: Text('Criar Wi-Fi Temporário', style: TextStyle(fontSize: 15, fontWeight: FontWeight.bold, color: colors.onSurface)),
              ),
            ),
          ],
        ),
      ),
    );
  }

  void _showEditWifiDialog(BuildContext context, WidgetRef ref, String initialSsid, String initialPass) {
    showDialog(
      context: context,
      builder: (context) => _EditWifiDialog(initialSsid: initialSsid, initialPass: initialPass),
    );
  }

  void _showGuestWifiDialog(BuildContext context) {
    showDialog(
      context: context,
      barrierColor: Colors.black.withOpacity(0.8),
      builder: (context) => const _GuestWifiDialog(),
    );
  }
}

class _EditWifiDialog extends ConsumerStatefulWidget {
  final String initialSsid;
  final String initialPass;
  const _EditWifiDialog({required this.initialSsid, required this.initialPass});

  @override
  ConsumerState<_EditWifiDialog> createState() => _EditWifiDialogState();
}

class _EditWifiDialogState extends ConsumerState<_EditWifiDialog> {
  late TextEditingController _ssidCtrl;
  late TextEditingController _passCtrl;
  bool _isLoading = false;

  @override
  void initState() {
    super.initState();
    _ssidCtrl = TextEditingController(text: widget.initialSsid);
    _passCtrl = TextEditingController(text: widget.initialPass);
  }

  void _save() async {
    final ssid = _ssidCtrl.text.trim();
    final pass = _passCtrl.text.trim();
    if (ssid.isEmpty || pass.length < 8) return;

    setState(() => _isLoading = true);
    
    try {
      final res = await ref.read(apiProvider).patch('/wifi', data: {
        'ssid': ssid,
        'password': pass,
      });
      if (!mounted) return;
      
      ref.invalidate(wifiConfigProvider); // refresh UI
      Navigator.pop(context);
      
      ScaffoldMessenger.of(context).showSnackBar(SnackBar(
        content: Row(
          children: [
            const Icon(LucideIcons.checkCircle, color: Colors.white),
            const SizedBox(width: 12),
            Expanded(child: Text(res.data['message'] ?? 'Concluído', style: const TextStyle(fontWeight: FontWeight.bold))),
          ],
        ),
        backgroundColor: Colors.green.shade700,
        behavior: SnackBarBehavior.floating,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
        margin: const EdgeInsets.only(bottom: 24, left: 24, right: 24),
      ));
    } catch (e) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Erro: $e', style: const TextStyle(color: Colors.white)), backgroundColor: Colors.redAccent));
    }

    if (mounted) setState(() => _isLoading = false);
  }

  @override
  Widget build(BuildContext context) {
    return AlertDialog(
      backgroundColor: Colors.white,
      title: const Text('Configurar Roteador', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
      content: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          const Text('Essas alterações serão aplicadas instantaneamente no seu roteador (provisionamento remoto).', style: TextStyle(fontSize: 12, color: Colors.grey)),
          const SizedBox(height: 24),
          TextField(controller: _ssidCtrl, decoration: const InputDecoration(labelText: 'Nome da Rede (SSID)')),
          const SizedBox(height: 16),
          TextField(controller: _passCtrl, decoration: const InputDecoration(labelText: 'Nova Senha (Mín. 8 caracteres)')),
        ],
      ),
      actions: [
        TextButton(onPressed: () => Navigator.pop(context), child: const Text('Cancelar', style: TextStyle(color: Colors.grey))),
        ElevatedButton(
          onPressed: _isLoading ? null : _save,
          style: ElevatedButton.styleFrom(backgroundColor: Theme.of(context).colorScheme.primary, foregroundColor: Colors.white),
          child: _isLoading ? const SizedBox(width: 16, height: 16, child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2)) : const Text('Salvar'),
        ),
      ],
    );
  }
}

// FEATURE 6: Guest Wi-Fi Dialog (Light Corporate Mode)
class _GuestWifiDialog extends StatefulWidget {
  const _GuestWifiDialog();

  @override
  State<_GuestWifiDialog> createState() => _GuestWifiDialogState();
}

class _GuestWifiDialogState extends State<_GuestWifiDialog> with SingleTickerProviderStateMixin {
  late AnimationController _timerController;

  @override
  void initState() {
    super.initState();
    _timerController = AnimationController(vsync: this, duration: const Duration(hours: 4));
    _timerController.reverse(from: 1.0);
  }

  @override
  void dispose() {
    _timerController.dispose();
    super.dispose();
  }

  String get timerString {
    Duration duration = _timerController.duration! * _timerController.value;
    return '${duration.inHours.toString().padLeft(2, '0')}:${(duration.inMinutes % 60).toString().padLeft(2, '0')}:${(duration.inSeconds % 60).toString().padLeft(2, '0')}';
  }

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Material(
        color: Colors.transparent,
        child: Container(
          width: 320,
          padding: const EdgeInsets.all(32),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(32),
            boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.05), blurRadius: 40)],
          ),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              const Icon(LucideIcons.partyPopper, color: Color(0xFFFF0080), size: 36),
              const SizedBox(height: 16),
              const Text('Wi-Fi de Convidados', style: TextStyle(color: Color(0xFF1E293B), fontSize: 20, fontWeight: FontWeight.bold)),
              const SizedBox(height: 8),
              Text('Rede: Familia_Plus_Visitante\nSenha: plusfesta2026', textAlign: TextAlign.center, style: TextStyle(color: Colors.grey.shade600, fontSize: 13, height: 1.5)),
              const SizedBox(height: 32),
              Container(
                width: 180, height: 180, padding: const EdgeInsets.all(24),
                decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(24), border: Border.all(color: Colors.grey.shade200, width: 2)),
                child: const FittedBox(child: Icon(LucideIcons.qrCode, color: Colors.black)),
              ),
              const SizedBox(height: 32),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                decoration: BoxDecoration(color: Colors.red.withOpacity(0.05), borderRadius: BorderRadius.circular(16), border: Border.all(color: Colors.red.withOpacity(0.1))),
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    const Icon(LucideIcons.timer, color: Colors.red, size: 16),
                    const SizedBox(width: 8),
                    AnimatedBuilder(
                      animation: _timerController,
                      builder: (context, child) => Text('Expira em $timerString', style: const TextStyle(color: Colors.red, fontWeight: FontWeight.bold, fontSize: 14, letterSpacing: 1)),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 24),
              SizedBox(
                width: double.infinity, height: 48,
                child: ElevatedButton(
                  onPressed: () => Navigator.of(context).pop(),
                  style: ElevatedButton.styleFrom(backgroundColor: Colors.grey.shade100, foregroundColor: Colors.grey.shade800, shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)), elevation: 0),
                  child: const Text('Fechar', style: TextStyle(fontWeight: FontWeight.bold)),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
