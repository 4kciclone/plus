import 'package:flutter/material.dart';
import 'dart:ui';

class AppStyles {
  // Colors
  static const Color primaryMagenta = Color(0xFFE10098);
  static const Color secondaryMagenta = Color(0xFFAD0075);
  static const Color darkBg = Color(0xFF080B12);
  static const Color surfaceCard = Color(0xFF121721);
  
  // Gradients
  static const LinearGradient primaryGradient = LinearGradient(
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
    colors: [primaryMagenta, secondaryMagenta],
  );

  static const LinearGradient glassGradient = LinearGradient(
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
    colors: [
      Color(0x1AFFFFFF), // Colors.white10
      Color(0x0DFFFFFF), // Colors.white05
    ],
  );

  // Glassmorphism Decoration
  static BoxDecoration glassDecoration({double opacity = 0.05, double radius = 24}) {
    return BoxDecoration(
      color: Colors.white.withOpacity(opacity),
      borderRadius: BorderRadius.circular(radius),
      border: Border.all(color: Colors.white.withOpacity(0.08)),
    );
  }

  // Backdrop Filter for Glass
  static Widget glassEffect({required Widget child, double sigma = 10, double radius = 24}) {
    return ClipRRect(
      borderRadius: BorderRadius.circular(radius),
      child: BackdropFilter(
        filter: ImageFilter.blur(sigmaX: sigma, sigmaY: sigma),
        child: child,
      ),
    );
  }
}

class GlassCard extends StatelessWidget {
  final Widget child;
  final EdgeInsets? padding;
  final double? width;
  final double? height;
  final double radius;
  final double opacity;

  const GlassCard({
    super.key,
    required this.child,
    this.padding,
    this.width,
    this.height,
    this.radius = 24,
    this.opacity = 0.05,
  });

  @override
  Widget build(BuildContext context) {
    return AppStyles.glassEffect(
      radius: radius,
      child: Container(
        width: width,
        height: height,
        padding: padding ?? const EdgeInsets.all(20),
        decoration: AppStyles.glassDecoration(radius: radius, opacity: opacity),
        child: child,
      ),
    );
  }
}
