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
      theme: ThemeData(
        useMaterial3: true,
        scaffoldBackgroundColor: const Color(0xFFF5F7FA), // Light Gray/Blueish Background
        colorScheme: ColorScheme.fromSeed(
          seedColor: const Color(0xFF660099), // Vivo Purple
          brightness: Brightness.light,
          primary: const Color(0xFF660099),
          secondary: const Color(0xFFFF0080), // Vibrant Pink Accent
          surface: Colors.white,
          onSurface: const Color(0xFF1E293B), // Dark text for cards
        ),
        textTheme: GoogleFonts.interTextTheme(
          ThemeData.light().textTheme,
        ).apply(bodyColor: const Color(0xFF1E293B), displayColor: const Color(0xFF0F172A)),
        appBarTheme: const AppBarTheme(
          backgroundColor: Colors.transparent,
          elevation: 0,
          centerTitle: true,
          iconTheme: IconThemeData(color: Color(0xFF660099)),
          titleTextStyle: TextStyle(color: Color(0xFF1E293B), fontSize: 18, fontWeight: FontWeight.bold),
        ),
        cardTheme: CardThemeData(
          elevation: 0,
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20), side: BorderSide(color: Colors.grey.withOpacity(0.1))),
          color: Colors.white,
        ),
      ),
      routerConfig: router,
    );
  }
}
