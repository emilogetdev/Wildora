# Wildora 🌿
**Discover the wild world.**

Wildora is a responsive nature discovery web app. It is designed to work as a static site on GitHub Pages and can also be edited in GitHub Codespaces.

## Features
- Plant and wildlife starter guides
- **AI photo classification in the browser** using Transformers.js and a vision model
- Photo preview stays in the browser; the image is not uploaded by this app
- Outdoor inspiration cards and nature facts
- Save discoveries in browser local storage
- Optional browser location permission
- Responsive layout for phones and desktops

## Run with GitHub Pages
1. Open this repository's **Settings → Pages**.
2. Under **Build and deployment**, choose **Deploy from a branch**.
3. Select branch **main** and folder **/(root)**, then save.
4. Wait for the Pages deployment to finish. Your site URL will appear in the Pages section.

The entry file is `index.html` in the repository root, so no build step is required.

## Open in GitHub Codespaces
1. Open the repository on GitHub.
2. Press the green **Code** button.
3. Choose **Codespaces → Create codespace on main**.
4. In the Codespaces terminal, run:
   ```bash
   python3 -m http.server 8000
   ```
5. Open the **Ports** tab and open port **8000** in the browser.

The `.devcontainer/devcontainer.json` file provides a ready-to-use development container.

## AI recognition notes
The photo guide uses a general-purpose image-classification model loaded from Hugging Face through Transformers.js. The model downloads on first use and performs inference in the browser. This requires an internet connection the first time. It returns visual category suggestions, **not guaranteed species identification**; fine-grained plant, mushroom, insect or animal identification is not yet supported reliably. Treat results as suggestions and confirm important identifications with a trusted nature expert or guide.

## Privacy
- The selected photo is processed in the browser and is not uploaded by Wildora.
- Saved discoveries are stored in local browser storage.
- Location is requested only after the user presses **Use my location**.

## Credits
The AI library and model are loaded from their public distribution endpoints. See the Transformers.js and model pages for their licenses and usage terms.
