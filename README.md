# What's In My Cart? Portfolio

This is a one-page interactive portfolio prototype with a store-manager introduction, an explorable top-down shopping cart, category modals, a growing receipt, store audio and checkout/contact state.

## Run it locally

From this folder, run:

```bash
python3 -m http.server 43123 --bind 127.0.0.1 --directory dist
```

Then open `http://127.0.0.1:43123`. If the preview is already running, just refresh it after saving your edits.

## Edit your content

All portfolio copy, contact details, category entries and image paths live in:

`dist/portfolio-data.js`

The first-page logo overview is configured in `quickHighlights`: edit each title, caption and logos array there. Brand sources and the supplied-logo background-removal notes are in `dist/assets/LOGO-SOURCES.md`. This preview has not been published.

The file contains comments and obvious placeholders. Put your files in `dist/assets/`, then reference them with paths such as:

- `assets/yiwen-manager.jpg`
- `assets/tiktok-project.jpg`
- `assets/yiwen-resume.pdf`
- `assets/store-lofi.mp3`

## Store Radio

The `audio` section in `dist/portfolio-data.js` selects YouTube video `vxPrlc2rtuk` and controls the background audio settings. Radio starts off. Click Store Radio to start it and open its controls. The Music slider adjusts music volume; Chatter adjusts the ambient layer. Close the controls with × without stopping playback, and click Store Radio to reopen them. Use “Turn audio off” to stop both layers. The optional video has its own hide button. Internet access and an embeddable video are required. The music remains on YouTube.

The local `dist/assets/crowd-murmur.mp3` contains real CC0 crowd chatter, played quietly for 4–7 seconds with fades and 18–35 seconds between snippets. Credits are in `dist/assets/AUDIO-CREDITS.md`. The player includes separate Music and Chatter sliders. Turning off the radio stops both layers.

### Where to change each piece

- At the top: `siteName`, `managerPhoto`, `email`, `resumeUrl`, and the short `overviewTags` shown on the welcome screen.
- Under `dialogue`: the two short introduction messages. Visitors can advance with the button or Space/Enter; the existing chatter asset gives each advance a brief conversational cue.
- `managerTalkingSheet` uses the approved apron photo with a mouth-only cut-out animation. Replay line repeats the brief chatter and mouth movement; advancing starts the next line, and entering the store stops both. Reduced-motion users see the resting photo. Clear `managerTalkingSheet` to use `managerPhoto` instead. The proof's captions and second portrait are cropped out by CSS; only the mouth overlay changes.
- Under `categories`: each section's `label`, `summary`, `metric`, and `image`.
- Under `interests`: change the emoji and label for the little craft-inspired stickers beside the cart.
- Under `quickLook`: change the introduction below the cart. The résumé and email links here are available without completing the cart.
- Under each category's `entries`: edit the `title`, `meta` (role/date), and `text` for each experience.
- `entrepreneurship` is the first category. Its `featured: true` flag keeps it visually highlighted without adding extra text to the card. Add your past ventures and verified results there.

Edit the words inside quotation marks, save the file, then refresh the preview. Keep surrounding commas and brackets. Image paths are relative to the `dist` folder: an image saved as `dist/assets/my-venture.jpg` is written as `"assets/my-venture.jpg"` in the content file.

The cart has six categories: Entrepreneurship, Work Experience, Projects & Creative, Education, Global Experiences, and About Me. Creative work and hackathons are entries within Projects & Creative. A section is collected when visitors close its window or use Back to cart; opening it again does not add it twice. A visible +1 notice and highlighted receipt row confirm each new addition. Receipt totals update automatically, and the entrance button returns to the store-manager introduction. The normal pointer remains visible inside all dialogs.

The résumé is a link below the cart, not another category to unlock. Add your PDF to `dist/assets/` and set `resumeUrl` to `"assets/yiwen-resume.pdf"`. Until you replace the `"#"` placeholder, the link says “Résumé coming soon”. Replace the placeholder email before sharing the finished portfolio.

If an image path is left blank, the site keeps a clearly labeled placeholder. Category modal images remain crisp while the cart uses a deliberately pixelated editorial treatment.

## Main files

- `dist/portfolio-data.js` — edit this first; all personal content is centralized here.
- `dist/index.html` — page structure.
- `dist/styles.css` — colors, type, layout and motion.
- `dist/app.js` — interactions, receipt progress and audio behavior.
- `dist/assets/top-down-cart.png` — original generated cart artwork.

## Mac visual editor

Double-click `Start Portfolio Editor.command` in Finder. Keep the Terminal window open while editing. The editor opens only on this Mac and lets you:

- edit the introduction, venture stories and cart-section copy;
- upload main venture images;
- change the site colours, image spacing and story width;
- drag ventures and cart sections into a new order;
- save and preview locally; and
- publish the saved version to the existing Vercel project.

This is a responsive section editor, not pixel-by-pixel positioning: that keeps the portfolio usable on phones. If macOS blocks the launcher the first time, Control-click it, choose **Open**, then confirm **Open**. The Publish button uses the Vercel login already configured on this Mac.
