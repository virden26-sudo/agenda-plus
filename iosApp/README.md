AgendaPlus iOS Scaffold

This folder contains a minimal SwiftUI app scaffold that consumes the KMM `shared` module via CocoaPods.

On macOS (required):

1. From the project root run:

```bash
cd iosApp
pod install
```

2. Open the generated workspace in Xcode and build the `AgendaPlus` target.

Notes:
- The `shared` CocoaPods pod is provided by the KMM `:shared` module. The shared module must be built/generated on macOS so CocoaPods can install it. See `shared/README.md` for details.
