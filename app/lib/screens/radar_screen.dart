import 'dart:math' as math;
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lucide_icons/lucide_icons.dart';

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
      backgroundColor: Colors.black, // Immersive AR feel
      extendBodyBehindAppBar: true,
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        leading: const BackButton(color: Colors.white),
        title: const Text('Radar de Sinal Wi-Fi (AR)', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 16)),
        centerTitle: true,
      ),
      body: Stack(
        children: [
          // Simulated AR Camera Background (Static dark blurred texture for now)
          Container(
            decoration: BoxDecoration(
              gradient: RadialGradient(
                colors: [
                  const Color(0xFF0F172A).withOpacity(0.8),
                  Colors.black,
                ],
                radius: 1.5,
              ),
            ),
          ),
          
          // Radar Animation
          Center(
            child: AnimatedBuilder(
              animation: _sweepController,
              builder: (context, child) {
                return CustomPaint(
                  size: const Size(320, 320),
                  painter: RadarPainter(_sweepController.value),
                );
              },
            ),
          ),

          // AR Overlay UI Elements
          Positioned(
            bottom: 40,
            left: 24,
            right: 24,
            child: Container(
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                color: Colors.white.withOpacity(0.1),
                borderRadius: BorderRadius.circular(24),
                border: Border.all(color: Colors.white.withOpacity(0.2)),
                boxShadow: [
                  BoxShadow(color: Colors.greenAccent.withOpacity(0.1), blurRadius: 30)
                ]
              ),
              child: const Column(
                children: [
                   Row(
                     children: [
                       Icon(LucideIcons.waves, color: Colors.greenAccent, size: 24),
                       SizedBox(width: 12),
                       Text('Analisando Ambiente', style: TextStyle(color: Colors.white, fontSize: 18, fontWeight: FontWeight.bold)),
                     ],
                   ),
                   SizedBox(height: 12),
                   Text(
                     'Caminhe pelo cômodo. O radar mapeia o sinal 5GHz do roteador nas paredes para identificar pontos cegos.',
                     style: TextStyle(color: Colors.white70, fontSize: 13, height: 1.5),
                   ),
                ],
              ),
            ),
          )
        ],
      ),
    );
  }
}

class RadarPainter extends CustomPainter {
  final double sweepProgress; // 0.0 to 1.0
  RadarPainter(this.sweepProgress);

  @override
  void paint(Canvas canvas, Size size) {
    final center = Offset(size.width / 2, size.height / 2);
    final radius = size.width / 2;

    // Draw concentric grids
    final gridPaint = Paint()
      ..color = Colors.greenAccent.withOpacity(0.15)
      ..style = PaintingStyle.stroke
      ..strokeWidth = 1.0;

    canvas.drawCircle(center, radius * 0.33, gridPaint);
    canvas.drawCircle(center, radius * 0.66, gridPaint);
    canvas.drawCircle(center, radius, gridPaint);

    // Draw crosshairs
    canvas.drawLine(Offset(center.dx, 0), Offset(center.dx, size.height), gridPaint);
    canvas.drawLine(Offset(0, center.dy), Offset(size.width, center.dy), gridPaint);

    // Draw the sweeping gradient arc
    final sweepAngle = sweepProgress * 2 * math.pi;
    final arcRect = Rect.fromCircle(center: center, radius: radius);
    
    final sweepPaint = Paint()
      ..shader = SweepGradient(
        center: Alignment.center,
        startAngle: 0.0,
        endAngle: math.pi / 2, // The tail length
        colors: [
          Colors.transparent,
          Colors.greenAccent.withOpacity(0.1),
          Colors.greenAccent.withOpacity(0.6),
        ],
        stops: const [0.0, 0.5, 1.0],
        transform: GradientRotation(sweepAngle - math.pi / 2),
      ).createShader(arcRect)
      ..style = PaintingStyle.fill;

    canvas.drawArc(arcRect, sweepAngle - math.pi / 2, math.pi / 2, true, sweepPaint);

    // Draw static Signal Dots representing devices or signal hotspots
    _drawSignalDot(canvas, center, Offset(center.dx + 40, center.dy - 60), Colors.greenAccent, 'TV');
    _drawSignalDot(canvas, center, Offset(center.dx - 80, center.dy + 30), Colors.yellowAccent, 'Fraco');
    _drawSignalDot(canvas, center, Offset(center.dx + 90, center.dy + 80), Colors.greenAccent, 'Excelente');
  }

  void _drawSignalDot(Canvas canvas, Offset center, Offset pos, Color color, String label) {
    // Distance from sweep line (simulated glow effect when the sweep passes over it)
    final dotPaint = Paint()..color = color..style = PaintingStyle.fill;
    final glowPaint = Paint()..color = color.withOpacity(0.4)..maskFilter = const MaskFilter.blur(BlurStyle.normal, 8);

    canvas.drawCircle(pos, 8, glowPaint);
    canvas.drawCircle(pos, 4, dotPaint);

    // Text Label simulating 3D AR tag
    final textPainter = TextPainter(
      text: TextSpan(text: label, style: TextStyle(color: color, fontSize: 10, fontWeight: FontWeight.bold)),
      textDirection: TextDirection.ltr,
    );
    textPainter.layout();
    textPainter.paint(canvas, Offset(pos.dx + 12, pos.dy - 6));
  }

  @override
  bool shouldRepaint(covariant RadarPainter oldDelegate) => true;
}
