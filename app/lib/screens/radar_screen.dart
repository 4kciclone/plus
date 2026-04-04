import 'dart:math' as math;
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'dart:ui';
import '../utils/app_styles.dart';

class RadarScreen extends ConsumerStatefulWidget {
  const RadarScreen({super.key});

  @override
  ConsumerState<RadarScreen> createState() => _RadarScreenState();
}

class _RadarScreenState extends ConsumerState<RadarScreen> with SingleTickerProviderStateMixin {
  late AnimationController _sweepController;

  @override
  void initState() {
    super.initState();
    _sweepController = AnimationController(vsync: this, duration: const Duration(seconds: 4))..repeat();
  }

  @override
  void dispose() {
    _sweepController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.black,
      extendBodyBehindAppBar: true,
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        leading: const BackButton(color: Colors.white),
        title: Text(
          'Radar de Sinal Ultra', 
          style: GoogleFonts.sora(color: Colors.white, fontWeight: FontWeight.w900, fontSize: 16),
        ),
        centerTitle: true,
      ),
      body: Stack(
        children: [
          // Background Deep Blue/Black Gradient
          Container(
            decoration: const BoxDecoration(
              gradient: RadialGradient(
                colors: [
                  Color(0xFF1E1B4B),
                  Colors.black,
                ],
                radius: 1.2,
                center: Alignment.center,
              ),
            ),
          ),
          
          // Scanning Grid Background
          _buildBackgroundGrid(),

          // Main Radar Component
          Center(
            child: AnimatedBuilder(
              animation: _sweepController,
              builder: (context, child) {
                return CustomPaint(
                  size: const Size(340, 340),
                  painter: UltraRadarPainter(_sweepController.value),
                );
              },
            ),
          ).animate(onPlay: (c) => c.repeat()).shimmer(duration: 3.seconds, color: Colors.white10),

          // Scanning UI Elements
          Positioned(
            top: 140,
            left: 0, right: 0,
            child: Center(
              child: Column(
                children: [
                   Text(
                     'SCANNING...', 
                     style: GoogleFonts.sora(
                       color: AppStyles.primaryMagenta, 
                       letterSpacing: 4, 
                       fontSize: 10, 
                       fontWeight: FontWeight.w900,
                     ),
                   ).animate(onPlay: (c) => c.repeat()).fadeIn(duration: 500.ms).fadeOut(delay: 500.ms),
                   const SizedBox(height: 4),
                   Text(
                     'MAPA DE CALOR 5GHz ATIVO', 
                     style: GoogleFonts.sora(color: Colors.white38, fontSize: 8, fontWeight: FontWeight.bold),
                   ),
                ],
              ),
            ),
          ),

          // Bottom Instruction Panel
          Positioned(
            bottom: 40,
            left: 24,
            right: 24,
            child: GlassCard(
              padding: const EdgeInsets.all(28),
              child: Column(
                children: [
                   Row(
                     children: [
                       Container(
                         padding: const EdgeInsets.all(10),
                         decoration: BoxDecoration(
                           color: AppStyles.primaryMagenta.withOpacity(0.1),
                           borderRadius: BorderRadius.circular(12),
                         ),
                         child: const Icon(LucideIcons.scanFace, color: AppStyles.primaryMagenta, size: 24),
                       ),
                       const SizedBox(width: 16),
                       Expanded(
                         child: Column(
                           crossAxisAlignment: CrossAxisAlignment.start,
                           children: [
                             Text(
                               'Calibração de Ambiente', 
                               style: GoogleFonts.sora(color: Colors.white, fontSize: 16, fontWeight: FontWeight.w800),
                             ),
                             const SizedBox(height: 2),
                             Text(
                               'Identificando obstáculos e reflexos.', 
                               style: GoogleFonts.dmSans(color: Colors.white54, fontSize: 12),
                             ),
                           ],
                         ),
                       ),
                     ],
                   ),
                   const SizedBox(height: 20),
                   ClipRRect(
                     borderRadius: BorderRadius.circular(10),
                     child: LinearProgressIndicator(
                       valueColor: const AlwaysStoppedAnimation<Color>(AppStyles.primaryMagenta),
                       backgroundColor: Colors.white.withOpacity(0.05),
                       minHeight: 4,
                     ),
                   ).animate(onPlay: (c) => c.repeat()).shimmer(duration: 2.seconds),
                ],
              ),
            ),
          ).animate().fadeIn(delay: 500.ms).moveY(begin: 30, end: 0),
        ],
      ),
    );
  }

  Widget _buildBackgroundGrid() {
    return Positioned.fill(
      child: Opacity(
        opacity: 0.1,
        child: CustomPaint(
          painter: GridPainter(),
        ),
      ),
    );
  }
}

class UltraRadarPainter extends CustomPainter {
  final double sweepProgress;
  UltraRadarPainter(this.sweepProgress);

  @override
  void paint(Canvas canvas, Size size) {
    final center = Offset(size.width / 2, size.height / 2);
    final radius = size.width / 2;

    // Rings
    final ringPaint = Paint()
      ..color = Colors.white.withOpacity(0.05)
      ..style = PaintingStyle.stroke
      ..strokeWidth = 1.0;

    canvas.drawCircle(center, radius * 0.25, ringPaint);
    canvas.drawCircle(center, radius * 0.50, ringPaint);
    canvas.drawCircle(center, radius * 0.75, ringPaint);
    canvas.drawCircle(center, radius, ringPaint);

    // Crosshairs
    canvas.drawLine(Offset(center.dx, 0), Offset(center.dx, size.height), ringPaint);
    canvas.drawLine(Offset(0, center.dy), Offset(size.width, center.dy), ringPaint);

    // Sweep Line (Neon Magenta)
    final sweepAngle = sweepProgress * 2 * math.pi;
    final arcRect = Rect.fromCircle(center: center, radius: radius);
    
    final sweepPaint = Paint()
      ..shader = SweepGradient(
        center: Alignment.center,
        startAngle: 0.0,
        endAngle: math.pi / 1.5,
        colors: [
          Colors.transparent,
          AppStyles.primaryMagenta.withOpacity(0.05),
          AppStyles.primaryMagenta.withOpacity(0.6),
        ],
        stops: const [0.0, 0.4, 1.0],
        transform: GradientRotation(sweepAngle - math.pi / 1.5),
      ).createShader(arcRect)
      ..style = PaintingStyle.fill;

    canvas.drawArc(arcRect, sweepAngle - math.pi / 1.5, math.pi / 1.5, true, sweepPaint);

    // Outer glow ring
    final glowPaint = Paint()
      ..color = AppStyles.primaryMagenta.withOpacity(0.2)
      ..style = PaintingStyle.stroke
      ..strokeWidth = 2.0
      ..maskFilter = const MaskFilter.blur(BlurStyle.normal, 10);
    canvas.drawCircle(center, radius, glowPaint);

    // Simulated Signal Points
    _drawSignalNode(canvas, center, Offset(center.dx + 50, center.dy - 90), AppStyles.primaryMagenta, 'PAREDE_OESTE', 0.85);
    _drawSignalNode(canvas, center, Offset(center.dx - 100, center.dy + 40), const Color(0xFF00D1FF), 'DISPOSITIVO_IOT', 0.92);
    _drawSignalNode(canvas, center, Offset(center.dx + 80, center.dy + 70), Colors.white30, 'REFLEXO_SIMULADO', 0.45);
  }

  void _drawSignalNode(Canvas canvas, Offset center, Offset pos, Color color, String tag, double strength) {
    final nodePaint = Paint()..color = color..style = PaintingStyle.fill;
    final haloPaint = Paint()..color = color.withOpacity(0.2)..maskFilter = const MaskFilter.blur(BlurStyle.normal, 12);

    canvas.drawCircle(pos, 10 * strength, haloPaint);
    canvas.drawCircle(pos, 4, nodePaint);

    final textPainter = TextPainter(
      text: TextSpan(
        text: tag, 
        style: GoogleFonts.dmSans(color: color, fontSize: 8, fontWeight: FontWeight.w900, letterSpacing: 0.5)
      ),
      textDirection: TextDirection.ltr,
    );
    textPainter.layout();
    textPainter.paint(canvas, Offset(pos.dx + 12, pos.dy - 4));
  }

  @override
  bool shouldRepaint(covariant UltraRadarPainter oldDelegate) => true;
}

class GridPainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()..color = Colors.white24..strokeWidth = 0.5;
    const step = 40.0;
    
    for (double i = 0; i < size.width; i += step) {
      canvas.drawLine(Offset(i, 0), Offset(i, size.height), paint);
    }
    for (double i = 0; i < size.height; i += step) {
      canvas.drawLine(Offset(0, i), Offset(size.width, i), paint);
    }
  }

  @override
  bool shouldRepaint(CustomPainter oldDelegate) => false;
}
