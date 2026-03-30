import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'dart:async';
import 'dart:math';
import 'theme_provider.dart';
import 'screens/crm_screen.dart';
import 'screens/tickets_screen.dart';
import 'screens/finance_screen.dart';
import 'services/api_service.dart';

void main() {
  runApp(
    const ProviderScope(
      child: PlusMultiplayerApp(),
    ),
  );
}

class PlusMultiplayerApp extends ConsumerWidget {
  const PlusMultiplayerApp({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final themeStyle = ref.watch(themeProvider);
    final themeData = ref.read(themeProvider.notifier).getThemeData();

    return MaterialApp(
      title: 'Plus Multiplayer',
      debugShowCheckedModeBanner: false,
      theme: themeData,
      home: const AdminDashboardScreen(),
    );
  }
}

class AdminDashboardScreen extends ConsumerStatefulWidget {
  const AdminDashboardScreen({super.key});

  @override
  ConsumerState<AdminDashboardScreen> createState() => _AdminDashboardScreenState();
}

class _AdminDashboardScreenState extends ConsumerState<AdminDashboardScreen> {
  int _selectedIndex = 0;

  @override
  Widget build(BuildContext context) {
    final currentStyle = ref.watch(themeProvider);
    final colors = Theme.of(context).colorScheme;

    Widget _buildContent() {
      switch (_selectedIndex) {
        case 0: return _DashboardOverview();
        case 1: return const CrmScreen();
        case 2: return const TicketsScreen();
        case 3: return const FinanceScreen();
        default: return const Center(child: Text('Página não encontrada'));
      }
    }

    return Scaffold(
      appBar: AppBar(
        title: Row(
          children: [
            const Icon(LucideIcons.wifi, color: Color(0xFFFF0080)),
            const SizedBox(width: 12),
            const Text('Plus Multiplayer', style: TextStyle(fontWeight: FontWeight.w900)),
          ],
        ),
        actions: [
          Padding(
            padding: const EdgeInsets.all(8.0),
            child: DropdownButton<AppThemeStyle>(
              value: currentStyle,
              underline: const SizedBox(),
              icon: const Icon(LucideIcons.palette),
              onChanged: (AppThemeStyle? newValue) {
                if (newValue != null) {
                  ref.read(themeProvider.notifier).setTheme(newValue);
                }
              },
              items: AppThemeStyle.values.map((AppThemeStyle style) {
                String label;
                switch (style) {
                  case AppThemeStyle.telecomFlat: label = "Telecom Flat"; break;
                  case AppThemeStyle.neoNoc: label = "Neo NOC (Dark)"; break;
                  case AppThemeStyle.glassmorphism: label = "Glassmorphism"; break;
                }
                return DropdownMenuItem<AppThemeStyle>(
                  value: style,
                  child: Text(label),
                );
              }).toList(),
            ),
          ),
          const SizedBox(width: 16),
          CircleAvatar(
            backgroundColor: colors.primary.withOpacity(0.1),
            child: Icon(LucideIcons.user, color: colors.primary),
          ),
          const SizedBox(width: 16),
        ],
      ),
      body: Row(
        children: [
          // Navigation Rail (Menu Lateral)
          NavigationRail(
            selectedIndex: _selectedIndex,
            onDestinationSelected: (int index) {
              setState(() => _selectedIndex = index);
            },
            labelType: NavigationRailLabelType.all,
            backgroundColor: Theme.of(context).cardTheme.color,
            selectedIconTheme: IconThemeData(color: colors.primary),
            unselectedIconTheme: IconThemeData(color: colors.onSurface.withOpacity(0.5)),
            destinations: const [
              NavigationRailDestination(icon: Icon(LucideIcons.layoutDashboard), label: Text('Painel')),
              NavigationRailDestination(icon: Icon(LucideIcons.users), label: Text('CRM')),
              NavigationRailDestination(icon: Icon(LucideIcons.layout), label: Text('Chamados')),
              NavigationRailDestination(icon: Icon(LucideIcons.wallet), label: Text('Financeiro')),
            ],
          ),
          const VerticalDivider(thickness: 1, width: 1),
          // Conteúdo Principal Dinâmico
          Expanded(
            child: Padding(
              padding: const EdgeInsets.all(24.0),
              child: _buildContent(),
            ),
          ),
        ],
      ),
    );
  }
}

class _DashboardOverview extends ConsumerStatefulWidget {
  @override
  ConsumerState<_DashboardOverview> createState() => _DashboardOverviewState();
}

class _DashboardOverviewState extends ConsumerState<_DashboardOverview> {
  final List<double> _dataPoints = List.generate(20, (index) => 30.0 + Random().nextDouble() * 40.0);
  Timer? _timer;

  @override
  void initState() {
    super.initState();
    _timer = Timer.periodic(const Duration(milliseconds: 1500), (timer) {
      setState(() {
        _dataPoints.removeAt(0);
        _dataPoints.add(30.0 + Random().nextDouble() * 60.0); 
      });
    });
  }

  @override
  void dispose() {
    _timer?.cancel();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final crmAsync = ref.watch(crmProvider);
    final financeAsync = ref.watch(financeProvider);
    final ticketsAsync = ref.watch(ticketsProvider);

    String activeClients = '...';
    String revenue = '...';
    String openTickets = '...';
    String defaulters = '...';

    if (crmAsync.hasValue) {
      final clients = crmAsync.value!;
      final activeCount = clients.where((c) {
        final subs = c['subscriptions'] as List<dynamic>? ?? [];
        return subs.isNotEmpty && subs.first['status'] == 'ACTIVE';
      }).length;
      activeClients = activeCount.toString();
    }

    if (financeAsync.hasValue) {
      final invoices = financeAsync.value!;
      final paidInvoices = invoices.where((i) => i['paid'] == true);
      final totalRevenue = paidInvoices.fold(0.0, (sum, i) => sum + (i['amount'] as num));
      revenue = 'R\$ ${totalRevenue.toStringAsFixed(2)}';

      final unpaidCount = invoices.where((i) => i['paid'] == false).length;
      defaulters = unpaidCount.toString();
    }

    if (ticketsAsync.hasValue) {
      final tickets = ticketsAsync.value!;
      // For this overview, we'll count all tickets (or just OPEN ones).
      openTickets = tickets.length.toString();
    }

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text('Visão Geral', style: TextStyle(fontSize: 32, fontWeight: FontWeight.bold)),
        const SizedBox(height: 24),
        Row(
          children: [
            Expanded(child: _StatCard(title: 'Clientes Ativos', value: activeClients, icon: LucideIcons.users)),
            const SizedBox(width: 16),
            Expanded(child: _StatCard(title: 'Faturamento', value: revenue, icon: LucideIcons.trendingUp)),
            const SizedBox(width: 16),
            Expanded(child: _StatCard(title: 'Chamados', value: openTickets, icon: LucideIcons.alertCircle)),
            const SizedBox(width: 16),
            Expanded(child: _StatCard(title: 'Inadimplentes', value: defaulters, icon: LucideIcons.thumbsDown)),
          ],
        ),
        const SizedBox(height: 32),
        const Text('Tráfego do Backbone (Ao Vivo)', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
        const SizedBox(height: 16),
        Expanded(
          child: Container(
            width: double.infinity,
            padding: const EdgeInsets.symmetric(vertical: 24),
            decoration: BoxDecoration(
              color: Theme.of(context).colorScheme.surface,
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: Theme.of(context).colorScheme.onSurface.withOpacity(0.05)),
            ),
            child: CustomPaint(
              painter: _NeonChartPainter(_dataPoints, Theme.of(context).colorScheme.primary),
            ),
          ),
        ),
      ],
    );
  }
}

class _NeonChartPainter extends CustomPainter {
  final List<double> dataPoints;
  final Color neonColor;

  _NeonChartPainter(this.dataPoints, this.neonColor);

  @override
  void paint(Canvas canvas, Size size) {
    if (dataPoints.isEmpty) return;

    final double stepX = size.width / (dataPoints.length - 1);
    final double maxY = 100.0; 

    final Path path = Path();
    for (int i = 0; i < dataPoints.length; i++) {
      final double x = i * stepX;
      final double y = size.height - (dataPoints[i] / maxY * size.height);
      if (i == 0) {
        path.moveTo(x, y);
      } else {
        // Spline curve for smooth connections
        final double prevX = (i - 1) * stepX;
        final double prevY = size.height - (dataPoints[i - 1] / maxY * size.height);
        final double controlX = (prevX + x) / 2;
        path.quadraticBezierTo(controlX, prevY, x, y);
      }
    }

    // Gradient fill under the line
    final Path fillPath = Path.from(path)
      ..lineTo(size.width, size.height)
      ..lineTo(0, size.height)
      ..close();

    final Paint fillPaint = Paint()
      ..shader = LinearGradient(
        begin: Alignment.topCenter,
        end: Alignment.bottomCenter,
        colors: [neonColor.withOpacity(0.4), neonColor.withOpacity(0.0)],
      ).createShader(Rect.fromLTWH(0, 0, size.width, size.height));
    
    canvas.drawPath(fillPath, fillPaint);

    // Glowing thick neon line
    final Paint glowPaint = Paint()
      ..style = PaintingStyle.stroke
      ..strokeWidth = 12
      ..color = neonColor.withOpacity(0.5)
      ..maskFilter = const MaskFilter.blur(BlurStyle.normal, 16);
    
    canvas.drawPath(path, glowPaint);

    // Core crisp line
    final Paint corePaint = Paint()
      ..style = PaintingStyle.stroke
      ..strokeWidth = 4
      ..color = Colors.white
      ..strokeCap = StrokeCap.round;

    canvas.drawPath(path, corePaint);

    // Live pulsing dot at the edge
    final double lastX = size.width;
    final double lastY = size.height - (dataPoints.last / maxY * size.height);
    
    canvas.drawCircle(Offset(lastX, lastY), 12, glowPaint);
    canvas.drawCircle(Offset(lastX, lastY), 6, Paint()..color = Colors.white);
  }

  @override
  bool shouldRepaint(covariant _NeonChartPainter oldDelegate) => true;
}

class _StatCard extends StatelessWidget {
  final String title;
  final String value;
  final IconData icon;

  const _StatCard({required this.title, required this.value, required this.icon});

  @override
  Widget build(BuildContext context) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(24.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(title, style: TextStyle(fontSize: 14, fontWeight: FontWeight.bold, color: Theme.of(context).colorScheme.onSurface.withOpacity(0.6))),
                Icon(icon, color: Theme.of(context).colorScheme.primary, size: 20),
              ],
            ),
            const SizedBox(height: 16),
            Text(value, style: const TextStyle(fontSize: 28, fontWeight: FontWeight.w900)),
          ],
        ),
      ),
    );
  }
}
