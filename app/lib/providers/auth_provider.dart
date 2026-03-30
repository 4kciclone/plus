import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import '../services/api_service.dart';

final authProvider = StateNotifierProvider<AuthNotifier, AuthState>((ref) {
  return AuthNotifier(ref);
});

class AuthState {
  final bool isLoading;
  final Map<String, dynamic>? user;
  final String? error;

  AuthState({this.isLoading = false, this.user, this.error});

  AuthState copyWith({bool? isLoading, Map<String, dynamic>? user, String? error}) {
    return AuthState(
      isLoading: isLoading ?? this.isLoading,
      user: user ?? this.user,
      error: error ?? this.error,
    );
  }
}

class AuthNotifier extends StateNotifier<AuthState> {
  final Ref ref;
  final _storage = const FlutterSecureStorage();

  AuthNotifier(this.ref) : super(AuthState()) {
    _checkLogin();
  }

  Future<void> _checkLogin() async {
    state = state.copyWith(isLoading: true);
    final token = await _storage.read(key: 'plus_token');
    
    if (token != null) {
      try {
        final res = await ref.read(apiProvider).get('/auth/me');
        state = state.copyWith(isLoading: false, user: res.data);
      } catch (e) {
        await _storage.delete(key: 'plus_token');
        state = state.copyWith(isLoading: false, user: null);
      }
    } else {
      state = state.copyWith(isLoading: false);
    }
  }

  Future<bool> login(String email, String password) async {
    state = state.copyWith(isLoading: true, error: null);
    try {
      final res = await ref.read(apiProvider).post(
        '/auth/login',
        data: {'email': email, 'password': password},
      );
      final token = res.data['token'];
      await _storage.write(key: 'plus_token', value: token);
      state = state.copyWith(isLoading: false, user: res.data['user']);
      return true;
    } catch (e) {
      String errorMessage = 'Falha de conexão. A API pode estar acordando (aguarde 50s).';
      if (e.toString().contains('401')) errorMessage = 'Senha ou e-mail inválidos.';
      else if (e.toString().contains('Timeout')) errorMessage = 'Servidor demorou muito para responder. Tente novamente.';
      else errorMessage = 'Erro: ${e.toString()}';
      
      state = state.copyWith(isLoading: false, error: errorMessage);
      return false;
    }
  }

  Future<void> logout() async {
    await _storage.delete(key: 'plus_token');
    state = state.copyWith(user: null);
  }
}
