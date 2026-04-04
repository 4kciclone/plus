import 'package:flutter/material.dart';
import 'dart:math' as math;

class AnimatedLogo extends StatefulWidget {
  final double size;
  final bool animate;

  const AnimatedLogo({
    super.key,
    this.size = 120,
    this.animate = true,
  });

  @override
  State<AnimatedLogo> createState() => _AnimatedLogoState();
}

class _AnimatedLogoState extends State<AnimatedLogo> with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<double> _scaleAnimation;
  late Animation<double> _opacityAnimation;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      vsync: this,
      duration: const Duration(seconds: 2),
    )..repeat(reverse: true);

    _scaleAnimation = Tween<double>(begin: 0.95, end: 1.05).animate(
      CurvedAnimation(parent: _controller, curve: Curves.easeInOut),
    );

    _opacityAnimation = Tween<double>(begin: 0.8, end: 1.0).animate(
      CurvedAnimation(parent: _controller, curve: Curves.easeInOut),
    );
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return AnimatedBuilder(
      animation: _controller,
      builder: (context, child) {
        return Transform.scale(
          scale: _scaleAnimation.value,
          child: Opacity(
            opacity: _opacityAnimation.value,
            child: SizedBox(
              width: widget.size,
              height: widget.size,
              child: CustomPaint(
                painter: _LogoPainter(),
              ),
            ),
          ),
        );
      },
    );
  }
}

class _LogoPainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final w = size.width;
    final h = size.height;

    // 1. Draw Outer Triangle Border
    final trianglePath = Path()
      ..moveTo(w * 0.1, h * 0.1)
      ..lineTo(w * 0.9, h * 0.45)
      ..lineTo(w * 0.1, h * 0.8)
      ..close();

    final paintBorder = Paint()
      ..shader = const LinearGradient(
        colors: [Color(0xFFFF6B00), Color(0xFFE10098)],
      ).createShader(Offset.zero & size)
      ..style = PaintingStyle.stroke
      ..strokeWidth = 4
      ..strokeCap = StrokeCap.round
      ..strokeJoin = StrokeJoin.round;

    canvas.drawPath(trianglePath, paintBorder);

    // 2. Draw Internal Glyphs (The "P" made of + and j)
    final glyphsPaint = Paint()
      ..shader = const LinearGradient(
        begin: Alignment.topCenter,
        end: Alignment.bottomCenter,
        colors: [Color(0xFFE10098), Color(0xFFAD0075)],
      ).createShader(Offset.zero & size)
      ..style = PaintingStyle.fill;

    // The + sign
    final plusPath = Path()
      ..addRect(Rect.fromLTWH(w * 0.25, h * 0.4, w * 0.2, h * 0.08)) // horizontal
      ..addRect(Rect.fromLTWH(w * 0.31, h * 0.34, w * 0.08, h * 0.2)); // vertical
    
    canvas.drawPath(plusPath, glyphsPaint);

    // The lying "j" - representing the loop of the P
    final jPath = Path()
      ..moveTo(w * 0.35, h * 0.48)
      ..lineTo(w * 0.6, h * 0.48)
      ..arcToPoint(
        Offset(w * 0.6, h * 0.68),
        radius: Radius.circular(w * 0.1),
        clockwise: true,
      )
      ..lineTo(w * 0.35, h * 0.68)
      ..close();

    canvas.drawPath(jPath, glyphsPaint);
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}
