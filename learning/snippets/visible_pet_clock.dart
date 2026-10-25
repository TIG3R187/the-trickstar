import 'dart:async';
import 'package:flutter/widgets.dart';

class VisiblePetClock {
  VisiblePetClock({required this.onTick}) {
    _listener = AppLifecycleListener(onStateChange: (_) => _restart());
  }

  final VoidCallback onTick;
  late final AppLifecycleListener _listener;
  Timer? _timer;
  bool _enabled = false;

  void start() {
    _enabled = true;
    _restart();
  }

  void stop() {
    _enabled = false;
    _timer?.cancel();
    _timer = null;
  }

  void _restart() {
    _timer?.cancel();
    _timer = null;
    if (!_enabled ||
        WidgetsBinding.instance.lifecycleState != AppLifecycleState.resumed) {
      return;
    }
    _timer = Timer.periodic(const Duration(seconds: 30), (_) => onTick());
  }

  void dispose() {
    stop();
    _listener.dispose();
  }
}
