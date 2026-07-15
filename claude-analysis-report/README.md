# Strategic Portfolio Console

A single-page interactive dashboard covering three strategic workstreams:

- Overview Hub (English)
- Factory IoT / CNC cross-brand connectivity (Simplified Chinese)
- Luxury Booking Operations with a live ROI calculator (English)
- Kedah, Malaysia recycled-plastics compliance control room (Traditional Chinese)

The original source files (pptx / xlsx / docx) are embedded as downloadable links inside their respective sections — no external hosting or database needed. Everything is a single static `index.html` file.

## Publish this to GitHub Pages

**Option A — via github.com (no command line)**

1. Go to [github.com/new](https://github.com/new) and create a new repository (public, so Pages can serve it for free). Name it anything, e.g. `strategic-portfolio-console`.
2. On the new repo's page, click "uploading an existing file."
3. Drag in `index.html` and `.nojekyll` from this folder, then commit.
4. Go to the repo's **Settings > Pages**.
5. Under "Build and deployment," set **Source** to "Deploy from a branch," **Branch** to `main`, folder `/ (root)`, then **Save**.
6. Wait 1-2 minutes. Your live URL will appear at the top of that same Pages settings screen, typically:
   `https://<your-github-username>.github.io/strategic-portfolio-console/`

**Option B — via terminal**

```
git init
git add index.html .nojekyll
git commit -m "Add strategic portfolio console"
git branch -M main
git remote add origin https://github.com/<your-username>/strategic-portfolio-console.git
git push -u origin main
```

Then enable Pages the same way as steps 4-5 above.

## Notes

- `.nojekyll` tells GitHub Pages to serve the file as-is, skipping its default Jekyll build step (not strictly required here, but prevents edge-case build errors).
- The page loads Chart.js from a public CDN (jsdelivr) for the cost chart in the Luxury Booking Ops section — this requires the visitor's browser to have normal internet access, same as any public webpage.
- Because this repo will be public, so is the file — including the three embedded source documents. Use a private repo (requires a paid GitHub plan for private Pages) if you'd rather not make those downloadable to anyone with the link.
