import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../providers/auth_provider.dart';

class SplashScreen extends ConsumerStatefulWidget {
  const SplashScreen({super.key});

  @override
  ConsumerState<SplashScreen> createState() => _SplashScreenState();
}

class _SplashScreenState extends ConsumerState<SplashScreen> with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<double> _pathAnim;
  late Animation<double> _fadeAnim;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(vsync: this, duration: const Duration(milliseconds: 2500));
    
    _pathAnim = Tween<double>(begin: 0.0, end: 1.0).animate(
      CurvedAnimation(parent: _controller, curve: const Interval(0.0, 0.6, curve: Curves.easeInOut)),
    );
    _fadeAnim = Tween<double>(begin: 0.0, end: 1.0).animate(
      CurvedAnimation(parent: _controller, curve: const Interval(0.6, 1.0, curve: Curves.easeIn)),
    );

    _controller.forward().then((_) {
      _checkAuthAndNavigate();
    });
  }

  void _checkAuthAndNavigate() async {
    // Wait an extra second for user to appreciate the glow
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
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF660099), // Vivo Purple Background
      body: Center(
        child: AnimatedBuilder(
          animation: _controller,
          builder: (context, child) {
            return Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                SizedBox(
                  width: 100,
                  height: 100,
                  child: CustomPaint(
                    painter: _LogoPainter(_pathAnim.value, _fadeAnim.value),
                  ),
                ),
                if (_fadeAnim.value > 0)
                  Opacity(
                    opacity: _fadeAnim.value,
                    child: const Text(
                      ' PLUS',
                      style: TextStyle(
                        fontSize: 56,
                        fontWeight: FontWeight.w900,
                        fontStyle: FontStyle.italic,
                        letterSpacing: -2,
                        color: Colors.white,
                      ),
                    ),
                  ),
              ],
            );
          },
        ),
      ),
    );
  }
}

class _LogoPainter extends CustomPainter {
  final double progress;
  final double glowProgress;

  _LogoPainter(this.progress, this.glowProgress);

  @override
  void paint(Canvas canvas, Size size) {
    final scale = size.width / 200.0;
    canvas.scale(scale, scale);

    final Paint glowPaint = Paint()
      ..style = PaintingStyle.stroke
      ..strokeWidth = 24
      ..strokeCap = StrokeCap.round
      ..strokeJoin = StrokeJoin.round
      ..color = Colors.white.withOpacity(glowProgress * 0.2)
      ..maskFilter = const MaskFilter.blur(BlurStyle.normal, 12);

    final Paint outlinePaint = Paint()
      ..style = PaintingStyle.stroke
      ..strokeWidth = 14
      ..strokeCap = StrokeCap.round
      ..strokeJoin = StrokeJoin.round
      ..color = Colors.white;

    final Paint innerPaint = Paint()
      ..style = PaintingStyle.stroke
      ..strokeWidth = 14
      ..strokeCap = StrokeCap.round
      ..strokeJoin = StrokeJoin.round
      ..color = Colors.white;

    // Triangle Path
    final Path triangle = Path()
      ..moveTo(170, 100)
      ..lineTo(50, 170)
      ..quadraticBezierTo(30, 180, 30, 160)
      ..lineTo(30, 40)
      ..quadraticBezierTo(30, 20, 50, 30)
      ..close();

    // P Path
    final Path letterP = Path()
      ..moveTo(65, 70)
      ..lineTo(90, 70)
      ..quadraticBezierTo(110, 70, 110, 90)
      ..quadraticBezierTo(110, 110, 90, 110)
      ..lineTo(65, 110)
      ..lineTo(65, 130)
      ..moveTo(65, 90)
      ..lineTo(90, 90);

    // + Path
    final Path plusSign = Path()
      ..moveTo(125, 85)
      ..lineTo(125, 105)
      ..moveTo(115, 95)
      ..lineTo(135, 95);

    // Determine how much of the path to draw based on `progress`
    if (progress > 0) {
      if (glowProgress > 0) {
        canvas.drawPath(triangle, glowPaint);
      }
      _drawPartialPath(canvas, triangle, outlinePaint, progress);
    }
    
    if (progress > 0.5) {
      final innerProgress = (progress - 0.5) * 2; // Normalize to 0-1
      _drawPartialPath(canvas, letterP, innerPaint, innerProgress);
    }

    if (progress > 0.8) {
      final plusProgress = (progress - 0.8) * 5; // Normalize to 0-1
      if (glowProgress > 0) canvas.drawPath(plusSign, glowPaint);
      _drawPartialPath(canvas, plusSign, innerPaint, plusProgress);
    }
  }

  void _drawPartialPath(Canvas canvas, Path path, Paint paint, double progress) {
    if (progress >= 1.0) {
      canvas.drawPath(path, paint);
      return;
    }
    
    final pathMetrics = path.computeMetrics();
    for (final metric in pathMetrics) {
      final extractLength = metric.length * progress;
      final extracted = metric.extractPath(0.0, extractLength);
      canvas.drawPath(extracted, paint);
    }
  }

  @override
  bool shouldRepaint(covariant _LogoPainter oldDelegate) {
    return oldDelegate.progress != progress || oldDelegate.glowProgress != glowProgress;
  }
}
