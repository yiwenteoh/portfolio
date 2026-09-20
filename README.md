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

The file contains comments and obvious placeholders. Put your files in `dist/assets/`, then reference them with paths such as:

- `assets/yiwen-manager.jpg`
- `assets/tiktok-project.jpg`
- `assets/yiwen-resume.pdf`
- `assets/store-lofi.mp3`

## Store Radio

The `audio` section in `dist/portfolio-data.js` selects YouTube video `vxPrlc2rtuk` and controls the background audio settings. Radio starts off; click the same Store Radio button to turn Music + Chatter on or off. Internet access and permission from the video's owner to embed it are required. The music remains on YouTube.

The local `dist/assets/crowd-murmur.mp3` contains real CC0 crowd chatter, played quietly for 4–7 seconds with fades and 18–35 seconds between snippets. Credits are in `dist/assets/AUDIO-CREDITS.md`. The player includes separate Music and Chatter sliders. Turning off the radio stops both layers.

### Where to change each piece

- At the top: `siteName`, `managerPhoto`, `email`, `resumeUrl`, and the short `overviewTags` shown on the welcome screen.
- Under `dialogue`: the two short introduction messages. Visitors can advance with the button or Space/Enter; the existing chatter asset gives each advance a brief conversational cue.
- Under `categories`: each section's `label`, `summary`, `metric`, and `image`.
- Under each category's `entries`: edit the `title`, `meta` (role/date), and `text` for each experience.
- `entrepreneurship` is the first category. Its `featured: true` flag keeps it visually highlighted without adding extra text to the card. Add your past ventures and verified results there.

Edit the words inside quotation marks, save the file, then refresh the preview. Keep surrounding commas and brackets. Image paths are relative to the `dist` folder: an image saved as `dist/assets/my-venture.jpg` is written as `"assets/my-venture.jpg"` in the content file.

The cart has nine categories. Receipt totals update automatically. Back buttons close a section without resetting the receipt, and the entrance button returns to the store-manager introduction. The normal pointer remains visible inside all dialogs.

If an image path is left blank, the site keeps a clearly labeled placeholder. Category modal images remain crisp while the cart uses a deliberately pixelated editorial treatment.

## Main files

- `dist/portfolio-data.js` — edit this first; all personal content is centralized here.
- `dist/index.html` — page structure.
- `dist/styles.css` — colors, type, layout and motion.
- `dist/app.js` — interactions, receipt progress and audio behavior.
- `dist/assets/top-down-cart.png` — original generated cart artwork.
