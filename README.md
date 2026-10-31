# Wildora 🌿
**Discover the wild world.**

Wildora is a responsive nature discovery web app designed for GitHub Pages and GitHub Codespaces.

## Features
- Nature guide with plant and wildlife starter entries
- Browser-based AI photo classification using Transformers.js
- Search across curated entries plus online Wikipedia nature topics
- Save discoveries locally; signed-in users can sync favorites with Supabase
- Supabase email registration, login and profile display (requires setup below)
- Outdoor inspiration and nature facts
- Optional browser location permission
- Responsive layout, transitions and animated interactions
- About, Imprint/Impressum and Privacy/Datenschutz information pages

## Publish with GitHub Pages
1. Open **Settings → Pages**.
2. Under **Build and deployment**, select **Deploy from a branch**.
3. Select branch **main** and folder **/(root)**, then save.
4. Wait for deployment. GitHub shows the public URL in the Pages section.

## Set up real user accounts (Supabase)
Registration is intentionally disabled until you configure your own Supabase project.
1. Create a project in Supabase and open **Project Settings → API**.
2. Copy the Project URL and the anon/public key (never use the service_role key).
3. Replace the placeholders in `supabase-config.js` with those two public values.
4. In the Supabase SQL Editor, run the complete script from `supabase/schema.sql`.
5. In Supabase Authentication settings, configure the allowed site URL and redirect URLs to your GitHub Pages URL.
6. Test registration and email confirmation, then log in. Email delivery and confirmation depend on your Supabase project settings.

The database enables row-level security. Users can only read and manage their own profile and favorites. Do not put private keys or database passwords in frontend files.

## AI photo guide — important limitations
The current model is a general-purpose image classifier. It returns visual category suggestions, not guaranteed plant or animal species identification. It may be unable to distinguish similar species. First use downloads the model and requires an internet connection. The selected photo is processed in the browser by this app and is not uploaded to a Wildora server. Never eat or handle an unknown plant, mushroom or animal based on an AI result.

## Search
Wildora searches its curated starter guide and can request additional article summaries and thumbnails from the Wikipedia API. Wikipedia content and images are provided by Wikipedia; open the source article for context and licensing information.

## Legal pages — must be completed before public operation
The Impressum and privacy pages contain clearly marked draft placeholders. They are not legal advice and are not a completed legal notice. Replace all bracketed provider/contact details and review the privacy text for the services, data flows and legal requirements that actually apply. Do not publish fake personal or business details. If you are under 18, ask a parent or guardian to help with the legal and account-provider setup.

## Run in Codespaces
1. Open the repository, press **Code → Codespaces → Create codespace on main**.
2. In the terminal run `python3 -m http.server 8000`.
3. Open forwarded port **8000** in the Ports tab.

The `.devcontainer/devcontainer.json` file provides a ready-to-use development container.

## Privacy notes
- Photo classification runs in the browser; Wildora does not upload the selected photo.
- Local saved discoveries use browser local storage.
- If configured, account email/authentication and synced favorites are handled by Supabase.
- Search requests go to Wikipedia; AI libraries/model files load from public CDNs.
- Location is requested only after the visitor presses the location button.
