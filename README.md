# Banana Orange AI 🍌🍊

Wildora is now a simple Banana Orange AI chat page. The previous nature guide, photo classifier, search, account screens, saved items and location UI have been removed from the website.

## How it works

- GitHub Pages serves the chat interface.
- The browser calls the Supabase Edge Function at `/functions/v1/banana-orange-ai`.
- The Edge Function calls the xAI Chat Completions API using the `grok-4.7` model.
- The xAI API key is stored only as a Supabase Edge Function secret. It must never be placed in this repository or browser code.

## Required one-time setup

1. Revoke any xAI API key that was posted publicly or in a chat, then create a replacement.
2. Open the Supabase project for this app: `dzwgomgrtlsqksnjclje`.
3. Go to **Edge Functions → Secrets**.
4. Add a secret named `XAI_API_KEY` and paste the replacement key as its value.
5. The Edge Function is deployed separately from GitHub Pages; see `supabase/functions/banana-orange-ai/index.ts`.

The current frontend uses the public Supabase publishable key from `supabase-config.js`. That key is designed for browser use. Never put an xAI key, Supabase secret key, or service-role key in a frontend file.

## Deploy the website

GitHub Pages should use branch `main` and folder `/(root)`. After the commit is published, open:

https://emilogetdev.github.io/Wildora/

## Notes

- The chat does not save conversations between page reloads.
- A small per-instance request limit is included. It is not a durable global rate limiter; add persistent rate limiting or CAPTCHA before sharing the public endpoint widely.
- xAI usage may incur charges under the xAI account's billing settings.
