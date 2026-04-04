import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'dart:ui';
import '../services/api_service.dart';
import '../providers/auth_provider.dart';
import '../utils/app_styles.dart';

class LunaChatScreen extends ConsumerStatefulWidget {
  const LunaChatScreen({super.key});

  @override
  ConsumerState<LunaChatScreen> createState() => _LunaChatScreenState();
}

class _LunaChatScreenState extends ConsumerState<LunaChatScreen> {
  final _msgCtrl = TextEditingController();
  final _scrollCtrl = ScrollController();
  final List<Map<String, String>> _messages = [
    {"role": "assistant", "content": "Olá! Sou a Luna, sua assistente ultra. Vi que sua conexão está estável, mas posso otimizar algo para você agora?"}
  ];
  bool _isLoading = false;

  void _sendMessage() async {
    final text = _msgCtrl.text.trim();
    if (text.isEmpty || _isLoading) return;

    setState(() {
      _messages.add({"role": "user", "content": text});
      _isLoading = true;
    });
    _msgCtrl.clear();
    _scrollToBottom();

    try {
      final user = ref.read(authProvider).user;
      final dio = ref.read(apiProvider);
      
      final res = await dio.post('/chat', data: {
        "messages": _messages,
        "context": {
          "subject": "Suporte Técnico Mobile",
          "userName": user?['name'] ?? "Cliente",
          "clientId": user?['id'] ?? "001",
        }
      });

      if (!mounted) return;
      setState(() {
        _messages.add({"role": "assistant", "content": res.data['reply'] ?? "Estou recalibrando meus sistemas, pode repetir?"});
        if (res.data['openTicket'] == true) {
          _messages.add({"role": "system", "content": "TICKET_OPEN"});
        }
      });
    } catch (e) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Falha na rede neural: $e')));
    } finally {
      if (mounted) {
        setState(() {
          _isLoading = false;
        });
        _scrollToBottom();
      }
    }
  }

  void _scrollToBottom() {
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (_scrollCtrl.hasClients) {
        _scrollCtrl.animateTo(_scrollCtrl.position.maxScrollExtent, duration: const Duration(milliseconds: 400), curve: Curves.easeOutCubic);
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppStyles.darkBg,
      extendBodyBehindAppBar: true,
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        flexibleSpace: ClipRect(
          child: BackdropFilter(
            filter: ImageFilter.blur(sigmaX: 10, sigmaY: 10),
            child: Container(color: Colors.black.withOpacity(0.2)),
          ),
        ),
        title: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Stack(
              children: [
                const CircleAvatar(
                  radius: 18,
                  backgroundColor: AppStyles.primaryMagenta,
                  child: Icon(LucideIcons.sparkles, color: Colors.white, size: 18),
                ),
                Positioned(
                  right: 0, bottom: 0,
                  child: Container(
                    width: 10, height: 10,
                    decoration: BoxDecoration(
                      color: const Color(0xFF00E676),
                      shape: BoxShape.circle,
                      border: Border.all(color: AppStyles.darkBg, width: 2),
                    ),
                  ),
                ),
              ],
            ),
            const SizedBox(width: 12),
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text('Luna AI', style: GoogleFonts.sora(fontWeight: FontWeight.w900, fontSize: 16)),
                Text('Sempre Online', style: GoogleFonts.dmSans(fontSize: 10, color: const Color(0xFF00E676), fontWeight: FontWeight.bold)),
              ],
            ),
          ],
        ),
        centerTitle: true,
      ),
      body: Stack(
        children: [
          // Animated Background Elements
          _buildBackgroundOrbs(),

          Column(
            children: [
              Expanded(
                child: ListView.builder(
                  controller: _scrollCtrl,
                  padding: const EdgeInsets.fromLTRB(24, 120, 24, 24),
                  itemCount: _messages.length,
                  itemBuilder: (context, index) {
                    final msg = _messages[index];
                    final role = msg['role'];
                    
                    if (msg['content'] == 'TICKET_OPEN') {
                      return _buildSystemNotice('Chamado técnico aberto com sucesso na central.');
                    }

                    return _buildChatBubble(msg['content']!, role == 'assistant');
                  },
                ),
              ),
              
              if (_isLoading) _buildTypingIndicator(),

              _buildInputArea(),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildBackgroundOrbs() {
    return Positioned.fill(
      child: Stack(
        children: [
          Positioned(
            top: 200, left: -50,
            child: _Orb(color: AppStyles.primaryMagenta.withOpacity(0.05), size: 300),
          ),
          Positioned(
            bottom: 100, right: -100,
            child: _Orb(color: const Color(0xFF00D1FF).withOpacity(0.03), size: 400),
          ),
        ],
      ),
    );
  }

  Widget _buildChatBubble(String content, bool isLuna) {
    return Align(
      alignment: isLuna ? Alignment.centerLeft : Alignment.centerRight,
      child: Container(
        margin: const EdgeInsets.only(bottom: 20),
        constraints: BoxConstraints(maxWidth: MediaQuery.of(context).size.width * 0.8),
        child: AppStyles.glassEffect(
          radius: 20,
          child: Container(
            padding: const EdgeInsets.all(18),
            decoration: BoxDecoration(
              color: isLuna 
                  ? Colors.white.withOpacity(0.05) 
                  : AppStyles.primaryMagenta.withOpacity(0.15),
              borderRadius: BorderRadius.only(
                topLeft: const Radius.circular(20),
                topRight: const Radius.circular(20),
                bottomLeft: Radius.circular(isLuna ? 4 : 20),
                bottomRight: Radius.circular(isLuna ? 20 : 4),
              ),
              border: Border.all(
                color: isLuna 
                    ? Colors.white.withOpacity(0.05) 
                    : AppStyles.primaryMagenta.withOpacity(0.2),
              ),
            ),
            child: Text(
              content,
              style: GoogleFonts.dmSans(
                color: Colors.white,
                fontSize: 15,
                height: 1.5,
              ),
            ),
          ),
        ),
      ).animate().fadeIn(duration: 400.ms).moveY(begin: 10, end: 0),
    );
  }

  Widget _buildSystemNotice(String text) {
    return Center(
      child: Container(
        margin: const EdgeInsets.symmetric(vertical: 24),
        padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 10),
        decoration: BoxDecoration(
          color: const Color(0xFF00E676).withOpacity(0.05),
          borderRadius: BorderRadius.circular(12),
          border: Border.all(color: const Color(0xFF00E676).withOpacity(0.1)),
        ),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            const Icon(LucideIcons.checkCircle, color: Color(0xFF00E676), size: 14),
            const SizedBox(width: 10),
            Text(
              text, 
              style: GoogleFonts.sora(color: const Color(0xFF00E676), fontSize: 11, fontWeight: FontWeight.bold),
            ),
          ],
        ),
      ),
    ).animate().fadeIn();
  }

  Widget _buildTypingIndicator() {
    return Padding(
      padding: const EdgeInsets.only(left: 24, bottom: 16),
      child: Row(
        children: [
          Text(
            'Luna está pensando', 
            style: GoogleFonts.dmSans(color: Colors.white38, fontSize: 11, fontWeight: FontWeight.bold),
          ),
          const SizedBox(width: 8),
          const SizedBox(
            width: 12, height: 12,
            child: CircularProgressIndicator(strokeWidth: 1.5, color: AppStyles.primaryMagenta),
          ),
        ],
      ),
    ).animate().fadeIn();
  }

  Widget _buildInputArea() {
    return Container(
      padding: const EdgeInsets.fromLTRB(20, 10, 20, 32),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          begin: Alignment.topCenter,
          end: Alignment.bottomCenter,
          colors: [Colors.transparent, Colors.black.withOpacity(0.4)],
        ),
      ),
      child: SafeArea(
        child: Row(
          children: [
            Expanded(
              child: AppStyles.glassEffect(
                radius: 28,
                child: TextField(
                  controller: _msgCtrl,
                  onSubmitted: (_) => _sendMessage(),
                  style: GoogleFonts.dmSans(color: Colors.white),
                  decoration: InputDecoration(
                    hintText: 'Fale com a Luna...',
                    hintStyle: GoogleFonts.dmSans(color: Colors.white24),
                    contentPadding: const EdgeInsets.symmetric(horizontal: 24, vertical: 18),
                    filled: true,
                    fillColor: Colors.white.withOpacity(0.03),
                    border: OutlineInputBorder(borderRadius: BorderRadius.circular(28), borderSide: BorderSide.none),
                  ),
                ),
              ),
            ),
            const SizedBox(width: 12),
            Container(
              width: 56, height: 56,
              decoration: BoxDecoration(
                gradient: AppStyles.primaryGradient,
                shape: BoxShape.circle,
                boxShadow: [
                  BoxShadow(color: AppStyles.primaryMagenta.withOpacity(0.3), blurRadius: 15, offset: const Offset(0, 5)),
                ],
              ),
              child: IconButton(
                icon: const Icon(LucideIcons.send, color: Colors.white, size: 22),
                onPressed: _sendMessage,
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _Orb extends StatelessWidget {
  final Color color;
  final double size;
  const _Orb({required this.color, required this.size});

  @override
  Widget build(BuildContext context) {
    return Container(
      width: size, height: size,
      decoration: BoxDecoration(
        color: color,
        shape: BoxShape.circle,
      ),
    ).animate(onPlay: (c) => c.repeat(reverse: true))
     .moveY(begin: -20, end: 20, duration: 4.seconds, curve: Curves.easeInOut)
     .scale(begin: const Offset(1, 1), end: const Offset(1.1, 1.1), duration: 6.seconds);
  }
}
