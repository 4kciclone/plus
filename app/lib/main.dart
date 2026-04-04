import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';

import 'providers/auth_provider.dart';
import 'providers/auth_provider.dart';
import 'screens/home_screen.dart';
import 'screens/login_screen.dart';
import 'screens/connection_screen.dart';
import 'screens/support_screen.dart';
import 'screens/invoices_screen.dart';
import 'screens/wifi_screen.dart';
import 'screens/splash_screen.dart';
import 'screens/radar_screen.dart';
import 'screens/luna_chat_screen.dart';
import 'screens/profile_screen.dart';
import 'screens/notifications_screen.dart';
import 'screens/contracts_screen.dart';

void main() {
  runApp(
    const ProviderScope(
      child: PlusApp(),
    ),
  );
}

class PlusApp extends ConsumerWidget {
  const PlusApp({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final authState = ref.watch(authProvider);

    final router = GoRouter(
      initialLocation: '/',
      redirect: (context, state) {
        if (authState.isLoading) return null; // wait
        final loggedIn = authState.user != null;
        final goingToLogin = state.uri.path == '/login';
        
        if (!loggedIn && !goingToLogin) return '/login';
        if (loggedIn && goingToLogin) return '/';
        return null;
      },
      routes: [
        GoRoute(
          path: '/',
          builder: (context, state) => const SplashScreen(),
        ),
        GoRoute(
          path: '/home',
          builder: (context, state) => const HomeScreen(),
        ),
        GoRoute(
          path: '/login',
          builder: (context, state) => const LoginScreen(),
        ),
        GoRoute(
          path: '/connection',
          builder: (context, state) => const ConnectionScreen(),
        ),
        GoRoute(
          path: '/support',
          builder: (context, state) => const SupportScreen(),
        ),
        GoRoute(
          path: '/invoices',
          builder: (context, state) => const InvoicesScreen(),
        ),
        GoRoute(
          path: '/wifi',
          builder: (context, state) => const WifiScreen(),
        ),
        GoRoute(
          path: '/radar',
          builder: (context, state) => const RadarScreen(),
        ),
        GoRoute(
          path: '/luna_chat',
          builder: (context, state) => const LunaChatScreen(),
        ),
        GoRoute(
          path: '/profile',
          builder: (context, state) => const ProfileScreen(),
        ),
        GoRoute(
          path: '/notifications',
          builder: (context, state) => const NotificationsScreen(),
        ),
        GoRoute(
          path: '/contracts',
          builder: (context, state) => const ContractsScreen(),
        ),
      ],
    );

    return MaterialApp.router(
      title: 'Plus App',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        useMaterial3: true,
        brightness: Brightness.dark,
        scaffoldBackgroundColor: const Color(0xFF080B12),
        colorScheme: ColorScheme.fromSeed(
          seedColor: const Color(0xFFE10098),
          brightness: Brightness.dark,
          primary: const Color(0xFFE10098),
          secondary: const Color(0xFFAD0075),
          surface: const Color(0xFF121721),
          onSurface: Colors.white,
          background: const Color(0xFF080B12),
        ),
        textTheme: GoogleFonts.soraTextTheme(ThemeData.dark().textTheme).copyWith(
          bodyLarge: GoogleFonts.dmSans(textStyle: ThemeData.dark().textTheme.bodyLarge),
          bodyMedium: GoogleFonts.dmSans(textStyle: ThemeData.dark().textTheme.bodyMedium),
          bodySmall: GoogleFonts.dmSans(textStyle: ThemeData.dark().textTheme.bodySmall),
        ),
        appBarTheme: AppBarTheme(
          backgroundColor: const Color(0xFF080B12).withOpacity(0.8),
          elevation: 0,
          centerTitle: true,
          iconTheme: const IconThemeData(color: Colors.white),
          titleTextStyle: GoogleFonts.sora(
            color: Colors.white,
            fontSize: 18,
            fontWeight: FontWeight.bold,
          ),
        ),
        cardTheme: CardThemeData(
          elevation: 0,
          clipBehavior: Clip.antiAlias,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(24),
            side: BorderSide(color: Colors.white.withOpacity(0.08)),
          ),
          color: const Color(0xFF121721).withOpacity(0.6),
        ),
      ),
      routerConfig: router,
    );
  }
}
