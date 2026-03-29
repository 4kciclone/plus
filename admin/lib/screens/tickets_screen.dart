import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lucide_icons/lucide_icons.dart';

import 'dart:math';

class TicketsScreen extends ConsumerStatefulWidget {
  const TicketsScreen({super.key});

  @override
  ConsumerState<TicketsScreen> createState() => _TicketsScreenState();
}

class _TicketsScreenState extends ConsumerState<TicketsScreen> {
  // Kanban State
  final Map<String, List<String>> _columns = {
    'Abertos (Triagem)': ['Cliente VIP sem conexão', 'Roteador sem sinal PON', 'Falha massiva no bairro Centro', 'Problema PPPoE - IP: 177.X'],
    'Luna Resolvendo 🤖': [],
    'Em Análise (NOC)': ['Lentidão - Rota Internacional'],
    'Técnico em Rota': ['Troca de Roteador Wi-Fi 6', 'Rompimento de Fibra Árvore 4'],
    'Resolvidos (Hoje)': ['Visita Técnica: Instalação', 'Configuração de Porta'],
  };

  @override
  void initState() {
    super.initState();
    _startLunaAutopilot();
  }

  void _startLunaAutopilot() async {
    while (mounted) {
      await Future.delayed(const Duration(seconds: 3));
      if (!mounted) break;
      
      if (_columns['Abertos (Triagem)']!.isNotEmpty) {
        final ticket = _columns['Abertos (Triagem)']!.first;
        _moveCard(ticket, 'Abertos (Triagem)', 'Luna Resolvendo 🤖');
        
        // Simulating the Deep Learning processing time
        await Future.delayed(const Duration(seconds: 4));
        if (!mounted) break;
        
        // The AI handles 80% dynamically, routing 20% to the NOC
        final bool resolved = Random().nextDouble() > 0.3;
        _moveCard(ticket, 'Luna Resolvendo 🤖', resolved ? 'Resolvidos (Hoje)' : 'Em Análise (NOC)');
      }
    }
  }

  void _moveCard(String item, String fromCol, String toCol) {
    if (fromCol == toCol) return;
    setState(() {
      _columns[fromCol]!.remove(item);
      _columns[toCol]!.add(item);
    });
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        const Text('Quadro de Chamados (O.S.)', style: TextStyle(fontSize: 28, fontWeight: FontWeight.bold)),
        const SizedBox(height: 24),
        Expanded(
          child: Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Expanded(child: _KanbanColumn(title: 'Abertos (Triagem)', color: Colors.redAccent, cards: _columns['Abertos (Triagem)']!, onDrop: (item, from) => _moveCard(item, from, 'Abertos (Triagem)'))),
              const SizedBox(width: 16),
              Expanded(flex: 1, child: _KanbanColumn(title: 'Luna Resolvendo 🤖', color: const Color(0xFFFF0080), isAI: true, cards: _columns['Luna Resolvendo 🤖']!, onDrop: (item, from) => _moveCard(item, from, 'Luna Resolvendo 🤖'))),
              const SizedBox(width: 16),
              Expanded(child: _KanbanColumn(title: 'Em Análise (NOC)', color: Colors.blueAccent, cards: _columns['Em Análise (NOC)']!, onDrop: (item, from) => _moveCard(item, from, 'Em Análise (NOC)'))),
              const SizedBox(width: 16),
              Expanded(child: _KanbanColumn(title: 'Técnico em Rota', color: Colors.orangeAccent, cards: _columns['Técnico em Rota']!, onDrop: (item, from) => _moveCard(item, from, 'Técnico em Rota'))),
              const SizedBox(width: 16),
              Expanded(child: _KanbanColumn(title: 'Resolvidos (Hoje)', color: Colors.green, cards: _columns['Resolvidos (Hoje)']!, onDrop: (item, from) => _moveCard(item, from, 'Resolvidos (Hoje)'))),
            ],
          ),
        ),
      ],
    );
  }
}

class _KanbanColumn extends StatelessWidget {
  final String title;
  final Color color;
  final List<String> cards;
  final bool isAI;
  final Function(String item, String fromCol) onDrop;

  const _KanbanColumn({required this.title, required this.color, required this.cards, this.isAI = false, required this.onDrop});

  @override
  Widget build(BuildContext context) {
    return DragTarget<Map<String, String>>(
      onAccept: (data) => onDrop(data['item']!, data['from']!),
      builder: (context, candidateData, rejectedData) {
        final highlight = candidateData.isNotEmpty;
        return Container(
          decoration: BoxDecoration(
            color: highlight 
                ? color.withOpacity(0.1) 
                : Theme.of(context).colorScheme.surface.withOpacity(0.5),
            borderRadius: BorderRadius.circular(12),
            border: Border.all(
              color: highlight ? color : Theme.of(context).colorScheme.onSurface.withOpacity(0.05),
              width: highlight ? 2 : 1,
            ),
          ),
      child: Column(
        children: [
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              border: Border(bottom: BorderSide(color: color, width: 3)),
            ),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(title, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
                CircleAvatar(radius: 12, backgroundColor: color.withOpacity(0.2), child: Text('${cards.length}', style: TextStyle(color: color, fontSize: 12, fontWeight: FontWeight.bold))),
              ],
            ),
          ),
          Expanded(
            child: ListView.separated(
              padding: const EdgeInsets.all(12),
              itemCount: cards.length,
              separatorBuilder: (_, __) => const SizedBox(height: 12),
              itemBuilder: (context, index) {
                final String item = cards[index];
                final Widget cardContent = Container(
                  decoration: isAI ? BoxDecoration(
                    borderRadius: BorderRadius.circular(12),
                    boxShadow: [BoxShadow(color: color.withOpacity(0.4), blurRadius: 16, spreadRadius: -2)],
                    border: Border.all(color: color.withOpacity(0.8), width: 1.5),
                  ) : null,
                  child: Card(
                    elevation: isAI ? 0 : 2,
                    color: isAI ? color.withOpacity(0.1) : null,
                    child: Padding(
                      padding: const EdgeInsets.all(16.0),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            children: [
                              Icon(isAI ? LucideIcons.sparkles : LucideIcons.tag, size: 14, color: color),
                              const SizedBox(width: 6),
                              const Text('#1024', style: TextStyle(fontSize: 12, color: Colors.grey)),
                            ],
                          ),
                          const SizedBox(height: 8),
                          Text(item, style: const TextStyle(fontWeight: FontWeight.bold)),
                          if (isAI)
                            Container(
                              margin: const EdgeInsets.only(top: 12),
                              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 8),
                              decoration: BoxDecoration(color: color.withOpacity(0.2), borderRadius: BorderRadius.circular(8)),
                              child: Row(
                                mainAxisSize: MainAxisSize.min,
                                children: [
                                  SizedBox(width: 14, height: 14, child: CircularProgressIndicator(strokeWidth: 2, color: color)),
                                  const SizedBox(width: 10),
                                  Text('IA em diagnóstico Ocorrendo', style: TextStyle(fontSize: 11, color: color, fontWeight: FontWeight.bold)),
                                ],
                              ),
                            )
                          else
                            const SizedBox(height: 12),
                          if (!isAI)
                            Row(
                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                              children: [
                                const Row(
                                  children: [
                                    CircleAvatar(radius: 10, child: Icon(LucideIcons.user, size: 12)),
                                    SizedBox(width: 6),
                                    Text('Nível 1 Humano', style: TextStyle(fontSize: 12)),
                                  ],
                                ),
                                Icon(LucideIcons.gripHorizontal, size: 16, color: Theme.of(context).colorScheme.onSurface.withOpacity(0.3)),
                              ],
                            ),
                        ],
                      ),
                    ),
                  ),
                );

                return LongPressDraggable<Map<String, String>>(
                  data: {'item': item, 'from': title},
                  feedback: Transform.rotate(
                    angle: 0.05, // 5 degrees tilt
                    child: Material(
                      color: Colors.transparent,
                      child: Container(
                        width: 280,
                        decoration: BoxDecoration(
                          boxShadow: [
                            BoxShadow(color: color.withOpacity(0.4), blurRadius: 20, spreadRadius: 2),
                          ],
                        ),
                        child: cardContent,
                      ),
                    ),
                  ),
                  childWhenDragging: Opacity(opacity: 0.3, child: cardContent),
                  child: cardContent,
                );
              },
            ),
          ),
        ],
      ),
    );
  }
}
