# Jalal Ahmmed: Academic Website

Personal academic website of **Jalal Ahmmed**, Graduate Researcher in Explainable AI and Computer Vision at Daffodil International University, Dhaka.

**Live URL:** https://mdtuhinkhan101.github.io/jalal-ahmmed/

All content comes from **`data.json`**. To update citations, add a paper or add an achievement, edit that one file. You never need to touch the HTML, CSS or JavaScript.

---

## File structure

```
jalal-ahmmed/                    ← this is the repository
├── data.json                    ← ★ ALL CONTENT. The only file you edit for updates.
├── index.html                   ← page layout, navigation, SEO tags
├── 404.html                     ← "page not found" page
├── sitemap.xml                  ← for Google Search Console
├── site.webmanifest             ← app name and icons for phones
├── favicon.ico
├── .nojekyll                    ← tells GitHub Pages to serve files as-is
├── .gitignore
├── README.md                    ← this guide
├── package.json                 ← optional: only for rebuilding the CSS
├── tailwind.config.js           ← optional: colours and fonts
├── src/input.css                ← optional: Tailwind source
├── optional-root-redirect/      ← optional: see "If you already have mdtuhinkhan101.github.io"
│   └── index.html
└── assets/
    ├── css/style.css            ← compiled Tailwind CSS (ready to use)
    ├── js/main.js               ← reads data.json and draws every section
    ├── docs/Jalal_Ahmmed_CV.pdf
    └── img/
        ├── jalal-ahmmed-640.jpg / .webp   ← hero photo
        ├── jalal-ahmmed-320.jpg / .webp   ← smaller copy
        ├── jalal-ahmmed.jpg               ← full photo (used by Google)
        ├── og-image.jpg                   ← link preview for LinkedIn, Facebook, WhatsApp
        └── favicon-32.png, apple-touch-icon.png, icon-192.png, icon-512.png
```

Every path inside the site is **relative** (no leading `/`), which is why it works inside the `/jalal-ahmmed/` folder of your GitHub Pages address.

---

## Part 1: Publish the site

### Step 1. Create the repository

1. Sign in to GitHub as **mdtuhinkhan101**.
2. Click **+** (top right) → **New repository**.
3. **Repository name:** `jalal-ahmmed` (exactly this; the name becomes the URL path).
4. Choose **Public**. Leave “Add a README”, .gitignore and licence **unticked**.
5. Click **Create repository**.

### Step 2. Upload the files

Pick **one** method.

#### Method A: In the browser (easiest)

1. Unzip `jalal-ahmmed.zip`.
2. Open the unzipped `jalal-ahmmed` folder so you see `index.html`, `data.json`, `assets` and the rest.
3. On the new repository page, click **uploading an existing file**.
4. Select **everything inside the folder** (not the folder itself) and drag it into the browser.
   ✔ Correct: `jalal-ahmmed/index.html` on GitHub
   ✘ Wrong: `jalal-ahmmed/jalal-ahmmed/index.html`
5. Write a message such as `Initial website` and click **Commit changes**.

> Files that start with a dot (`.nojekyll`, `.gitignore`) are hidden on most computers and may not upload by drag and drop. The site works without them. To add `.nojekyll` anyway: **Add file → Create new file**, name it `.nojekyll`, leave it empty, **Commit**.

#### Method B: Git command line

Install Git from https://git-scm.com, then:

```bash
cd path/to/jalal-ahmmed            # the unzipped folder
git init
git add .
git commit -m "Initial website"
git branch -M main
git remote add origin https://github.com/mdtuhinkhan101/jalal-ahmmed.git
git push -u origin main
```

When asked for a password, use a **Personal Access Token**: GitHub → **Settings → Developer settings → Personal access tokens → Tokens (classic) → Generate new token**, tick **repo**, then paste the token as the password.

### Step 3. Turn on GitHub Pages

1. In the repository, open **Settings → Pages** (left sidebar).
2. **Source:** *Deploy from a branch*.
3. **Branch:** `main`, folder **`/ (root)`** → **Save**.
4. Wait 1–3 minutes and refresh. You’ll see:
   **“Your site is live at https://mdtuhinkhan101.github.io/jalal-ahmmed/”**
5. The **Actions** tab shows progress; a green tick means it’s published.

### Step 4. Check it

Open https://mdtuhinkhan101.github.io/jalal-ahmmed/ on a computer and a phone. Check the photo, the metrics, the publication filters and sort, the collaborator network, dark mode and the CV download.

---

## Part 2: Updating content with data.json

### How to edit

**On GitHub (no software needed):** open the repository → click `data.json` → pencil icon ✏️ → make the change → **Commit changes**. The live site updates within 1–2 minutes. If you don’t see the change, hard-refresh with Ctrl + Shift + R (Cmd + Shift + R on Mac).

### Three rules for editing JSON

1. Text goes in "double quotes". Numbers don’t: `"citations": 35`.
2. Items in a list are separated by commas, but **the last item has no comma after it**.
3. Inside text, `**word**` shows as **bold** and `*word*` shows as *italic*.

If the page shows *“The page content (data.json) didn’t load”*, there is a typo. Paste the whole file into https://jsonlint.com and it will point to the line.

### Common updates

**Update citations, h-index and i10-index** (in `"metrics"`):

```json
"metrics": {
  "citations": 35,
  "hIndex": 4,
  "i10Index": 2,
  "asOf": "January 2027",
  ...
}
```

**Update one paper’s citation count:** find the paper in `"publications"` and change `"citations": 14` to the new number. Use `null` for papers without a count; no citation badge is shown for those.

**Add a new paper:** copy an existing block in `"publications"`, paste it after the last `}` (add a comma between blocks) and edit it:

```json
{
  "id": "lighthcf",
  "short": "LightHCF",
  "type": "journal",
  "title": "LightHCF: Lightweight Hybrid CNN–Transformer with Explainable AI for ...",
  "authors": ["Jalal Ahmmed", "Md Alamgir Kabir", "Atiq ur Rehman", "Amine Bermak"],
  "year": 2027,
  "venue": "IEEE Open Journal of the Computer Society",
  "venueDetail": "vol. 8, pp. 100–112",
  "publisher": "IEEE",
  "doi": "10.1109/OJCS.2027.0000000",
  "url": "https://doi.org/10.1109/OJCS.2027.0000000",
  "code": "",
  "dataset": "",
  "citations": 0,
  "quartile": "Q1",
  "firstAuthor": true,
  "summary": "One or two sentences about the result."
}
```

- `"type"` must be one of: `journal`, `conference`, `preprint`, `dataset`.
- `"short"` is the short name shown in the collaborator list.
- Write your own name exactly as in `profile.authorNames` (`"Jalal Ahmmed"` or `"J. Ahmmed"`) so it appears in bold.
- Leave unused links as `""`.
- The BibTeX entry, the filter counts, the collaborators’ joint-paper counts and the Google structured data all update automatically.

When a submitted paper is accepted, also remove it from `"ongoing"`.

**Add an achievement** (in `"achievements"`):

```json
{ "year": "2027", "title": "Erasmus Mundus scholarship", "detail": "Joint master’s programme in ..." }
```

**Add a collaborator** (in `"collaborators"`; they appear in the same order as in the file):

```json
{
  "name": "Jane Doe",
  "title": "Associate Professor",
  "department": "Department of Computer Science",
  "institution": "University of Example",
  "country": "Germany",
  "highlight": true,
  "url": "https://scholar.google.com/citations?user=XXXX",
  "matchNames": ["Jane Doe", "J. Doe"]
}
```

`matchNames` lists every spelling of their name used in your author lists. The site counts your joint papers from these names. A new country gets its own colour on the network graph automatically. `"highlight": true` gives their title a gold badge.

**Show a citations-per-year chart:** fill in `"citationsByYear"` from your Google Scholar graph and the chart appears in the metrics section:

```json
"citationsByYear": [
  { "year": 2025, "citations": 6 },
  { "year": 2026, "citations": 23 }
]
```

**Other sections:** `education`, `experience`, `projects`, `ongoing`, `skills`, `service`, `repositories`, `contact` and `links` all follow the same pattern: copy an existing item and edit it.

**After any update,** change `"lastUpdated"` at the top of `data.json` (the footer shows it), and the `<lastmod>` date in `sitemap.xml`.

### Change the photo or CV

Replace the image files in `assets/img/` with new ones **using the same file names** (square photos work best; 640 × 640 px for the `-640` files), or change the `"photo"` / `"photoWebp"` paths in `data.json`. Replace `assets/docs/Jalal_Ahmmed_CV.pdf` the same way.

---

## Part 3: Get found on Google for “Jalal Ahmmed”

The page already has: your name in the title, H1 heading, description and image text; Open Graph and Twitter preview tags; and Schema.org `Person` + `ProfilePage` + one `ScholarlyArticle` per paper, generated from data.json. These steps tell Google the site exists.

### Step 5. Verify the site in Google Search Console

1. Go to https://search.google.com/search-console → **Add property** → **URL prefix**.
2. Enter **`https://mdtuhinkhan101.github.io/jalal-ahmmed/`** (with the trailing slash) → **Continue**.
3. Choose **HTML tag**. Copy the code inside `content="..."`.
4. In GitHub, edit `index.html` (the one time you edit it). Find:
   ```html
   <!-- <meta name="google-site-verification" content="PASTE_YOUR_CODE_HERE"> -->
   ```
   and replace it with:
   ```html
   <meta name="google-site-verification" content="YOUR_CODE">
   ```
5. **Commit**, wait 2 minutes, then click **Verify**.

### Step 6. Submit the sitemap and request indexing

1. Search Console → **Sitemaps** → enter `sitemap.xml` → **Submit**.
2. Search Console → **URL inspection** → paste `https://mdtuhinkhan101.github.io/jalal-ahmmed/` → **Request indexing**.

### Step 7. Link to the site from your profiles (the step that matters most)

Search engines trust a personal page when your established profiles point to it. Add **https://mdtuhinkhan101.github.io/jalal-ahmmed/** to:

| Profile | Where |
|---|---|
| Google Scholar | Edit profile → *Homepage* |
| ORCID | *Websites & social links* → add “Personal website” |
| ResearchGate | Edit profile → *Personal website* |
| LinkedIn | *Contact info* → *Website* (Personal), and in your *About* |
| GitHub profile | **Edit profile** → *Website* |
| This repository | Repo page → ⚙ next to *About* → *Website*, tick “Use your GitHub Pages website” |
| Email signature, CV, future author bios | Add the link |

Optionally, add the site in **Bing Webmaster Tools** (https://www.bing.com/webmasters → *Import from Google Search Console*).

Nobody can promise the #1 result, but with a verified site, structured data and these profile links, a distinctive name like “Jalal Ahmmed” usually reaches the first page within a few weeks.

### If you already have `mdtuhinkhan101.github.io`

If you published an earlier version of this website in a repository called `mdtuhinkhan101.github.io`, Google would see two copies of the same content, and they compete. Pick one:

- **Recommended:** send the old address to the new one. Replace everything in the `mdtuhinkhan101.github.io` repository with the single file in `optional-root-redirect/index.html` (keep its name `index.html`). Visitors and Google are sent to `/jalal-ahmmed/`.
- Or delete the `mdtuhinkhan101.github.io` repository.

Your project site keeps working either way. If you don’t have that repository, ignore the `optional-root-redirect` folder (you can delete it).

---

## Preview on your own computer

Browsers block `data.json` when you double-click `index.html`, so the page shows a loading message. Start a tiny local server instead:

```bash
cd path/to/jalal-ahmmed
python -m http.server 8000
```

Then open http://localhost:8000.

## Changing the design (optional)

Only needed if you edit `src/input.css` or add new Tailwind classes to `index.html` / `main.js`:

```bash
npm install
npm run build        # writes assets/css/style.css
```

Updating `data.json` never requires a rebuild.

---

## Troubleshooting

| Problem | Fix |
|---|---|
| 404 at the live URL | Repository must be named exactly `jalal-ahmmed`, be public, and have `index.html` at the top level. Check **Settings → Pages** is set to `main` / `(root)`. |
| Page loads without styling | The `assets` folder ended up nested or didn’t upload. Compare your repository with the file structure above. |
| “The page content (data.json) didn’t load” | A typo in `data.json`. Check it at https://jsonlint.com. On your own computer, use the local server above. |
| Edits don’t appear | Wait 1–2 minutes, then hard-refresh (Ctrl + Shift + R). |
| A section is empty | That section’s part of `data.json` has a wrong field name. Compare it with the original. The rest of the page keeps working. |
| LinkedIn shows an old preview | Use https://www.linkedin.com/post-inspector/ to refresh it. |

---

© Jalal Ahmmed
