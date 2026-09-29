import express from 'express';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// GitHub OAuth configuration (load from .env or set defaults)
const CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;
const REDIRECT_URI = `http://localhost:3000/auth/github/callback`;

// Validate configuration at startup
if (!CLIENT_ID || !CLIENT_SECRET) {
    console.warn('⚠️  WARNING: GITHUB_CLIENT_ID and/or GITHUB_CLIENT_SECRET not set.');
}

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Home - login link (FIXED syntax error)
app.get("/", (req, res) => {
    res.send(`
        <h1>Login with GitHub</h1>
        <a href="/auth/github">Login with GitHub</a>
    `);
});

// Step 1: Initiate OAuth flow
app.get("/auth/github", (req, res) => {
    const state = Math.random().toString(36).substring(2);
    const params = new URLSearchParams({
        client_id: CLIENT_ID || 'not-set',
        redirect_uri: REDIRECT_URI,
        scope: 'read:user user:email',
        state
    });

    console.log(`[OAuth] Initiating GitHub auth for state: ${state}`);
    
    res.redirect(`https://github.com/login/oauth/authorize?${params.toString()}`);
});

// Step 2: Handle OAuth callback
app.get('/auth/callback', async(req, res) => {
    const { code, state } = req.query;
    
    if (!code) return res.status(400).send("Missing authorization code");
    if (!state) return res.send("No GitHub login required - please sign in on GitHub first.");
    
    // TODO: Production improvement: Store state when initiating auth and validate match here
    console.log(`[OAuth] Processing callback for state: ${state}, code: ${code}`);

    // Exchange code for access token
    const tokenRes = await fetch('https://github.com/login/oauth/access_token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            client_id: CLIENT_ID,
            client_secret: CLIENT_SECRET,
            code,
            redirect_uri: REDIRECT_URI,
            state
        }),
    });

    if (!tokenRes.ok) {
        const errorBody = await tokenRes.text();
        console.error(`[OAuth] Token exchange failed: ${errorBody}`);
        return res.status(tokenRes.status || 401).send("Token exchange failed");
    }

    // Parse token response safely
    let tokenData;
    try {
        tokenData = await tokenRes.json();
    } catch (e) {
        console.error(`[OAuth] Failed to parse token response`);
        return res.status(500).send("Invalid token response from GitHub");
    }

    if (tokenData.error) return res.status(401).send(`Token error: ${tokenData.error}`);
    
    const access_token = tokenData.access_token;
    console.log(`[OAuth] Received access token for user`);

    // Use token to fetch profile
    const userRes = await fetch('https://api.github.com/user', {
        headers: {
            Authorization: `Bearer ${access_token}`,
            'User-Agent': 'lab14.3'
        }
    });

    if (!userRes.ok) {
        console.error(`[OAuth] Failed to fetch user profile`);
        return res.status(401).send("Failed to fetch user profile from GitHub");
    }

    const userData = await userRes.json();
    
    // Add security headers and friendly response
    res.setHeader('X-Frame-Options', 'SAMEORIGIN');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.send(`
        <h1>Hola ${userData.login}</h1>
        <img src="${userData.avatar_url}" width="80"/>
        <p>ID: ${userData.id} | Login: ${userData.login}</p>
        <a href="/">Exit</a> | 
        <a href="/auth/github?test=true">Test Login Again</a>
    `);
});

app.listen(PORT, () => console.log(`Listening on http://localhost:${PORT}`));
export default app;