/* Shared assignment content. npm run build regenerates both Markdown documents. */
globalThis.POCKET_PAL = {
  name: 'Pocket Pal',
  student: 'Quadri',
  goal: 'Build and deploy a small Flutter virtual pet game that you can explain, maintain and confidently demonstrate. Practise turning an idea into screens, Dart rules, saved state and a working release.',
  outcome: 'A visitor opens your live web link, adopts and names a pet, feeds it, plays with it, puts it to sleep, sees its mood change and returns after a refresh to find the same pet.',
  tools: 'Flutter stable, Dart, VS Code or Android Studio, Git, a supported web browser, and shared_preferences. Use setState first; another state management approach is optional if you can explain it.',
  scope: 'Required: Flutter web, two pet styles, adoption, a dashboard, care actions, a visible-time timer, mood feedback, local saving, responsive layouts and deployment. Optional: an Android APK, sound, accessories or a small animation. Accounts, a backend, purchases, notifications and offline time progression are outside this assignment.',
  rules: [
    ['Starting state', 'Hunger 30, happiness 70, energy 70; awake. All three are integers from 0 to 100. Higher hunger means hungrier; higher happiness and energy mean better. Clamp every change to this range.'],
    ['Feed', 'While awake: hunger −20. Happiness and energy stay unchanged. Disable Feed at hunger 0 and explain why.'],
    ['Play', 'While awake and energy ≥10: happiness +15, energy −10, hunger +5. Otherwise disable Play and explain why.'],
    ['Sleep / Wake', 'Sleep switches to sleeping; Wake switches to awake. Neither toggle instantly changes stats. Feed and Play are disabled while sleeping. A pet can always sleep, even at energy 0.'],
    ['Awake tick', 'After every 30 seconds of visible, active app time: hunger +5, happiness −3, energy −2.'],
    ['Sleeping tick', 'After every 30 seconds of visible, active app time: hunger +2, energy +10, happiness unchanged. Remain asleep at energy 100 until the user chooses Wake.'],
    ['Mood priority', 'Check in this order: sleeping → hungry (hunger ≥70) → tired (energy ≤20) → sad (happiness ≤30) → happy. Show a text label and a different expression or illustration.'],
    ['Pause and resume', 'Cancel the timer when the app is hidden, inactive or disposed. Start one fresh 30-second timer on resume. Do not calculate time away. Save the sleeping flag; a sleeping pet stays asleep after reload.'],
    ['Saving', 'Save name, style, hunger, happiness, energy and sleeping state after adoption, every successful action and each tick. Load before showing the dashboard. Use a versioned JSON object; missing data opens adoption. Invalid saved data shows a recovery message and offers a confirmed reset.'],
    ['Naming and reset', 'Offer at least two visually distinct styles. Trim names and accept 2–16 characters. Show an inline error for invalid names. A New pet action must ask for confirmation before deleting the existing pet and returning to adoption.']
  ],
  missions: [
    {
      id: 'setup', day: 'Day 1', title: 'Get your launchpad ready', skill: 'Setup & Git',
      what: 'Prepare a Flutter web project in app/ and make your first commit.',
      how: ['Install Flutter stable and your editor extensions. Run flutter doctor and address issues affecting your web target; Android tooling is only needed for the optional APK.', 'Run the commands below from this assignment folder. The HTML guide is your reference; the Dart game belongs in app/.', 'Replace the counter screen with a Pocket Pal title and run it in a supported browser. Initialise Git at the assignment root if needed and commit your starting point.'],
      code: 'flutter doctor\nflutter devices\nflutter create --platforms=web app\ncd app\nflutter run -d chrome',
      done: ['The Flutter app launches in a browser without runtime errors.', 'The repository contains an app/ folder and a meaningful first commit.'],
      hint: 'If Chrome is unavailable, use flutter run -d web-server and open its printed URL in your browser.'
    },
    {
      id: 'plan', day: 'Day 2', title: 'Sketch a tiny world', skill: 'Planning & layout',
      what: 'Plan adoption and home screens before adding game logic.',
      how: ['Sketch the two screens on paper or in any design tool. Mark the pet picker, name field, three stats and care buttons.', 'Choose two distinct pet styles, a readable palette and at least five mood expressions. Reuse the supplied generic icon or draw your own.', 'Write down the rule table in your own words. Decide where state will live and which widgets can be reused.'],
      code: null,
      done: ['You have two screen sketches and a small component list.', 'You can explain why a higher hunger number means the pet needs food.'],
      hint: 'Two colour variants count as two styles. You do not need custom animation or professional illustration.'
    },
    {
      id: 'adopt', day: 'Days 3–4', title: 'Meet your first pal', skill: 'Forms & navigation',
      what: 'Build adoption with a style picker and a validated name.',
      how: ['Create an adoption screen using a Form and a TextFormField. Trim the name and validate the 2–16 character rule.', 'Let the user select between two pet styles and show the selected state clearly.', 'On Adopt, create the starting pet state and open the dashboard. Do not allow repeated taps to create multiple pets.'],
      code: null,
      done: ['Blank, one-character and overlong names show clear errors.', 'Adopting with a valid name and style opens the correct pet dashboard.'],
      hint: 'Start with placeholder art. The important part is a working journey from selection to dashboard.'
    },
    {
      id: 'model', day: 'Day 5', title: 'Give your pal a brain', skill: 'Dart & state',
      what: 'Represent the pet as data and show its live statistics.',
      how: ['Create a Pet model with name, style, hunger, happiness, energy and isSleeping. Add JSON conversion when you reach the saving mission.', 'Keep pet state in one clear owner. Use setState to rebuild the screen when it changes. Avoid separate copies of each stat in different widgets.', 'Extract a reusable stat widget with a text value and progress bar. Label hunger clearly: 0 = full, 100 = very hungry.'],
      code: 'int clampStat(int value) => value.clamp(0, 100).toInt();',
      done: ['The dashboard displays the chosen name, style and all three starting values.', 'Stats have one source of truth and cannot leave the 0–100 range.'],
      hint: 'Keep numeric rules in Dart methods that can be tested without rendering the whole screen.'
    },
    {
      id: 'actions', day: 'Day 6', title: 'Feed. Play. Snooze.', skill: 'Events & feedback',
      what: 'Implement the three care actions and mood priority exactly as specified.',
      how: ['Add Feed, Play and Sleep/Wake methods. Apply each change from the rule table, clamp values and refresh the UI.', 'Disable unavailable actions with a visible explanation. Feed and Play must be unavailable while sleeping.', 'Derive mood from the current state in the specified priority order. Update both a text label and the pet expression.'],
      code: null,
      done: ['From the initial state, Feed then Play gives hunger 15, happiness 85 and energy 60.', 'Sleeping blocks Feed and Play, and Wake makes eligible actions available again.', 'A hungry and tired pet displays hungry because that condition has higher priority.'],
      hint: 'Mood is computed from the pet; saving a second mood value creates a chance for the two to disagree.'
    },
    {
      id: 'timer', day: 'Day 7', title: 'Make the world tick', skill: 'Timers & lifecycle',
      what: 'Update needs every 30 seconds while the game is visible.',
      how: ['Use one Timer.periodic with a 30-second interval and apply either the awake or sleeping tick.', 'Observe lifecycle changes, for example with AppLifecycleListener. Cancel on inactive/hidden/paused/detached; start one new timer on resumed. Dispose your listener and timer.', 'Use a temporary shorter interval while developing if helpful, but restore 30 seconds before submission. Do not change stats when returning from a hidden tab.'],
      code: null,
      done: ['One awake tick from the initial state gives hunger 35, happiness 67 and energy 68.', 'One sleeping tick from the initial state gives hunger 32, happiness 70 and energy 80.', 'Hiding and returning to the tab never creates duplicate timers or time-away changes.'],
      hint: 'Start the timer after the saved pet has loaded, never inside a widget build method.'
    },
    {
      id: 'save', day: 'Days 8–9', title: 'Remember your little friend', skill: 'JSON & persistence',
      what: 'Save locally, restore reliably and handle reset safely.',
      how: ['Run flutter pub add shared_preferences from app/. Follow the package documentation; SharedPreferencesAsync is suitable for a new implementation.', 'Encode one versioned JSON object and save it under a named key. Save after adoption, successful actions and ticks. Await writes in order so older state cannot overwrite newer state.', 'Show loading while reading. Validate decoded types, names, styles and stat ranges. Missing data opens adoption; corrupt or unsupported data shows a recovery message with a confirmed reset.', 'Add New pet with a confirmation dialog. Delete the saved pet only after confirmation, cancel its timer and return to adoption.'],
      code: 'cd app\nflutter pub add shared_preferences',
      done: ['Refreshing restores the name, style, stats and sleeping flag.', 'Canceling reset keeps the pet; confirming reset returns to adoption.', 'A failed save shows a message, and bad saved data cannot crash the app.'],
      hint: 'Browser storage belongs to the browser and origin. It will not sync across devices, and clearing site data removes it.'
    },
    {
      id: 'polish', day: 'Days 10–11', title: 'Make it feel finished', skill: 'Layout & accessibility',
      what: 'Make your screens readable, responsive and pleasant to use.',
      how: ['Try 375px and 1280px viewport widths. Use LayoutBuilder or sensible constraints to adapt the dashboard rather than stretching everything.', 'Use readable text, clear focus states and at least 48×48 logical-pixel care controls. Show text labels for stats and moods instead of relying only on colour.', 'Finish the loading, disabled and error states. Give each mood a recognisable expression, and use your keyboard to complete adoption and care actions.'],
      code: null,
      done: ['No layout overflow at either required width.', 'You can adopt and care for the pet with a keyboard, and every action has understandable feedback.'],
      hint: 'Do not spend the last two days adding optional features while the required journey is still broken.'
    },
    {
      id: 'verify', day: 'Day 12', title: 'Try to break it, kindly', skill: 'Testing & debugging',
      what: 'Check the rules and edge cases, then record evidence that they work.',
      how: ['Add at least three meaningful automated tests: stat clamping/action math, mood priority, and one user journey such as invalid adoption followed by successful adoption.', 'Manually verify pause/resume, reload, disabled actions, reset cancel/confirm and invalid saved data. Record outcomes in app/TESTING.md.', 'Run the checks below from app/. Fix failures, review warnings and explain any remaining limitation. Recheck any feature you change after a failed test.'],
      code: 'dart format lib test\nflutter analyze\nflutter test',
      done: ['Formatting, analysis and automated tests pass.', 'TESTING.md records actual manual check results, and the browser has no runtime errors.'],
      hint: 'A boundary test should prove behaviour, such as feeding at hunger 10 yielding 0 rather than −10.'
    },
    {
      id: 'ship', day: 'Days 13–14', title: 'Put your pal on the internet', skill: 'Deployment & handoff',
      what: 'Deploy the Flutter game and explain what you built.',
      how: ['Create a Firebase project and install the Firebase CLI following the official guide. Log in, build the app, then initialise classic Firebase Hosting from app/.', 'Select your Firebase project. Set the public directory to build/web, choose Yes for single-page app, No for automatic GitHub builds unless you intend to configure them, and No if asked to overwrite index.html. Do not enable the experimental web-framework integration.', 'Deploy only Hosting using the commands below. Open the returned HTTPS URL and repeat adoption, actions and refresh there. Deploy the Flutter build, not this assignment guide.', 'Update app/README.md with the live URL, setup instructions, screenshots or GIF, design choices and limitations. Include your test evidence and a 3–5 minute walkthrough.'],
      code: 'firebase login\nflutter build web --release\nfirebase init hosting\nfirebase deploy --only hosting',
      done: ['The live HTTPS URL serves the Flutter game and works after a page refresh.', 'Your repository, app README, test notes and walkthrough are ready to review.'],
      hint: 'If the default Firebase welcome page appears, check public: build/web in firebase.json, rebuild and redeploy. Do not overwrite Flutter’s generated index.html.'
    }
  ],
  acceptance: [
    'Adopt either of two pet styles with a valid 2–16 character trimmed name.',
    'See hunger, happiness and energy as numbers and labelled indicators.',
    'Feed, Play and Sleep/Wake follow every action rule and show disabled reasons.',
    'All values stay in 0–100 and mood follows the specified priority.',
    'One visible-time timer applies the correct 30-second updates; hidden time has no effect.',
    'Refresh restores the same pet, values and sleep state without a flash of default state.',
    'Missing, invalid or failed storage operations have a usable recovery or error state.',
    'New pet asks for confirmation; cancel keeps the pet and confirm opens adoption.',
    'The game works at 375px and 1280px widths and is usable with a keyboard.',
    'Formatting, analysis and at least three meaningful automated tests pass.',
    'The deployed HTTPS URL passes adoption, action and refresh checks.',
    'Submission includes repository, live URL, app README, TESTING.md, screenshots/GIF and a walkthrough.'
  ],
  rubric: [
    ['Game behaviour', 30, 'Adoption, action math, mood, timer and boundary conditions.'],
    ['Persistence & recovery', 20, 'Reliable reload, ordered saves, loading/error states and safe reset.'],
    ['Code clarity', 15, 'Understandable Dart, one owner of state and reusable widgets.'],
    ['UI & accessibility', 15, 'Responsive layouts, readable feedback, labels and keyboard access.'],
    ['Testing', 10, 'Meaningful automated tests plus recorded manual verification.'],
    ['Deployment & explanation', 10, 'Working public game URL, documentation and a clear walkthrough.']
  ],
  deliverables: [
    'A live HTTPS link to the Flutter game, verified in a fresh browser session.',
    'A GitHub repository containing the Flutter app in app/ and a useful commit history.',
    'app/README.md with run instructions, live URL, features, screenshots or a GIF, decisions and known limitations.',
    'app/TESTING.md with automated check results and manual test evidence.',
    'A 3–5 minute recorded walkthrough or live demonstration: adopt, care, sleep, reload and reset; explain a state change and one bug you fixed.'
  ],
  resources: [
    ['Install Flutter', 'https://docs.flutter.dev/install'],
    ['Flutter forms and validation', 'https://docs.flutter.dev/cookbook/forms/validation'],
    ['Simple state management', 'https://docs.flutter.dev/data-and-backend/state-mgmt/simple'],
    ['Dart Timer.periodic', 'https://api.dart.dev/dart-async/Timer/Timer.periodic.html'],
    ['Flutter AppLifecycleListener', 'https://api.flutter.dev/flutter/widgets/AppLifecycleListener-class.html'],
    ['Local key-value storage', 'https://docs.flutter.dev/cookbook/persistence/key-value'],
    ['shared_preferences package', 'https://pub.dev/packages/shared_preferences'],
    ['Flutter testing', 'https://docs.flutter.dev/testing/overview'],
    ['Flutter web release', 'https://docs.flutter.dev/deployment/web'],
    ['Firebase CLI installation', 'https://firebase.google.com/docs/cli#install_the_firebase_cli'],
    ['Firebase Hosting quickstart', 'https://firebase.google.com/docs/hosting/quickstart'],
    ['Tailwind CLI (for the guide only)', 'https://tailwindcss.com/docs/installation/tailwind-cli'],
    ['GitHub expandable sections', 'https://docs.github.com/en/get-started/writing-on-github/working-with-advanced-formatting/organizing-information-with-collapsed-sections']
  ]
};
