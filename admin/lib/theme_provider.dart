import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

enum AppThemeStyle {
  telecomFlat,
  neoNoc,
  glassmorphism,
}

final themeProvider = StateNotifierProvider<ThemeNotifier, AppThemeStyle>((ref) {
  return ThemeNotifier();
});

class ThemeNotifier extends StateNotifier<AppThemeStyle> {
  ThemeNotifier() : super(AppThemeStyle.telecomFlat);

  void setTheme(AppThemeStyle style) {
    state = style;
  }

  ThemeData getThemeData() {
    switch (state) {
      case AppThemeStyle.telecomFlat:
        return ThemeData(
          useMaterial3: true,
          scaffoldBackgroundColor: const Color(0xFFF1F5F9), // Slate 100
          colorScheme: ColorScheme.fromSeed(
            seedColor: const Color(0xFFFF0080),
            brightness: Brightness.light,
            primary: const Color(0xFFFF0080),
            surface: Colors.white,
          ),
          appBarTheme: const AppBarTheme(
            backgroundColor: Colors.white,
            foregroundColor: Color(0xFF0F172A),
            elevation: 1,
          ),
          cardTheme: CardTheme(
            color: Colors.white,
            elevation: 0,
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(8),
              side: const BorderSide(color: Color(0xFFE2E8F0)),
            ),
          ),
        );

      case AppThemeStyle.neoNoc:
        return ThemeData(
          useMaterial3: true,
          scaffoldBackgroundColor: const Color(0xFF0F172A),
          colorScheme: ColorScheme.fromSeed(
            seedColor: const Color(0xFFFF0080),
            brightness: Brightness.dark,
            primary: const Color(0xFFFF0080),
            surface: const Color(0xFF1E293B),
          ),
          appBarTheme: const AppBarTheme(
            backgroundColor: Color(0xFF0F172A),
            foregroundColor: Colors.white,
            elevation: 0,
          ),
          cardTheme: CardTheme(
            color: const Color(0xFF1E293B),
            elevation: 12,
            shadowColor: const Color(0xFFFF0080).withOpacity(0.2),
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(16),
            ),
          ),
        );

      case AppThemeStyle.glassmorphism:
        return ThemeData(
          useMaterial3: true,
          scaffoldBackgroundColor: const Color(0xFFF8FAFC),
          colorScheme: ColorScheme.fromSeed(
            seedColor: const Color(0xFFFF0080),
            brightness: Brightness.light,
            primary: const Color(0xFFFF0080),
            surface: Colors.white.withOpacity(0.7),
          ),
          appBarTheme: AppBarTheme(
            backgroundColor: Colors.white.withOpacity(0.5),
            foregroundColor: const Color(0xFF334155),
            elevation: 0,
          ),
          cardTheme: CardTheme(
            color: Colors.white.withOpacity(0.6),
            elevation: 0,
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(24),
              side: BorderSide(color: Colors.white.withOpacity(0.5), width: 1.5),
            ),
          ),
        );
    }
  }
}
