import 'package:flutter/material.dart';

/// Serviço Simulado de Push Notifications (Firebase Cloud Messaging Mock)
class PushNotificationService {
  static void initialize(BuildContext context) {
    // Simula o registro do device token no servidor
    debugPrint("📱 [FCM Mock] Registrando Token do Dispositivo no Servidor...");
    Future.delayed(const Duration(seconds: 3), () {
      debugPrint("✅ [FCM Mock] Token Registrado com Sucesso: abc123_mock_token_xyz");
      
      // Simula o recebimento de uma notificação após 10 segundos logado
      _simulateIncomingPush(context);
    });
  }

  static void _simulateIncomingPush(BuildContext context) {
    Future.delayed(const Duration(seconds: 10), () {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          duration: const Duration(seconds: 8),
          behavior: SnackBarBehavior.floating,
          margin: const EdgeInsets.all(16),
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
          backgroundColor: const Color(0xFF0F172A), // Dark Slate
          content: Row(
            children: [
              Container(
                padding: const EdgeInsets.all(8),
                decoration: BoxDecoration(
                  color: const Color(0xFFFF0080).withOpacity(0.2), // Plus Pink glow
                  shape: BoxShape.circle,
                ),
                child: const Icon(Icons.notifications_active, color: Color(0xFFFF0080)),
              ),
              const SizedBox(width: 16),
              const Expanded(
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text("Técnico a Caminho", style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16, color: Colors.white)),
                    SizedBox(height: 4),
                    Text("O técnico João está em deslocamento. Chegada prevista em 20 min.", style: TextStyle(color: Colors.white70, fontSize: 12)),
                  ],
                ),
              ),
            ],
          ),
          action: SnackBarAction(
            label: "Ver Mapa",
            textColor: const Color(0xFFFF0080),
            onPressed: () {},
          ),
        ),
      );
    });
  }
}
