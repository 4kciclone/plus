import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_fonts/google_fonts.dart';
import '../providers/auth_provider.dart';
import '../widgets/animated_logo.dart';
import '../utils/app_styles.dart';

class SplashScreen extends ConsumerStatefulWidget {
  const SplashScreen({super.key});

  @override
  ConsumerState<SplashScreen> createState() => _SplashScreenState();
}

class _SplashScreenState extends ConsumerState<SplashScreen> with SingleTickerProviderStateMixin {
  late AnimationController _fadeController;
  late Animation<double> _fadeAnim;

  @override
  void initState() {
    super.initState();
    _fadeController = AnimationController(
      vsync: this, 
      duration: const Duration(milliseconds: 1500)
    );
    
    _fadeAnim = Tween<double>(begin: 0.0, end: 1.0).animate(
      CurvedAnimation(parent: _fadeController, curve: Curves.easeIn),
    );

    _fadeController.forward().then((_) {
      _checkAuthAndNavigate();
    });
  }

  void _checkAuthAndNavigate() async {
    await Future.delayed(const Duration(milliseconds: 500));
    if (!mounted) return;
    final user = ref.read(authProvider).user;
    if (user != null) {
      context.go('/home');
    } else {
      context.go('/login');
    }
  }

  @override
  void dispose() {
    _fadeController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppStyles.darkBg,
      body: Center(
        child: FadeTransition(
          opacity: _fadeAnim,
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              const AnimatedLogo(size: 160),
              const SizedBox(height: 32),
              RichText(
                text: TextSpan(
                  children: [
                    TextSpan(
                      text: 'PLUS ',
                      style: GoogleFonts.sora(
                        fontSize: 48,
                        fontWeight: FontWeight.w900,
                        letterSpacing: -1,
                        color: Colors.white,
                      ),
                    ),
                    TextSpan(
                      text: 'INTERNET',
                      style: GoogleFonts.sora(
                        fontSize: 48,
                        fontWeight: FontWeight.w300,
                        letterSpacing: -1,
                        color: Colors.white.withOpacity(0.5),
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 12),
              Text(
                'Velocidade que você sente',
                style: GoogleFonts.dmSans(
                  fontSize: 16,
                  color: AppStyles.primaryMagenta.withOpacity(0.8),
                  fontWeight: FontWeight.w500,
                  letterSpacing: 2,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
