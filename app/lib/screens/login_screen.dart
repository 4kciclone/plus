import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:lucide_icons/lucide_icons.dart';
import '../providers/auth_provider.dart';
import '../widgets/animated_logo.dart';
import '../utils/app_styles.dart';
import 'dart:ui';

class LoginScreen extends ConsumerStatefulWidget {
  const LoginScreen({super.key});

  @override
  ConsumerState<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends ConsumerState<LoginScreen> {
  final _emailCtrl = TextEditingController();
  final _passCtrl = TextEditingController();

  void _submit() async {
    final success = await ref.read(authProvider.notifier).login(
      _emailCtrl.text.trim(),
      _passCtrl.text,
    );
    if (success && mounted) {
      context.go('/home'); // Go to home instead of / to avoid splash again
    }
  }

  @override
  Widget build(BuildContext context) {
    final currentAuthState = ref.watch(authProvider);

    return Scaffold(
      backgroundColor: AppStyles.darkBg,
      body: Stack(
        children: [
          // Background Glow
          Positioned(
            bottom: -100,
            left: -100,
            child: ImageFiltered(
              imageFilter: ImageFilter.blur(sigmaX: 80, sigmaY: 80),
              child: Container(
                width: 300,
                height: 300,
                decoration: BoxDecoration(
                  color: AppStyles.primaryMagenta.withOpacity(0.1),
                  shape: BoxShape.circle,
                ),
              ),
            ),
          ),

          SafeArea(
            child: Center(
              child: SingleChildScrollView(
                padding: const EdgeInsets.all(32.0),
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  children: [
                    const AnimatedLogo(size: 100),
                    const SizedBox(height: 32),
                    Text(
                      'Bem-vindo à Plus',
                      style: GoogleFonts.sora(
                        fontSize: 32, 
                        fontWeight: FontWeight.w900, 
                        color: Colors.white,
                        letterSpacing: -1,
                      ),
                      textAlign: TextAlign.center,
                    ),
                    const SizedBox(height: 8),
                    Text(
                      'Sua internet, seu controle, seu app ultra.',
                      style: GoogleFonts.dmSans(
                        color: Colors.white.withOpacity(0.5),
                        fontSize: 14,
                        fontWeight: FontWeight.w500,
                      ),
                      textAlign: TextAlign.center,
                    ),
                    const SizedBox(height: 48),

                    if (currentAuthState.error != null)
                      Container(
                        padding: const EdgeInsets.all(16),
                        margin: const EdgeInsets.only(bottom: 24),
                        decoration: BoxDecoration(
                          color: Colors.red.withOpacity(0.05),
                          borderRadius: BorderRadius.circular(16),
                          border: Border.all(color: Colors.red.withOpacity(0.1)),
                        ),
                        child: Text(
                          currentAuthState.error!,
                          style: GoogleFonts.dmSans(
                            color: Colors.redAccent, 
                            fontSize: 13, 
                            fontWeight: FontWeight.bold,
                          ),
                          textAlign: TextAlign.center,
                        ),
                      ),

                    GlassCard(
                      padding: const EdgeInsets.all(24),
                      child: Column(
                        children: [
                          _buildTextField(
                            controller: _emailCtrl,
                            label: 'E-mail ou CPF',
                            icon: LucideIcons.user,
                          ),
                          const SizedBox(height: 16),
                          _buildTextField(
                            controller: _passCtrl,
                            label: 'Senha',
                            icon: LucideIcons.lock,
                            obscure: true,
                          ),
                        ],
                      ),
                    ),
                    
                    const SizedBox(height: 32),
                    
                    Container(
                      height: 60,
                      decoration: BoxDecoration(
                        gradient: AppStyles.primaryGradient,
                        borderRadius: BorderRadius.circular(16),
                        boxShadow: [
                          BoxShadow(
                            color: AppStyles.primaryMagenta.withOpacity(0.3),
                            blurRadius: 20,
                            offset: const Offset(0, 8),
                          ),
                        ],
                      ),
                      child: ElevatedButton(
                        onPressed: currentAuthState.isLoading ? null : _submit,
                        style: ElevatedButton.styleFrom(
                          backgroundColor: Colors.transparent,
                          foregroundColor: Colors.white,
                          shadowColor: Colors.transparent,
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                        ),
                        child: currentAuthState.isLoading
                            ? const SizedBox(
                                width: 20, 
                                height: 20, 
                                child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2),
                              )
                            : Text(
                                'Entrar no Sistema', 
                                style: GoogleFonts.sora(fontSize: 16, fontWeight: FontWeight.bold),
                              ),
                      ),
                    ),
                    
                    const SizedBox(height: 24),
                    TextButton(
                      onPressed: () {}, // Recover pass logic would go here
                      child: Text(
                        'Esqueci minha senha',
                        style: GoogleFonts.dmSans(
                          color: Colors.white30,
                          fontSize: 13,
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildTextField({
    required TextEditingController controller,
    required String label,
    required IconData icon,
    bool obscure = false,
  }) {
    return TextFormField(
      controller: controller,
      obscureText: obscure,
      style: GoogleFonts.dmSans(color: Colors.white, fontSize: 15),
      decoration: InputDecoration(
        prefixIcon: Icon(icon, color: Colors.white30, size: 20),
        labelText: label,
        labelStyle: GoogleFonts.dmSans(color: Colors.white30),
        filled: true,
        fillColor: Colors.white.withOpacity(0.05),
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: BorderSide.none,
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: BorderSide.none,
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: const BorderSide(color: AppStyles.primaryMagenta, width: 1),
        ),
      ),
    );
  }
}
