# Agenda+

This is a Next.js and Genkit project created in Firebase Studio.

## Getting Started

To get started with local development, run the following commands:

```bash
npm install
```

Open [http://localhost:9002](http://localhost:9002) with your browser to see the result.

## Creating Versions and Releases

Versioning is a crucial practice for managing your application's lifecycle. It allows you to mark specific points in your development history as stable releases, making it easier to track changes and roll back if needed.

This project uses `npm` to manage the version number in `package.json` and `git` to create release tags.

### Versioning Workflow

1.  **Ensure your main branch is up-to-date** and all changes you want in the release are committed.

2.  **Bump the version number:** Use the `npm version` command. This command will automatically update the `version` in your `package.json` and create a corresponding `git` tag.

    Choose one of the following commands based on the type of changes you've made (this is called [Semantic Versioning](https://semver.org/)):

    *   For small bug fixes (e.g., `0.1.0` -> `0.1.1`):
        ```bash
        npm version patch
        ```

    *   For new, backward-compatible features (e.g., `0.1.1` -> `0.2.0`):
        ```bash
        npm version minor
        ```

    *   For changes that break backward compatibility (e.g., `0.2.0` -> `1.0.0`):
        ```bash
        npm version major
        ```

3.  **Push your changes and tags to the remote repository:**
    
    ```bash
    git push && git push --tags
    ```

4.  **Deploy the new version:** After tagging a release, you can proceed with your deployment to Firebase App Hosting.
    ```bash
    firebase deploy --only apphosting
    ```

By following this process, you create a clean, tagged history of your releases, which is essential for good project management.

## Deploying to Firebase

To make your application available for others to use, you need to deploy it to Firebase App Hosting.

Follow these steps:

1.  **Install the Firebase CLI:** If you don't have it already, install the Firebase command-line tool globally.
    ```bash
    npm install -g firebase-tools
    ```

2.  **Log in to Firebase:**
    ```bash
    firebase login
    ```

3.  **Deploy your app:** From your project's root directory, run the deploy command.
    ```bash
    firebase deploy --only apphosting
    ```

After the deployment is complete, the Firebase CLI will provide you with a public URL where your application is live. Anyone with this URL will be able to access and use your Agenda+ app.

## Building for Android

This project is configured to be wrapped as a native Android application using Capacitor.

### One-Time Setup

First, you need to generate the native Android project files. This will create a folder named `agenda1` in your project root.

```bash
npm run cap:android
```

### Development Workflow

1.  **Open the Android Project:**
    *   Open Android Studio.
    *   Click "Open an existing project".
    *   Navigate to your project folder and select the `agenda1` directory.

2.  **Build Your Web App:**
    Before you can run the app in Android Studio, you need to build the latest version of your Next.js web code and copy it into the native project. Run the following command from your terminal:

    ```bash
    npm run build:android
    ```

3.  **Run in Android Studio:**
    *   After the build is complete, go to Android Studio.
    *   Click the "Sync Project with Gradle Files" button if prompted.
    *   Select your desired device (emulator or a connected physical device).
    *   Click the "Run" button (the green play icon).

Your Agenda+ app will now launch on the selected Android device.
