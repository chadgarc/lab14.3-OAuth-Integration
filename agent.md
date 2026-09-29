# Agent Guide — Lab 14.3 OAuth Integration

## Project Objectives

1. Understand OAuth 2.0 Authorization Code flow at a conceptual level.
2. Complete reading assignment: Doyensec blog — "Common OAuth Vulnerabilities".
3. Prepare Task 2 reflection (300–500 words) in `README.md` after the lab.
4. Meet grading criteria: Clarity (10 pts) + Depth (10 pts) + Completeness and Professionalism (5 pts) = 25 pts.

## Context

- Stack: Node.js ESM, Express 5, dotenv, pnpm.
- `server.js` is intentionally empty — this lab is reading and reflection only, no coding.
- Reference: Doyensec "Common OAuth Vulnerabilities" article.
- Submission: link to document (README will serve as the submission doc).

## Checklist

- [ ] Read Doyensec article; note attack vectors and misconfigurations.
- [ ] Q1 (for README later): CSRF on OAuth flow + how `state` prevents it.
- [ ] Q2 (for README later): leaky `redirect_uri` validation exploit scenario to steal authorization code.
- [ ] Q3 (for README later): one UX vs. Security trade-off of third-party login.
- [ ] Draft reflection in `README.md` (300–500 words total, own words, concise).
- [ ] Verify all three questions clearly labeled and answered.
- [ ] Verify word count (e.g., `wc -w README.md` on reflection body).
- [ ] Proofread for professional tone, clarity, and depth.

## Constraints

- This file holds objectives and checklist only — no reflection content here.
- Task 2 reflection lives in `README.md`, not in this file.
- Do not implement OAuth code unless explicitly requested.
- Paraphrase in own words; do not copy-paste from the article.
- Do not commit secrets (`.env`, tokens); respect `.gitignore`.

## Definition of Done

- `README.md` contains a complete 300–500 word reflection answering Q1/Q2/Q3.
- This `agent.md` remains a lean guide with no duplicated reflection content.
