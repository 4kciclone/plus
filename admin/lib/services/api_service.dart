import 'package:dio/dio.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

class ApiService {
  final Dio _dio = Dio(BaseOptions(
    baseUrl: 'https://plus-sqxw.onrender.com/employee',
    connectTimeout: const Duration(seconds: 15),
    receiveTimeout: const Duration(seconds: 15),
  ));

  String? _token;

  ApiService() {
    _dio.interceptors.add(InterceptorsWrapper(
      onRequest: (options, handler) {
        if (_token != null) {
          options.headers['Authorization'] = 'Bearer $_token';
        }
        return handler.next(options);
      },
    ));
  }

  Future<void> loginAdmin() async {
    if (_token != null) return;
    try {
      final res = await _dio.post('/login', data: {
        'email': 'admin@plusinternet.com.br',
        'password': 'admin123',
      });
      _token = res.data['token'];
    } catch (e) {
      print('Erro no login silencioso do Admin NOC: $e');
    }
  }

  Future<List<dynamic>> getCrmClients() async {
    await loginAdmin();
    final res = await _dio.get('/crm');
    return res.data as List<dynamic>;
  }

  Future<List<dynamic>> getTickets() async {
    await loginAdmin();
    final res = await _dio.get('/tickets');
    return res.data as List<dynamic>;
  }

  Future<List<dynamic>> getInvoices() async {
    await loginAdmin();
    final res = await _dio.get('/finance');
    return res.data as List<dynamic>;
  }

  Future<void> updateSubscriptionStatus(String id, String status) async {
    await loginAdmin();
    await _dio.put('/subscriptions/$id', data: {
      'status': status,
      'installationDate': DateTime.now().toIso8601String(),
    });
  }

  Future<void> sendInstallationOptions(String id, List<String> slots, {String? techId, String? techName}) async {
    await loginAdmin();
    final data = <String, dynamic>{'installationOptions': slots};
    if (techId != null) data['assignedTechId'] = techId;
    if (techName != null) data['assignedTechName'] = techName;
    await _dio.put('/subscriptions/$id', data: data);
  }

  Future<List<dynamic>> getEmployees() async {
    await loginAdmin();
    final res = await _dio.get('/employees');
    return res.data as List<dynamic>;
  }

  Future<void> createEmployee(String name, String email, String password, String role) async {
    await loginAdmin();
    await _dio.post('/employees', data: {
      'name': name, 'email': email, 'password': password, 'role': role,
    });
  }
}

final apiServiceProvider = Provider<ApiService>((ref) => ApiService());

// Future providers to make UI binding trivial
final crmProvider = FutureProvider<List<dynamic>>((ref) async {
  final api = ref.watch(apiServiceProvider);
  return await api.getCrmClients();
});

final ticketsProvider = FutureProvider<List<dynamic>>((ref) async {
  final api = ref.watch(apiServiceProvider);
  return await api.getTickets();
});

final financeProvider = FutureProvider<List<dynamic>>((ref) async {
  final api = ref.watch(apiServiceProvider);
  return await api.getInvoices();
});

final employeesProvider = FutureProvider<List<dynamic>>((ref) async {
  final api = ref.watch(apiServiceProvider);
  return await api.getEmployees();
});
