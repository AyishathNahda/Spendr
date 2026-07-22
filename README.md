# Spendr - Expense Tracking App

Spendr is a modern, premium fintech mobile application built with React Native (Expo) and Firebase. It helps users track their income and expenses, view statistical insights, and manage their finances securely.

## Features

*   **Secure Authentication**: Email and password authentication powered by Firebase Auth.
*   **Real-time Database**: Cloud Firestore integration for seamless, real-time data syncing.
*   **Dashboard**: A beautifully animated dashboard displaying total balance, income, expenses, and savings.
*   **Expense Management (CRUD)**: Easily add, edit, and categorize income and expenses.
*   **Transaction History**: Search, sort, and filter transactions. Features a premium swipe-to-delete gesture.
*   **Visual Statistics**: Interactive Pie Charts and Bar Charts to visualize spending habits over time.
*   **Clean Architecture**: Separation of concerns using Context API for state management and modular services for backend logic.
*   **Responsive UI**: Built with a custom design system that adapts to different screen sizes, featuring glassmorphism and subtle animations.

## Tech Stack

*   **Framework**: React Native (Expo)
*   **Language**: JavaScript (ES6+)
*   **Backend / BaaS**: Firebase (Authentication, Firestore)
*   **Navigation**: React Navigation (Native Stack, Bottom Tabs)
*   **UI Components**: React Native Paper, React Native SVG, React Native Chart Kit
*   **Animations**: React Native Animated API, React Native Swipe List View

## Prerequisites

Before running the project, ensure you have the following installed:

*   [Node.js](https://nodejs.org/) (v16 or higher)
*   [Expo CLI](https://docs.expo.dev/get-started/installation/)
*   A [Firebase](https://firebase.google.com/) account

## Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/AyishathNahda/Spendr.git
    cd Spendr
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Firebase Configuration:**
    *   Create a new project in the Firebase Console.
    *   Enable **Authentication** (Email/Password).
    *   Enable **Firestore Database**.
    *   Register a web app in your Firebase project to get your API keys.
    *   Create a `.env` file in the root of the project and add your Firebase credentials:

    ```env
    EXPO_PUBLIC_FIREBASE_API_KEY=your_api_key
    EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
    EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
    EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
    EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
    EXPO_PUBLIC_FIREBASE_APP_ID=your_app_id
    ```

4.  **Run the app:**
    ```bash
    npx expo start
    ```
    *   Press `a` to run on an Android emulator.
    *   Press `i` to run on an iOS simulator (Mac only).
    *   Or, download the **Expo Go** app on your physical device and scan the QR code in the terminal.

## Deployment

To deploy the app to the App Store or Google Play Store, we recommend using [EAS (Expo Application Services)](https://expo.dev/eas).

1.  **Install EAS CLI:**
    ```bash
    npm install -g eas-cli
    ```

2.  **Login and Configure:**
    ```bash
    eas login
    eas build:configure
    ```

3.  **Build the project:**
    *   For Android (APK):
        ```bash
        eas build -p android --profile preview
        ```
    *   For iOS:
        ```bash
        eas build -p ios
        ```

## License

This project is licensed under the MIT License.
