# Agenda+

Agenda+ is a smart agenda application for Android, iOS, and Windows that helps you organize your tasks, exams, and notes. It uses natural language processing to let you add items to your agenda by simply typing them in.

## Features

*   **Natural Language Input**: Add agenda items by typing in plain English. For example, "I have an exam on Friday at 2pm" or "buy groceries tomorrow".
*   **Categorization**: Automatically categorizes your items into Assignments, Exams, and Notes.
*   **Simple Interface**: A clean, tabbed interface to view your upcoming agenda items.

## Getting Started

1.  **Clone the repository**:

    ```bash
    git clone https://github.com/your-username/agenda-plus.git
    ```

2.  **Add your Gemini API Key**: The app uses the Google Gemini API for natural language processing. You'll need to add your API key to the `local.properties` file in the root of the project:

    ```properties
    GEMINI_API_KEY="YOUR_API_KEY"
    ```

### Android

1.  **Open in Android Studio**: Open the cloned project in Android Studio.
2.  **Build and Run**: Build and run the app on an Android device or emulator.

### iOS

1.  **Open the iOS project**: Navigate to the `iosApp` directory and open the `.xcodeproj` or `.xcworkspace` file in Xcode.
2.  **Configure API Key**: Make sure the Gemini API key is accessible to the iOS app. You might need to add it to a configuration file or directly in the code (not recommended for production).
3.  **Build and Run**: Build and run the app on an iOS simulator or a physical device.

### Windows

1.  **Install Dependencies**: Open a terminal in the root of the project and run:

    ```bash
    npm install
    ```

2.  **Run the app**: Start the Electron application by running:

    ```bash
    npm start
    ```

## How it Works

Agenda+ uses the `gemini-1.5-flash` model from the Google Gemini API to parse your text input. When you add a new item, the app sends a request to the Gemini API with a prompt to extract the relevant information (type, title, due date, and details) from your text. The parsed information is then stored locally on your device.

## Project Structure

*   `:app`: The main Android application module.
*   `:iosApp`: The iOS application module.
*   `main.js`, `preload.js`, `electron-builder.config.json`: Files for the Electron (Windows) application.
*   `:shared`: A shared module containing common business logic (currently not used).
