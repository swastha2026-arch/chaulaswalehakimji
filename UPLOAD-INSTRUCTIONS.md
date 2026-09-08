# V6: publish the complete preview on GitHub Pages

Repository already identified by you: `swastha2026-arch/chaulaswalehakimji`.

## Recommended: ready-built upload, no installation

1. Download **Chaulas-Wale-Hakim-Ji-V6-GitHub-Pages.zip** and extract it.
2. Open the repository's Code tab, select the Pages publishing branch (`main` in the setup discussed), and use **Add file → Upload files**.
3. Drag in the extracted **index.html**, **assets folder**, **media folder**, and the other small supporting files. Replace the old root index.html. Preserve folder names and file names. The index and folders must sit beside one another, not inside an additional wrapper folder.
4. Commit. Leave **Settings → Pages → Source: Deploy from a branch → main → /(root)**. Leave **Custom domain empty**.
5. Wait for the Pages deployment in Actions to finish, then open the existing website address below. This package has not been deployed to your account by the assistant.

```text
https://swastha2026-arch.github.io/chaulaswalehakimji/?v=6#/
```

Correct repository layout:

```text
index.html
assets/
  app.js
  spatial.js
  motion.js
  styles.css
media/
  [all supplied images, crops and 3D textures]
404.html
robots.txt
build-manifest.json
.nojekyll
```

Do not upload the ZIP as a ZIP. Do not upload only index.html. Do not use the browser's Save Page As; it can save a changed DOM or omit the source assets. This build deliberately uses separate files.

The `.nojekyll` file is empty and may be hidden in Finder. It is included in the ZIP. Its absence will not introduce underscore-path problems in this particular output, but include it when possible. No CNAME file is included.

## Verify the new deployment

The footer changes from **Preview V6 · Starting…** to **Preview V6 · Navigation ready** only when the application starts. Test the logo/Home, a product link, **In 3D**, Open cap/lid, the gallery, and Add to bag. The expected product deep link is:

```text
https://swastha2026-arch.github.io/chaulaswalehakimji/#/products/ras-e-jalali
```

If the old design remains, wait for the latest Actions deployment and refresh. The version query can help identify the requested preview but is not a guarantee against all browser/proxy caching.

If a missing-scripts warning appears, check that `assets/app.js` exists beside the uploaded index's assets folder. If photos or 3D textures are missing, verify the entire `media/` folder was uploaded. If 3D itself is unsupported or context is lost, the original photo remains while navigation/shopping continue.

## Alternative: deploy the full source with Actions

Upload the contents of **chaulas-wale-hakim-ji-v6/** to the repository root (package.json, src, public, content, scripts, vendor, lockfile and .github, not just site). Select **Settings → Pages → Source: GitHub Actions**. The included workflow installs the local compiler, builds `site/`, typechecks, and publishes that folder. Its Pages permissions are scoped to the deploy job. This workflow is supplied but has not been run in your GitHub account.

Choose one route. Do not leave branch/root publishing pointed at the unbuilt source while expecting the workflow output.

## Scope

GitHub Pages is being used for a design/demo preview. This is not a production payment-enabled store. Do not put credentials, private licence documents or customer information into a public repository.

Official documentation reviewed for these controls:
- https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site
- https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages
