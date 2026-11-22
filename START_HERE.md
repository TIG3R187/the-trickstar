# Quadri: fix the workspace, then build one small thing

Read this first. Keep the longer [assignment](assignment.md) as a reference while you complete one checkpoint at a time.

## What the screenshots show

The supplied screenshots show errors in learning/snippets/adoption_screen.dart. That directory contains reference examples outside the Flutter package. The Flutter app is in flutter_application_1/. Fix the first unresolved Flutter import in the correct project context before treating the later class errors as separate bugs. These screenshots do not establish whether there are additional errors inside the app.

## Recover the existing project

1. Keep the existing flutter_application_1 folder and your work. In VS Code choose File → Open Folder and select the folder named flutter_application_1 inside the-trickstar. Do not create another app or rename the existing folder.
2. In Explorer, you should now see pubspec.yaml and lib/ directly under the open folder. Open lib/main.dart. Keep the assignment HTML or START_HERE.md in a separate window for reading.
3. Choose Terminal → New Terminal. Run Get-Location and Get-ChildItem pubspec.yaml. The terminal must be inside flutter_application_1. If the file is not found, stop and open the correct folder.
4. Run flutter pub get and wait for it to finish. If flutter is not recognized, install/configure the Flutter SDK and reopen VS Code. Flutter by Dart Code must also be installed. Do not add package:flutter/material.dart as a separate dependency.
5. Use Ctrl+Shift+P → Dart: Restart Analysis Server. If that command is unavailable, install the Flutter extension, reopen this Flutter folder and run Flutter: Run Flutter Doctor.
6. Run flutter analyze from this folder. Read the first error that points into your own lib/ or test/. Errors still listed for learning/snippets mean the guide root is still open in another workspace/window.
7. Run flutter devices. If Chrome is listed, run flutter run -d chrome --web-port 7357. If Chrome is unavailable, run flutter run -d web-server --web-port 7357 and open the printed address in a browser.
8. Only copy an example when its mission asks for it, and paste it into the destination under lib/. Reference files now end in .dart.txt. They are text to read; their original imports resolve only after copying them into the Flutter project.

Run these commands only after opening the actual Flutter folder:

```powershell
Get-Location
Get-ChildItem pubspec.yaml
flutter pub get
flutter analyze
flutter devices
flutter run -d chrome --web-port 7357
```

Throughout the longer assignment, app/ means your actual Flutter project folder. For Quadri’s existing project, substitute flutter_application_1/ wherever a path says app/. A folder name and the package name are different: read name: in pubspec.yaml. For example, package:pocket_pal/models/pet.dart becomes package:flutter_application_1/models/pet.dart only if the package name is flutter_application_1. Keep package:flutter/material.dart unchanged.

The 130 staged files in Source Control are Git changes awaiting a commit; that count does not cause a Flutter import error. Creating a Flutter project with several platforms produces many files. Review them normally without deleting the project or making a second copy.

## An easier build order

### 1. Run and feed

First run the existing generated app unchanged. Once it runs, back up lib/main.dart or commit it, then try the single-file exercise below. See hunger 30, press Feed and see 10, press again and see 0. Today’s work can stop here.

### 2. Add care actions

In the same file, add happiness 70 and energy 70. Implement Play (+15 happiness, −10 energy, +5 hunger), then Sleep/Wake. Start with the action rules; leave timer and saving for later.

### 3. Add adoption and tidy up

Add a validated pet name and two styles. Only after this journey works, extract the Pet model and reusable widgets using the longer missions. Keep one working project throughout.

### 4. Add persistence and timing

Once Quadri can explain his button handlers and setState, add saving, then a single visible-time timer. Test and deploy last. The full assignment remains the final target; agree each checkpoint with the mentor before moving on.

## Checkpoint 1: one file and one button

Complete file for checkpoint 1 only: replace lib/main.dart after backing up your existing file. No extra packages, assets or other Dart files are needed. Run it, then explain what setState and clamp do. Return to your existing main.dart if you are already further along; this exercise is not a reason to overwrite working features.

```dart
import 'package:flutter/material.dart';

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
            Text('Hunger: $_hunger / 100'),
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
}
```

Expected result: hunger goes 30 → 10 → 0. At zero, Feed is disabled and “Sprout is full.” appears. Do not add other features until you can reproduce this and explain the handler.

The original generated counter test refers to MyApp. If you use this exercise and run flutter test, update that test to pump MaterialApp(home: FirstPetScreen()) and check the Feed behaviour instead of the old counter. Do not use the later Pet model tests until you have created the Pet model.

## If it still fails

If package:flutter/material.dart still cannot resolve inside flutter_application_1/lib/main.dart after pub get succeeds, send the first flutter analyze error plus flutter doctor -v output, pubspec.yaml and the current terminal path. The screenshots alone cannot distinguish a missing SDK from another project configuration problem.

Official references: [Flutter in VS Code](https://docs.flutter.dev/tools/vs-code), [Dart import diagnostic](https://dart.dev/tools/diagnostics/uri_does_not_exist).
