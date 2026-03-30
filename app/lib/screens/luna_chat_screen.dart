import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:lucide_icons/lucide_icons.dart';
import '../services/api_service.dart';
import '../providers/auth_provider.dart';

class LunaChatScreen extends ConsumerStatefulWidget {
  const LunaChatScreen({super.key});

  @override
  ConsumerState<LunaChatScreen> createState() => _LunaChatScreenState();
}

class _LunaChatScreenState extends ConsumerState<LunaChatScreen> {
  final _msgCtrl = TextEditingController();
  final _scrollCtrl = ScrollController();
  final List<Map<String, String>> _messages = [
    {"role": "assistant", "content": "Olá! Sou a Luna, inteligência artificial da Plus. Como posso te ajudar com a sua internet hoje?"}
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
          "cpf": user?['cpf'] ?? "000.000.000-00",
          "clientId": user?['id'] ?? "001",
          "region": "Centro",
          "macAddress": "AA:BB:CC:DD:EE:FF"
        }
      });

      setState(() {
        _messages.add({"role": "assistant", "content": res.data['reply'] ?? "Não entendi, pode repetir?"});
        if (res.data['openTicket'] == true) {
          _messages.add({"role": "system", "content": "Chamado técnico aberto com sucesso na central."});
        }
      });
    } catch (e) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Falha ao falar com a Luna: $e')));
    } finally {
      setState(() {
        _isLoading = false;
      });
      _scrollToBottom();
    }
  }

  void _scrollToBottom() {
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (_scrollCtrl.hasClients) {
        _scrollCtrl.animateTo(_scrollCtrl.position.maxScrollExtent, duration: const Duration(milliseconds: 300), curve: Curves.easeOut);
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    final colors = Theme.of(context).colorScheme;
    
    return Scaffold(
      appBar: AppBar(
        title: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            const CircleAvatar(
              radius: 14,
              backgroundColor: Colors.white,
              child: Text('🤖', style: TextStyle(fontSize: 16)),
            ),
            const SizedBox(width: 8),
            Text('Luna AI', style: TextStyle(fontWeight: FontWeight.bold, color: colors.onSurface)),
          ],
        ),
        centerTitle: true,
      ),
      body: Column(
        children: [
          Expanded(
            child: ListView.builder(
              controller: _scrollCtrl,
              padding: const EdgeInsets.all(24),
              itemCount: _messages.length,
              itemBuilder: (context, index) {
                final msg = _messages[index];
                final isLuna = msg['role'] == 'assistant';
                final isSystem = msg['role'] == 'system';

                if (isSystem) {
                  return Center(
                    child: Container(
                      margin: const EdgeInsets.symmetric(vertical: 16),
                      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                      decoration: BoxDecoration(color: Colors.green.shade50, borderRadius: BorderRadius.circular(16), border: Border.all(color: Colors.green.shade200)),
                      child: Text(msg['content']!, style: TextStyle(color: Colors.green.shade700, fontSize: 12, fontWeight: FontWeight.bold)),
                    ),
                  );
                }

                return Align(
                  alignment: isLuna ? Alignment.centerLeft : Alignment.centerRight,
                  child: Container(
                    margin: const EdgeInsets.only(bottom: 12),
                    constraints: BoxConstraints(maxWidth: MediaQuery.of(context).size.width * 0.75),
                    padding: const EdgeInsets.all(16),
                    decoration: BoxDecoration(
                      color: isLuna ? Colors.white : colors.primary,
                      borderRadius: BorderRadius.only(
                        topLeft: const Radius.circular(20),
                        topRight: const Radius.circular(20),
                        bottomLeft: isLuna ? const Radius.circular(4) : const Radius.circular(20),
                        bottomRight: isLuna ? const Radius.circular(20) : const Radius.circular(4),
                      ),
                      border: isLuna ? Border.all(color: Colors.grey.shade200) : null,
                      boxShadow: [if (isLuna) BoxShadow(color: Colors.black.withOpacity(0.02), blurRadius: 10, offset: const Offset(0, 4))],
                    ),
                    child: Text(
                      msg['content']!,
                      style: TextStyle(
                        color: isLuna ? colors.onSurface : Colors.white,
                        fontSize: 15,
                        height: 1.4,
                      ),
                    ),
                  ),
                );
              },
            ),
          ),
          if (_isLoading)
            const Padding(
              padding: EdgeInsets.symmetric(vertical: 8.0),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  SizedBox(width: 16, height: 16, child: CircularProgressIndicator(strokeWidth: 2)),
                  SizedBox(width: 12),
                  Text('Luna está digitando...', style: TextStyle(color: Colors.grey, fontSize: 12, fontWeight: FontWeight.bold)),
                ],
              ),
            ),
          Container(
            padding: const EdgeInsets.all(24),
            decoration: BoxDecoration(
              color: Colors.white,
              border: Border(top: BorderSide(color: Colors.grey.shade200)),
            ),
            child: SafeArea(
              child: Row(
                children: [
                  Expanded(
                    child: TextField(
                      controller: _msgCtrl,
                      onSubmitted: (_) => _sendMessage(),
                      decoration: InputDecoration(
                        hintText: 'Digite sua dúvida...',
                        hintStyle: TextStyle(color: Colors.grey.shade400),
                        contentPadding: const EdgeInsets.symmetric(horizontal: 20, vertical: 14),
                        filled: true,
                        fillColor: Colors.grey.shade50,
                        border: OutlineInputBorder(borderRadius: BorderRadius.circular(24), borderSide: BorderSide.none),
                      ),
                    ),
                  ),
                  const SizedBox(width: 12),
                  CircleAvatar(
                    radius: 24,
                    backgroundColor: colors.primary,
                    child: IconButton(
                      icon: const Icon(LucideIcons.send, color: Colors.white, size: 20),
                      onPressed: _sendMessage,
                    ),
                  ),
                ],
              ),
            ),
          )
        ],
      ),
    );
  }
}
