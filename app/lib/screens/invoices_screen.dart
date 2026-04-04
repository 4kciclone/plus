import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:flutter_animate/flutter_animate.dart';
import '../services/api_service.dart';
import '../utils/app_styles.dart';

final invoicesProvider = FutureProvider<List<dynamic>>((ref) async {
  final res = await ref.read(apiProvider).get('/invoices/my');
  return res.data;
});

class InvoicesScreen extends ConsumerWidget {
  const InvoicesScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final invoicesOpt = ref.watch(invoicesProvider);

    return Scaffold(
      backgroundColor: AppStyles.darkBg,
      appBar: AppBar(
        title: Text('Centro Financeiro', style: GoogleFonts.sora(fontWeight: FontWeight.bold)),
      ),
      body: Stack(
        children: [
          // Subtly glow at the bottom
          Positioned(
            bottom: -50, right: -50,
            child: Container(
              width: 250, height: 250,
              decoration: BoxDecoration(
                color: AppStyles.primaryMagenta.withOpacity(0.08),
                shape: BoxShape.circle,
              ),
            ),
          ),

          invoicesOpt.when(
            loading: () => const Center(child: CircularProgressIndicator(color: AppStyles.primaryMagenta)),
            error: (err, stack) => Center(child: Text('Erro ao carregar faturas: $err', style: const TextStyle(color: Colors.red))),
            data: (invoices) {
              if (invoices.isEmpty) {
                return _buildEmptyState();
              }

              // Take the first pending invoice as "Hero"
              final pending = invoices.where((i) => i['status'] == 'PENDING').toList();
              final nextInvoice = pending.isNotEmpty ? pending[0] : null;

              return CustomScrollView(
                slivers: [
                  if (nextInvoice != null)
                    SliverToBoxAdapter(
                      child: Padding(
                        padding: const EdgeInsets.all(24.0),
                        child: _buildNextInvoiceHero(nextInvoice),
                      ),
                    ),
                  
                  SliverPadding(
                    padding: const EdgeInsets.symmetric(horizontal: 24),
                    sliver: SliverToBoxAdapter(
                      child: Padding(
                        padding: const EdgeInsets.only(bottom: 16),
                        child: Text(
                          'HISTÓRICO DE PAGAMENTOS', 
                          style: GoogleFonts.sora(fontSize: 11, fontWeight: FontWeight.w900, color: Colors.white38, letterSpacing: 1.5),
                        ),
                      ),
                    ),
                  ),

                  SliverList(
                    delegate: SliverChildBuilderDelegate(
                      (context, index) {
                        final inv = invoices[index];
                        return Padding(
                          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 8),
                          child: _buildInvoiceItem(inv),
                        );
                      },
                      childCount: invoices.length,
                    ),
                  ),
                  const SliverToBoxAdapter(child: SizedBox(height: 48)),
                ],
              );
            },
          ),
        ],
      ),
    );
  }

  Widget _buildEmptyState() {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(LucideIcons.checkCircle, size: 80, color: AppStyles.primaryMagenta.withOpacity(0.1)),
          const SizedBox(height: 24),
          Text(
            'Tudo em dia!', 
            style: GoogleFonts.sora(fontSize: 24, fontWeight: FontWeight.w900, color: Colors.white),
          ),
          const SizedBox(height: 8),
          Text(
            'Você não possui faturas pendentes.', 
            style: GoogleFonts.dmSans(color: Colors.white54, fontSize: 14),
          ),
        ],
      ),
    ).animate().fadeIn().scale(begin: const Offset(0.95, 0.95));
  }

  Widget _buildNextInvoiceHero(Map<String, dynamic> inv) {
    final dueDate = DateTime.parse(inv['dueDate']);
    final amount = inv['amount'].toStringAsFixed(2).replaceFirst('.', ',');

    return GlassCard(
      padding: const EdgeInsets.all(32),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                'Próxima Fatura', 
                style: GoogleFonts.dmSans(color: Colors.white60, fontSize: 14, fontWeight: FontWeight.w600),
              ),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
                decoration: BoxDecoration(
                  color: AppStyles.primaryMagenta.withOpacity(0.1),
                  borderRadius: BorderRadius.circular(8),
                  border: Border.all(color: AppStyles.primaryMagenta.withOpacity(0.2)),
                ),
                child: Text(
                  'AGUARDANDO', 
                  style: GoogleFonts.sora(color: AppStyles.primaryMagenta, fontSize: 9, fontWeight: FontWeight.w900, letterSpacing: 1),
                ),
              ),
            ],
          ),
          const SizedBox(height: 16),
          Text(
            'R\$ $amount', 
            style: GoogleFonts.sora(color: Colors.white, fontSize: 42, fontWeight: FontWeight.w900, letterSpacing: -2),
          ),
          const SizedBox(height: 8),
          Text(
            'Vence em ${dueDate.day.toString().padLeft(2, '0')}/${dueDate.month.toString().padLeft(2, '0')}', 
            style: GoogleFonts.dmSans(color: Colors.white38, fontSize: 14),
          ),
          const SizedBox(height: 32),
          Container(
            height: 56,
            decoration: BoxDecoration(
              gradient: AppStyles.primaryGradient,
              borderRadius: BorderRadius.circular(16),
              boxShadow: [
                BoxShadow(color: AppStyles.primaryMagenta.withOpacity(0.3), blurRadius: 15, offset: const Offset(0, 6)),
              ],
            ),
            child: ElevatedButton.icon(
              onPressed: () {},
              icon: const Icon(LucideIcons.qrCode, size: 20),
              label: Text('PAGAR VIA PIX', style: GoogleFonts.sora(fontWeight: FontWeight.w800, fontSize: 14)),
              style: ElevatedButton.styleFrom(
                backgroundColor: Colors.transparent,
                shadowColor: Colors.transparent,
                foregroundColor: Colors.white,
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
              ),
            ),
          ).animate(onPlay: (c) => c.repeat()).shimmer(delay: 3.seconds, duration: 1.5.seconds),
        ],
      ),
    ).animate().fadeIn().moveY(begin: 20, end: 0);
  }

  Widget _buildInvoiceItem(Map<String, dynamic> inv) {
    final isPending = inv['status'] == 'PENDING';
    final dueDate = DateTime.parse(inv['dueDate']);
    final amount = inv['amount'].toStringAsFixed(2).replaceFirst('.', ',');

    return GlassCard(
      padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 18),
      radius: 20,
      opacity: 0.04,
      child: Row(
        children: [
          Container(
            width: 48, height: 48,
            decoration: BoxDecoration(
              color: isPending ? AppStyles.primaryMagenta.withOpacity(0.1) : Colors.green.withOpacity(0.1),
              borderRadius: BorderRadius.circular(14),
            ),
            child: Icon(
              isPending ? LucideIcons.alertCircle : LucideIcons.check2, 
              color: isPending ? AppStyles.primaryMagenta : Colors.green, 
              size: 24
            ),
          ),
          const SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'Fatura de ${dueDate.month.toString().padLeft(2, '0')}/${dueDate.year}', 
                  style: GoogleFonts.sora(color: Colors.white, fontWeight: FontWeight.w700, fontSize: 14),
                ),
                const SizedBox(height: 4),
                Text(
                  'Venceu em ${dueDate.day.toString().padLeft(2, '0')}/${dueDate.month.toString().padLeft(2, '0')}', 
                  style: GoogleFonts.dmSans(color: Colors.white38, fontSize: 12),
                ),
              ],
            ),
          ),
          Column(
            crossAxisAlignment: CrossAxisAlignment.end,
            children: [
              Text(
                'R\$ $amount', 
                style: GoogleFonts.sora(color: Colors.white, fontWeight: FontWeight.w800, fontSize: 15),
              ),
              const SizedBox(height: 4),
              Text(
                isPending ? 'ABERTO' : 'PAGO', 
                style: GoogleFonts.sora(
                  color: isPending ? AppStyles.primaryMagenta : Colors.green, 
                  fontWeight: FontWeight.w900, 
                  fontSize: 9, 
                  letterSpacing: 1
                ),
              ),
            ],
          ),
        ],
      ),
    ).animate().fadeIn(delay: 500.ms).moveX(begin: 10, end: 0);
  }
}
