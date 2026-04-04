import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:google_fonts/google_fonts.dart';
import '../services/notification_service.dart';
import '../services/api_service.dart';
import '../providers/auth_provider.dart';
import '../widgets/animated_logo.dart';
import '../utils/app_styles.dart';

final myTicketsProvider = FutureProvider.autoDispose<List<dynamic>>((ref) async {
  final res = await ref.read(apiProvider).get('/tickets/my');
  return res.data;
});

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
      barrierColor: Colors.black.withOpacity(0.8),
      builder: (context) => const _SelfHealingDialog(),
    );
  }

  @override
  Widget build(BuildContext context) {
    final user = ref.watch(authProvider).user;
    final userName = user != null ? user['name'].split(' ')[0] : 'Cliente';
    final ticketsOpt = ref.watch(myTicketsProvider);
    
    final Map<String, dynamic>? activeTicket = ticketsOpt.whenOrNull(
      data: (tickets) {
        try {
          return tickets.firstWhere((t) => t['status'] == 'SCHEDULED') as Map<String, dynamic>;
        } catch (_) {
          return null;
        }
      }
    );

    return Scaffold(
      body: Stack(
        children: [
          // Background Gradient
          Positioned.fill(
            child: Container(
              decoration: BoxDecoration(
                gradient: RadialGradient(
                  center: const Alignment(-0.8, -0.6),
                  radius: 1.2,
                  colors: [
                    AppStyles.primaryMagenta.withOpacity(0.05),
                    AppStyles.darkBg,
                  ],
                ),
              ),
            ),
          ),

          SafeArea(
            child: SingleChildScrollView(
              padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // App Bar / Header
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      const AnimatedLogo(size: 40),
                      Row(
                        children: [
                          _GlassIconButton(
                            icon: LucideIcons.bell,
                            onTap: () => context.push('/notifications'),
                          ),
                          const SizedBox(width: 12),
                          _GlassIconButton(
                            icon: LucideIcons.user,
                            onTap: () => context.push('/profile'),
                          ),
                        ],
                      ),
                    ],
                  ),

                  const SizedBox(height: 32),

                  Text(
                    'Olá, $userName',
                    style: GoogleFonts.sora(
                      fontSize: 28,
                      fontWeight: FontWeight.w900,
                      color: Colors.white,
                    ),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    'Bem-vindo ao seu painel ultra.',
                    style: GoogleFonts.dmSans(
                      fontSize: 14,
                      color: Colors.white60,
                      fontWeight: FontWeight.w500,
                    ),
                  ),

                  const SizedBox(height: 32),

                  // Hero Plan Card
                  _HeroPlanCard(
                    planName: 'Plus 1 Giga',
                    status: 'CONECTADO',
                    onTap: _startSelfHealing,
                  ),

                  const SizedBox(height: 32),

                  if (activeTicket != null) ...[
                    _ActiveTicketCard(
                      visitTime: activeTicket['visitScheduled'],
                    ),
                    const SizedBox(height: 32),
                  ],

                  // Quick Actions
                  Text(
                    'Acesso Rápido',
                    style: GoogleFonts.sora(
                      fontSize: 18,
                      fontWeight: FontWeight.w800,
                      color: Colors.white,
                    ),
                  ),
                  const SizedBox(height: 16),
                  GridView.count(
                    crossAxisCount: 2,
                    shrinkWrap: true,
                    physics: const NeverScrollableScrollPhysics(),
                    mainAxisSpacing: 16,
                    crossAxisSpacing: 16,
                    childAspectRatio: 1.15,
                    children: [
                       _QuickActionCard(
                         icon: LucideIcons.receipt, 
                         title: 'Faturas', 
                         onTap: () => context.push('/invoices'),
                       ),
                       _QuickActionCard(
                         icon: LucideIcons.gauge, 
                         title: 'Diagnóstico', 
                         onTap: () => context.push('/connection'),
                       ),
                       _QuickActionCard(
                         icon: LucideIcons.router, 
                         title: 'Meu Wi-Fi', 
                         onTap: () => context.push('/wifi'),
                       ),
                       _QuickActionCard(
                         icon: LucideIcons.headphones, 
                         title: 'Suporte', 
                         onTap: () => context.push('/support'),
                       ),
                    ],
                  ),
                  
                  const SizedBox(height: 100), // Space for FAB
                ],
              ),
            ),
          ),
        ],
      ),
      floatingActionButton: Padding(
        padding: const EdgeInsets.only(bottom: 16),
        child: FloatingActionButton.extended(
          onPressed: () => context.push('/luna_chat'),
          backgroundColor: AppStyles.primaryMagenta,
          elevation: 12,
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
          icon: const Icon(LucideIcons.sparkles, color: Colors.white),
          label: Text(
            'Falar com a Luna', 
            style: GoogleFonts.sora(
              color: Colors.white, 
              fontWeight: FontWeight.w800,
              fontSize: 14,
            ),
          ),
        ),
      ),
      floatingActionButtonLocation: FloatingActionButtonLocation.centerFloat,
    );
  }
}

class _GlassIconButton extends StatelessWidget {
  final IconData icon;
  final VoidCallback onTap;

  const _GlassIconButton({required this.icon, required this.onTap});

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: AppStyles.glassEffect(
        radius: 14,
        child: Container(
          width: 44,
          height: 44,
          decoration: AppStyles.glassDecoration(radius: 14, opacity: 0.1),
          child: Icon(icon, color: Colors.white, size: 20),
        ),
      ),
    );
  }
}

class _HeroPlanCard extends StatelessWidget {
  final String planName;
  final String status;
  final VoidCallback onTap;

  const _HeroPlanCard({
    required this.planName,
    required this.status,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return Stack(
      children: [
        // Glow layer
        Positioned(
          top: 0, right: 0,
          child: Container(
            width: 100, height: 100,
            decoration: BoxDecoration(
              color: AppStyles.primaryMagenta.withOpacity(0.15),
              shape: BoxShape.circle,
            ),
          ),
        ),
        
        GlassCard(
          padding: const EdgeInsets.all(28),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
                    decoration: BoxDecoration(
                      color: const Color(0xFF00E676).withOpacity(0.1),
                      borderRadius: BorderRadius.circular(8),
                      border: Border.all(color: const Color(0xFF00E676).withOpacity(0.2)),
                    ),
                    child: Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        const Icon(LucideIcons.wifi, size: 12, color: Color(0xFF00E676)),
                        const SizedBox(width: 6),
                        Text(
                          status, 
                          style: GoogleFonts.sora(
                            color: const Color(0xFF00E676), 
                            fontSize: 10, 
                            fontWeight: FontWeight.w900, 
                            letterSpacing: 1,
                          ),
                        ),
                      ],
                    ),
                  ),
                  IconButton(
                    onPressed: onTap,
                    icon: const Icon(LucideIcons.refreshCcw, color: Colors.white30, size: 18),
                  ),
                ],
              ),
              const SizedBox(height: 24),
              Text(
                'Internet de Ultra Velocidade',
                style: GoogleFonts.dmSans(color: Colors.white60, fontSize: 13, fontWeight: FontWeight.bold),
              ),
              const SizedBox(height: 4),
              Text(
                planName, 
                style: GoogleFonts.sora(
                  color: Colors.white, 
                  fontSize: 32, 
                  fontWeight: FontWeight.w900,
                  letterSpacing: -1,
                ),
              ),
              const SizedBox(height: 24),
              
              // Progress visualization
              Row(
                children: [
                  Expanded(
                    child: Container(
                      height: 6,
                      decoration: BoxDecoration(
                        color: Colors.white.withOpacity(0.05),
                        borderRadius: BorderRadius.circular(3),
                      ),
                      child: FractionallySizedBox(
                        alignment: Alignment.centerLeft,
                        widthFactor: 0.85,
                        child: Container(
                          decoration: BoxDecoration(
                            gradient: AppStyles.primaryGradient,
                            borderRadius: BorderRadius.circular(3),
                            boxShadow: [
                              BoxShadow(color: AppStyles.primaryMagenta.withOpacity(0.5), blurRadius: 8),
                            ],
                          ),
                        ),
                      ),
                    ),
                  ),
                  const SizedBox(width: 16),
                  Text('85%', style: GoogleFonts.sora(color: Colors.white, fontSize: 12, fontWeight: FontWeight.bold)),
                ],
              ),
            ],
          ),
        ),
      ],
    );
  }
}

class _QuickActionCard extends StatelessWidget {
  final IconData icon;
  final String title;
  final VoidCallback onTap;

  const _QuickActionCard({required this.icon, required this.title, required this.onTap});

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: GlassCard(
        padding: const EdgeInsets.all(20),
        radius: 20,
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Container(
              width: 44,
              height: 44,
              decoration: BoxDecoration(
                color: AppStyles.primaryMagenta.withOpacity(0.1),
                borderRadius: BorderRadius.circular(12),
              ),
              child: Icon(icon, color: AppStyles.primaryMagenta, size: 24),
            ),
            Text(
              title, 
              style: GoogleFonts.sora(
                color: Colors.white, 
                fontWeight: FontWeight.w700, 
                fontSize: 14,
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _ActiveTicketCard extends StatelessWidget {
  final String visitTime;

  const _ActiveTicketCard({required this.visitTime});

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
      decoration: BoxDecoration(
        color: AppStyles.primaryMagenta.withOpacity(0.05),
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: AppStyles.primaryMagenta.withOpacity(0.1)),
      ),
      child: Row(
        children: [
          const Icon(LucideIcons.truck, color: AppStyles.primaryMagenta, size: 24),
          const SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'TÉCNICO A CAMINHO', 
                  style: GoogleFonts.sora(
                    color: AppStyles.primaryMagenta, 
                    fontSize: 9, 
                    fontWeight: FontWeight.w900, 
                    letterSpacing: 1,
                  ),
                ),
                Text(
                  'Agendado para hoje às $visitTime', 
                  style: GoogleFonts.dmSans(color: Colors.white, fontSize: 13, fontWeight: FontWeight.bold),
                ),
              ],
            ),
          ),
          const Icon(LucideIcons.chevronRight, color: Colors.white24, size: 20),
        ],
      ),
    );
  }
}

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
        child: GlassCard(
          width: 280,
          padding: const EdgeInsets.all(32),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
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
                            border: Border.all(color: AppStyles.primaryMagenta.withOpacity(0.3), width: 3),
                          ),
                          child: Align(
                            alignment: Alignment.topCenter,
                            child: Container(
                              width: 8,
                              height: 8,
                              margin: const EdgeInsets.all(2),
                              decoration: BoxDecoration(
                                color: AppStyles.primaryMagenta,
                                shape: BoxShape.circle,
                                boxShadow: [
                                  BoxShadow(color: AppStyles.primaryMagenta.withOpacity(0.5), blurRadius: 10)
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
                        color: isDone ? Colors.green.withOpacity(0.1) : AppStyles.primaryMagenta.withOpacity(0.1),
                        shape: BoxShape.circle,
                      ),
                      child: Icon(
                        isDone ? LucideIcons.check : LucideIcons.zap,
                        color: isDone ? Colors.green : AppStyles.primaryMagenta,
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
                style: GoogleFonts.sora(
                  color: isDone ? Colors.green : Colors.white,
                  fontSize: 15,
                  fontWeight: FontWeight.bold,
                ),
              ),
              if (!isDone)
                Padding(
                  padding: const EdgeInsets.only(top: 16),
                  child: LinearProgressIndicator(
                    valueColor: const AlwaysStoppedAnimation<Color>(AppStyles.primaryMagenta),
                    backgroundColor: Colors.white.withOpacity(0.05),
                    borderRadius: BorderRadius.circular(4),
                  ),
                ),
            ],
          ),
        ),
      ),
    );
  }
}
