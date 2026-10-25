import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';
import '../models/pet.dart';

class PetStorage {
  static const key = 'pocket_pal.pet.v1';
  final _preferences = SharedPreferencesAsync();
  Future<void> _tail = Future<void>.value();

  Future<void> _queue(Future<void> Function() operation) {
    final result = _tail.then((_) => operation());
    // A failed operation must not prevent later retries.
    _tail = result.then<void>((_) {}, onError: (Object _, StackTrace _) {});
    return result;
  }

  Future<void> save(Pet pet) {
    final snapshot = jsonEncode(pet.toJson());
    return _queue(() => _preferences.setString(key, snapshot));
  }

  Future<Pet?> load() async {
    await _tail;
    final raw = await _preferences.getString(key);
    if (raw == null) return null;
    final decoded = jsonDecode(raw);
    if (decoded is! Map<String, dynamic>) {
      throw const FormatException('Expected a saved pet object.');
    }
    return Pet.fromJson(decoded);
  }

  Future<void> clear() => _queue(() => _preferences.remove(key));
}
