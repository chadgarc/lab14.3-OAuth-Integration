# Lab 14.3 OAuth Integration

This project is a **practice implementation of OAuth 2.0 authentication** using GitHub as the identity provider. It demonstrates the Authorization Code flow with Express.js.

## Current Status

⚠️ **Known Issue**: The OAuth flow initiates correctly and redirects to GitHub for authorization, but **after authorization it won't return anything**. This is because the callback route in the code (`/auth/callback`) doesn't match the `REDIRECT_URI` registered with GitHub (`/auth/github/callback`). To fix this, either:

- Change the `REDIRECT_URI` in the code to match the route, or
- Add a route handler for `/auth/github/callback`

## How the `.env` File Works

The `.env` file stores sensitive configuration variables that shouldn't be committed to version control. This project uses the `dotenv` package to load these variables at runtime.

### Required Variables

Create a `.env` file in the project root with:

```env
GITHUB_CLIENT_ID=your_github_oauth_app_client_id
GITHUB_CLIENT_SECRET=your_github_oauth_app_client_secret
PORT=3000
```

### How It Works

1. **`dotenv.config()`** in `server.js` loads the `.env` file into `process.env`
2. **`process.env.GITHUB_CLIENT_ID`** and **`process.env.GITHUB_CLIENT_SECRET`** are read to configure the OAuth app
3. The app validates these exist at startup (logs a warning if missing)
4. Never commit `.env` — it's in `.gitignore` to prevent leaking secrets

### Getting GitHub OAuth Credentials

1. Go to GitHub → Settings → Developer settings → OAuth Apps
2. Click "New OAuth App"
3. Set **Authorization callback URL** to: `http://localhost:3000/auth/github/callback`
4. Copy the **Client ID** and generate a **Client Secret** into your `.env`

## Running the Project

```bash
# Install dependencies
pnpm install

# Create .env with your credentials (see above)
# Start development server
pnpm dev
```

Then visit `http://localhost:3000` and click "Login with GitHub".

## Reflection

### 1. CSRF and the state Parameter

An OAuth CSRF attack happens when an attacker tricks a victim into finishing a login process that the attacker started.

First, the attacker starts logging into an app using OAuth (like "Log in with Google"), but they pause right after getting the authorization code. Then, they send a link to the victim with that stolen code. When the victim clicks it, the app accepts the code and links the victim’s browser session to the attacker’s account. Now, anything the victim does on the app is saved directly in the attacker's account, allowing the attacker to see their data.

The state parameter stops this by working like a secret matching code. Before sending the user to Google, the app creates a random unique string, saves it in the user’s browser cookie, and sends it along in the login request. When Google redirects the user back, it returns that same state string. The app checks if the returned state matches the user's cookie. If they don't match (which happens during a CSRF attack), the app knows something is wrong and blocks the request.

### 2. Scenario: "Leaky" redirect_uri Validation

A "leaky" redirect_uri validation happens when an authorization server only checks the domain name instead of checking the exact full web address.

Imagine an app that allows any address starting with [https://my-app.com/](https://my-app.com/). An attacker finds a page on that site that has an open redirect, like [https://my-app.com/redirect?to=https://attacker.com](https://my-app.com/redirect?to=https://attacker.com). The attacker sends a victim a login link that sets the redirect_uri to that specific redirect page. Since the server only checks that it starts with my-app.com, it approves the request and sends the authorization code to that page. The victim's browser then automatically forwards the code straight to attacker.com, allowing the attacker to steal it.

### 3. User Experience vs. Security

Adding "Login with Google" is great for users because they can log in with one click without creating a new password. However, the main trade-off developers face is user convenience versus implementation security.

OAuth makes onboarding smooth, but it adds a lot of hidden security responsibilities for developers. A single setup mistake—like identifying users by their email instead of a unique user ID (sub), or misconfiguring redirect URIs—can let attackers take over user accounts completely. Developers have to carefully weigh the benefits of an easy login screen against the extra time and effort needed to configure OAuth securely.
