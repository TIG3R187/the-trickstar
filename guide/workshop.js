/* Beginner walkthrough, shared by Markdown and the interactive guide. */
(() => {
  const c = globalThis.POCKET_PAL;
  const dollar = '$';
  c.beginner = {
    title: 'Quadri: fix the workspace, then build one small thing',
    diagnosis: 'The supplied screenshots show errors in learning/snippets/adoption_screen.dart. That directory contains reference examples outside the Flutter package. The Flutter app is in flutter_application_1/. Fix the first unresolved Flutter import in the correct project context before treating the later class errors as separate bugs. These screenshots do not establish whether there are additional errors inside the app.',
    recovery: [
      'Keep the existing flutter_application_1 folder and your work. In VS Code choose File → Open Folder and select the folder named flutter_application_1 inside the-trickstar. Do not create another app or rename the existing folder.',
      'In Explorer, you should now see pubspec.yaml and lib/ directly under the open folder. Open lib/main.dart. Keep the assignment HTML or START_HERE.md in a separate window for reading.',
      'Choose Terminal → New Terminal. Run Get-Location and Get-ChildItem pubspec.yaml. The terminal must be inside flutter_application_1. If the file is not found, stop and open the correct folder.',
      'Run flutter pub get and wait for it to finish. If flutter is not recognized, install/configure the Flutter SDK and reopen VS Code. Flutter by Dart Code must also be installed. Do not add package:flutter/material.dart as a separate dependency.',
      'Use Ctrl+Shift+P → Dart: Restart Analysis Server. If that command is unavailable, install the Flutter extension, reopen this Flutter folder and run Flutter: Run Flutter Doctor.',
      'Run flutter analyze from this folder. Read the first error that points into your own lib/ or test/. Errors still listed for learning/snippets mean the guide root is still open in another workspace/window.',
      'Run flutter devices. If Chrome is listed, run flutter run -d chrome --web-port 7357. If Chrome is unavailable, run flutter run -d web-server --web-port 7357 and open the printed address in a browser.',
      'Only copy an example when its mission asks for it, and paste it into the destination under lib/. Reference files now end in .dart.txt. They are text to read; their original imports resolve only after copying them into the Flutter project.'
    ],
    commands: 'Get-Location\nGet-ChildItem pubspec.yaml\nflutter pub get\nflutter analyze\nflutter devices\nflutter run -d chrome --web-port 7357',
    pathNote: 'Throughout the longer assignment, app/ means your actual Flutter project folder. For Quadri’s existing project, substitute flutter_application_1/ wherever a path says app/. A folder name and the package name are different: read name: in pubspec.yaml. For example, package:pocket_pal/models/pet.dart becomes package:flutter_application_1/models/pet.dart only if the package name is flutter_application_1. Keep package:flutter/material.dart unchanged.',
    gitNote: 'The 130 staged files in Source Control are Git changes awaiting a commit; that count does not cause a Flutter import error. Creating a Flutter project with several platforms produces many files. Review them normally without deleting the project or making a second copy.',
    checkpoints: [
      ['1. Run and feed', 'First run the existing generated app unchanged. Once it runs, back up lib/main.dart or commit it, then try the single-file exercise below. See hunger 30, press Feed and see 10, press again and see 0. Today’s work can stop here.'],
      ['2. Add care actions', 'In the same file, add happiness 70 and energy 70. Implement Play (+15 happiness, −10 energy, +5 hunger), then Sleep/Wake. Start with the action rules; leave timer and saving for later.'],
      ['3. Add adoption and tidy up', 'Add a validated pet name and two styles. Only after this journey works, extract the Pet model and reusable widgets using the longer missions. Keep one working project throughout.'],
      ['4. Add persistence and timing', 'Once Quadri can explain his button handlers and setState, add saving, then a single visible-time timer. Test and deploy last. The full assignment remains the final target; agree each checkpoint with the mentor before moving on.']
    ],
    starter: `import 'package:flutter/material.dart';

void main() => runApp(const MaterialApp(home: FirstPetScreen()));

class FirstPetScreen extends StatefulWidget {
  const FirstPetScreen({super.key});

  @override
  State<FirstPetScreen> createState() => _FirstPetScreenState();
}

class _FirstPetScreenState extends State<FirstPetScreen> {
  int _hunger = 30;

  void _feed() {
    setState(() {
      _hunger = (_hunger - 20).clamp(0, 100).toInt();
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Quadri’s first Pocket Pal')),
      body: Center(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            const Text('🌱', style: TextStyle(fontSize: 72)),
            const Text('Sprout'),
            Text('Hunger: ${dollar}_hunger / 100'),
            const Text('Lower hunger means a fuller pet.'),
            const SizedBox(height: 16),
            FilledButton(
              onPressed: _hunger == 0 ? null : _feed,
              child: const Text('Feed'),
            ),
            if (_hunger == 0) const Text('Sprout is full.'),
          ],
        ),
      ),
    );
  }
}`,
    starterNote: 'Complete file for checkpoint 1 only: replace lib/main.dart after backing up your existing file. No extra packages, assets or other Dart files are needed. Run it, then explain what setState and clamp do. Return to your existing main.dart if you are already further along; this exercise is not a reason to overwrite working features.',
    help: 'If package:flutter/material.dart still cannot resolve inside flutter_application_1/lib/main.dart after pub get succeeds, send the first flutter analyze error plus flutter doctor -v output, pubspec.yaml and the current terminal path. The screenshots alone cannot distinguish a missing SDK from another project configuration problem.'
  };
  c.workbench = {
    title: 'Quadri’s VS Code workbench',
    intro: 'Start with START_HERE.md and its small checkpoints before using this reference. Paths below use app/ as the Flutter project folder. If your existing folder is flutter_application_1/, use it instead and do not create another project. Open that folder itself in VS Code so pubspec.yaml and lib/ are at the top of Explorer.',
    steps: [
      'Open VS Code. Choose File → Open Folder and select the extracted or cloned assignment folder containing assignment.md. Use View → Explorer to see the files.',
      'Press Ctrl+Shift+X. Install Flutter by Dart Code; its Dart dependency is installed with it. Install the Flutter SDK using the official instructions if the flutter command is unavailable, then restart VS Code.',
      'Choose Terminal → New Terminal. On Windows, use the terminal dropdown to select PowerShell. Run Get-Location and Get-ChildItem; confirm you are at the assignment root before creating app/.',
      'Run the mission 01 setup commands only if you do not have a Flutter project yet. If flutter_application_1/pubspec.yaml or app/pubspec.yaml already exists, keep that project, open its folder directly, and run flutter pub get there.',
      'After creation, choose File → Open Folder → app. This is your Flutter workspace. Open a fresh terminal: Get-Location should end in app, and Get-ChildItem pubspec.yaml should find the file.',
      'Use Explorer → New Folder / New File to create the exact paths in each mission. Right-click lib to create models, screens, widgets and services. Save files with Ctrl+S.',
      'Click the device name in the VS Code status bar and select Chrome. Press F5 to debug. If Chrome is unavailable, use flutter run -d web-server --web-port 7357 and open the printed address.',
      'Use the Hot Reload button after a widget edit. Use Flutter: Hot Restart from Ctrl+Shift+P after changing initial values, initState or main. Use View → Problems for analyzer errors and Debug Console for runtime errors.',
      'Keep one run session open. Use a second terminal for flutter analyze and flutter test. Stop the run session with the red Stop button, or Ctrl+C in the terminal that launched flutter run.',
      'At the end of each mission, run the stated checkpoint and make a meaningful Git commit. Use Source Control (Ctrl+Shift+G) to review the changed files before committing.'
    ],
    folderTree: 'app/\n├── .vscode/launch.json\n├── assets/images/pocket-pal-icon.png\n├── lib/\n│   ├── main.dart\n│   ├── models/pet.dart\n│   ├── screens/adoption_screen.dart\n│   ├── screens/game_screen.dart\n│   ├── services/pet_storage.dart\n│   ├── services/visible_pet_clock.dart\n│   └── widgets/pet_stat.dart\n├── test/pet_test.dart\n├── pubspec.yaml\n├── README.md\n└── TESTING.md',
    workflow: 'GameScreen is the single owner of the current Pet. AdoptionScreen sends a name and style to its parent. PetStat displays values and does not own a second copy. PetStorage saves snapshots. VisiblePetClock asks GameScreen to apply a tick; it never owns the pet.',
    snippetNote: 'Code blocks labelled Complete file can be copied into the named file. Member fragments belong inside the stated class, not below its closing brace. Imports go at the top. Widget fragments replace part of a build method. Reference helpers in learning/snippets/ end in .dart.txt so VS Code does not analyze them as source files. Copy their contents into the stated destination inside your Flutter project. Do not run the reference folder. Start with the one-file checkpoint before these longer helpers.'
  };
  c.codebaseFiles = [
    ['app/lib/main.dart', 'Starts MaterialApp. Begin with the mission 01 screen, then set home to GameScreen after creating it.'],
    ['app/lib/models/pet.dart', 'Pet fields, initial values, feed, mood priority, copyWith and validated JSON conversion.'],
    ['app/lib/screens/adoption_screen.dart', 'Name form, two style choices and onAdopt callback.'],
    ['app/lib/screens/game_screen.dart', 'One stateful parent: load, adopt, update, save, start/stop the clock and confirm reset. You implement this screen.'],
    ['app/lib/widgets/pet_stat.dart', 'A reusable, labelled stat indicator.'],
    ['app/lib/services/pet_storage.dart', 'Read, save and delete one pet key; queue writes to preserve order.'],
    ['app/lib/services/visible_pet_clock.dart', 'One 30-second timer that pauses when the app is not resumed.'],
    ['app/test/pet_test.dart', 'Boundary and mood tests; add a widget journey test separately.'],
    ['app/TESTING.md', 'Record test command output and manual checks with actual results.']
  ];
  c.commonQuestions = [
    ['Which folder should I edit?', 'Use the existing flutter_application_1/ folder shown in the screenshots. Open that folder itself in VS Code. app/ in this guide is a placeholder for your actual Flutter project folder. Edit lib/main.dart there and run Flutter commands beside its pubspec.yaml.'],
    ['flutter is not recognized', 'Install the Flutter SDK, add its bin directory to PATH using the official instructions, close all VS Code windows and reopen. Run flutter --version and flutter doctor in a new terminal.'],
    ['No pubspec.yaml file found', 'Run Get-Location and Get-ChildItem. If you are at the assignment root, run cd app. If your VS Code folder is already app/, do not run cd app again.'],
    ['What do I build first?', 'Run the mission 01 title screen. Build the adoption form next. Add the model and parent dashboard before wiring storage or the timer. Run again after each small change.'],
    ['A snippet has red underlines', 'If the path is learning/snippets/, you are looking at a reference outside the Flutter project; open the actual app folder and copy only the required snippet to its destination. New references end in .dart.txt. If an error is in your app/lib/, run flutter pub get and read the first flutter analyze error.'],
    ['The generated widget test mentions MyApp', 'When you replace main.dart with PocketPalApp, update the generated test accordingly or replace that counter test with meaningful tests for your game. Do not leave a stale MyApp test failing.'],
    ['My pet resets on refresh', 'Use the same browser, hostname and port while testing. Run flutter run -d chrome --web-port 7357. Private browsing, clearing site data or changing the port changes/removes the available browser storage. Then check that you await load before showing the dashboard.'],
    ['Hot reload did not change the starting values', 'Hot reload preserves state. Use Hot Restart to rerun main/initState. A saved pet will still load its saved values; use your confirmed New pet action to create a fresh pet.'],
    ['My image is missing', 'Copy the PNG into app/assets/images/, add assets/images/ under the existing flutter section of pubspec.yaml, keep two-space YAML indentation, run flutter pub get and restart. Do not create a second flutter section.'],
    ['The page overflows', 'Read the overflow message, check the narrow viewport, constrain the content width and allow vertical scrolling. Avoid fixed screen heights and wide Rows that cannot wrap.'],
    ['My timer speeds up after returning to the tab', 'Never create a timer in build. Cancel the old timer before starting another, listen to app lifecycle and dispose the clock. Adopt only once and start after loading.'],
    ['Saving fails or saved JSON is invalid', 'Show an error and keep a recovery screen with a confirmed reset. Do not silently replace a damaged save with a brand-new pet. Keep storage exceptions visible during debugging.'],
    ['Should I install Riverpod, Firebase Auth or a backend?', 'Use setState and local storage for the required version. Extra architecture or accounts are not required. Firebase Hosting is only the suggested way to publish your finished web build.'],
    ['Firebase shows its welcome page', 'From app/, run flutter build web --release. Verify firebase.json has hosting.public set to build/web, then deploy again. Answer No if initialization asks to overwrite the generated index.html.'],
    ['When should I ask my mentor?', 'Try the checkpoint, read the first error, check the relevant FAQ and make one focused attempt. If still stuck after about 20 minutes, ask with the file path, command, exact error, expected result and what you tried. Ask sooner if the instructions conflict or you are unsure about a requirement.']
  ];
  c.helpTemplate = 'Mission / file:\nCommand I ran:\nWhat I expected:\nWhat happened (exact error):\nWhat I already tried:\nRelevant small code block or screenshot:';

  const byId = id => c.missions.find(m => m.id === id);
  const add = (id, extra) => Object.assign(byId(id), extra);
  add('setup', {
    code: 'Get-Location\nGet-ChildItem\nflutter doctor\nflutter devices\nflutter create --project-name pocket_pal --platforms=web app\ncd app\nflutter run -d chrome --web-port 7357',
    editor: ['Existing project: open flutter_application_1/ (or your existing app folder) directly and run flutter pub get. Skip the create command below. New project only: run flutter create from the assignment root, then open app/.', 'Run the existing app once before changing files. Work through START_HERE.md checkpoint 1 if the full assignment feels too large. In the longer route, replace lib/main.dart with the mission file below after backing it up.', 'Create .vscode/launch.json inside the actual Flutter folder. Select Pocket Pal (Chrome) in Run and Debug and press F5. Stop any terminal-launched run first.'],
    files: ['app/lib/main.dart', 'app/.vscode/launch.json'],
    snippets: [
      { id: 'first-screen', title: 'Your first runnable screen', file: 'app/lib/main.dart', placement: 'Complete file. Replace the generated main.dart for this mission.', language: 'dart', filename: 'first_screen.dart', code: `import 'package:flutter/material.dart';

void main() => runApp(const PocketPalApp());

class PocketPalApp extends StatelessWidget {
  const PocketPalApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      title: 'Pocket Pal',
      theme: ThemeData(colorSchemeSeed: Colors.green),
      home: const Scaffold(
        body: Center(child: Text('Hello Quadri. Let’s build Pocket Pal!')),
      ),
    );
  }
}`, explain: 'Checkpoint: the browser displays the greeting. Later, import screens/game_screen.dart and replace home with const GameScreen() after that widget exists.' },
      { id: 'debug-config', title: 'Run the same browser origin every time', file: 'app/.vscode/launch.json', placement: 'Complete JSON file. This assumes app/ is the open VS Code folder.', language: 'json', filename: 'launch.json', code: `{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Pocket Pal (Chrome)",
      "request": "launch",
      "type": "dart",
      "program": "lib/main.dart",
      "deviceId": "chrome",
      "args": ["--web-port", "7357"]
    }
  ]
}`, explain: 'Use this launch configuration or the terminal command, not both at the same time. Keeping port 7357 makes refresh/storage checks easier.' }
    ]
  });
  add('plan', {
    editor: ['With app/ open, right-click lib in Explorer and create models, screens, services and widgets. Create assets/images under app/.', 'Sketch adoption and dashboard. Write a short plan in app/README.md: screens, file responsibilities and the rule priority.', 'Copy the supplied PNG and declare it in the existing flutter section of pubspec.yaml. Do not add another flutter section.'],
    files: ['app/README.md', 'app/assets/images/pocket-pal-icon.png', 'app/pubspec.yaml'],
    snippets: [
      { id: 'folders', title: 'Create the working folders', file: 'Terminal inside app/', placement: 'PowerShell commands. Existing directories are preserved.', language: 'powershell', code: `New-Item -ItemType Directory -Force lib/models,lib/screens,lib/services,lib/widgets,assets/images
Copy-Item ../assets/pocket-pal-icon.png assets/images/pocket-pal-icon.png
flutter pub get`, explain: 'Use Explorer instead if you prefer. Keep test/ from the generated project. Create each Dart file when its mission introduces it.' },
      { id: 'asset-config', title: 'Register the mascot image', file: 'app/pubspec.yaml', placement: 'Edit the existing flutter block; this is a YAML fragment.', language: 'yaml', code: `flutter:
  uses-material-design: true
  assets:
    - assets/images/`, explain: 'After saving, run flutter pub get from app/. Display it with Image.asset(\'assets/images/pocket-pal-icon.png\'). Create the second visual style yourself.' }
    ]
  });
  add('adopt', {
    editor: ['Create lib/screens/adoption_screen.dart and copy the complete widget below. It has no dependency on the Pet model yet.', 'To try it now, import screens/adoption_screen.dart in main.dart and temporarily use AdoptionScreen(onAdopt: (name, style) async { debugPrint(name + ": " + style); }) as home.', 'In the next mission, replace that temporary callback with the GameScreen parent’s adoption method. Keep the form UI in this file.'],
    files: ['app/lib/screens/adoption_screen.dart', 'app/lib/main.dart'],
    snippets: [{ id: 'adoption-form', title: 'A form with two choices and a parent callback', file: 'app/lib/screens/adoption_screen.dart', placement: 'Complete file. The parent decides what to do after adoption.', language: 'dart', filename: 'adoption_screen.dart', code: `import 'package:flutter/material.dart';

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
}`, explain: 'Try empty input, one character, 17 characters and a valid name. The chip labels are a starting point; add a visible pet preview for each style. When storage is introduced, the parent must catch errors and show feedback.' }]
  });

  add('model', {
    editor: ['Create lib/models/pet.dart using the complete helper below. Read the defaults, copyWith, mood getter and JSON methods before using them.', 'Create a StatefulWidget named GameScreen in lib/screens/game_screen.dart. Its State owns Pet? _pet. Import material.dart, ../models/pet.dart and adoption_screen.dart.', 'Create Future<void> _adopt(String name, String style) async { setState(() => _pet = Pet(name: name, style: style)); }. For now, when _pet is null return AdoptionScreen(onAdopt: _adopt) from build; otherwise return your dashboard Scaffold.', 'Import screens/game_screen.dart in main.dart and change MaterialApp.home to const GameScreen(). Add saving and startup loading in mission 07.'],
    files: ['app/lib/models/pet.dart', 'app/lib/screens/game_screen.dart', 'app/lib/main.dart'],
    snippets: [{ id: 'pet-model', title: 'One model, one source of truth', file: 'app/lib/models/pet.dart', placement: 'Complete file. Feed is demonstrated; build Play using copyWith in mission 05.', language: 'dart', filename: 'pet.dart', code: `class Pet {
  const Pet({
    required this.name,
    required this.style,
    this.hunger = 30,
    this.happiness = 70,
    this.energy = 70,
    this.isSleeping = false,
  });

  final String name;
  final String style;
  final int hunger;
  final int happiness;
  final int energy;
  final bool isSleeping;

  static int clampStat(int value) => value.clamp(0, 100).toInt();

  Pet copyWith({int? hunger, int? happiness, int? energy, bool? isSleeping}) {
    return Pet(
      name: name,
      style: style,
      hunger: clampStat(hunger ?? this.hunger),
      happiness: clampStat(happiness ?? this.happiness),
      energy: clampStat(energy ?? this.energy),
      isSleeping: isSleeping ?? this.isSleeping,
    );
  }

  Pet feed() => isSleeping ? this : copyWith(hunger: hunger - 20);

  String get mood {
    if (isSleeping) return 'sleeping';
    if (hunger >= 70) return 'hungry';
    if (energy <= 20) return 'tired';
    if (happiness <= 30) return 'sad';
    return 'happy';
  }

  Map<String, Object> toJson() => {
    'version': 1,
    'name': name,
    'style': style,
    'hunger': hunger,
    'happiness': happiness,
    'energy': energy,
    'isSleeping': isSleeping,
  };

  factory Pet.fromJson(Map<String, dynamic> json) {
    final name = json['name'];
    final style = json['style'];
    final sleeping = json['isSleeping'];
    if (json['version'] != 1 ||
        name is! String ||
        name.trim() != name || name.length < 2 || name.length > 16 ||
        (style != 'mint' && style != 'mango') || sleeping is! bool) {
      throw const FormatException('Invalid or unsupported pet save.');
    }
    int readStat(String key) {
      final value = json[key];
      if (value is! int || value < 0 || value > 100) {
        throw FormatException('Invalid stat: ${dollar}key');
      }
      return value;
    }
    return Pet(
      name: name,
      style: style as String,
      hunger: readStat('hunger'),
      happiness: readStat('happiness'),
      energy: readStat('energy'),
      isSleeping: sleeping,
    );
  }
}`, explain: 'Use copyWith for stat changes so clamping happens in one place. toJson/fromJson are ready for mission 07. Do not store a separate mood string; derive it from the current pet.' },
      { id: 'game-shell', title: 'Start the parent screen with a working adoption handoff', file: 'app/lib/screens/game_screen.dart', placement: 'Complete starter file for mission 04. Extend this same State class in later missions.', language: 'dart', filename: 'game_screen.dart', code: `import 'package:flutter/material.dart';
import '../models/pet.dart';
import 'adoption_screen.dart';

class GameScreen extends StatefulWidget {
  const GameScreen({super.key});

  @override
  State<GameScreen> createState() => _GameScreenState();
}

class _GameScreenState extends State<GameScreen> {
  Pet? _pet;

  Future<void> _adopt(String name, String style) async {
    setState(() => _pet = Pet(name: name, style: style));
    // Mission 06: start the clock after adoption.
    // Mission 07: save first, handle errors, then show the new pet.
  }

  @override
  Widget build(BuildContext context) {
    if (_pet == null) return AdoptionScreen(onAdopt: _adopt);
    final pet = _pet!;
    return Scaffold(
      appBar: AppBar(title: Text(pet.name)),
      body: Padding(
        padding: const EdgeInsets.all(24),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('Style: ${dollar}{pet.style}'),
            Text('Mood: ${dollar}{pet.mood}'),
            Text('Hunger: ${dollar}{pet.hunger}'),
            Text('Happiness: ${dollar}{pet.happiness}'),
            Text('Energy: ${dollar}{pet.energy}'),
            // Mission 05: add the care controls here.
            // Mission 08: replace repeated stat text with PetStat.
          ],
        ),
      ),
    );
  }
}`, explain: 'After creating this file, import screens/game_screen.dart in main.dart and use home: const GameScreen(). This shell deliberately has no care controls, timer, storage or reset yet; add them in the next missions without creating a second State owner.' }
    ]
  });
  add('actions', {
    editor: ['In GameScreen State, add the _changePet method below. It updates the one current Pet and asks the storage helper to save a snapshot after mission 07.', 'Add Feed, Play and Sleep/Wake buttons. Use null for an unavailable onPressed callback, plus nearby text explaining why it is disabled.', 'Implement Play yourself with copyWith: happiness +15, energy −10, hunger +5. Guard against sleeping or energy below 10. Toggle isSleeping for Sleep/Wake and use pet.mood to select an expression.'],
    files: ['app/lib/screens/game_screen.dart', 'app/lib/models/pet.dart'],
    snippets: [
      { id: 'change-pet', title: 'Update parent state before rebuilding its widgets', file: 'app/lib/screens/game_screen.dart', placement: 'Member fragment inside State<GameScreen>. Requires Pet? _pet. Add the save call in mission 07.', language: 'dart', code: `void _changePet(Pet Function(Pet) change) {
  final current = _pet;
  if (current == null) return;
  final next = change(current);
  setState(() => _pet = next);
  // Mission 07: add _saveSnapshot(next); here.
}`, explain: 'The callback receives the newest pet. For Feed, call _changePet((pet) => pet.feed()). Keep state mutation outside build.' },
      { id: 'feed-button', title: 'Wire one button, then build the others', file: 'app/lib/screens/game_screen.dart', placement: 'Widget fragment inside your dashboard build. Define final pet = _pet! after the null/adoption branch.', language: 'dart', code: `FilledButton(
  onPressed: pet.isSleeping || pet.hunger == 0
      ? null
      : () => _changePet((current) => current.feed()),
  child: const Text('Feed'),
)
// Put the reason in a Text widget beside the controls:
// sleeping: 'Wake your pet before feeding.'
// hunger == 0: 'Your pet is full.'`, explain: 'For Play, guard both in the UI and in your rule method. Test Feed then Play from the initial state: 15 hunger, 85 happiness, 60 energy.' }
    ]
  });
  add('timer', {
    editor: ['Create lib/services/visible_pet_clock.dart with the complete helper. It owns the timer and lifecycle listener only.', 'In GameScreen State, import ../services/visible_pet_clock.dart. Add late final VisiblePetClock _clock; then create _clock = VisiblePetClock(onTick: _tickPet) in initState after super.initState().', 'Call _clock.start() after adoption and, in mission 07, after successful restore of an existing pet. Call _clock.stop() when returning to adoption. In dispose, call _clock.dispose() before super.dispose().', 'Add _tickPet from the fragment below. Do not create a clock or start a timer inside build.'],
    files: ['app/lib/services/visible_pet_clock.dart', 'app/lib/screens/game_screen.dart'],
    snippets: [
      { id: 'visible-clock', title: 'One clock that follows visible app time', file: 'app/lib/services/visible_pet_clock.dart', placement: 'Complete file. Call start only when a pet is ready.', language: 'dart', filename: 'visible_pet_clock.dart', code: `import 'dart:async';
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
}`, explain: 'When the app resumes, this starts a fresh 30 seconds. It does not calculate time away and it does not alter the sleeping flag.' },
      { id: 'tick-rule', title: 'Apply the correct tick to the current pet', file: 'app/lib/screens/game_screen.dart', placement: 'Member fragment inside State<GameScreen>. Requires _changePet from mission 05.', language: 'dart', code: `void _tickPet() {
  _changePet((pet) => pet.isSleeping
      ? pet.copyWith(hunger: pet.hunger + 2, energy: pet.energy + 10)
      : pet.copyWith(
          hunger: pet.hunger + 5,
          happiness: pet.happiness - 3,
          energy: pet.energy - 2,
        ));
}`, explain: 'Try awake and sleeping states separately. Keep the timer interval at 30 seconds for submission.' }
    ]
  });
  add('save', {
    editor: ['From the app/ terminal, run flutter pub add shared_preferences. Create lib/services/pet_storage.dart using the complete helper.', 'In GameScreen State, import ../services/pet_storage.dart and create final _storage = PetStorage();. Add _loading = true and String? _loadError. Start _restorePet from initState after creating the clock.', 'In build, show a loading spinner while _loading is true, a recovery screen when _loadError is set, AdoptionScreen when _pet is null, and the dashboard otherwise. Restore must finish before choosing the adoption/dashboard branch.', 'Add _saveSnapshot from the fragment below and call it at the end of _changePet. In _adopt, save the new Pet first; on success set _pet and start the clock. On failure show feedback and stay on adoption.', 'Build New pet confirmation with showDialog<bool>. If the answer is not true, return. Stop the clock and disable controls while awaiting _storage.clear(); only on success set _pet = null and clear the recovery error. If clear fails, keep the pet/recovery screen and let the user retry.'],
    files: ['app/lib/services/pet_storage.dart', 'app/lib/screens/game_screen.dart', 'app/pubspec.yaml'],
    snippets: [
      { id: 'pet-storage', title: 'Save JSON snapshots in order', file: 'app/lib/services/pet_storage.dart', placement: 'Complete file. Requires mission 04 Pet model and shared_preferences.', language: 'dart', filename: 'pet_storage.dart', code: `import 'dart:convert';
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
}`, explain: 'save and clear use the same queue so an earlier pending save cannot recreate a pet after reset. The caller must catch operation errors. Only this game key is removed.' },
      { id: 'restore-save', title: 'Load once, save every changed snapshot', file: 'app/lib/screens/game_screen.dart', placement: 'Member fragments inside State<GameScreen>. Requires _storage, _loading, _loadError, _pet and _clock fields described above.', language: 'dart', code: `Future<void> _restorePet() async {
  try {
    final saved = await _storage.load();
    if (!mounted) return;
    setState(() {
      _pet = saved;
      _loading = false;
      _loadError = null;
    });
    if (saved != null) _clock.start();
  } catch (error) {
    if (!mounted) return;
    setState(() {
      _loading = false;
      _loadError = 'Could not load your pet. Retry or confirm a reset.';
    });
  }
}

Future<void> _saveSnapshot(Pet snapshot) async {
  try {
    await _storage.save(snapshot);
  } catch (error) {
    if (!mounted) return;
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text('Could not save. Your latest change may be lost on refresh.')),
    );
  }
}`, explain: 'Add _saveSnapshot(next) after setState in _changePet. This sample keeps changes visible when saving fails and warns the player. Add a Retry save control using the current _pet; do not pretend the failed write succeeded.' }
    ]
  });
  add('polish', {
    editor: ['Create lib/widgets/pet_stat.dart and replace duplicated stat markup in your dashboard with the complete widget below.', 'Use a centered ConstrainedBox(maxWidth: 600) and SingleChildScrollView for dashboard content. Keep controls at least 48 logical pixels tall.', 'In Chrome DevTools, toggle device emulation and test widths 375 and 1280. Tab through the controls and check the focus indicator.'],
    files: ['app/lib/widgets/pet_stat.dart', 'app/lib/screens/game_screen.dart'],
    snippets: [{ id: 'stat-widget', title: 'A reusable stat with a number and label', file: 'app/lib/widgets/pet_stat.dart', placement: 'Complete file. The parent passes the current value each rebuild.', language: 'dart', filename: 'pet_stat.dart', code: `import 'package:flutter/material.dart';

class PetStat extends StatelessWidget {
  const PetStat({super.key, required this.label, required this.value});
  final String label;
  final int value;

  @override
  Widget build(BuildContext context) {
    final bounded = value.clamp(0, 100).toInt();
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          Text('${dollar}label: ${dollar}bounded/100'),
          const SizedBox(height: 8),
          LinearProgressIndicator(
            value: bounded / 100,
            semanticsLabel: label,
            semanticsValue: bounded.toString(),
          ),
        ],
      ),
    );
  }
}`, explain: 'For example: PetStat(label: \'Hunger (lower is fuller)\', value: pet.hunger). Do not give this widget its own mutable hunger variable.' }]
  });
  add('verify', {
    editor: ['Create test/pet_test.dart and start with these model checks. Run flutter test test/pet_test.dart from the app/ terminal.', 'Add Play/tick boundary tests and a widget test that enters an invalid name, corrects it and adopts a pet. Update/remove the generated counter test if it no longer describes your app.', 'Run the three quality commands below. In TESTING.md, record command results and manual cases for refresh, pause/resume, reset cancellation, corrupt data and a failed save.'],
    files: ['app/test/pet_test.dart', 'app/test/widget_test.dart', 'app/TESTING.md'],
    snippets: [{ id: 'model-tests', title: 'Tests for boundaries and rule priority', file: 'app/test/pet_test.dart', placement: 'Complete initial test file. Add further tests for your implementation.', language: 'dart', filename: 'pet_test.dart', code: `import 'package:flutter_test/flutter_test.dart';
import 'package:pocket_pal/models/pet.dart';

void main() {
  test('feeding near zero clamps hunger', () {
    const pet = Pet(name: 'Sprout', style: 'mint', hunger: 10);
    expect(pet.feed().hunger, 0);
  });
  test('hungry has priority over tired', () {
    const pet = Pet(name: 'Sprout', style: 'mint', hunger: 80, energy: 10);
    expect(pet.mood, 'hungry');
  });
  test('saving and restoring preserves sleep state', () {
    const pet = Pet(name: 'Sprout', style: 'mango', isSleeping: true);
    final restored = Pet.fromJson(pet.toJson());
    expect(restored.style, 'mango');
    expect(restored.isSleeping, isTrue);
  });
  test('invalid saved numbers are rejected', () {
    final json = const Pet(name: 'Sprout', style: 'mint').toJson();
    json['energy'] = 999;
    expect(() => Pet.fromJson(json), throwsFormatException);
  });
}`, explain: 'The package import matches the pocket_pal name set in mission 01. If you reused a project with a different pubspec.yaml name, use that name in the import. These model tests do not replace your widget journey test.' }]
  });
  add('ship', {
    editor: ['Open the app/ terminal, stop the dev run and run formatting, analysis and tests before building release.', 'Create/select a Firebase project, install the CLI using its official guide, and initialise Hosting from app/. Use build/web as public directory, Yes for SPA, No for experimental framework integration and No to overwriting index.html.', 'Open the returned HTTPS address in a fresh browser session and do adoption, Feed/Play, sleep, refresh and reset. Put the real URL and results in app/README.md and TESTING.md.'],
    files: ['app/firebase.json', 'app/.firebaserc', 'app/README.md', 'app/TESTING.md'],
    snippets: [{ id: 'hosting-config', title: 'The expected static Hosting configuration', file: 'app/firebase.json', placement: 'Complete minimal Hosting example. Compare it with the file generated by firebase init hosting.', language: 'json', filename: 'firebase.json', code: `{
  "hosting": {
    "public": "build/web",
    "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
    "rewrites": [{"source": "**", "destination": "/index.html"}]
  }
}`, explain: 'Deploy with firebase deploy --only hosting after flutter build web --release. Publishing this assignment guide through GitHub Pages is separate from deploying your Flutter game.' }]
  });
  c.resources.push(['Flutter in VS Code', 'https://docs.flutter.dev/tools/vs-code']);
})();
