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
      ],
    );

    return MaterialApp.router(
      title: 'Plus App',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        useMaterial3: true,
        scaffoldBackgroundColor: const Color(0xFF0F172A),
        colorScheme: ColorScheme.fromSeed(
          seedColor: const Color(0xFFFF0080),
          brightness: Brightness.dark,
          primary: const Color(0xFFFF0080),
          surface: const Color(0xFF1E293B),
        ),
        textTheme: GoogleFonts.interTextTheme(
          Theme.of(context).textTheme,
        ).apply(bodyColor: Colors.white, displayColor: Colors.white),
      ),
      routerConfig: router,
    );
  }
}
