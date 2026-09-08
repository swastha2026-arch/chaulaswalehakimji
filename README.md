# Chaulas Wale Hakim Ji — V5 GitHub Pages preview

This is a portable hosting copy of V5, not a new design and not a replacement for the multi-file source project.

## Publish the preview
1. Put index.html at the top level of your existing GitHub repository. The included empty .nojekyll file can be placed beside it to skip Jekyll processing.
2. Open the repository Settings > Pages.
3. Under Build and deployment: choose Deploy from a branch, choose the branch containing these files (normally main), then /(root), and Save.
4. After the deployment completes, return to Settings > Pages and use Visit site. GitHub documents that publication can take up to 10 minutes.

For a standard project repository the URL is:
https://YOUR-USERNAME.github.io/YOUR-REPOSITORY/

You can share a product directly, for example:
https://YOUR-USERNAME.github.io/YOUR-REPOSITORY/#/products/ras-e-jalali

Keep the repository name in the URL. The hash (#/) routing is intentional for this standalone static preview. index.html must be at the publishing root, not inside an unextracted ZIP or another folder. If it does not publish, inspect the repository Actions tab.

## What was corrected
The earlier V5 standalone file switched to root-relative page and media paths over HTTP(S), rather than retaining its local-preview hash routes and embedded imagery. This copy always uses hash routes and embedded images, including when hosted in a repository subfolder. Pre-rendered links also use hash routes. Product images and CSS were not changed.

## Scope
This is a publicly shareable design demonstration, not a live store. No real payments, orders or contact messages are processed. Keep the preview notices and use only fictitious details. Do not publish secrets or private documents. GitHub Free supports Pages from public repositories; private source repository support depends on your plan, and private source does not generally mean a private Pages site. GitHub Pages is not allowed as free hosting for an operational online business or e-commerce site. Use appropriate commerce hosting before launch.

## Checks for this hosting patch
- JavaScript syntax: node --check passed.
- 35 browser assertions passed: home, all five product routes, embedded product imagery, purchase docks, add-to-bag, hash navigation, browser back, fresh product hash boot, 390px/320px layout checks, and absence of uncaught JavaScript errors.
- 12 HTTPS pathname/hash combinations passed in an isolated routing-function test, including repository and nested subpaths.
- Embedded image data and CSS blocks are unchanged from the supplied V5 file.
- Browser execution used Chromium set_content. Native local HTTP navigation was blocked by the managed browser's administrator policy. These results do NOT constitute live GitHub deployment verification. Actual hosting and mobile-device testing remain to be performed after upload.

## Official instructions
https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site
https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site
https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits
