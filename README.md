# Telegram SSO Proof of Concept (PoC)

This repository demonstrates the feasibility and implementation of using **Telegram as a Single Sign-On (SSO) provider** for a web application using a Node.js backend and a frontend login flow powered by the official Telegram Login Widget.

---

## ✅ What This PoC Proves

### 1. Telegram SSO is Viable and Functional
- The [Telegram Login Widget](https://core.telegram.org/widgets/login) can be used to authenticate users using their Telegram accounts.
- Telegram provides user data along with a signed `hash`, which can be validated securely using your bot token.

### 2. No Bot Logic Needed in Runtime
- The Telegram bot is only used for retrieving the `botToken` from [@BotFather](https://t.me/BotFather).
- There's no need to connect the bot itself to the authentication logic.

### 3. Clear Separation Between Frontend and Backend
- The Telegram widget redirects to a backend route using the `data-auth-url` parameter.
- The backend validates the data and generates a JWT token.
- The backend then redirects the user back to the frontend with the token (e.g., via query param or cookie).

### 4. Telegram Login Is Not Standard OAuth2/OpenID
- Telegram uses its own signature-based verification (HMAC SHA-256).
- It is not compatible out-of-the-box with OAuth2 providers like Google, Facebook, Auth0, etc.

### 5. Real Widget Must Be Used to Test the Flow
- The signed `hash` that proves data authenticity is generated only by the Telegram widget.
- You cannot test this authentication flow via tools like Postman or Insomnia unless you capture the full `user` object from a successful real login.

---

## 🔐 Authentication Flow

```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant Telegram
    participant Backend

    User->>Frontend: Clicks "Login with Telegram"
    Frontend->>Telegram: Triggers login widget
    Telegram->>Backend (/callback): Sends user data via query string
    Backend->>Backend: Validates hash using bot token
    Backend->>Backend: Generates JWT
    Backend->>Frontend: Redirects to frontend with token
    Frontend->>Frontend: Stores token (localStorage/cookie)