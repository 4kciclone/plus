import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:flutter_animate/flutter_animate.dart';
import '../services/api_service.dart';
import '../utils/app_styles.dart';

final wifiConfigProvider = FutureProvider.autoDispose<Map<String, dynamic>>((ref) async {
  final res = await ref.read(apiProvider).get('/wifi');
  return res.data;
});

class WifiScreen extends ConsumerWidget {
  const WifiScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final wifiOpt = ref.watch(wifiConfigProvider);

    return Scaffold(
      backgroundColor: AppStyles.darkBg,
      appBar: AppBar(
        title: Text('Meu Wi-Fi', style: GoogleFonts.sora(fontWeight: FontWeight.bold)),
      ),
      body: Stack(
        children: [
          // Background subtle glow
          Positioned(
            top: 100, right: -50,
            child: Container(
              width: 200, height: 200,
              decoration: BoxDecoration(
                color: AppStyles.primaryMagenta.withOpacity(0.05),
                shape: BoxShape.circle,
              ),
            ),
          ),

          SingleChildScrollView(
            padding: const EdgeInsets.all(24),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Router Status Hero
                Center(
                  child: Column(
                    children: [
                      Container(
                        padding: const EdgeInsets.all(32),
                        decoration: BoxDecoration(
                          shape: BoxShape.circle,
                          color: AppStyles.primaryMagenta.withOpacity(0.05),
                          border: Border.all(color: AppStyles.primaryMagenta.withOpacity(0.1)),
                        ),
                        child: const Icon(LucideIcons.router, size: 60, color: AppStyles.primaryMagenta)
                            .animate(onPlay: (controller) => controller.repeat())
                            .shimmer(duration: 2.seconds, color: Colors.white24)
                            .scale(begin: const Offset(1, 1), end: const Offset(1.05, 1.05), duration: 2.seconds, curve: Curves.easeInOut),
                      ),
                      const SizedBox(height: 24),
                      Text(
                        'Roteador Giga Plus', 
                        style: GoogleFonts.sora(fontSize: 22, fontWeight: FontWeight.w900, color: Colors.white),
                      ),
                      const SizedBox(height: 12),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                        decoration: BoxDecoration(
                          color: const Color(0xFF00E676).withOpacity(0.1),
                          borderRadius: BorderRadius.circular(12),
                          border: Border.all(color: const Color(0xFF00E676).withOpacity(0.2)),
                        ),
                        child: Row(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            Container(
                              width: 8, height: 8,
                              decoration: const BoxDecoration(color: Color(0xFF00E676), shape: BoxShape.circle),
                            ).animate(onPlay: (c) => c.repeat()).fade(duration: 1.seconds),
                            const SizedBox(width: 10),
                            Text(
                              'ONLINE VIA FIBRA', 
                              style: GoogleFonts.sora(color: const Color(0xFF00E676), fontWeight: FontWeight.w900, fontSize: 11, letterSpacing: 1),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),
                
                const SizedBox(height: 40),
                
                // Signal Map Button
                Material(
                  color: Colors.transparent,
                  child: InkWell(
                    onTap: () => context.push('/radar'),
                    borderRadius: BorderRadius.circular(20),
                    child: GlassCard(
                      padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 18),
                      radius: 20,
                      child: Row(
                        children: [
                          const Icon(LucideIcons.scanLine, color: AppStyles.primaryMagenta),
                          const SizedBox(width: 16),
                          Expanded(
                            child: Text(
                              'Visualizar Mapa de Sinal 3D', 
                              style: GoogleFonts.sora(color: Colors.white, fontWeight: FontWeight.w700, fontSize: 15),
                            ),
                          ),
                          const Icon(LucideIcons.chevronRight, color: Colors.white24, size: 20),
                        ],
                      ),
                    ),
                  ),
                ).animate().fadeIn(delay: 200.ms).moveY(begin: 10, end: 0),
                
                const SizedBox(height: 48),

                // Main Network Section
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(
                      'CONEXÃO PRINCIPAL', 
                      style: GoogleFonts.sora(fontSize: 12, fontWeight: FontWeight.w900, color: Colors.white38, letterSpacing: 1.5),
                    ),
                    TextButton.icon(
                      onPressed: wifiOpt.isLoading ? null : () {
                        if (wifiOpt.value != null) {
                          _showEditWifiDialog(context, ref, wifiOpt.value!['ssid'], wifiOpt.value!['password']);
                        }
                      },
                      icon: const Icon(LucideIcons.edit2, size: 14, color: AppStyles.primaryMagenta),
                      label: Text('Ajustar', style: GoogleFonts.dmSans(color: AppStyles.primaryMagenta, fontWeight: FontWeight.bold)),
                    ),
                  ],
                ),
                const SizedBox(height: 12),
                
                wifiOpt.when(
                  loading: () => const GlassCard(height: 160, child: Center(child: CircularProgressIndicator(color: AppStyles.primaryMagenta))),
                  error: (err, _) => GlassCard(child: Text('Erro: $err', style: const TextStyle(color: Colors.red))),
                  data: (wifiData) {
                    return GlassCard(
                      padding: const EdgeInsets.all(28),
                      child: Column(
                        children: [
                          _buildWifiField(
                            label: 'NOME DA REDE (SSID)',
                            value: wifiData['ssid'] ?? 'Plus_Internet_Giga',
                            icon: LucideIcons.share2,
                          ),
                          Padding(
                            padding: const EdgeInsets.symmetric(vertical: 20.0),
                            child: Divider(color: Colors.white.withOpacity(0.05), height: 1),
                          ),
                          _buildWifiField(
                            label: 'SENHA DE ACESSO',
                            value: '••••••••••••',
                            icon: LucideIcons.eyeOff,
                          ),
                        ],
                      ),
                    ).animate().fadeIn(delay: 400.ms).scale(begin: const Offset(0.98, 0.98));
                  }
                ),
                
                const SizedBox(height: 32),
                
                // Guest Wi-Fi Ultra Button
                GestureDetector(
                  onTap: () => _showGuestWifiDialog(context),
                  child: Container(
                    width: double.infinity,
                    padding: const EdgeInsets.all(24),
                    decoration: BoxDecoration(
                      gradient: LinearGradient(
                        colors: [
                          AppStyles.primaryMagenta.withOpacity(0.1),
                          AppStyles.secondaryMagenta.withOpacity(0.05),
                        ],
                      ),
                      borderRadius: BorderRadius.circular(24),
                      border: Border.all(color: AppStyles.primaryMagenta.withOpacity(0.2)),
                    ),
                    child: Row(
                      children: [
                        Container(
                          padding: const EdgeInsets.all(12),
                          decoration: BoxDecoration(
                            color: AppStyles.primaryMagenta.withOpacity(0.2),
                            borderRadius: BorderRadius.circular(16),
                          ),
                          child: const Icon(LucideIcons.partyPopper, color: AppStyles.primaryMagenta, size: 28),
                        ),
                        const SizedBox(width: 20),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                'Rede de Convidados', 
                                style: GoogleFonts.sora(color: Colors.white, fontWeight: FontWeight.w800, fontSize: 16),
                              ),
                              const SizedBox(height: 4),
                              Text(
                                'Crie um acesso temporário seguro', 
                                style: GoogleFonts.dmSans(color: Colors.white54, fontSize: 13),
                              ),
                            ],
                          ),
                        ),
                        const Icon(LucideIcons.plusCircle, color: AppStyles.primaryMagenta),
                      ],
                    ),
                  ),
                ).animate().fadeIn(delay: 600.ms).moveY(begin: 20, end: 0),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildWifiField({required String label, required String value, required IconData icon}) {
    return Row(
      children: [
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(label, style: GoogleFonts.sora(color: Colors.white38, fontSize: 10, fontWeight: FontWeight.w900, letterSpacing: 1)),
              const SizedBox(height: 6),
              Text(value, style: GoogleFonts.dmSans(fontSize: 18, fontWeight: FontWeight.w700, color: Colors.white)),
            ],
          ),
        ),
        Icon(icon, color: Colors.white24, size: 20),
      ],
    );
  }

  void _showEditWifiDialog(BuildContext context, WidgetRef ref, String initialSsid, String initialPass) {
    showDialog(
      context: context,
      barrierColor: Colors.blackDE.withOpacity(0.8), // Using DE suffix for transparent black
      builder: (context) => _EditWifiDialog(initialSsid: initialSsid, initialPass: initialPass),
    );
  }

  void _showGuestWifiDialog(BuildContext context) {
    showDialog(
      context: context,
      barrierColor: Colors.black.withOpacity(0.9),
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
      await ref.read(apiProvider).patch('/wifi', data: {
        'ssid': ssid,
        'password': pass,
      });
      if (!mounted) return;
      
      ref.invalidate(wifiConfigProvider);
      Navigator.pop(context);
      
      ScaffoldMessenger.of(context).showSnackBar(SnackBar(
        content: Text('Configurações atualizadas no roteador!', style: GoogleFonts.sora(fontWeight: FontWeight.bold, fontSize: 13)),
        backgroundColor: const Color(0xFF00E676),
        behavior: SnackBarBehavior.floating,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
      ));
    } catch (e) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Erro: $e')));
    }

    if (mounted) setState(() => _isLoading = false);
  }

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Material(
        color: Colors.transparent,
        child: GlassCard(
          width: 320,
          padding: const EdgeInsets.all(32),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              Text('Configurar Router', style: GoogleFonts.sora(fontSize: 20, fontWeight: FontWeight.w900, color: Colors.white)),
              const SizedBox(height: 8),
              Text('Ajuste as configurações reais da sua rede.', style: GoogleFonts.dmSans(fontSize: 13, color: Colors.white54)),
              const SizedBox(height: 24),
              _buildModernInput(controller: _ssidCtrl, label: 'Nome da Rede'),
              const SizedBox(height: 16),
              _buildModernInput(controller: _passCtrl, label: 'Senha (Mín. 8 char)', obscure: true),
              const SizedBox(height: 32),
              Container(
                height: 54,
                decoration: BoxDecoration(
                  gradient: AppStyles.primaryGradient,
                  borderRadius: BorderRadius.circular(14),
                ),
                child: ElevatedButton(
                  onPressed: _isLoading ? null : _save,
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Colors.transparent,
                    shadowColor: Colors.transparent,
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                  ),
                  child: _isLoading 
                    ? const SizedBox(width: 20, height: 20, child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2))
                    : Text('Salvar Alterações', style: GoogleFonts.sora(fontWeight: FontWeight.bold, color: Colors.white)),
                ),
              ),
              const SizedBox(height: 12),
              TextButton(onPressed: () => Navigator.pop(context), child: Text('Cancelar', style: GoogleFonts.dmSans(color: Colors.white38))),
            ],
          ),
        ),
      ),
    ).animate().scale(duration: 300.ms, curve: Curves.backOut).fadeIn();
  }

  Widget _buildModernInput({required TextEditingController controller, required String label, bool obscure = false}) {
    return TextField(
      controller: controller,
      obscureText: obscure,
      style: GoogleFonts.dmSans(color: Colors.white),
      decoration: InputDecoration(
        labelText: label,
        labelStyle: GoogleFonts.dmSans(color: Colors.white38),
        filled: true,
        fillColor: Colors.white.withOpacity(0.05),
        border: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: BorderSide.none),
        focusedBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: const BorderSide(color: AppStyles.primaryMagenta, width: 1)),
      ),
    );
  }
}

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
        child: GlassCard(
          width: 320,
          padding: const EdgeInsets.all(32),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              const Icon(LucideIcons.partyPopper, color: AppStyles.primaryMagenta, size: 40).animate().shake(delay: 500.ms),
              const SizedBox(height: 16),
              Text('Acesso Convidado', style: GoogleFonts.sora(color: Colors.white, fontSize: 22, fontWeight: FontWeight.w900)),
              const SizedBox(height: 12),
              RichText(
                textAlign: TextAlign.center,
                text: TextSpan(
                  style: GoogleFonts.dmSans(color: Colors.white54, fontSize: 13, height: 1.6),
                  children: [
                    const TextSpan(text: 'Sua rede temporária está ativa:\n'),
                    TextSpan(text: 'Familia_Plus_Visitante', style: GoogleFonts.dmSans(color: Colors.white, fontWeight: FontWeight.bold)),
                    const TextSpan(text: '\nSenha: '),
                    TextSpan(text: 'plusfesta2026', style: GoogleFonts.dmSans(color: AppStyles.primaryMagenta, fontWeight: FontWeight.bold)),
                  ],
                ),
              ),
              const SizedBox(height: 32),
              AppStyles.glassEffect(
                radius: 20,
                child: Container(
                  width: 160, height: 160, padding: const EdgeInsets.all(20),
                  decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(20)),
                  child: const FittedBox(child: Icon(LucideIcons.qrCode, color: AppStyles.darkBg)),
                ),
              ),
              const SizedBox(height: 32),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
                decoration: BoxDecoration(
                  color: AppStyles.primaryMagenta.withOpacity(0.05), 
                  borderRadius: BorderRadius.circular(12), 
                  border: Border.all(color: AppStyles.primaryMagenta.withOpacity(0.1))
                ),
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    const Icon(LucideIcons.timer, color: AppStyles.primaryMagenta, size: 16),
                    const SizedBox(width: 10),
                    AnimatedBuilder(
                      animation: _timerController,
                      builder: (context, child) => Text(
                        'Expira em $timerString', 
                        style: GoogleFonts.sora(color: AppStyles.primaryMagenta, fontWeight: FontWeight.w900, fontSize: 13, letterSpacing: 0.5)
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 32),
              SizedBox(
                width: double.infinity, height: 50,
                child: ElevatedButton(
                  onPressed: () => Navigator.of(context).pop(),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Colors.white.withOpacity(0.05), 
                    foregroundColor: Colors.white, 
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)), 
                    elevation: 0
                  ),
                  child: Text('Concluir', style: GoogleFonts.sora(fontWeight: FontWeight.bold)),
                ),
              ),
            ],
          ),
        ),
      ),
    ).animate().scale(duration: 400.ms, curve: Curves.elasticOut).fadeIn();
  }
}
