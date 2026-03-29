import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:go_router/go_router.dart';

class WifiScreen extends ConsumerWidget {
  const WifiScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final colors = Theme.of(context).colorScheme;

    return Scaffold(
      appBar: AppBar(
        title: const Row(
          children: [
            Hero(tag: 'hero-Meu Wi-Fi', child: Icon(LucideIcons.router, color: Colors.white)),
            SizedBox(width: 12),
            Text('Meu Wi-Fi', style: TextStyle(fontWeight: FontWeight.bold)),
          ],
        ),
        backgroundColor: Colors.transparent,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(24),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Status do Roteador
            Center(
              child: Column(
                children: [
                  Container(
                    padding: const EdgeInsets.all(24),
                    decoration: BoxDecoration(
                      shape: BoxShape.circle,
                      color: colors.primary.withOpacity(0.1),
                    ),
                    child: Icon(LucideIcons.router, size: 60, color: colors.primary),
                  ),
                  const SizedBox(height: 16),
                  const Text('Roteador Principal - Sala', style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold)),
                  const SizedBox(height: 8),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                    decoration: BoxDecoration(
                      color: Colors.green.withOpacity(0.2),
                      borderRadius: BorderRadius.circular(16),
                    ),
                    child: const Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Icon(LucideIcons.checkCircle, color: Colors.greenAccent, size: 14),
                        SizedBox(width: 8),
                        Text('Online via OLT', style: TextStyle(color: Colors.greenAccent, fontWeight: FontWeight.bold, fontSize: 12)),
                      ],
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 24),
            
            // Radar AR Button Edge-to-Edge
            SizedBox(
              width: double.infinity,
              height: 56,
              child: ElevatedButton.icon(
                onPressed: () => context.push('/radar'),
                style: ElevatedButton.styleFrom(
                  backgroundColor: colors.primary,
                  foregroundColor: Colors.white,
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
                  elevation: 0,
                ),
                icon: const Icon(LucideIcons.scanLine, size: 22),
                label: const Text('Analisar Sinal com AR', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
              ),
            ),
            
            const SizedBox(height: 40),

            // Gerenciamento de Senha
            const Text('Rede Wi-Fi Principal', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
            const SizedBox(height: 16),
            Card(
              color: colors.surface,
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
              child: Padding(
                padding: const EdgeInsets.all(20.0),
                child: Column(
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            const Text('Nome da Rede (SSID)', style: TextStyle(color: Colors.grey, fontSize: 12)),
                            const SizedBox(height: 4),
                            const Text('Familia_Plus_5G', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
                          ],
                        ),
                        IconButton(onPressed: () {}, icon: const Icon(LucideIcons.edit2, size: 20)),
                      ],
                    ),
                    const Divider(height: 32),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            const Text('Senha', style: TextStyle(color: Colors.grey, fontSize: 12)),
                            const SizedBox(height: 4),
                            const Text('********', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold, letterSpacing: 2)),
                          ],
                        ),
                        IconButton(onPressed: () {}, icon: const Icon(LucideIcons.eye, size: 20)),
                      ],
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 16),
            
            // Guest Wi-Fi Button
            SizedBox(
              width: double.infinity,
              height: 56,
              child: ElevatedButton.icon(
                onPressed: () => _showGuestWifiDialog(context),
                style: ElevatedButton.styleFrom(
                  backgroundColor: colors.surface,
                  foregroundColor: Colors.white,
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20), side: BorderSide(color: colors.primary.withOpacity(0.3))),
                  elevation: 0,
                ),
                icon: const Icon(LucideIcons.partyPopper, size: 22, color: Colors.yellowAccent),
                label: const Text('Criar Wi-Fi de Festa (Visitantes)', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
              ),
            ),
            
            const SizedBox(height: 32),

            // Dispositivos Conectados
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                const Text('Dispositivos (4)', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
                TextButton(onPressed: () {}, child: Text('Ver todos', style: TextStyle(color: colors.primary))),
              ],
            ),
            const SizedBox(height: 16),
            _DeviceTile(icon: LucideIcons.smartphone, name: 'iPhone do Paulo', connection: 'Wi-Fi 5GHz', color: colors, mbps: 12.5),
            const SizedBox(height: 12),
            _DeviceTile(icon: LucideIcons.tv, name: 'Smart TV Samsung', connection: 'Wi-Fi 5GHz', color: colors, mbps: 854.2),
            const SizedBox(height: 12),
            _DeviceTile(icon: LucideIcons.laptop, name: 'MacBook Pro', connection: 'Wi-Fi 2.4GHz', color: colors, mbps: 45.0),
          ],
        ),
      ),
    );
  }

  void _showGuestWifiDialog(BuildContext context) {
    showDialog(
      context: context,
      barrierColor: Colors.black.withOpacity(0.8),
      builder: (context) => const _GuestWifiDialog(),
    );
  }
}

class _DeviceTile extends StatefulWidget {
  final IconData icon;
  final String name;
  final String connection;
  final ColorScheme color;
  final double mbps;

  const _DeviceTile({required this.icon, required this.name, required this.connection, required this.color, required this.mbps});

  @override
  State<_DeviceTile> createState() => _DeviceTileState();
}

class _DeviceTileState extends State<_DeviceTile> {
  bool _isLoading = false;
  bool _isPaused = false;

  void _togglePause() async {
    setState(() => _isLoading = true);
    // Simulate MikroTik API call to add MAC address to drop rule
    await Future.delayed(const Duration(milliseconds: 1400));
    if (!mounted) return;
    
    setState(() {
      _isLoading = false;
      _isPaused = !_isPaused;
    });

    ScaffoldMessenger.of(context).clearSnackBars();
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Row(
          children: [
            Icon(_isPaused ? LucideIcons.ban : LucideIcons.checkCircle, color: Colors.white, size: 18),
            const SizedBox(width: 12),
            Expanded(child: Text(_isPaused ? 'Internet bloqueada para ${widget.name}' : 'Acesso restaurado para ${widget.name}', style: const TextStyle(fontWeight: FontWeight.bold))),
          ],
        ),
        backgroundColor: _isPaused ? Colors.redAccent.shade700 : Colors.green.shade700,
        behavior: SnackBarBehavior.floating,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
        margin: const EdgeInsets.only(bottom: 24, left: 24, right: 24),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return AnimatedContainer(
      duration: const Duration(milliseconds: 400),
      curve: Curves.fastOutSlowIn,
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: _isPaused ? Colors.redAccent.withOpacity(0.05) : widget.color.surface,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: _isPaused ? Colors.redAccent.withOpacity(0.2) : widget.color.onSurface.withOpacity(0.05)),
      ),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: _isPaused ? Colors.redAccent.withOpacity(0.1) : widget.color.primary.withOpacity(0.1), 
              borderRadius: BorderRadius.circular(12)
            ),
            child: Icon(widget.icon, color: _isPaused ? Colors.redAccent : widget.color.primary, size: 20),
          ),
          const SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  widget.name, 
                  style: TextStyle(
                    fontWeight: FontWeight.bold, 
                    decoration: _isPaused ? TextDecoration.lineThrough : null, 
                    color: _isPaused ? Colors.grey : Colors.white
                  )
                ),
                const SizedBox(height: 4),
                if (_isPaused)
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                    decoration: BoxDecoration(color: Colors.redAccent.withOpacity(0.2), borderRadius: BorderRadius.circular(4)),
                    child: const Text('ACESSO PAUSADO', style: TextStyle(fontSize: 9, fontWeight: FontWeight.bold, color: Colors.redAccent, letterSpacing: 0.5)),
                  )
                else
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(widget.connection, style: const TextStyle(fontSize: 12, color: Colors.grey)),
                      const SizedBox(height: 6),
                      // FEATURE 7: DPI Real-time Bandwidth Tracker
                      Row(
                        children: [
                          Icon(LucideIcons.activity, size: 12, color: widget.mbps > 500 ? Colors.redAccent : Colors.greenAccent),
                          const SizedBox(width: 4),
                          Text('${widget.mbps} Mbps', style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: widget.mbps > 500 ? Colors.redAccent : Colors.greenAccent)),
                          const SizedBox(width: 8),
                          Expanded(
                            child: ClipRRect(
                              borderRadius: BorderRadius.circular(2),
                              child: LinearProgressIndicator(
                                value: widget.mbps / 1000,
                                backgroundColor: Colors.white.withOpacity(0.05),
                                valueColor: AlwaysStoppedAnimation<Color>(widget.mbps > 500 ? Colors.redAccent : Colors.greenAccent),
                                minHeight: 4,
                              ),
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
              ],
            ),
          ),
          IconButton(
            onPressed: _isLoading ? null : _togglePause,
            icon: _isLoading 
              ? const SizedBox(width: 20, height: 20, child: CircularProgressIndicator(strokeWidth: 2))
              : Icon(_isPaused ? LucideIcons.play : LucideIcons.ban, size: 20, color: _isPaused ? Colors.greenAccent : Colors.redAccent),
            tooltip: _isPaused ? 'Restaurar Acesso' : 'Bloquear Dispositivo',
          ),
        ],
      ),
    );
  }
}

// FEATURE 6: Guest Wi-Fi Dialog
class _GuestWifiDialog extends StatefulWidget {
  const _GuestWifiDialog();

  @override
  State<_GuestWifiDialog> createState() => _GuestWifiDialogState();
}

class _GuestWifiDialogState extends State<_GuestWifiDialog> with SingleTickerProviderStateMixin {
  late AnimationController _timerController;

  @override
  void initState() {
    super.initState();
    _timerController = AnimationController(
      vsync: this, 
      duration: const Duration(hours: 4),
    );
    _timerController.reverse(from: 1.0);
  }

  @override
  void dispose() {
    _timerController.dispose();
    super.dispose();
  }

  String get timerString {
    Duration duration = _timerController.duration! * _timerController.value;
    return '${duration.inHours.toString().padLeft(2, '0')}:${(duration.inMinutes % 60).toString().padLeft(2, '0')}:${(duration.inSeconds % 60).toString().padLeft(2, '0')}';
  }

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Material(
        color: Colors.transparent,
        child: Container(
          width: 320,
          padding: const EdgeInsets.all(32),
          decoration: BoxDecoration(
            color: const Color(0xFF15151A),
            borderRadius: BorderRadius.circular(32),
            border: Border.all(color: Colors.yellowAccent.withOpacity(0.3)),
            boxShadow: [
              BoxShadow(color: Colors.yellowAccent.withOpacity(0.1), blurRadius: 60),
            ],
          ),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              const Icon(LucideIcons.partyPopper, color: Colors.yellowAccent, size: 36),
              const SizedBox(height: 16),
              const Text('Wi-Fi de Convidados', style: TextStyle(color: Colors.white, fontSize: 20, fontWeight: FontWeight.bold)),
              const SizedBox(height: 8),
              const Text('Rede: Familia_Plus_Visitante\nSenha: plusfesta2026', textAlign: TextAlign.center, style: TextStyle(color: Colors.grey, fontSize: 13, height: 1.5)),
              const SizedBox(height: 32),
              
              // Mocked QR Code
              Container(
                width: 180,
                height: 180,
                padding: const EdgeInsets.all(24),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(24),
                ),
                child: const FittedBox(
                  child: Icon(LucideIcons.qrCode, color: Colors.black),
                ),
              ),
              
              const SizedBox(height: 32),
              // Destructive Timer
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                decoration: BoxDecoration(
                  color: Colors.redAccent.withOpacity(0.1),
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(color: Colors.redAccent.withOpacity(0.3)),
                ),
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    const Icon(LucideIcons.timer, color: Colors.redAccent, size: 16),
                    const SizedBox(width: 8),
                    AnimatedBuilder(
                      animation: _timerController,
                      builder: (context, child) {
                        return Text(
                          'Expira em $timerString',
                          style: const TextStyle(color: Colors.redAccent, fontWeight: FontWeight.bold, fontSize: 14, letterSpacing: 1),
                        );
                      }
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 24),
              SizedBox(
                width: double.infinity,
                height: 48,
                child: ElevatedButton(
                  onPressed: () => Navigator.of(context).pop(),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Colors.white.withOpacity(0.1),
                    foregroundColor: Colors.white,
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                    elevation: 0,
                  ),
                  child: const Text('Fechar', style: TextStyle(fontWeight: FontWeight.bold)),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
