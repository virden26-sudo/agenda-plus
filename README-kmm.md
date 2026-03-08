Agenda_plus — KMM integration notes

What I created
- `:shared` Kotlin Multiplatform module with common models and JSON utils.

How it works
- The shared module is Android-first on non-macOS hosts and enables iOS targets when configured on macOS.

To finish iOS integration (on macOS)
1. Install CocoaPods (`sudo gem install cocoapods`) if not present.
2. From project root run:

```bash
./gradlew :shared:podInstall
open iosApp/Agenda_plus.xcworkspace  # if you create an Xcode app using Cocoapods
```

3. Use the generated `shared.framework` from the KMM build or the CocoaPods integration.

If you want, I can scaffold an `iosApp` Xcode project and sample Swift UI code next — I will need macOS to build/run the example.
