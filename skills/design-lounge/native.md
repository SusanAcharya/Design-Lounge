# Native apps and PWAs

Read this after [practice.md](practice.md) and [app.md](app.md) when the app is React Native (or Expo), Flutter, SwiftUI, Jetpack Compose, or a PWA. The kit, the pieces, and the checks stay the same. What changes is how you turn them into code, and how you look at the result.

Every brief is written as HTML and CSS. Keep its structure, counts, sizes, states, motion timing, and hit targets. Translate the rest with the tables below. Never ship a WebView of the demo as the screen.

## The tokens

Do not copy the CSS files into an app. Import the same system as numbers:

- `library/themes/<id>.json` — the theme's colours by role. When `pair` is set, load that theme's file too for the other mode.
- `library/pairings/<id>.json` — the three faces: family, weight, italic, uppercase, tracking in em, line height, and the Google Fonts name.
- `library/app.json` — the families' radius and button style, the density table, phone type sizes, touch targets, durations in ms, and every easing as four numbers.

Units: CSS px, iOS points, Android dp, and Flutter logical pixels are the same number. A 44px button is 44 everywhere. Do not multiply by the screen density.

Write one theme file in the app (`theme.ts`, `theme.dart`, `Theme.swift`, `Theme.kt`) built from those three files. Every screen reads from it. A hex written inside a screen is a fail, the same as on the web.

### Colour roles

| Lounge role | Flutter `ColorScheme` and Compose `colorScheme` | React Native and SwiftUI |
| --- | --- | --- |
| `bg` | `surface` (and the scaffold background) | `colors.bg` |
| `surface` | `surfaceContainer` | `colors.surface` |
| `surface2` / `surface3` | `surfaceContainerHigh` / `surfaceContainerHighest` | `colors.surface2` / `surface3` |
| `ink` / `ink2` | `onSurface` / `onSurfaceVariant` | `colors.ink` / `ink2` |
| `line` / `lineStrong` | `outlineVariant` / `outline` | `colors.line` / `lineStrong` |
| `primary` / `primaryInk` / `primarySoft` | `primary` / `onPrimary` / `primaryContainer` | same names |
| `secondary`, `tertiary` and their `Ink` and `Soft` | `secondary`, `tertiary`, `on…`, `…Container` | same names |
| `danger` / `dangerInk` / `dangerSoft` | `error` / `onError` / `errorContainer` | same names |
| `success`, `warning`, `info` | no slot: add them as a theme extension | same names |

`onPrimaryContainer` and the other `on…Container` slots are `ink`. Do not let Material generate a scheme from a seed colour. That replaces the locked theme with Google's.

### Fonts

Load the pairing's families. Nothing else.

- Expo: `@expo-google-fonts/<family>` and `useFonts`, or bundled files with `expo-font`. Hide the splash until the fonts load, so the first frame is not in the system face.
- Bare React Native: put the files in `assets/fonts` and link them.
- Flutter: the `google_fonts` package, or the files under `fonts:` in `pubspec.yaml` for offline-first apps.
- SwiftUI: add the files to the target and list them under `UIAppFonts` in Info.plist. Use `Font.custom(_:size:relativeTo:)` so the text still scales.
- Compose: put the files in `res/font`, or use downloadable fonts.

Tracking is in em in the file. Native letter spacing is in points: multiply. A 34pt display at -0.02em is -0.68. Line height: React Native wants points (1.5 × 17 = 25.5), Flutter wants the ratio (`height: 1.5`), SwiftUI wants the extra space (`lineSpacing`).

If the pairing's script is missing on the device (Devanagari, for example), bundle the font. Do not let the system fall back mid-word. [locale.md](locale.md) still applies.

## CSS to native

| The brief says | React Native | Flutter | SwiftUI / Compose |
| --- | --- | --- | --- |
| `box-shadow` | `shadowColor/Offset/Opacity/Radius` on iOS, `elevation` on Android | `BoxShadow` | `.shadow()` / `Modifier.shadow` |
| `backdrop-filter: blur` | `expo-blur` `BlurView` | `BackdropFilter` | `.background(.ultraThinMaterial)` / a blur modifier |
| `linear-gradient` | `expo-linear-gradient` | `LinearGradient` | `LinearGradient` / `Brush.linearGradient` |
| `position: sticky` | `stickyHeaderIndices` | `SliverPersistentHeader` | `pinnedViews` / `stickyHeader` |
| `:hover` | does not exist; use the pressed state | `InkWell` pressed | pressed state |
| `transition` on a size | Reanimated layout animations | `AnimatedContainer`, `AnimatedSize` | `withAnimation` / `animate*AsState` |
| `cubic-bezier(a, b, c, d)` | `Easing.bezier(a, b, c, d)` | `Cubic(a, b, c, d)` | `.timingCurve(a, b, c, d)` / `CubicBezierEasing` |
| scroll-linked effect | Reanimated `useAnimatedScrollHandler` | `ScrollController`, slivers | `ScrollView` offset / `LazyListState` |
| CSS grid | rows of flex boxes, `FlatList numColumns` | `GridView`, `Wrap` | `LazyVGrid` / `LazyVerticalGrid` |
| `clamp()`, `vw` | `useWindowDimensions` | `MediaQuery.sizeOf` | `GeometryReader` / `LocalConfiguration` |
| `env(safe-area-inset-*)` | `react-native-safe-area-context` | `SafeArea`, `MediaQuery.padding` | safe area is on by default / `WindowInsets` |

The brief's motion table keeps its durations and curves. A drag that follows the finger (a sheet, a swipe row) uses a spring on release instead of a fixed time: React Native `withSpring`, Flutter `SpringSimulation`, SwiftUI `.spring`, Compose `spring()`.

## Phone rules

These apply on every native screen, on top of the Look fails.

- Safe areas. Nothing under the status bar, the notch, or the home indicator except a background. The tab bar sits above the home indicator.
- Touch targets are 44pt on iOS and 48dp on Android, even when the brief draws a smaller dot. Pad the hit area, not the drawing.
- Text size. The app follows the user's text size setting. Do not turn font scaling off. At the largest standard size, nothing is cut off or overlaps: rows grow, and a two-column row stacks. You may cap only the display size, at 1.4 times.
- Dark mode. Every theme has a `pair`. Load both files and follow the system setting. The status bar text follows the mode.
- Reduced motion. React Native `AccessibilityInfo.isReduceMotionEnabled`, Flutter `MediaQuery.disableAnimations`, SwiftUI `accessibilityReduceMotion`, Android's animator scale. Effects become a still frame. Sheets and pushes may still move, shorter.
- The keyboard never covers the field being typed in, or the button that submits it.
- Haptics on a real moment only: a confirm, a toggle, a pull-to-refresh catch. Not on every tap.
- Android back closes the sheet or the drawer first, then goes back. iOS swipe-back works on every pushed screen.
- Screen readers. Every icon button has a label. Grouped rows read as one item. The reading order matches the visual order.
- Lists use the platform's virtualised list (`FlatList`, `ListView.builder`, `List`, `LazyColumn`), not a scroll view with every row in it.

## iOS and Android

One brand, two platforms. The kit (theme, pairing, family) is the same on both. Behaviour follows the platform:

- Navigation and back: native stack transitions and gestures on each.
- System pieces stay native: date and time pickers, the share sheet, alerts and permission dialogs, the photo picker, keyboards. Style around them, not over them.
- Tab bar: `phone-tab-plain`, or `ios-glass-tab-bar` when the family is glass, on iOS. `m3-navigation-bar` on Android, or on both when the family is Material or they said Android first. Never two tab bars in one app.
- Settings: `ios-grouped-settings` on iOS, `m3-settings-list` on Android. Sign in: `phone-sign-in` on iOS, `m3-sign-in` on Android. The Android versions of the other screens are listed in components.md.
- Store rules: an app with accounts needs `phone-delete-account`. Subscriptions need `phone-subscription-manage` with Restore purchases.
- Large text: check every screen at the largest size (`phone-large-text-layout` shows how rows stack).
- A floating action button only on Android, and only when there is one main create action (`m3-fab-menu`).

If they ask for one look on both, keep the iOS behaviours on iOS anyway. A Material back arrow on an iPhone is a fail.

## Looking at the app

The page check in practice.md still applies. A native app needs a simulator or a device, not a browser.

```
xcrun simctl io booted screenshot ios.png
xcrun simctl ui booted appearance dark
xcrun simctl ui booted content_size extra-extra-extra-large
adb exec-out screencap -p > android.png
adb shell cmd uimode night yes
adb shell settings put system font_scale 1.3
flutter screenshot --out=flutter.png
```

Take each screen in light, in dark, and at the large text size. Write the file names in the closing block.

Expo web or Flutter web in a browser is a weaker check: the layout is close, but the native parts (blur, fonts, safe areas, gestures) differ. If that is all you have, say "web build only" in Looked at. If you have no simulator at all, write "not looked".

## PWAs

A PWA is a website that installs. Build it as a website or an app, by its job, then add these. The pieces are `pwa-app-shell`, `pwa-install-sheet`, `pwa-connectivity-banner`, `pwa-update-toast`, `pwa-offline-library`, `pwa-outbox-sync`, and `pwa-news-reader`.

- Manifest: `name`, `short_name` (12 characters or fewer), `start_url`, `display: standalone`, `theme_color` and `background_color` from the theme's `bg`, and icons at 192 and 512, plus a 512 maskable icon with the mark inside the middle 80%.
- iOS: an `apple-touch-icon` (180 × 180) and `apple-mobile-web-app-title`. iOS has no install prompt. Show the "Share, then Add to Home Screen" steps in `pwa-install-sheet`, once.
- The install prompt waits until the person has done one real thing. Never on the first screen. "Not now" hides it for weeks, not for the session.
- A service worker caches the app shell, the fonts, and the icons, so a second open works offline.
- Offline is a state, not an error page: `pwa-connectivity-banner` says so in one line, saved content stays readable (`pwa-offline-library`), and writes wait in an outbox (`pwa-outbox-sync`) with a count and a retry.
- Updates: `pwa-update-toast` offers a reload. Never reload by itself while someone is typing.
- In standalone mode there is no browser bar. The app needs its own back, its own share button, and `viewport-fit=cover` with the safe-area insets.
- Full-height layouts use `100dvh`. No hover-only controls.
- Check it: open the manifest and the service worker in the browser's Application panel, then turn the network off and reload. Write what worked offline in the closing block.
