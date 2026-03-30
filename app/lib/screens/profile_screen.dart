import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:lucide_icons/lucide_icons.dart';
import '../services/api_service.dart';
import '../providers/auth_provider.dart';

class ProfileScreen extends ConsumerStatefulWidget {
  const ProfileScreen({super.key});

  @override
  ConsumerState<ProfileScreen> createState() => _ProfileScreenState();
}

class _ProfileScreenState extends ConsumerState<ProfileScreen> {
  bool _biometricsEnabled = false;

  void _changePassword() {
    showDialog(
      context: context,
      builder: (context) => const _ChangePasswordDialog(),
    );
  }

    return Scaffold(
      appBar: AppBar(
        title: const Text('Minha Conta', style: TextStyle(fontWeight: FontWeight.bold)),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(24),
        child: Column(
          children: [
            CircleAvatar(
              radius: 40,
              backgroundColor: colors.primary.withOpacity(0.1),
              child: Text(
                user != null ? user['name'].toString().substring(0, 1).toUpperCase() : 'C',
                style: TextStyle(fontSize: 32, fontWeight: FontWeight.bold, color: colors.primary),
              ),
            ),
            const SizedBox(height: 16),
            Text(user?['name'] ?? 'Cliente Plus', style: const TextStyle(fontSize: 22, fontWeight: FontWeight.w900)),
            Text(user?['email'] ?? 'Sem email', style: TextStyle(color: Colors.grey.shade600)),
            const SizedBox(height: 32),

            const SizedBox(height: 24),
            _buildSectionTitle('Documentos e Contratos'),
            _MenuTile(
              icon: LucideIcons.fileText,
              title: 'Meus Contratos e Equipamentos',
              onTap: () => context.push('/contracts'),
            ),

            const SizedBox(height: 24),
            _buildSectionTitle('Segurança'),
            _MenuTile(icon: LucideIcons.key, title: 'Trocar Senha', onTap: _changePassword),
            SwitchListTile(
              contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
              tileColor: Colors.white,
              title: const Text('Acesso com Biometria', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
              subtitle: Text('Face ID / Impressão Digital', style: TextStyle(color: Colors.grey.shade500, fontSize: 12)),
              secondary: Icon(LucideIcons.fingerprint, color: colors.primary),
              value: _biometricsEnabled,
              activeColor: colors.primary,
              onChanged: (val) => setState(() => _biometricsEnabled = val),
            ),
            
            const SizedBox(height: 48),
            SizedBox(
              width: double.infinity,
              height: 56,
              child: OutlinedButton.icon(
                onPressed: () {
                  ref.read(authProvider.notifier).logout();
                  context.go('/login');
                },
                style: OutlinedButton.styleFrom(
                  foregroundColor: Colors.red.shade700,
                  side: BorderSide(color: Colors.red.shade200),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                ),
                icon: const Icon(LucideIcons.logOut, size: 20),
                label: const Text('Sair do Aplicativo', style: TextStyle(fontWeight: FontWeight.bold)),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildSectionTitle(String title) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 12, left: 4),
      child: Align(
        alignment: Alignment.centerLeft,
        child: Text(title, style: TextStyle(color: Colors.grey.shade500, fontWeight: FontWeight.bold, fontSize: 13, letterSpacing: 1)),
      ),
    );
  }
}

class _MenuTile extends StatelessWidget {
  final IconData icon;
  final String title;
  final VoidCallback onTap;

  const _MenuTile({required this.icon, required this.title, required this.onTap});

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: Colors.grey.shade200),
      ),
      child: ListTile(
        onTap: onTap,
        leading: Icon(icon, color: Theme.of(context).colorScheme.primary),
        title: Text(title, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
        trailing: const Icon(LucideIcons.chevronRight, size: 16, color: Colors.grey),
      ),
    );
  }
}

class _ChangePasswordDialog extends ConsumerStatefulWidget {
  const _ChangePasswordDialog();

  @override
  ConsumerState<_ChangePasswordDialog> createState() => _ChangePasswordDialogState();
}

class _ChangePasswordDialogState extends ConsumerState<_ChangePasswordDialog> {
  final _oldPassCtrl = TextEditingController();
  final _newPassCtrl = TextEditingController();
  bool _isLoading = false;

  void _submit() async {
    final oldPass = _oldPassCtrl.text;
    final newPass = _newPassCtrl.text;
    if (oldPass.isEmpty || newPass.isEmpty) return;

    setState(() => _isLoading = true);
    try {
      await ref.read(apiProvider).patch('/auth/password', data: {
        'currentPassword': oldPass,
        'newPassword': newPass
      });
      if (!mounted) return;
      Navigator.pop(context);
      ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Senha alterada com sucesso!'), backgroundColor: Colors.green));
    } catch (e) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Erro ao trocar senha: $e'), backgroundColor: Colors.red));
    } finally {
      setState(() => _isLoading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return AlertDialog(
      backgroundColor: Colors.white,
      title: const Text('Trocar Senha', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
      content: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          TextField(controller: _oldPassCtrl, obscureText: true, decoration: const InputDecoration(labelText: 'Senha Atual')),
          const SizedBox(height: 16),
          TextField(controller: _newPassCtrl, obscureText: true, decoration: const InputDecoration(labelText: 'Nova Senha')),
        ],
      ),
      actions: [
        TextButton(onPressed: () => Navigator.pop(context), child: const Text('Cancelar', style: TextStyle(color: Colors.grey))),
        ElevatedButton(
          onPressed: _isLoading ? null : _submit,
          style: ElevatedButton.styleFrom(backgroundColor: Theme.of(context).colorScheme.primary, foregroundColor: Colors.white),
          child: _isLoading ? const SizedBox(width: 16, height: 16, child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2)) : const Text('Salvar'),
        ),
      ],
    );
  }
}
