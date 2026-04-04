import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'dart:ui';
import '../services/api_service.dart';
import '../providers/auth_provider.dart';
import '../utils/app_styles.dart';

class ProfileScreen extends ConsumerStatefulWidget {
  const ProfileScreen({super.key});

  @override
  ConsumerState<ProfileScreen> createState() => _ProfileScreenState();
}

class _ProfileScreenState extends ConsumerState<ProfileScreen> {
  bool _biometricsEnabled = false;

  void _changePassword() {
    showDialog(
      context: context,
      barrierColor: Colors.black.withOpacity(0.8),
      builder: (context) => const _ChangePasswordDialog(),
    );
  }

  @override
  Widget build(BuildContext context) {
    final user = ref.watch(authProvider).user;

    return Scaffold(
      backgroundColor: AppStyles.darkBg,
      appBar: AppBar(
        title: Text('Meu Perfil Ultra', style: GoogleFonts.sora(fontWeight: FontWeight.bold)),
      ),
      body: Stack(
        children: [
          // Subtly glow at the top
          Positioned(
            top: -100, left: MediaQuery.of(context).size.width / 2 - 150,
            child: ImageFiltered(
              imageFilter: ImageFilter.blur(sigmaX: 100, sigmaY: 100),
              child: Container(
                width: 300, height: 300,
                decoration: BoxDecoration(
                  color: AppStyles.primaryMagenta.withOpacity(0.05),
                  shape: BoxShape.circle,
                ),
              ),
            ),
          ),

          SingleChildScrollView(
            padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 32),
            child: Column(
              children: [
                // Profile Header
                Center(
                  child: Column(
                    children: [
                      Container(
                        padding: const EdgeInsets.all(4),
                        decoration: BoxDecoration(
                          shape: BoxShape.circle,
                          gradient: AppStyles.primaryGradient,
                          boxShadow: [
                            BoxShadow(color: AppStyles.primaryMagenta.withOpacity(0.3), blurRadius: 20),
                          ],
                        ),
                        child: CircleAvatar(
                          radius: 50,
                          backgroundColor: AppStyles.darkBg,
                          child: Text(
                            user != null ? user['name'].toString().substring(0, 1).toUpperCase() : 'P',
                            style: GoogleFonts.sora(fontSize: 32, fontWeight: FontWeight.w900, color: Colors.white),
                          ),
                        ),
                      ).animate().scale(duration: 500.ms, curve: Curves.easeOutBack),
                      const SizedBox(height: 24),
                      Text(
                        user?['name'] ?? 'Cliente Plus', 
                        style: GoogleFonts.sora(fontSize: 24, fontWeight: FontWeight.w900, color: Colors.white),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        user?['email'] ?? 'plus_user_ultra@plus.com.br', 
                        style: GoogleFonts.dmSans(color: Colors.white38, fontSize: 13, fontWeight: FontWeight.w500),
                      ),
                    ],
                  ),
                ),
                
                const SizedBox(height: 48),

                // Sections
                _buildSectionTitle('CONTRATOS E DOCUMENTAÇÃO'),
                _buildMenuTile(
                  icon: LucideIcons.fileText,
                  title: 'Meus Contratos e Equipamentos',
                  onTap: () => context.push('/contracts'),
                ),
                
                const SizedBox(height: 32),
                
                _buildSectionTitle('SEGURANÇA E ACESSO'),
                _buildMenuTile(
                  icon: LucideIcons.key,
                  title: 'Alterar Senha de Acesso',
                  onTap: _changePassword,
                ),
                const SizedBox(height: 12),
                GlassCard(
                  padding: const EdgeInsets.symmetric(horizontal: 4, vertical: 8),
                  radius: 20,
                  child: SwitchListTile(
                    activeColor: AppStyles.primaryMagenta,
                    inactiveTrackColor: Colors.white.withOpacity(0.05),
                    title: Text(
                      'Acesso via Biometria', 
                      style: GoogleFonts.sora(color: Colors.white, fontWeight: FontWeight.w700, fontSize: 14),
                    ),
                    subtitle: Text(
                      'Face ID / Impressão Digital', 
                      style: GoogleFonts.dmSans(color: Colors.white38, fontSize: 11),
                    ),
                    secondary: const Icon(LucideIcons.fingerprint, color: AppStyles.primaryMagenta, size: 24),
                    value: _biometricsEnabled,
                    onChanged: (val) => setState(() => _biometricsEnabled = val),
                  ),
                ),

                const SizedBox(height: 60),

                // Logout Button
                SizedBox(
                  width: double.infinity,
                  height: 56,
                  child: OutlinedButton.icon(
                    onPressed: () {
                      ref.read(authProvider.notifier).logout();
                      context.go('/login');
                    },
                    style: OutlinedButton.styleFrom(
                      foregroundColor: Colors.redAccent,
                      side: BorderSide(color: Colors.redAccent.withOpacity(0.3)),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                    ),
                    icon: const Icon(LucideIcons.logOut, size: 20),
                    label: Text(
                      'ENCERRAR SESSÃO ULTRA', 
                      style: GoogleFonts.sora(fontWeight: FontWeight.w800, fontSize: 12, letterSpacing: 1),
                    ),
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

  Widget _buildSectionTitle(String title) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 16, left: 4),
      child: Align(
        alignment: Alignment.centerLeft,
        child: Text(
          title, 
          style: GoogleFonts.sora(color: Colors.white24, fontWeight: FontWeight.w900, fontSize: 10, letterSpacing: 1.5),
        ),
      ),
    );
  }

  Widget _buildMenuTile({required IconData icon, required String title, required VoidCallback onTap}) {
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      child: GestureDetector(
        onTap: onTap,
        child: GlassCard(
          padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
          radius: 20,
          child: Row(
            children: [
              Icon(icon, color: AppStyles.primaryMagenta, size: 22),
              const SizedBox(width: 16),
              Expanded(
                child: Text(
                  title, 
                  style: GoogleFonts.sora(color: Colors.white, fontWeight: FontWeight.w700, fontSize: 14),
                ),
              ),
              const Icon(LucideIcons.chevronRight, color: Colors.white24, size: 18),
            ],
          ),
        ),
      ),
    ).animate().fadeIn(delay: 200.ms).moveX(begin: 10, end: 0);
  }
}

class _ChangePasswordDialog extends ConsumerStatefulWidget {
  const _ChangePasswordDialog();

  @override
  ConsumerState<_ChangePasswordDialog> createState() => _ChangePasswordDialogState();
}

class _ChangePasswordDialogState extends ConsumerState<_ChangePasswordDialog> {
  final _oldPassCtrl = TextEditingController();
  final _newPassCtrl = TextEditingController();
  bool _isLoading = false;

  void _submit() async {
    final oldPass = _oldPassCtrl.text;
    final newPass = _newPassCtrl.text;
    if (oldPass.isEmpty || newPass.isEmpty) return;

    setState(() => _isLoading = true);
    try {
      await ref.read(apiProvider).patch('/auth/password', data: {
        'currentPassword': oldPass,
        'newPassword': newPass
      });
      if (!mounted) return;
      Navigator.pop(context);
      ScaffoldMessenger.of(context).showSnackBar(const SnackBar(
        content: Text('Sua senha foi atualizada.'),
        backgroundColor: Color(0xFF00E676),
      ));
    } catch (e) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Erro: $e')));
    } finally {
      if (mounted) setState(() => _isLoading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Material(
        color: Colors.transparent,
        child: GlassCard(
          width: 300,
          padding: const EdgeInsets.all(32),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Text('Trocar Senha', style: GoogleFonts.sora(fontWeight: FontWeight.w900, color: Colors.white, fontSize: 20)),
              const SizedBox(height: 24),
              _buildInput(controller: _oldPassCtrl, label: 'Senha Atual'),
              const SizedBox(height: 16),
              _buildInput(controller: _newPassCtrl, label: 'Nova Senha'),
              const SizedBox(height: 32),
              Container(
                height: 50, width: double.infinity,
                decoration: BoxDecoration(gradient: AppStyles.primaryGradient, borderRadius: BorderRadius.circular(12)),
                child: ElevatedButton(
                  onPressed: _isLoading ? null : _submit,
                  style: ElevatedButton.styleFrom(backgroundColor: Colors.transparent, shadowColor: Colors.transparent),
                  child: _isLoading 
                    ? const SizedBox(width: 16, height: 16, child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2))
                    : Text('Salvar', style: GoogleFonts.sora(fontWeight: FontWeight.bold, color: Colors.white)),
                ),
              ),
              TextButton(onPressed: () => Navigator.pop(context), child: Text('Cancelar', style: GoogleFonts.dmSans(color: Colors.white24))),
            ],
          ),
        ),
      ),
    ).animate().scale(duration: 300.ms, curve: Curves.easeOutBack).fadeIn();
  }

  Widget _buildInput({required TextEditingController controller, required String label}) {
    return TextField(
      controller: controller,
      obscureText: true,
      style: GoogleFonts.dmSans(color: Colors.white),
      decoration: InputDecoration(
        labelText: label,
        labelStyle: GoogleFonts.dmSans(color: Colors.white38),
        filled: true,
        fillColor: Colors.white.withOpacity(0.05),
        border: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: BorderSide.none),
        focusedBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: const BorderSide(color: AppStyles.primaryMagenta)),
      ),
    );
  }
}
