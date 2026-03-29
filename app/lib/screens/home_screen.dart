import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:lucide_icons/lucide_icons.dart';
import '../services/notification_service.dart';

class HomeScreen extends ConsumerStatefulWidget {
  const HomeScreen({super.key});

  @override
  ConsumerState<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends ConsumerState<HomeScreen> with SingleTickerProviderStateMixin {
  @override
  void initState() {
    super.initState();
    PushNotificationService.initialize(context);
  }

  void _startSelfHealing() {
    showDialog(
      context: context,
      barrierDismissible: false,
      barrierColor: Colors.black87,
      builder: (context) => const _SelfHealingDialog(),
    );
  }

  @override
  Widget build(BuildContext context) {
    final colors = Theme.of(context).colorScheme;

    return Scaffold(
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(24.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Header
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'Bom dia,',
                        style: TextStyle(color: Colors.white.withOpacity(0.6), fontSize: 14),
                      ),
                      const Text(
                        'Paulo Cezar 👋',
                        style: TextStyle(fontSize: 24, fontWeight: FontWeight.w900, color: Colors.white),
                      ),
                    ],
                  ),
                  CircleAvatar(
                    backgroundColor: colors.surface,
                    child: Icon(LucideIcons.user, color: colors.primary),
                  ),
                ],
              ),
              const SizedBox(height: 32),

              // Network Status Card
              Container(
                width: double.infinity,
                padding: const EdgeInsets.all(24),
                decoration: BoxDecoration(
                  color: colors.primary,
                  borderRadius: BorderRadius.circular(24),
                  boxShadow: [
                    BoxShadow(color: colors.primary.withOpacity(0.3), blurRadius: 24, offset: const Offset(0, 12)),
                  ],
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                          decoration: BoxDecoration(
                            color: Colors.white.withOpacity(0.2),
                            borderRadius: BorderRadius.circular(20),
                          ),
                          child: const Row(
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              Icon(LucideIcons.wifi, size: 14, color: Colors.white),
                              SizedBox(width: 6),
                              Text('CONECTADO', style: TextStyle(color: Colors.white, fontSize: 12, fontWeight: FontWeight.w900, letterSpacing: 1)),
                            ],
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 24),
                    const Text('Plus Gamer 1 Giga', style: TextStyle(color: Colors.white, fontSize: 28, fontWeight: FontWeight.w900)),
                    Text('Sua conexão está excelente.', style: TextStyle(color: Colors.white.withOpacity(0.8))),
                  ],
                ),
              ),
              const SizedBox(height: 32),

              // FEATURE 4: Live Activity Tracker (Mocked State)
              Container(
                width: double.infinity,
                padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
                decoration: BoxDecoration(
                  color: Colors.black.withOpacity(0.3),
                  borderRadius: BorderRadius.circular(20),
                  border: Border.all(color: Colors.white.withOpacity(0.05)),
                ),
                child: Row(
                  children: [
                    Container(
                      width: 44,
                      height: 44,
                      decoration: BoxDecoration(
                        color: Colors.blueAccent.withOpacity(0.2),
                        shape: BoxShape.circle,
                      ),
                      child: const Icon(LucideIcons.truck, color: Colors.blueAccent, size: 20),
                    ),
                    const SizedBox(width: 16),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            children: [
                              Container(
                                width: 8,
                                height: 8,
                                decoration: const BoxDecoration(color: Colors.greenAccent, shape: BoxShape.circle),
                              ),
                              const SizedBox(width: 6),
                              const Text('TÉCNICO A CAMINHO', style: TextStyle(color: Colors.greenAccent, fontSize: 10, fontWeight: FontWeight.w900, letterSpacing: 1)),
                            ],
                          ),
                          const SizedBox(height: 4),
                          const Text('Bruno chega em 12 minutos', style: TextStyle(color: Colors.white, fontSize: 14, fontWeight: FontWeight.bold)),
                          const SizedBox(height: 8),
                          // Mini Progress Bar
                          ClipRRect(
                            borderRadius: BorderRadius.circular(4),
                            child: LinearProgressIndicator(
                              value: 0.75,
                              backgroundColor: Colors.white.withOpacity(0.1),
                              valueColor: const AlwaysStoppedAnimation<Color>(Colors.greenAccent),
                              minHeight: 4,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 32),

              // Quick Actions Grid
              Text('Acesso Rápido', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: Colors.white)),
              const SizedBox(height: 16),
              GridView.count(
                crossAxisCount: 2,
                shrinkWrap: true,
                physics: const NeverScrollableScrollPhysics(),
                mainAxisSpacing: 16,
                crossAxisSpacing: 16,
                childAspectRatio: 1.2,
                children: [
                   _QuickActionCard(icon: LucideIcons.receipt, title: 'Faturas', color: colors.surface, onTap: () => context.push('/invoices')),
                   _QuickActionCard(icon: LucideIcons.gauge, title: 'Speedtest', color: colors.surface, onTap: () => context.push('/connection')),
                   _QuickActionCard(icon: LucideIcons.headphones, title: 'Suporte & IA', color: colors.surface, onTap: () => context.push('/support')),
                   _QuickActionCard(icon: LucideIcons.router, title: 'Meu Wi-Fi', color: colors.surface, onTap: () => context.push('/wifi')),
                ],
              ),
            ],
          ),
        ),
      ),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: _startSelfHealing,
        backgroundColor: colors.primary,
        icon: const Icon(LucideIcons.wand2, color: Colors.white),
        label: const Text('Otimizar Conexão', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 14)),
      ),
    );
  }
}

class _QuickActionCard extends StatelessWidget {
  final IconData icon;
  final String title;
  final Color color;
  final VoidCallback onTap;

  const _QuickActionCard({required this.icon, required this.title, required this.color, required this.onTap});

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        color: color,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: Colors.white.withOpacity(0.05)),
      ),
      child: Material(
        color: Colors.transparent,
        child: InkWell(
          borderRadius: BorderRadius.circular(20),
          onTap: onTap,
          child: Padding(
            padding: const EdgeInsets.all(20),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Hero(
                  tag: 'hero-$title',
                  child: Icon(icon, color: Theme.of(context).colorScheme.primary, size: 28),
                ),
                Text(title, style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 15)),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

// FEATURE 5: Self-Healing Dialog
class _SelfHealingDialog extends StatefulWidget {
  const _SelfHealingDialog();

  @override
  State<_SelfHealingDialog> createState() => _SelfHealingDialogState();
}

class _SelfHealingDialogState extends State<_SelfHealingDialog> with SingleTickerProviderStateMixin {
  int _currentStep = 0;
  late AnimationController _rotationCtrl;
  bool _mounted = true;

  final List<String> _steps = [
    "Iniciando Diagnóstico P+",
    "Lendo níveis óticos da OLT...",
    "Trocando canal do Wi-Fi...",
    "Aplicando novas rotas QoS...",
    "Otimização Concluída!"
  ];

  @override
  void initState() {
    super.initState();
    _rotationCtrl = AnimationController(vsync: this, duration: const Duration(seconds: 2))..repeat();
    _runSequence();
  }

  @override
  void dispose() {
    _mounted = false;
    _rotationCtrl.dispose();
    super.dispose();
  }

  Future<void> _runSequence() async {
    for (int i = 0; i < 4; i++) {
      await Future.delayed(const Duration(milliseconds: 1800));
      if (!_mounted) return;
      setState(() {
        _currentStep++;
      });
    }
    _rotationCtrl.stop();
    await Future.delayed(const Duration(milliseconds: 1500));
    if (!_mounted) return;
    Navigator.of(context).pop();
  }

  @override
  Widget build(BuildContext context) {
    bool isDone = _currentStep == 4;

    return Center(
      child: Material(
        color: Colors.transparent,
        child: Container(
          width: 280,
          padding: const EdgeInsets.all(32),
          decoration: BoxDecoration(
            color: const Color(0xFF15151A),
            borderRadius: BorderRadius.circular(32),
            border: Border.all(color: Colors.white.withOpacity(0.1)),
            boxShadow: [
              BoxShadow(color: Theme.of(context).colorScheme.primary.withOpacity(0.2), blurRadius: 40),
            ],
          ),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              // Animated Icon Ring
              SizedBox(
                width: 80,
                height: 80,
                child: Stack(
                  alignment: Alignment.center,
                  children: [
                    if (!isDone)
                      RotationTransition(
                        turns: _rotationCtrl,
                        child: Container(
                          decoration: BoxDecoration(
                            shape: BoxShape.circle,
                            border: Border.all(color: Theme.of(context).colorScheme.primary.withOpacity(0.3), width: 3),
                          ),
                          child: Align(
                            alignment: Alignment.topCenter,
                            child: Container(
                              width: 8,
                              height: 8,
                              margin: const EdgeInsets.all(2),
                              decoration: BoxDecoration(
                                color: Theme.of(context).colorScheme.primary,
                                shape: BoxShape.circle,
                                boxShadow: [
                                  BoxShadow(color: Theme.of(context).colorScheme.primary, blurRadius: 10)
                                ],
                              ),
                            ),
                          ),
                        ),
                      ),
                    Container(
                      width: 56,
                      height: 56,
                      decoration: BoxDecoration(
                        color: isDone ? Colors.greenAccent.withOpacity(0.2) : Colors.white.withOpacity(0.05),
                        shape: BoxShape.circle,
                      ),
                      child: Icon(
                        isDone ? LucideIcons.check : LucideIcons.sparkles,
                        color: isDone ? Colors.greenAccent : Colors.white,
                        size: 28,
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 24),
              Text(
                _steps[_currentStep],
                textAlign: TextAlign.center,
                style: TextStyle(
                  color: isDone ? Colors.greenAccent : Colors.white,
                  fontSize: 16,
                  fontWeight: FontWeight.bold,
                ),
              ),
              if (!isDone)
                Padding(
                  padding: const EdgeInsets.only(top: 12),
                  child: LinearProgressIndicator(
                    valueColor: AlwaysStoppedAnimation<Color>(Theme.of(context).colorScheme.primary),
                    backgroundColor: Colors.white.withOpacity(0.1),
                  ),
                ),
            ],
          ),
        ),
      ),
    );
  }
}
