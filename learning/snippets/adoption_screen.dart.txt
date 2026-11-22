import 'package:flutter/material.dart';

class AdoptionScreen extends StatefulWidget {
  const AdoptionScreen({super.key, required this.onAdopt});
  final Future<void> Function(String name, String style) onAdopt;

  @override
  State<AdoptionScreen> createState() => _AdoptionScreenState();
}

class _AdoptionScreenState extends State<AdoptionScreen> {
  final _formKey = GlobalKey<FormState>();
  final _name = TextEditingController();
  String _style = 'mint';
  bool _submitting = false;

  Future<void> _submit() async {
    if (_submitting || !_formKey.currentState!.validate()) return;
    setState(() => _submitting = true);
    try {
      await widget.onAdopt(_name.text.trim(), _style);
    } finally {
      if (mounted) setState(() => _submitting = false);
    }
  }

  @override
  void dispose() {
    _name.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Adopt a Pocket Pal')),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(24),
        child: Form(
          key: _formKey,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              TextFormField(
                controller: _name,
                decoration: const InputDecoration(labelText: 'Pet name'),
                validator: (value) {
                  final length = (value ?? '').trim().length;
                  return length < 2 || length > 16
                      ? 'Use a name with 2–16 characters.'
                      : null;
                },
              ),
              const SizedBox(height: 16),
              Wrap(
                spacing: 12,
                children: ['mint', 'mango'].map((style) {
                  return ChoiceChip(
                    label: Text(style),
                    selected: _style == style,
                    onSelected: _submitting
                        ? null
                        : (_) => setState(() => _style = style),
                  );
                }).toList(),
              ),
              const SizedBox(height: 24),
              FilledButton(
                onPressed: _submitting ? null : _submit,
                child: Text(_submitting ? 'Adopting…' : 'Adopt my pal'),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
