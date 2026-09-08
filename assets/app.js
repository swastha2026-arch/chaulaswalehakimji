"use strict";
/** V6 serves separate cacheable assets, rather than embedding photographs in JavaScript. */
const embeddedProductMedia = {};
const products = [
    { id: 'ras-e-jalali', name: 'Ras e Jalali', number: '01', form: 'Bottle', previewPrice: 480, color: 'green', short: 'A place in the Chaulas Wale Hakim Ji collection.' },
    { id: 'majun-jalali', name: 'Majun Jalali', number: '02', form: 'Jar', previewPrice: 680, color: 'ivory', short: 'Explore the formulation, one detail at a time.' },
    { id: 'ras-e-faulad', name: 'Ras e Faulad', number: '03', form: 'Bottle', previewPrice: 540, color: 'brown', short: 'Part of the collection. A story to be documented.' },
    { id: 'herbal-jari-booti-oil', name: 'Herbal Jari Booti Oil', number: '04', form: 'Jar', previewPrice: 420, color: 'sage', short: 'Discover the named product in our brand collection.' },
    { id: 'chyawanprash', name: 'Chyawanprash', number: '05', form: 'Jar', previewPrice: 750, color: 'green', short: 'Learn about the product before making it part of your day.' }
];
const needs = ['Hair & Scalp', 'Skin & Beauty', 'Digestion', 'Energy & Vitality', 'Immunity', 'Everyday Wellness', 'Traditional Remedies'];
const articles = [
    { slug: 'a-slower-beginning', title: 'A slower beginning.', category: 'Everyday rituals', kind: 'leaf', intro: 'Not every new ritual needs to begin with a purchase. Sometimes it begins with a little more attention.', sections: [['Make room for a moment.', 'A quiet shelf. A notebook. A few minutes without another open tab. We imagine this journal as a place to pause and become more curious about the things we bring into everyday life.'], ['Curiosity, before certainty.', 'What is this formulation? What is actually in it? Where can I find the directions and cautions? There is room for simple questions, and good product information should make their answers easy to find.'], ['A note on this journal.', 'This is an original editorial preview, not a health recommendation or a description of an established brand ritual. Brand-reviewed articles and named authors will be added before publication.']] },
    { slug: 'before-you-choose', title: 'Before you choose a formulation.', category: 'Ayurveda, considered', kind: 'root', intro: 'A thoughtful choice begins with clear information, not the promise on the front of a bottle.', sections: [['Look beyond the product name.', 'Before considering a product, look for its complete ingredient list, directions, cautions and approved product details. Those fields remain explicitly pending in this preview.'], ['Keep tradition and evidence distinct.', 'Historical context can explain where an idea comes from. It cannot, on its own, demonstrate what a particular product will do. Our product pages give traditional context and substantiated information separate places.'], ['Take personal questions to a professional.', 'Product browsing is not individual medical advice. Discuss Ayurvedic products with a qualified healthcare professional, particularly when using other medicines or managing a health condition. Do not delay medical care.'], ['Editorial status.', 'Draft for review. General safety reading: NCCIH, Ayurvedic Medicine: In Depth. This article makes no efficacy claims for Chaulas Wale Hakim Ji products.']] },
    { slug: 'a-heritage-carefully-recorded', title: 'A heritage, carefully recorded.', category: 'From the house', kind: 'archive', intro: 'A date can begin a story. The people, places and records give it its depth.', sections: [['Begin with what we know.', 'Chaulas Wale Hakim Ji is a Swastha Ayurveda Pvt. Ltd. brand with heritage dating to 1939, as supplied in the brand brief. That is the starting point for this digital archive.'], ['Leave room for the real story.', 'Founder details, family milestones and archival photographs have not yet been supplied. We have deliberately left those chapters open rather than filling them with invented history.'], ['The next page.', 'The finished archive should bring approved family photographs, dated records and firsthand recollections together. Every image should have a clear caption and every milestone a source. This is the editorial structure for that work, not a completed family history.']] }
];
let cart = [];
let saved = [];
let route = '/';
let query = new URLSearchParams();
let productQty = 1;
let checkoutStep = 1;
let selectedGallery = 'front';
let shopForm = 'all';
let shopMax = 1000;
let shopSort = 'featured';
let shopTerm = '';
let ingredientKind = 'all';
let journalCategory = 'all';
let activeModal = '';
let modalReturnFocus = null;
let checkoutDraft = {};
let storageAvailable = true;
let toastTimer = 0;
const brand = 'Chaulas Wale Hakim Ji';
const sourceURL = 'https://www.nccih.nih.gov/health/ayurvedic-medicine-in-depth';
const esc = (v) => String(v ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const money = (n) => '₹' + n.toLocaleString('en-IN');
const findProduct = (id) => products.find(p => p.id === id);
const countCart = () => cart.reduce((n, l) => n + l.qty, 0);
const cartSubtotal = () => cart.reduce((n, l) => n + (findProduct(l.id)?.previewPrice || 0) * l.qty, 0);
function href(path) { return '#' + (path.startsWith('/') ? path : '/' + path); }
function link(path, label, cls = 'text-link') { return `<a href="${href(path)}" data-route class="${cls}">${label}</a>`; }
function arrow() { return icon('arrow'); }
function icon(name, cls = '') {
    const paths = {
        left: '<path d="m14 6-6 6 6 6"/>', right: '<path d="m10 6 6 6-6 6"/>', reset: '<path d="M4 8V3m0 5h5M4 8a8 8 0 1 1-1 7"/>', arrow: '<path d="M4 12h15M13 6l6 6-6 6"/>', diagonal: '<path d="M5 19 19 5M5 5h14v14"/>', down: '<path d="m6 9 6 6 6-6"/>',
        search: '<circle cx="10.8" cy="10.8" r="6.8"/><path d="m16 16 5 5"/>', bag: '<path d="M5 7h14l1 14H4L5 7Z"/><path d="M8 8V6a4 4 0 0 1 8 0v2"/>',
        menu: '<path d="M3 7h18M3 16h18"/>', close: '<path d="m6 6 12 12M6 18 18 6"/>', user: '<circle cx="12" cy="8" r="3.8"/><path d="M4 21v-2a8 8 0 0 1 16 0v2"/>',
        plus: '<path d="M5 12h14M12 5v14"/>', minus: '<path d="M5 12h14"/>', check: '<path d="m5 12 4 4L19 6"/>', heart: '<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z"/>',
        leaf: '<path d="M19 3C7 1 1 9 6 16s17 1 13-13ZM5 21 16 8"/>', filter: '<path d="M4 7h16M4 17h16"/><circle cx="8" cy="7" r="2" fill="currentColor"/><circle cx="16" cy="17" r="2" fill="currentColor"/>',
        rotate: '<path d="M20 7V3l-4 4M20 7a8 8 0 1 0 0 10"/>', cube: '<path d="m12 2 10 5v10l-10 5-10-5V7l10-5Zm0 10L2 7m10 5 10-5M12 12v10"/>', info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7v1"/>',
        mail: '<rect x="3" y="5" width="18" height="14" rx="1"/><path d="m3 6 9 7 9-7"/>', lock: '<rect x="5" y="10" width="14" height="11" rx="1"/><path d="M8 10V6a4 4 0 0 1 8 0v4M12 14v3"/>', trash: '<path d="M3 6h18M9 6V3h6v3M6 6l1 15h10l1-15M10 10v7M14 10v7"/>', sun: '<circle cx="12" cy="12" r="4"/><path d="M12 1v2M12 21v2M1 12h2M21 12h2M4 4l2 2M18 18l2 2M4 20l2-2M18 6l2-2"/>',
        gift: '<path d="M3 8h18v5H3zM5 13v8h14v-8M12 8v13"/><path d="M12 8C2 8 5 0 9 3l3 5Zm0 0c10 0 7-8 3-5l-3 5Z"/>', book: '<path d="M12 5C9 2 5 2 2 3v17c3-1 7-1 10 2 3-3 7-3 10-2V3c-3-1-7-1-10 2Zm0 0v17"/>', back: '<path d="M20 12H5m6-6-6 6 6 6"/>', zoom: '<circle cx="10" cy="10" r="7"/><path d="m15 15 6 6M7 10h6M10 7v6"/>'
    };
    return `<svg class="icon ${cls}" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.45" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name] || paths.leaf}</svg>`;
}
function crest() { return `<svg viewBox="0 0 70 76" fill="none" aria-hidden="true" class="crest"><path d="M35 3c-8 13-19 13-26 24v30l26 15 26-15V27C54 16 43 16 35 3Z" stroke="currentColor" stroke-width="1"/><path d="M35 11c-7 9-16 11-20 18v24l20 12 20-12V29C51 22 42 20 35 11Z" stroke="currentColor" stroke-width=".6"/><path d="M24 43h24c-1 8-6 13-12 13s-11-5-12-13Zm11 0V25m0 14c-8 0-12-4-12-10 7 0 12 4 12 10Zm0-8c0-7 5-10 11-11-1 7-4 11-11 11Z" stroke="currentColor" stroke-width="1.3"/><path d="m42 43 8-14" stroke="currentColor" stroke-width="3"/><path d="M23 59h25" stroke="currentColor"/></svg>`; }
function legacyWordmark() { return `<span class="wordmark">${crest()}<span><span class="wordmark-top">CHAULAS WALE</span><span class="wordmark-main">Hakim Ji</span><span class="wordmark-bottom">AYURVEDIC HERITAGE · SINCE 1939</span></span></span>`; }
function placeholder(text) { return `<div class="pending"><span class="pending-dot"></span><span>${text}</span></div>`; }
function breadcrumb(items) { return `<nav class="breadcrumbs" aria-label="Breadcrumb">${link('/', 'Home', '')}${items.map(([name, path], i) => `<span aria-hidden="true">/</span>${i === items.length - 1 ? `<span aria-current="page">${esc(name)}</span>` : link(path, esc(name), '')}`).join('')}</nav>`; }
function sectionHead(kicker, title, tail = '', path = '') { return `<div class="section-head"><div><p class="eyebrow">${kicker}</p><h2>${title}</h2></div>${tail ? link(path, tail + ' ' + arrow()) : ''}</div>`; }
function quantity(id, value, context = 'cart') { return `<div class="quantity" role="group" aria-label="Quantity for ${esc(findProduct(id)?.name || 'product')}"><button type="button" data-action="qty" data-id="${id}" data-context="${context}" data-change="-1" aria-label="Decrease quantity" ${value <= 1 ? 'disabled' : ''}>${icon('minus')}</button><output aria-live="polite">${value}</output><button type="button" data-action="qty" data-id="${id}" data-context="${context}" data-change="1" aria-label="Increase quantity" ${value >= 20 ? 'disabled' : ''}>${icon('plus')}</button></div>`; }
/** Original, decorative concept illustrations; never botanical identity or approved package references. */
function botanical(kind = 'leaf', className = '') {
    let shapes = '';
    if (kind === 'root') {
        shapes = '<path d="M158 155C138 205 162 254 143 341M160 169c31 38 17 72 42 102m-49-59c-33 35-39 61-56 96m60-40c32 31 20 58 44 86m-65-87c-13 35-7 71-23 89m49-132c33 5 47 22 57 46m-71-103c-37 22-40 42-64 48" stroke-width="8" stroke="#94704A" opacity=".85"/><path d="M158 155c-2 64-20 117-15 186m17-172c23 46 19 80 42 102m-49-59c-22 42-40 60-56 96m60-40c21 24 24 65 44 86" stroke-width="1.2"/><path d="M158 158V70m-1 53c-23-30-54-12-55-41 26-3 44 15 55 41Zm2-18c25-28 43-6 51-36-28-5-39 8-51 36Zm0-24c-17-23-26-20-20-48 25 9 25 28 20 48Z" fill="#849274" stroke-width="1"/>';
        for (let i = 0; i < 16; i++) {
            const y = 180 + i * 10;
            shapes += `<path d="M${147 + Math.sin(i) * 7} ${y}q${i % 2 ? 28 : -24} 14 ${i % 2 ? 22 : -32} 40" stroke-width=".8" opacity=".6"/>`;
        }
    }
    else if (kind === 'fruit') {
        shapes = '<path d="M145 345c23-80 29-140 5-257m7 111c-26-37-50-49-91-59m93 83c38-12 61-40 79-76" fill="none" stroke-width="2"/>';
        [[83, 152, 1], [118, 198, .88], [204, 187, .92]].forEach(([x, y, s]) => { shapes += `<g transform="translate(${x} ${y}) scale(${s})"><path d="M-27 2C-30-34 29-40 31 0c4 38-59 41-58 2Z" fill="#B5B88B" stroke-width="1"/><path d="M-7-25C-23 0-18 17-5 28M8-28C25-2 21 21 10 29M1-28v57" stroke="#697657" stroke-width=".8" opacity=".7"/><path d="M-2-27v-10m-5 11 11-2" stroke-width="2"/></g>`; });
        for (let i = 0; i < 12; i++) {
            const y = 60 + i * 12;
            const x = 148 + Math.sin(i / 3) * 12;
            shapes += `<path d="M${x} ${y}q-27-35-47-21 11 26 47 21Zm0 0q27-32 43-21-10 22-43 21Z" fill="#718768" fill-opacity=".75" stroke-width=".7"/>`;
        }
    }
    else {
        shapes = '<path d="M143 357C187 273 138 198 159 56m-2 153c-26-20-58-44-72-79m75 116c38-28 54-51 67-85m-71 121c-36-21-56-39-78-79" fill="none" stroke-width="1.8"/>';
        const leaves = [[155, 71, -34, .62], [157, 94, 34, .69], [157, 122, -45, .83], [154, 150, 41, .86], [154, 182, -38, 1], [158, 216, 40, 1.1], [158, 257, -54, .86], [155, 296, 37, .82], [110, 171, -40, .68], [92, 141, -63, .62], [200, 197, 35, .69], [220, 166, 25, .6], [104, 249, -51, .73], [84, 217, -40, .57]];
        leaves.forEach(([x, y, rot, s], i) => { shapes += `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${s})"><path d="M0 0C-28-15-35-44-10-72 12-47 18-20 0 0Z" fill="${i % 3 === 0 ? '#869276' : i % 3 === 1 ? '#657C58' : '#9DA587'}" stroke-width=".8"/><path d="M0 0-10-65m7 43-17-9m15-4 13-12m-15 0-11-9" fill="none" stroke="#344B32" stroke-width=".7"/><path d="M-10-63C-24-42-23-17 0 0" fill="none" stroke="#B7BCA1" stroke-width="1" opacity=".7"/></g>`; });
    }
    return `<svg viewBox="0 0 320 390" class="botanical ${className}" fill="none" stroke="#57664A" role="img" aria-label="Decorative ${kind} botanical study, not a verified ingredient">${shapes}</svg>`;
}
function packageLabel(p) { return `<div class="package-label ${p.color}"><span class="label-small">CHAULAS WALE</span><b>Hakim Ji</b><span class="label-rule"></span><span class="label-name">${p.name}</span><span class="label-branch">✧</span><span class="label-since">SINCE 1939</span><span class="label-micro">CONCEPT PACKAGING</span></div>`; }
function bottle(p, extra = '') { return `<div class="bottle ${p.form === 'Jar' ? 'jar' : ''} ${extra}" aria-hidden="true"><div class="bottle-cap"><i></i></div><div class="bottle-neck"></div><div class="bottle-body"><div class="bottle-light"></div>${packageLabel(p)}<div class="bottle-foot"></div></div></div>`; }
function carton(p) { return `<div class="carton" aria-hidden="true"><div class="carton-face front">${packageLabel(p)}</div><div class="carton-face right"><span>CHAULAS WALE HAKIM JI</span><i>SINCE 1939</i></div><div class="carton-face left"></div><div class="carton-face back"><span>PRODUCT INFORMATION</span><small>Ingredients<br>Directions<br>Cautions<br><br>Approved details<br>to be added</small></div><div class="carton-face top">1939</div></div>`; }
function stage(p = products[0], variant = 'hero') {
    return `<div class="reference-still" data-reference-product="${p.id}">${referenceCutout(p)}</div>`;
}
function giftArt(open = false) {
    return `<figure class="reference-gift-art"><img src="${mediaURL('ref-gift-wood-original.jpg')}" alt="Supplied wooden Chaulas Wale Hakim Ji gift-box image, with the packaging unchanged" loading="lazy" width="1179" height="632"></figure>`;
}
function archiveArt() { return `<div class="archive-art"><div class="archive-paper"><span>THE HERITAGE ARCHIVE</span>${crest()}<div class="archive-year">1939</div><i>Chaulas Wale Hakim Ji</i><small>A beginning worth remembering.</small></div><div class="archive-sprig">${botanical('leaf')}</div><span class="art-caption">Illustrative composition · not an archival document</span></div>`; }
function productCardV3(p) { return `<article class="product-card"><div class="product-visual"><a href="${href('/products/' + p.id)}" data-route aria-label="Explore ${esc(p.name)}">${stage(p, 'product')}</a><span class="visual-note">CONCEPT ${p.form.toUpperCase()}</span><button type="button" class="save-button ${saved.includes(p.id) ? 'is-saved' : ''}" data-action="save" data-id="${p.id}" aria-label="${saved.includes(p.id) ? 'Unsave' : 'Save'} ${esc(p.name)}" aria-pressed="${saved.includes(p.id)}">${icon('heart')}</button><button type="button" class="quick-view" data-action="quickview" data-id="${p.id}">Quick view ${icon('plus')}</button></div><div class="product-card-body"><p class="eyebrow">THE COLLECTION / ${p.number}</p><h3>${link('/products/' + p.id, esc(p.name), '')}</h3><div class="product-card-bottom"><span class="price">${money(p.previewPrice)}<small>Demo price</small></span><button type="button" data-action="add" data-id="${p.id}" class="small-add" aria-label="Add ${esc(p.name)} to demo bag">Add to bag ${icon('plus')}</button></div></div></article>`; }
function articleCard(a, i = 0) { return `<article class="journal-card journal-card-${i}"><a class="journal-art journal-art-${a.kind}" href="${href('/journal/' + a.slug)}" data-route tabindex="-1" aria-hidden="true">${a.kind === 'archive' ? `<span class="journal-year">1939</span>${crest()}` : botanical(a.kind)}<span>FIELD NOTES / 0${i + 1}</span></a><p class="eyebrow">${a.category} · EDITORIAL PREVIEW</p><h3>${link('/journal/' + a.slug, a.title, '')}</h3>${link('/journal/' + a.slug, 'Read the story ' + arrow())}</article>`; }
/** Shared page components. All copy and labels have an explicit content status. */
function headerV3() {
    return `<a class="skip-link" href="#main">Skip to content</a><header class="site-header v2-header"><a class="brand-link" href="${href('/')}" data-route aria-label="Chaulas Wale Hakim Ji — Home">${wordmark()}</a><nav class="desktop-nav" aria-label="Main navigation">${[['The collection', '/shop'], ['Our story', '/our-story'], ['Ayurveda', '/ayurveda']].map(([n, p]) => `<a href="${href(p)}" data-route ${route === p ? 'aria-current="page"' : ''}>${n}</a>`).join('')}</nav><div class="header-tools"><button type="button" data-action="search" class="icon-button search-trigger" aria-label="Search the website">${icon('search')}</button><button type="button" data-action="cart" class="bag-trigger" aria-label="Open bag, ${countCart()} items">${icon('bag')}<span class="bag-count">${countCart()}</span></button><button type="button" data-action="menu" class="v2-menu-trigger" aria-label="Open menu"><span>Menu</span>${icon('menu')}</button></div></header><div class="scroll-progress" aria-hidden="true"><i></i></div>`;
}
function footer() {
    return `<footer class="site-footer"><div class="footer-top"><div class="footer-intro"><p class="eyebrow">LET THE CONVERSATION CONTINUE</p><h2>A little wisdom.<br><em>Now and then.</em></h2><p>Notes from the house, thoughtful reading, and a closer look at our world.</p></div><form id="newsletter-form" class="newsletter-form"><label for="newsletter-email">Your email address</label><div class="email-line"><input id="newsletter-email" name="email" type="email" placeholder="you@example.com" autocomplete="email" required maxlength="254"><button type="submit" aria-label="Preview newsletter subscription">${arrow()}</button></div><label class="checkbox-label"><input name="consent" type="checkbox" required> I agree to the ${link('/privacy', 'privacy information', 'inline-link')}.</label><small>Preview only. This form does not subscribe you or transmit your email.</small><p class="form-feedback" role="status"></p></form></div><div class="footer-main"><div><a href="${href('/')}" data-route class="footer-wordmark" aria-label="Home">${wordmark()}</a><p class="footer-parent">A Swastha Ayurveda Pvt. Ltd. brand.</p></div><div><h3>Explore the house</h3>${link('/our-story', 'Our Story', '')}${link('/ayurveda', 'Our Ayurveda', '')}${link('/ingredients', 'Botanical Library', '')}${link('/journal', 'The Journal', '')}${link('/licences', 'Licences & Certifications', '')}</div><div><h3>Find your way</h3>${link('/shop', 'All Formulations', '')}${link('/gift-sets', 'Gift Sets', '')}${link('/account', 'Saved Collection', '')}${link('/contact', 'Contact', '')}</div><div><h3>Here to help</h3>${link('/faqs', 'Frequently Asked Questions', '')}${link('/shipping', 'Shipping', '')}${link('/returns', 'Returns', '')}${link('/preview-notes', 'About This Preview', '')}</div></div>${footerDocumentation()}<div class="footer-bottom"><span>© 2026 Chaulas Wale Hakim Ji.</span><span>${link('/privacy', 'Privacy', '')}${link('/terms', 'Terms', '')}</span><span>ROOTED IN TRADITION. &nbsp;OPEN TO TOMORROW.</span></div><button type="button" class="v6-motion-control" data-action="pl-motion" aria-pressed="false">Reduce motion</button><p id="build-status" class="build-status">Preview V6 · Starting…</p><p class="footer-disclaimer">Interactive design preview. Supplied imagery and demo prices are not verified product information. No real orders or payments are accepted.</p></footer>`;
}
function sceneWidget(p, mode = 'single') {
    if (mode === 'mortar')
        return `<figure class="reference-history"><img src="${mediaURL('ref-ras-e-jalali-original.jpg')}" alt="Ras e Jalali in the supplied apothecary setting, with a mortar behind it" width="1408" height="768" loading="lazy"><figcaption>From the supplied brand imagery. Not an archival photograph.</figcaption></figure>`;
    if (mode === 'hero')
        return `<figure class="v6-home-portrait"><img src="${mediaURL('ref-' + p.id + '-cutout.webp')}" alt="${esc(p.name)} — supplied product image" width="279" height="719" fetchpriority="high"></figure>`;
    return referenceStudio(p, mode);
}
function homeV3() {
    return `<section class="v2-hero" aria-labelledby="hero-title"><div class="v2-hero-copy"><p class="eyebrow">AYURVEDIC HERITAGE · SINCE 1939</p><h1 id="hero-title">Rooted.<br><em>Reimagined.</em></h1><p class="v2-hero-description">A family Ayurvedic heritage.<br>A new perspective on the everyday.</p><div class="v2-hero-actions">${link('/shop', 'Explore the collection ' + arrow(), 'button button-dark')}${link('/our-story', 'Our story', 'text-link')}</div></div><div class="v2-hero-object"><div class="v2-object-meta"><span>THE APOTHECARY</span><span>01 — RAS E JALALI</span></div>${sceneWidget(products[0], 'hero')}</div><div class="v2-hero-bottom"><span>1939 heritage. <em>2026 experience.</em></span><a href="#heritage" class="v2-scroll">A slower kind of discovery ${icon('down')}</a>${link('/preview-notes', 'Design preview · no real orders', 'v2-preview-link')}</div></section>
 <section class="v2-heritage" id="heritage" aria-label="Our heritage, in three chapters"><div class="v2-heritage-sticky"><div class="v2-heritage-head"><p class="eyebrow">A HERITAGE TO HOLD ON TO</p><span class="v2-chapter-number" id="chapter-number">01 / 03</span></div><div class="v2-history-stage">${sceneWidget(products[0], 'mortar')}</div><div class="v2-history-copy"><span class="v2-history-year" id="history-year">1939</span><h2 id="history-title">Not just a date.<br><em>A beginning.</em></h2><p id="history-description">Chaulas Wale Hakim Ji is a family Ayurvedic business with heritage dating to 1939.</p>${link('/our-story', 'The story behind the name ' + arrow(), 'text-link')}</div><div class="v2-chapter-nav" role="group" aria-label="Explore the heritage chapters"><button type="button" data-action="chapter" data-index="0" aria-pressed="true"><span>01</span>1939</button><button type="button" data-action="chapter" data-index="1" aria-pressed="false"><span>02</span>Generations</button><button type="button" data-action="chapter" data-index="2" aria-pressed="false"><span>03</span>Today</button><small>Scroll to explore. Or choose a chapter.</small></div></div></section>
 <section class="v2-collection section" id="collection"><div class="v2-section-heading"><div><p class="eyebrow">THE COLLECTION, ONE AT A TIME</p><h2>Every formulation.<br><em>A closer look.</em></h2></div>${link('/shop', 'Visit the apothecary ' + arrow(), 'text-link')}</div><div class="v2-collection-layout"><div class="v2-product-selector"><p class="v2-micro">SELECT A FORMULATION</p><div role="group" aria-label="Choose a formulation to inspect">${products.map((p, i) => `<button type="button" class="v2-product-choice ${i === 0 ? 'is-active' : ''}" data-action="select-product" data-id="${p.id}" aria-pressed="${i === 0}"><span>${p.number}</span><h3>${p.name}</h3>${arrow()}</button>`).join('')}</div><p class="quiet-note">Five names from the supplied collection.<br>Supplied packaging images. Demonstration prices.</p></div><div class="v2-collection-inspector"><div id="collection-scene">${sceneWidget(products[0], 'gallery')}</div><div class="v2-collection-detail" id="collection-detail">${collectionDetail(products[0])}</div></div></div></section>
 <section class="v2-way section"><div class="v2-way-heading"><p class="eyebrow">THE HAKIM JI WAY</p><h2>Understanding<br><em>comes first.</em></h2>${link('/ayurveda', 'Explore our Ayurveda ' + arrow(), 'text-link')}</div><div class="v2-way-list"><details open><summary><span>01</span><h3>Know the story.</h3>${icon('plus')}</summary><p>Start with the family, the heritage and the context behind the name. Verified records will shape the fuller story.</p></details><details><summary><span>02</span><h3>Read beyond the label.</h3>${icon('plus')}</summary><p>Ingredients, directions and cautions belong together. They remain marked as pending until approved information is supplied.</p></details><details><summary><span>03</span><h3>Leave room for questions.</h3>${icon('plus')}</summary><p>Traditional context and product evidence are not the same. This preview makes no product-benefit or suitability claims.</p></details></div></section>
 <section class="v2-explore section"><a class="v2-library-link" href="${href('/ingredients')}" data-route><p class="eyebrow">THE BOTANICAL ARCHIVE</p><h2>A closer look<br><em>at nature.</em></h2><div class="v2-botanical-art">${botanical('leaf')}</div><span class="v2-explore-action">Enter the ingredient library ${arrow()}</span><small>Decorative study · approved ingredient entries pending</small></a><div class="v2-gift-link"><p class="eyebrow">SOMETHING WORTH GIVING</p><h2>Tradition,<br><em>thoughtfully wrapped.</em></h2><div class="v2-gift-preview">${giftArt()}</div>${link('/gift-sets', 'Open the gifting experience ' + arrow(), 'v2-explore-action')}<small>Gift packaging concept · contents unconfirmed</small></div></section>
 <section class="v2-journal section"><p class="eyebrow">NOTES FROM THE HOUSE</p><div class="v2-journal-title"><h2>Pause.<br><em>Stay curious.</em></h2>${link('/journal', 'Read the journal ' + arrow(), 'text-link')}</div><div class="v2-journal-lines">${articles.map((a, i) => `<a href="${href('/journal/' + a.slug)}" data-route><span>0${i + 1}</span><h3>${a.title}</h3><small>${a.category}</small>${arrow()}</a>`).join('')}</div><p class="quiet-note">Editorial previews, awaiting brand review.</p></section>
 <section class="v2-closing"><p class="eyebrow">CHAULAS WALE HAKIM JI</p><h2>Old roots.<br><em>Open to tomorrow.</em></h2>${link('/shop', 'Discover the collection ' + arrow(), 'button button-dark')}</section>`;
}
function collectionDetailV3(p) {
    return `<div><p class="eyebrow">FORMULATION ${p.number}</p><h3>${p.name}</h3><p>${money(p.previewPrice)} <small>Demo price</small></p></div><div class="v2-detail-actions">${link('/products/' + p.id, 'Explore formulation ' + arrow(), 'button button-dark')}<button type="button" data-action="add" data-id="${p.id}" class="v2-add-text">Add to demo bag ${icon('plus')}</button></div>`;
}
function shopV3() {
    const need = query.get('need') || '';
    const state = query.get('state') || '';
    const selected = products.filter(p => (shopForm === 'all' || p.form === shopForm) && p.previewPrice <= shopMax && p.name.toLowerCase().includes(shopTerm.toLowerCase()));
    if (shopSort === 'price-low')
        selected.sort((a, b) => a.previewPrice - b.previewPrice);
    if (shopSort === 'price-high')
        selected.sort((a, b) => b.previewPrice - a.previewPrice);
    if (shopSort === 'name')
        selected.sort((a, b) => a.name.localeCompare(b.name));
    return `<section class="shop-intro page-intro">${breadcrumb([['Shop', '/shop']])}<div class="split-heading"><div><p class="eyebrow">THE APOTHECARY / ${String(products.length).padStart(2, '0')} NAMED FORMULATIONS</p><h1>A little closer<br><em>to the collection.</em></h1></div><p>Explore at your own pace. Read the details. Make room for questions.</p></div><div class="shop-notice">${icon('info')}<span>Interactive catalogue preview. Supplied packaging images with demonstration prices. Approved product information is pending.</span>${link('/preview-notes', 'What’s verified?', 'inline-link')}</div></section><section class="shop-section section"><div class="shop-wellness"><span>EXPLORE BY</span><a href="${href('/shop')}" data-route class="${!need ? 'selected' : ''}">All formulations</a>${needs.map(n => `<a href="${href('/shop?need=' + encodeURIComponent(n))}" data-route class="${need === n ? 'selected' : ''}">${n}</a>`).join('')}</div>${need ? `<div class="category-pending"><div><p class="eyebrow">${esc(need)}</p><h2>A thoughtful match<br><em>needs the right information.</em></h2><p>Verified product-to-need mappings have not been supplied. We won’t guess which formulation is right for this category.</p><div class="button-row">${link('/shop', 'Explore the complete collection ' + arrow(), 'button button-dark')}${link('/contact', 'Ask a product question ' + arrow())}</div></div>${botanical('leaf')}</div>` : `<div class="shop-toolbar"><div class="toolbar-left"><button type="button" class="filter-toggle button button-outline" data-action="filters" aria-expanded="false">${icon('filter')} Filters</button><span id="result-count" aria-live="polite">${selected.length} formulations</span></div><div class="sort-control"><label for="shop-sort">Sort by</label><select id="shop-sort"><option value="featured" ${shopSort === 'featured' ? 'selected' : ''}>Collection order</option><option value="price-low" ${shopSort === 'price-low' ? 'selected' : ''}>Demo price: low to high</option><option value="price-high" ${shopSort === 'price-high' ? 'selected' : ''}>Demo price: high to low</option><option value="name" ${shopSort === 'name' ? 'selected' : ''}>Name: A–Z</option></select></div></div><div class="catalogue-layout"><aside class="filter-sidebar" aria-label="Product filters"><div class="filter-head"><h2>Refine your view</h2><button type="button" data-action="clear-filters" class="inline-link">Reset</button></div><label for="shop-search">Search formulations</label><div class="input-icon">${icon('search')}<input id="shop-search" type="search" placeholder="Product name" value="${esc(shopTerm)}"></div><fieldset><legend>Packaging shown</legend>${[['all', 'All formats'], ['Bottle', 'Bottles'], ['Jar', 'Jars']].map(([v, t]) => `<label class="radio-label"><input type="radio" name="shop-form" value="${v}" ${shopForm === v ? 'checked' : ''}>${t}</label>`).join('')}</fieldset><label for="shop-price">Maximum demo price <output>${money(shopMax)}</output></label><input id="shop-price" type="range" min="400" max="1000" step="50" value="${shopMax}"><p class="quiet-note">These are demo prices, not MRP or a sales offer.</p><details class="filter-pending"><summary>Ingredient & suitability filters ${icon('plus')}</summary><p>Available when verified ingredient lists and suitability data are supplied. No inferred matches.</p></details>${link('/gift-sets', 'Looking for a gift? ' + arrow())}</aside><div class="catalogue-results">${state === 'error' ? `<div class="empty-state">${icon('info')}<h2>The collection couldn’t load.</h2><p>Simulated network error for preview testing. Your bag is still here.</p>${link('/shop', 'Try again ' + arrow(), 'button button-dark')}</div>` : state === 'loading' ? `<div class="product-grid shop-grid skeleton-grid" aria-busy="true" aria-label="Preview loading state">${[1, 2, 3].map(() => '<div class="skeleton"><div></div><p></p><span></span></div>').join('')}</div><div class="empty-state compact"><p>Loading-state demonstration.</p>${link('/shop', 'Show the collection ' + arrow())}</div>` : selected.length ? `<div class="product-grid shop-grid">${selected.map(p => productCard(p)).join('')}</div>` : `<div class="empty-state">${icon('search')}<h2>No formulations found.</h2><p>Try another name, a different format, or a higher demo price.</p><button type="button" data-action="clear-filters" class="button button-dark">Reset filters ${arrow()}</button></div>`}</div></div>`}</section><section class="small-brand-banner"><p>Not sure where to begin?</p><h2>Understanding comes first.</h2>${link('/ayurveda', 'Explore our Ayurveda ' + arrow())}</section>`;
}
function story() {
    return `<section class="story-intro page-intro">${breadcrumb([['Our Story', '/our-story']])}<p class="eyebrow">THE HOUSE / OUR STORY</p><h1>A name.<br>A beginning.<br><em>A continuing story.</em></h1><div class="story-intro-foot"><p>Chaulas Wale Hakim Ji.<br>A Swastha Ayurveda Pvt. Ltd. brand.<br>Heritage dating to 1939.</p><span>SCROLL TO TURN THE PAGE ${icon('down')}</span></div><div class="story-year" aria-hidden="true">1939</div></section><section class="story-chapter section"><div><p class="eyebrow">CHAPTER 01 / THE BEGINNING</p><h2>It starts<br><em>with 1939.</em></h2><p>That is the date at the heart of our identity. The beginning of the heritage we are bringing into this new digital home.</p>${placeholder('Founder story, original location and founding records to be added.')}</div>${archiveArt()}</section><section class="story-quote"><p class="eyebrow">LEAVING ROOM FOR WHAT IS REAL</p><h2>The most important part<br>of a heritage story?<br><em>That it’s yours.</em></h2><p>Family photographs, memories and milestones belong here.<br>Invented ones do not.</p></section><section class="story-chapter section"><div class="story-botanical">${botanical('root')}<small>Decorative botanical study</small></div><div><p class="eyebrow">CHAPTER 02 / THE KNOWLEDGE</p><h2>What we carry<br><em>forward.</em></h2><p>Traditional Ayurvedic knowledge and family heritage form the direction of Chaulas Wale Hakim Ji. Our aim is to make that identity easier to discover and understand.</p>${placeholder('Approved family lineage, preparation practices and formulation stories to be added.')}${link('/ayurveda', 'Explore the philosophy ' + arrow())}</div></section><section class="timeline-section section"><p class="eyebrow">THE RECORD, SO FAR</p><div class="timeline"><div><span class="timeline-date">1939</span><i></i><h3>Heritage begins.</h3><p>Brand-supplied heritage date.</p></div><div><span class="timeline-date italic">Generations</span><i></i><h3>A chapter to document.</h3><p>Verified family milestones and records pending.</p></div><div><span class="timeline-date">Today</span><i></i><h3>Tradition, encountered anew.</h3><p>A brand of Swastha Ayurveda Pvt. Ltd.</p></div></div></section>${storyDocumentation()}<section class="closing-section"><p class="eyebrow">THE NEXT CHAPTER IS AN INVITATION</p><h2>Come closer<br><em>to our world.</em></h2>${link('/shop', 'Explore the apothecary ' + arrow())}</section>`;
}
function ayurveda() {
    return `<section class="ayurveda-intro page-intro">${breadcrumb([['Ayurveda', '/ayurveda']])}<div><p class="eyebrow">AYURVEDA / AN APPROACHABLE BEGINNING</p><h1>Not a quick fix.<br><em>A closer look.</em></h1><p class="lead">A space to understand the tradition, ask better questions, and separate context from claims.</p></div><div class="ayurveda-leaf">${botanical('leaf')}</div></section><section class="ayurveda-explainer section"><div><p class="eyebrow">FIRST, A LITTLE CONTEXT</p><h2>What is<br><em>Ayurveda?</em></h2></div><div><p class="large-copy">Ayurveda is a traditional system of medicine originating in India.</p><p>That background tells us where the tradition comes from. It does not establish the safety or effectiveness of every product described as Ayurvedic.</p><p>On this website, product-specific ingredients, directions and claims will only be added from approved, verified information.</p><a href="${sourceURL}" target="_blank" rel="noopener noreferrer" class="source-link">General reference: NCCIH, Ayurvedic Medicine: In Depth ${arrow()}</a></div></section><section class="philosophy-tabs section"><p class="eyebrow">THE HAKIM JI WAY / EXPLORE THE PRINCIPLES</p><div class="principle-layout"><div class="principle-nav" role="tablist" aria-label="Our digital principles"><button type="button" role="tab" id="principle-tab-0" aria-controls="principle-panel" aria-selected="true" data-action="principle" data-index="0">01 <span>Tradition</span>${arrow()}</button><button type="button" role="tab" id="principle-tab-1" aria-controls="principle-panel" aria-selected="false" tabindex="-1" data-action="principle" data-index="1">02 <span>Understanding</span>${arrow()}</button><button type="button" role="tab" id="principle-tab-2" aria-controls="principle-panel" aria-selected="false" tabindex="-1" data-action="principle" data-index="2">03 <span>Clarity</span>${arrow()}</button></div><div id="principle-panel" role="tabpanel" aria-labelledby="principle-tab-0" tabindex="0">${principleContent(0)}</div></div></section><section class="evidence-section section"><p class="eyebrow">AN IMPORTANT DISTINCTION</p><h2>Context isn’t<br><em>clinical evidence.</em></h2><div class="evidence-columns"><div><span class="evidence-number">01</span><h3>Traditional context</h3><p>The historical background of a practice or formulation. It needs a reliable source and must not be presented as proof of a product’s effects.</p></div><div><span class="evidence-number">02</span><h3>Substantiated product information</h3><p>The approved details and supporting evidence for the specific formulation. These fields remain pending until verified material is supplied.</p></div></div></section><section class="safety-note section"><div>${icon('info')}<h2>A note on personal care.</h2></div><p>This website is not a substitute for individual medical advice. Discuss Ayurvedic products with a qualified healthcare professional, especially when taking medicines or managing a health condition. Do not delay medical care.</p><a class="source-link" href="${sourceURL}" target="_blank" rel="noopener noreferrer">Read the NCCIH safety overview ${arrow()}</a></section><section class="small-brand-banner"><h2>Curiosity is a good beginning.</h2>${link('/ingredients', 'Explore the botanical library ' + arrow())}</section>`;
}
function principleContent(i) {
    const c = [['Honour the roots.', 'Start with the story and give it room to be documented properly. Our heritage date is 1939. Further family history will come from real records, not decorative copy.', 'leaf'], ['Read beyond the label.', 'A name and a beautiful bottle are only the beginning. Ingredient lists, directions, cautions and suitability should be easy to find before a purchase.', 'root'], ['Say what we know.', 'Pending information is labelled as pending. Traditional context has its own place. Product claims need their own substantiation. That is the structure of this digital home.', 'fruit']][i];
    return `<div class="principle-art">${botanical(c[2])}</div><p class="eyebrow">THE HAKIM JI WAY / 0${i + 1}</p><h3>${c[0]}</h3><p>${c[1]}</p>`;
}
function ingredients() {
    const types = ['leaf', 'root', 'fruit'];
    const chosen = types.filter(t => ingredientKind === 'all' || ingredientKind === t);
    return `<section class="ingredient-intro page-intro">${breadcrumb([['Ingredients', '/ingredients']])}<p class="eyebrow">THE BOTANICAL LIBRARY</p><h1>A world of detail.<br><em>A little more wonder.</em></h1><p class="lead">An evolving archive of the ingredients behind our formulations. A place for curiosity, with room for the facts.</p>${placeholder('Library preview: no verified ingredient names or product associations have been supplied. These are decorative studies, not catalogue ingredients.')}</section><section class="ingredient-library section"><div class="library-toolbar"><div class="filter-pills" role="group" aria-label="Filter decorative studies">${[['all', 'All studies'], ['leaf', 'Leaves'], ['root', 'Roots'], ['fruit', 'Fruits']].map(([v, t]) => `<button type="button" data-action="ingredient-filter" data-kind="${v}" aria-pressed="${ingredientKind === v}">${t}</button>`).join('')}</div><span>${chosen.length} illustrative ${chosen.length === 1 ? 'study' : 'studies'}</span></div><div class="ingredient-grid">${chosen.map(t => `<button type="button" class="ingredient-card" data-action="ingredient-detail" data-kind="${t}"><span class="plate-index">ILLUSTRATED STUDY / 00${types.indexOf(t) + 1}</span>${botanical(t)}<div><h2>${t === 'leaf' ? 'The leaf.' : t === 'root' ? 'The root.' : 'The fruit.'}</h2>${arrow()}</div><p>Botanical identity to be verified</p></button>`).join('')}</div><div class="library-bottom"><h2>A beautiful illustration<br><em>is not an ingredient list.</em></h2><p>When approved data arrives, each entry will include the verified common and botanical name, source-backed traditional context, and only those products confirmed to contain it.</p></div></section>`;
}
function journal() {
    const cats = ['all', ...Array.from(new Set(articles.map(a => a.category)))];
    const shown = articles.filter(a => journalCategory === 'all' || a.category === journalCategory);
    return `<section class="journal-intro page-intro">${breadcrumb([['Journal', '/journal']])}<p class="eyebrow">NOTES FROM THE HOUSE</p><h1>For the<br><em>curious at heart.</em></h1><p class="lead">On tradition, thoughtful choices, and the small details worth noticing.</p></section><section class="section journal-list"><div class="filter-pills" role="group" aria-label="Journal categories">${cats.map(c => `<button type="button" data-action="journal-filter" data-category="${c}" aria-pressed="${journalCategory === c}">${c === 'all' ? 'All stories' : c}</button>`).join('')}</div><p class="quiet-note">Original editorial previews. Brand review and approved author attribution pending.</p><div class="journal-grid">${shown.map((a, i) => articleCard(a, i)).join('')}</div></section>`;
}
function articlePage(a) {
    return `<article><header class="article-header page-intro">${breadcrumb([['Journal', '/journal'], [a.title, '/journal/' + a.slug]])}<p class="eyebrow">${a.category} / EDITORIAL PREVIEW</p><h1>${a.title}</h1><p class="lead">${a.intro}</p><p class="quiet-note">Draft for brand review · Author attribution pending</p></header><div class="article-hero-art ${a.kind === 'archive' ? 'is-archive' : ''}">${a.kind === 'archive' ? archiveArt() : botanical(a.kind)}<span>Illustrative composition</span></div><div class="article-body">${a.sections.map(([t, d]) => `<section><h2>${t}</h2><p>${d}</p></section>`).join('')}${a.slug === 'before-you-choose' ? `<a href="${sourceURL}" target="_blank" rel="noopener noreferrer" class="source-link">Source: NCCIH, Ayurvedic Medicine: In Depth ${arrow()}</a>` : ''}<div class="article-end">${link('/journal', icon('left') + ' Back to the journal')}</div></div></article>`;
}
function gifts() {
    return `<section class="page-intro reference-gift-intro">${breadcrumb([['Gift Sets', '/gift-sets']])}<div class="reference-gift-heading"><div><p class="eyebrow">FROM OUR HOUSE TO YOURS</p><h1>Some gifts<br>say a little<br><em>more.</em></h1></div><div><p class="lead">A little tradition. A thoughtful gesture.<br>Explore the packaging, then make the note your own.</p>${link('/contact?topic=gifting', 'Enquire about a gift ' + arrow(), 'button button-dark')}</div></div><div class="reference-gift-viewer" data-gift-album><div class="reference-gift-main"><img id="gift-reference-image" src="${mediaURL('ref-gift-wood-original.jpg')}" alt="Supplied wooden gift-box image, unchanged" width="1179" height="632"></div><div class="reference-gift-options" role="group" aria-label="Explore the supplied gift-box images">${[['wood', 'Wooden box'], ['green', 'Ivory & green'], ['paper', 'Parchment box']].map(([id, name], i) => `<button type="button" data-action="ref-gift-select" data-id="${id}" aria-pressed="${i === 0}"><img src="${mediaURL('ref-gift-' + id + '-original.jpg')}" alt="" width="180" height="110"><span>${name}</span>${arrow()}</button>`).join('')}</div><p class="quiet-note">Supplied packaging artwork, retained as provided. Printed counts and claims are not verified by this preview. Contents, prices and availability require confirmation.</p></div></section><section class="gift-builder section"><div><p class="eyebrow">THE PERSONAL TOUCH</p><h2>A note<br><em>of your own.</em></h2><p>The packaging stays as supplied. Give your separate note a personal touch.</p><form id="gift-form"><fieldset><legend>Note-card colour</legend><div class="wrap-options">${[['forest', 'Botanical'], ['ivory', 'Warm ivory'], ['brown', 'Charcoal']].map(([v, t]) => `<label><input type="radio" name="wrap" value="${v}" ${v === 'ivory' ? 'checked' : ''}><span class="wrap-swatch ${v}"></span>${t}</label>`).join('')}</div></fieldset><label for="gift-message">Your gift note <span class="optional">(optional)</span></label><textarea id="gift-message" name="message" rows="3" maxlength="180" placeholder="A little tradition, with a lot of love."></textarea><div class="character-count"><output id="gift-count">0</output> / 180</div><button class="button button-dark" type="submit">Save my note on this device ${arrow()}</button><p class="form-feedback" role="status"></p><p class="quiet-note">This saves a note only. No gift order or enquiry is sent.</p></form></div><div class="gift-note-preview" data-wrap="ivory"><p class="eyebrow">A LITTLE SOMETHING, JUST FOR YOU</p>${wordmark()}<p id="gift-note-text">A little tradition,<br>with a lot of love.</p><span>A NOTE FROM THE HOUSE</span></div></section>`;
}
function cartLines(drawer = false) {
    return cart.map(l => { const p = findProduct(l.id); return `<article class="cart-line"><a class="cart-line-art" href="${href('/products/' + p.id)}" data-route aria-label="View ${esc(p.name)}">${frontPhoto(p, true)}</a><div class="cart-line-info"><p class="eyebrow">CONCEPT ${p.form.toUpperCase()}</p><h3>${link('/products/' + p.id, p.name, '')}</h3><p>${money(p.previewPrice)} <small>demo price</small></p>${quantity(p.id, l.qty)}<button type="button" data-action="remove" data-id="${p.id}" class="remove-item" aria-label="Remove ${esc(p.name)}">Remove</button></div><strong class="line-total">${money(p.previewPrice * l.qty)}</strong></article>`; }).join('');
}
function summaryBlockV3(button = true) {
    return `<div class="order-summary"><p class="eyebrow">YOUR DEMO BAG</p><h2>A considered choice.</h2><dl><div><dt>Subtotal (${countCart()} ${countCart() === 1 ? 'item' : 'items'})</dt><dd>${money(cartSubtotal())}</dd></div><div><dt>Delivery</dt><dd>Not calculated</dd></div><div><dt>Taxes</dt><dd>Not calculated</dd></div><div class="summary-total"><dt>Demo subtotal</dt><dd>${money(cartSubtotal())}</dd></div></dl><p class="quiet-note">Illustrative prices only. This is not a final payable total or a sales offer.</p>${button ? link('/checkout', 'Continue to demo checkout ' + arrow(), 'button button-dark full-width') : ''}<p class="purchase-note">${icon('lock')} No real payment or order.</p>${link('/shop', 'Continue exploring ' + arrow())}</div>`;
}
function cartPage() {
    return `<section class="cart-page page-intro">${breadcrumb([['Your Bag', '/cart']])}<p class="eyebrow">THE THINGS YOU’RE EXPLORING</p><h1>Your <em>bag.</em></h1>${cart.length ? `<div class="cart-layout"><div class="cart-items">${cartLines()}</div>${summaryBlock()}</div>` : `<div class="empty-state large-empty">${icon('bag')}<h2>A little room<br><em>for discovery.</em></h2><p>Your bag is empty. Explore the apothecary and find something to look at more closely.</p>${link('/shop', 'Explore the collection ' + arrow(), 'button button-dark')}</div>`}</section>`;
}
function checkout() {
    if (!cart.length && checkoutStep !== 3)
        return `<section class="page-intro">${breadcrumb([['Checkout', '/checkout']])}<div class="empty-state large-empty"><h1>Nothing in your bag.<br><em>Plenty to discover.</em></h1><p>Add a formulation to explore the checkout experience.</p>${link('/shop', 'Explore the collection ' + arrow(), 'button button-dark')}</div></section>`;
    if (checkoutStep === 3)
        return `<section class="page-intro checkout-complete"><span class="completion-symbol">${icon('check')}</span><p class="eyebrow">DEMO COMPLETE</p><h1>A thoughtful choice.<br><em>A preview completed.</em></h1><p class="lead">You have reached the end of the demonstration checkout.</p><div class="completion-facts"><p>No order was placed.</p><p>No money was charged.</p><p>No confirmation email was sent.</p></div><p>Your bag has been cleared on this device. Contact and delivery details were not stored or transmitted.</p>${link('/shop', 'Return to the apothecary ' + arrow(), 'button button-dark')}</section>`;
    return `<section class="checkout-page page-intro">${breadcrumb([['Bag', '/cart'], ['Demo Checkout', '/checkout']])}<p class="eyebrow">A SIMPLE, CONSIDERED CHECKOUT</p><h1>Almost <em>there.</em></h1><div class="checkout-disclaimer">${icon('info')}<span><strong>Demonstration only.</strong> Use fictional details. Nothing is submitted to a server. This checkout cannot take payment.</span></div><ol class="checkout-steps"><li class="${checkoutStep === 1 ? 'current' : 'complete'}"><span>01</span> Details</li><li class="${checkoutStep === 2 ? 'current' : ''}"><span>02</span> Review</li><li><span>03</span> Demo complete</li></ol><div class="checkout-layout"><div>${checkoutStep === 1 ? `<form id="checkout-details" class="checkout-form"><h2>Your details</h2><p class="quiet-note">Fictional information only. Held in page memory until the preview is completed or reloaded.</p><div class="form-grid"><div><label for="co-name">Full name</label><input id="co-name" name="name" autocomplete="off" required minlength="2" maxlength="80" value="${esc(checkoutDraft.name)}" placeholder="A. Customer"></div><div><label for="co-email">Email address</label><input id="co-email" type="email" name="email" autocomplete="off" required maxlength="254" value="${esc(checkoutDraft.email)}" placeholder="customer@example.com"></div><div><label for="co-phone">Mobile number</label><input id="co-phone" name="phone" inputmode="numeric" pattern="[0-9]{10}" autocomplete="off" required maxlength="10" title="Enter 10 digits for this India checkout demonstration" value="${esc(checkoutDraft.phone)}" placeholder="10 digits"></div><div><label for="co-pin">PIN code</label><input id="co-pin" name="pin" inputmode="numeric" pattern="[1-9][0-9]{5}" autocomplete="off" required maxlength="6" title="Enter a six-digit PIN code" value="${esc(checkoutDraft.pin)}" placeholder="6 digits"></div><div class="full-span"><label for="co-address">Address</label><input id="co-address" name="address" autocomplete="off" required minlength="5" maxlength="180" value="${esc(checkoutDraft.address)}" placeholder="Fictional street and building"></div><div><label for="co-city">City</label><input id="co-city" name="city" autocomplete="off" required maxlength="80" value="${esc(checkoutDraft.city)}"></div><div><label for="co-state">State / Union Territory</label><select id="co-state" name="state" required><option value="">Select one</option>${['Andaman and Nicobar Islands', 'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chandigarh', 'Chhattisgarh', 'Dadra and Nagar Haveli and Daman and Diu', 'Delhi', 'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jammu and Kashmir', 'Jharkhand', 'Karnataka', 'Kerala', 'Ladakh', 'Lakshadweep', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Puducherry', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal'].map(s => `<option ${checkoutDraft.state === s ? 'selected' : ''}>${s}</option>`).join('')}</select></div></div><label class="checkbox-label"><input name="acknowledge" type="checkbox" required> I understand this is a demo, not an order.</label><div class="button-row"><button class="button button-dark" type="submit">Review demo order ${arrow()}</button>${link('/cart', 'Back to bag', 'text-link')}</div></form>` : `<div class="checkout-review"><h2>A final look.</h2><div class="review-address"><p class="eyebrow">DEMO DELIVERY DETAILS</p><strong>${esc(checkoutDraft.name)}</strong><p>${esc(checkoutDraft.address)}<br>${esc(checkoutDraft.city)}, ${esc(checkoutDraft.state)} ${esc(checkoutDraft.pin)}</p><p>${esc(checkoutDraft.email)}<br>${esc(checkoutDraft.phone)}</p><button type="button" data-action="checkout-back" class="inline-link">Edit details</button></div><div class="checkout-delivery"><h3>Delivery & payment</h3><p>No carrier, delivery date, shipping charge or tax has been calculated. No payment provider is connected. There are no card fields in this preview.</p></div>${cartLines()}<form id="checkout-confirm"><label class="checkbox-label"><input type="checkbox" required> I understand that completing this preview creates no real order.</label><button class="button button-dark full-width" type="submit">Complete demo · no payment ${arrow()}</button></form></div>`}</div>${summaryBlock(false)}</div></section>`;
}
function contact() {
    return `<section class="contact-intro page-intro">${breadcrumb([['Contact', '/contact']])}<p class="eyebrow">THERE’S ALWAYS ROOM FOR A QUESTION</p><h1>Let’s begin<br><em>a conversation.</em></h1><p class="lead">About a formulation, a gift, or the house itself.</p></section><section class="contact-layout section"><div><h2>We’re listening.</h2><p>Leave room for a proper conversation. Use this form to explore the enquiry experience.</p><div class="contact-details"><p><span>EMAIL</span>[Verified email address to be added]</p><p><span>PHONE</span>[Verified phone number to be added]</p><p><span>VISIT THE HOUSE</span>[Verified address and opening hours to be added]</p></div><p class="quiet-note">This form is a local demonstration. Messages are not delivered. For personal health questions, consult a qualified healthcare professional.</p></div><form id="contact-form"><div class="form-grid"><div><label for="contact-name">Your name</label><input id="contact-name" name="name" required maxlength="80" autocomplete="name"></div><div><label for="contact-email">Email address</label><input id="contact-email" name="email" type="email" required maxlength="254" autocomplete="email"></div><div class="full-span"><label for="contact-topic">What brings you here?</label><select id="contact-topic" name="topic"><option ${query.get('product') ? 'selected' : ''}>Product question</option><option ${query.get('topic') === 'gifting' ? 'selected' : ''}>Gifting</option><option ${query.get('topic') === 'documentation' ? 'selected' : ''}>Licences & documentation</option><option>Brand story</option><option>Something else</option></select></div><div class="full-span"><label for="contact-message">Your message</label><textarea id="contact-message" name="message" rows="5" required minlength="10" maxlength="2000" placeholder="Please do not include sensitive medical information.">${query.get('product') ? esc('I would like to know more about ' + (findProduct(query.get('product') || '')?.name || 'a formulation') + '.') : ''}</textarea></div></div><label class="checkbox-label"><input type="checkbox" required> I have read the ${link('/privacy', 'privacy information', 'inline-link')} and understand this form is a demo.</label><button type="submit" class="button button-dark">Preview enquiry ${arrow()}</button><p class="form-feedback" role="status"></p></form></section>`;
}
function account() {
    return `<section class="account-page page-intro">${breadcrumb([['Saved Collection', '/account']])}<p class="eyebrow">A PLACE FOR YOUR CURIOSITY</p><h1>Your saved<br><em>collection.</em></h1><p class="lead">For the formulations you’d like to return to.</p><div class="shop-notice">${icon('info')}<span>Saved on this device only. No account is created, and this is not a sign-in or authentication service.</span></div>${saved.length ? `<div class="product-grid featured-grid">${saved.map(id => findProduct(id)).filter((p) => !!p).map(p => productCard(p)).join('')}</div>` : `<div class="empty-state"><span>${icon('heart')}</span><h2>Keep something<br><em>in mind.</em></h2><p>Tap the heart on a formulation to save it here.</p>${link('/shop', 'Explore the collection ' + arrow(), 'button button-dark')}</div>`}</section>`;
}
function faqs() {
    const qs = [['Is this a live store?', 'No. The website is an interactive design and shopping demonstration. It does not accept payments or create real orders.'], ['What brand details are supplied?', 'The supplied brief names Chaulas Wale Hakim Ji, its relationship to Swastha Ayurveda Pvt. Ltd., the heritage date 1939, and five product names.'], ['Are product prices and packaging final?', 'All displayed prices are demo values. The supplied product images and right-hand brand logo are used as provided. The artwork’s publication-ready status, printed claims and product details still require confirmation. Botanical studies remain decorative.'], ['Where are the ingredients and directions?', 'Those details have not yet been provided. They are visibly marked as pending on every product page, rather than inferred or fabricated.'], ['Are these formulations suitable for me?', 'Suitability has not been verified. This preview does not assess your health or recommend a product. Discuss personal health questions with a qualified healthcare professional.'], ['Can I see my order history or sign in?', 'Not in this version. Saved products and the cart work locally on your device. Authentication and real order management are not connected.'], ['How do I contact the brand?', 'Verified contact details have not been supplied. The Contact page demonstrates the enquiry flow but does not deliver messages.']];
    return `<section class="page-intro">${breadcrumb([['FAQs', '/faqs']])}<p class="eyebrow">A LITTLE MORE CLARITY</p><h1>Questions,<br><em>welcome.</em></h1></section><section class="faq-list section">${qs.map(([q, a], i) => `<details class="accordion" ${i === 0 ? 'open' : ''}><summary>${q}${icon('plus')}</summary><div><p>${a}</p></div></details>`).join('')}${link('/contact', 'A different question? ' + arrow())}</section>`;
}
function policyPage(type) {
    const content = {
        shipping: ['Shipping', 'Delivery details, without assumptions.', [['Policy awaiting approval', '[Verified delivery regions, fulfilment windows, shipping fees, courier arrangements and serviceability rules to be added.]'], ['This preview', 'No products are dispatched, no delivery dates are promised and no shipping fees are calculated. A PIN code field in checkout demonstrates the form only; it does not check carrier serviceability.']]],
        returns: ['Returns', 'Clear expectations belong here.', [['Policy awaiting approval', '[Brand-approved return eligibility, cancellation conditions, refund process, timeframes and customer-support details to be added.]'], ['This preview', 'There is no real purchase, return or refund service. No return window or refund entitlement has been invented.']]],
        privacy: ['Privacy', 'What this preview does with your information.', [['Local storage', 'The bag, saved product IDs and optional saved gift note are stored in your browser when local storage is available. They are not synced to an account. The gift note may include your message; do not enter sensitive information.'], ['Browsing preferences & recent products', 'The optional Remember choice stores only packaging-format and demo-budget preferences on this device. Recently viewed product IDs and the optional demo promo code are stored for this browser tab when session storage is available. No health profile is created. Use the clear-data control below to remove them.'], ['Forms', 'Newsletter and contact forms validate locally and display a demo acknowledgement. They do not send data or subscribe you. Checkout details are held only in page memory and are discarded when the demo is completed or the page reloads.'], ['Third parties', 'This standalone preview does not load tracking, analytics, external fonts, remote imagery or payment scripts. Following an external source link opens a separate website with its own privacy practices.'], ['Before public launch', '[A reviewed privacy notice covering the actual operator, processors, data use, retention, user rights and contact details must replace this preview explanation.]']]],
        terms: ['Terms', 'A design preview, not a sales offer.', [['Purpose', 'This website demonstrates the proposed brand and e-commerce experience. Demo prices are not approved sales offers. Supplied packaging images are retained as references; their printed details and claims are not independently verified.'], ['No transactions', 'Checkout does not accept payment, create a real order, or send a confirmation. No account authentication, inventory reservation, tax calculation or shipping service is connected.'], ['Content limitations', 'Health-related product information has not been supplied. Do not use this preview for dosage, suitability, diagnosis, treatment or other medical decisions.'], ['Before public launch', '[Reviewed commercial terms, company disclosures, applicable policies and customer-service information must be supplied before the site is used for real sales.]']]]
    };
    const c = content[type];
    return `<section class="page-intro policy-intro">${breadcrumb([[c[0], '/' + type]])}<p class="eyebrow">HELP & INFORMATION / PREVIEW</p><h1>${c[0]}<em> information.</em></h1><p class="lead">${c[1]}</p></section><section class="policy-body">${c[2].map(([t, d]) => `<div><h2>${t}</h2><p>${d}</p></div>`).join('')}${type === 'privacy' ? '<button type="button" data-action="clear-data" class="button button-outline">Clear all local preview data</button>' : ''}${link('/contact', 'Contact information ' + arrow())}</section>`;
}
function previewNotes() {
    return `<section class="page-intro">${breadcrumb([['Preview Notes', '/preview-notes']])}<p class="eyebrow">THE DESIGN, WITH NOTHING HIDDEN</p><h1>1939 heritage.<br><em>2026 experience.</em></h1><p class="lead">A working brand-and-commerce frontend. Here is exactly what is real, illustrative, and still to be connected.</p></section><section class="preview-content section"><div class="status-columns"><div><span class="status-tag">SUPPLIED IN THE BRIEF</span><h2>The foundations.</h2><p>Chaulas Wale Hakim Ji.<br>A Swastha Ayurveda Pvt. Ltd. brand.<br>Heritage dating to 1939.</p><p>Product names: Ras e Jalali, Majun Jalali, Ras e Faulad, Herbal Jari Booti Oil, and Chyawanprash.</p></div><div><span class="status-tag">SUPPLIED VISUAL ASSETS</span><h2>The actual references.</h2><p>Six supplied product and gift-set images, and the right-hand, non-human brand logo. Original image files are retained unchanged; detail crops and background-only masks use their existing pixels.</p><p>The website logo is not added to any product image. Printed claims, counts, directions and pack information in the artwork have not been independently verified. Decorative botanical studies and editorial drafts remain illustrative.</p></div><div><span class="status-tag">PENDING VERIFICATION</span><h2>The details.</h2><p>Founder and family history, ingredients, directions, warnings, suitability, pack sizes, prices, stock, regulatory information, manufacturing claims, reviews, policies and contact details.</p></div></div><div class="preview-section"><h2>What works.</h2><p>Navigation, search, filters, sorting, quick view, multi-image galleries, image comparison, document records, scroll-driven 3D packaging, text reveals, photographic depth and zoom, saved items, local bag, quantities, removal, preference-based discovery, optional demo promotion, multi-step demo checkout, three supplied gift-box views, editable gift note, journal categories, botanical filters, forms and mobile navigation.</p><h2>What is not connected.</h2><p>Real payments, order creation, product inventory, tax or delivery calculation, email delivery, newsletter subscription, customer authentication and a content backend. The frontend must not be represented as a live sales service.</p><h2>Interaction state previews.</h2><div class="state-links">${link('/shop?state=loading', 'Loading state ' + arrow(), 'button button-outline')}${link('/shop?state=error', 'Error & retry ' + arrow(), 'button button-outline')}${link('/products/ras-e-jalali?state=out-of-stock', 'Out-of-stock state ' + arrow(), 'button button-outline')}${link('/not-a-page', 'Not-found state ' + arrow(), 'button button-outline')}</div><h2>About the 3D packaging studies.</h2><p>Each product landing now includes a real-time WebGL 2 packaging mockup with a rotating body and independently moving cap or lid. Its front texture comes from the supplied photograph. Dimensions, rear surfaces and opening mechanisms are illustrative, not measured or brand-approved. No new rear-label claims are added. Original images remain in the gallery.</p><p>The smaller Herbal Jari Booti Oil and Chyawanprash views are crops from the supplied gift photographs. Enlarging them cannot reveal detail absent from those source images. Approved multi-angle photography, label artwork or a matching 3D model is needed for a faithful full-turn product viewer.</p><p>No Higgsfield or other generative image/video service was used in this build. Pointer, keyboard and explicit animation controls are supported; scroll-controlled movement is enabled unless reduced motion is selected, and the scene suspends offscreen.</p></div></section>`;
}
function notFound() { return `<section class="page-intro"><div class="empty-state large-empty"><p class="eyebrow">404 / A PATH NOT YET TAKEN</p><h1>A little<br><em>off the path.</em></h1><p>This page doesn’t exist. The apothecary is just over here.</p>${link('/', 'Return to the house ' + arrow(), 'button button-dark')}${link('/shop', 'Explore the collection ' + arrow())}</div></section>`; }
const sceneInstances = new Map();
function initScenes(root = document) { initReferenceScenes(root); }
function disposeScenes(root = document) {
    disposeReferenceScenes(root);
    for (const [canvas, api] of sceneInstances) {
        if (root === document || root.contains(canvas)) {
            api.dispose();
            sceneInstances.delete(canvas);
        }
    }
}
/** Local-only demo commerce adapter. Replace the interface, not UI events, for real checkout. */
const storageKeys = { cart: 'cwhj:bag:v1', saved: 'cwhj:saved:v1', gift: 'cwhj:gift:v1' };
const commerce = { mode: 'demo', add(id, quantity) { if (!findProduct(id))
        return false; const q = Math.max(1, Math.min(20, Math.floor(quantity))); const existing = cart.find(l => l.id === id); if (existing && existing.qty + q > 20) {
        toast('The demo limit is 20 of each formulation.');
        return false;
    } if (existing)
        existing.qty += q;
    else
        cart.push({ id, qty: q }); persist(); return true; }, update(id, quantity) { const l = cart.find(x => x.id === id); if (l)
        l.qty = Math.max(1, Math.min(20, Math.floor(quantity))); persist(); }, remove(id) { cart = cart.filter(l => l.id !== id); persist(); }, checkout() { cart = []; checkoutDraft = {}; persist(); return { kind: 'demo-complete' }; } };
function loadLocalState() {
    try {
        const raw = JSON.parse(localStorage.getItem(storageKeys.cart) || '[]');
        if (Array.isArray(raw)) {
            const seen = new Set();
            cart = raw.filter(x => x && typeof x === 'object' && typeof x.id === 'string' && findProduct(x.id) && Number.isInteger(x.qty) && x.qty >= 1 && x.qty <= 20 && !seen.has(x.id) && !!seen.add(x.id)).map(x => ({ id: x.id, qty: x.qty }));
        }
        const list = JSON.parse(localStorage.getItem(storageKeys.saved) || '[]');
        if (Array.isArray(list))
            saved = Array.from(new Set(list.filter((x) => typeof x === 'string' && !!findProduct(x))));
    }
    catch {
        storageAvailable = false;
        cart = [];
        saved = [];
    }
}
function persist() { try {
    localStorage.setItem(storageKeys.cart, JSON.stringify(cart));
    localStorage.setItem(storageKeys.saved, JSON.stringify(saved));
}
catch {
    storageAvailable = false;
} }
function toast(message) { const el = document.getElementById('toast'); if (!el)
    return; clearTimeout(toastTimer); el.textContent = message; el.classList.add('visible'); toastTimer = window.setTimeout(() => el.classList.remove('visible'), 4200); }
function readRoute() {
    const file = true;
    let raw = file ? (location.hash.startsWith('#/') ? location.hash.slice(1) : '/') : location.pathname + location.search;
    const q = raw.indexOf('?');
    query = new URLSearchParams(q >= 0 ? raw.slice(q + 1) : '');
    route = (q >= 0 ? raw.slice(0, q) : raw).replace(/\/$/, '') || '/';
    if (query.has('q'))
        shopTerm = (query.get('q') || '').slice(0, 120);
}
function routeTitle() {
    const known = { '/': 'Ayurvedic wisdom, rooted since 1939', '/shop': 'The Apothecary', '/our-story': 'Our Story', '/licences': 'Licences & Certifications', '/licenses': 'Licences & Certifications', '/ayurveda': 'Our Ayurveda', '/ingredients': 'The Botanical Library', '/journal': 'The Journal', '/gift-sets': 'The Gift of Tradition', '/contact': 'Contact', '/cart': 'Your Bag', '/checkout': 'Demo Checkout', '/account': 'Your Saved Collection', '/faqs': 'Frequently Asked Questions', '/preview-notes': 'About This Preview' };
    const p = route.startsWith('/products/') ? findProduct(route.split('/')[2]) : undefined;
    const a = route.startsWith('/journal/') ? articles.find(x => x.slug === route.split('/')[2]) : undefined;
    return `${p?.name || a?.title || known[route] || (['shipping', 'returns', 'privacy', 'terms'].includes(route.slice(1)) ? route[1].toUpperCase() + route.slice(2) : 'Page Not Found')} — ${brand}`;
}
function pageContent() {
    if (route === '/')
        return home();
    if (route === '/shop')
        return shop();
    if (route.startsWith('/products/')) {
        const p = findProduct(route.split('/')[2]);
        return p ? productLandingPage(p) : notFound();
    }
    if (route === '/licences' || route === '/licenses')
        return licensesPage();
    if (route === '/our-story')
        return story();
    if (route === '/ayurveda')
        return ayurveda();
    if (route === '/ingredients')
        return ingredients();
    if (route === '/journal')
        return journal();
    if (route.startsWith('/journal/')) {
        const a = articles.find(x => x.slug === route.split('/')[2]);
        return a ? articlePage(a) : notFound();
    }
    if (route === '/gift-sets')
        return gifts();
    if (route === '/cart')
        return cartPage();
    if (route === '/checkout')
        return checkout();
    if (route === '/contact')
        return contact();
    if (route === '/account')
        return account();
    if (route === '/faqs')
        return faqs();
    if (route === '/preview-notes')
        return previewNotes();
    if (['shipping', 'returns', 'privacy', 'terms'].includes(route.slice(1)))
        return policyPage(route.slice(1));
    return notFound();
}
function render(keepPosition = false, focusId = '') {
    const scrollY = window.scrollY;
    const filtersOpen = keepPosition && !!document.querySelector('.filter-sidebar.filters-open');
    const active = focusId ? document.getElementById(focusId) : null;
    let caret = null;
    try {
        caret = active?.selectionStart ?? null;
    }
    catch { }
    const app = document.getElementById('app');
    if (!app)
        return;
    document.dispatchEvent(new Event('cwh:before-render'));
    recordRecentView();
    disposeProductLanding();
    disposeV4();
    disposeV2();
    disposeScenes(app);
    app.innerHTML = header() + `<main id="main" tabindex="-1" class="route-${route.split('/')[1] || 'home'}">${pageContent()}</main>` + footer();
    document.title = routeTitle();
    document.body.classList.toggle('has-mobile-purchase', route.startsWith('/products/') && !!findProduct(route.split('/')[2]));
    document.querySelector('meta[name="description"]')?.setAttribute('content', route === '/' ? 'Discover the world of Chaulas Wale Hakim Ji, a Swastha Ayurveda Pvt. Ltd. brand with heritage dating to 1939. Interactive concept preview.' : `${routeTitle()}. Explore our interactive brand and storefront preview. Product details and demo prices are not final.`);
    if (keepPosition) {
        window.scrollTo({ top: scrollY, behavior: 'instant' });
        if (focusId) {
            const next = document.getElementById(focusId);
            next?.focus({ preventScroll: true });
            if (caret !== null)
                try {
                    next?.setSelectionRange(caret, caret);
                }
                catch { }
        }
    }
    else {
        window.scrollTo({ top: 0, behavior: 'instant' });
        document.getElementById('main')?.focus({ preventScroll: true });
    }
    if (filtersOpen) {
        document.querySelector('.filter-sidebar')?.classList.add('filters-open');
        document.querySelector('[data-action="filters"]')?.setAttribute('aria-expanded', 'true');
    }
    for (const enhance of [() => initScenes(app), initV2, initV4, initProductLanding, restoreGift, updateScrollProgress]) {
        try {
            enhance();
        }
        catch (error) {
            console.warn('Optional enhancement could not start', error);
        }
    }
    document.dispatchEvent(new Event('cwh:render'));
    const status = document.getElementById('build-status');
    if (status)
        status.textContent = 'Preview V6 · Navigation ready';
}
function navigate(path, push = true) {
    if (activeModal)
        closeModal(false);
    const previous = route;
    const target = path.startsWith('#/') ? path.slice(1) : path;
    const url = '#' + target;
    if (push)
        history.pushState({}, '', url);
    readRoute();
    if (previous !== route) {
        productQty = 1;
        selectedGallery = initialProductGallery();
        if (route === '/checkout')
            checkoutStep = 1;
        else {
            checkoutDraft = {};
            checkoutStep = 1;
        }
    }
    if (route === '/shop' && !query.has('q') && previous !== '/shop')
        shopTerm = '';
    render(false);
    const announce = document.getElementById('route-announcer');
    if (announce)
        announce.textContent = routeTitle();
}
function modalTemplate(title, body, cls = '') { return `<div class="modal-overlay" data-action="close-modal"></div><section class="modal-panel ${cls}" role="dialog" aria-modal="true" aria-labelledby="dialog-title"><div class="modal-heading"><h2 id="dialog-title">${title}</h2><button type="button" data-action="close-modal" class="icon-button" aria-label="Close dialog">${icon('close')}</button></div>${body}</section>`; }
function showModal(type, html) {
    const root = document.getElementById('modal-root');
    if (!root)
        return;
    if (!activeModal)
        modalReturnFocus = document.activeElement;
    else
        disposeScenes(root);
    activeModal = type;
    root.innerHTML = html;
    root.hidden = false;
    document.getElementById('app')?.setAttribute('inert', '');
    document.body.classList.add('modal-open');
    const focus = root.querySelector('input:not([type=hidden]), button:not([disabled]), a[href], [tabindex="0"]');
    focus?.focus();
    initScenes(root);
}
function closeModal(restore = true) {
    const wasGallery = activeModal === 'gallery';
    const root = document.getElementById('modal-root');
    if (!root)
        return;
    disposeScenes(root);
    root.hidden = true;
    root.innerHTML = '';
    activeModal = '';
    document.getElementById('app')?.removeAttribute('inert');
    document.body.classList.remove('modal-open');
    if (restore && modalReturnFocus?.isConnected)
        modalReturnFocus.focus({ preventScroll: true });
    else if (restore && wasGallery)
        document.querySelector('#product-gallery .v3-expand-control, #product-gallery .v3-gallery-open')?.focus({ preventScroll: true });
    modalReturnFocus = null;
}
function openCartV3() { showModal('cart', modalTemplate(`Your bag <span class="dialog-count">(${countCart()})</span>`, cart.length ? `<div class="drawer-items">${cartLines(true)}</div><div class="drawer-summary"><div><span>Demo subtotal</span><strong>${money(cartSubtotal())}</strong></div><p>Demo prices. Delivery and taxes not calculated.</p>${link('/checkout', 'Demo checkout ' + arrow(), 'button button-dark full-width')}${link('/cart', 'View your bag ' + arrow(), 'text-link')}<span>No payment or real order.</span></div>` : `<div class="empty-state drawer-empty">${icon('bag')}<h3>A little room<br><em>for discovery.</em></h3><p>Your bag is waiting for a closer look.</p>${link('/shop', 'Explore the collection ' + arrow(), 'button button-dark')}</div>`, 'drawer')); }
function updateBagHeader() { document.querySelectorAll('.bag-count').forEach(e => e.textContent = String(countCart())); document.querySelector('.bag-trigger')?.setAttribute('aria-label', `Open bag, ${countCart()} items`); }
function searchResults(term) {
    const t = term.trim().toLowerCase();
    const list = products.filter(p => !t || p.name.toLowerCase().includes(t));
    const pages = [['Our Story', '/our-story', 'The heritage behind the name'], ['Ayurveda', '/ayurveda', 'An approachable introduction'], ['Ingredients', '/ingredients', 'The botanical library'], ['Gift Sets', '/gift-sets', 'Thoughtfully given'], ['Licences & Certifications', '/licences', 'FSSAI AYUSH documents and records'], ...articles.map(a => [a.title, '/journal/' + a.slug, a.category])];
    const pgs = t ? pages.filter(p => p[0].toLowerCase().includes(t) || p[2].toLowerCase().includes(t)) : [];
    return list.length || pgs.length ? `<p class="eyebrow">${t ? 'SEARCH RESULTS' : 'THE COLLECTION'}</p>${list.map(p => `<a class="search-result" href="${href('/products/' + p.id)}" data-route><span class="search-art">${bottle(p)}</span><span><strong>${p.name}</strong><small>Formulation · product information pending</small></span>${arrow()}</a>`).join('')}${pgs.map(([name, path, desc]) => `<a class="search-result editorial-result" href="${href(path)}" data-route>${icon('book')}<span><strong>${name}</strong><small>${desc}</small></span>${arrow()}</a>`).join('')}` : `<div class="empty-state"><h3>Nothing here just yet.</h3><p>No matches for “${esc(term)}”. Try “Jalali”, “Oil”, or explore the full collection.</p>${link('/shop', 'Explore all formulations ' + arrow())}</div>`;
}
function openSearch() { showModal('search', modalTemplate('A little curiosity.', `<form id="search-form" class="search-form"><label class="sr-only" for="global-search">Search products and stories</label><div class="search-field">${icon('search')}<input id="global-search" name="q" type="search" placeholder="Search formulations, stories, ingredients…" autocomplete="off" maxlength="120"><button type="submit" class="icon-button" aria-label="View shop search results">${arrow()}</button></div></form><div id="search-results" class="search-results" aria-live="polite">${searchResults('')}</div>`, 'search-panel')); document.getElementById('global-search')?.focus(); }
function openMenu() { showModal('menu', modalTemplate('The house.', `<nav class="mobile-nav" aria-label="Mobile navigation">${[['Home', '/'], ['Shop', '/shop'], ['Our Story', '/our-story'], ['Ayurveda', '/ayurveda'], ['Ingredients', '/ingredients'], ['Journal', '/journal'], ['Gift Sets', '/gift-sets'], ['Licences', '/licences'], ['Contact', '/contact']].map(([n, p], i) => `<a href="${href(p)}" data-route ${route === p ? 'aria-current="page"' : ''}><small>0${i + 1}</small>${n}${arrow()}</a>`).join('')}</nav><div class="menu-footer">${link('/account', 'Your saved collection ' + icon('heart'))}<p>1939 heritage. 2026 experience.</p></div>`, 'menu-panel')); }
function quickViewV3(id) { const p = findProduct(id); if (!p)
    return; showModal('quickview', modalTemplate('A closer look.', `<div class="quick-layout"><div class="quick-art">${sceneWidget(p, 'quick')}</div><div><p class="eyebrow">COLLECTION / ${p.number}</p><h3>${p.name}</h3><p class="quick-price">${money(p.previewPrice)} <span>Demo price</span></p><p>Ingredients, directions, pack size and suitability are awaiting verified product information.</p><button type="button" data-action="add" data-id="${p.id}" class="button button-dark full-width">Add to demo bag ${icon('plus')}</button>${link('/products/' + p.id, 'Read the formulation details ' + arrow())}<p class="quiet-note">No real orders or payments.</p></div></div>`, 'quick-panel')); }
function ingredientDetail(kind) { const label = kind === 'leaf' ? 'The leaf.' : kind === 'root' ? 'The root.' : 'The fruit.'; showModal('ingredient', modalTemplate(label, `<div class="ingredient-detail"><div>${botanical(kind)}</div><div><p class="eyebrow">DECORATIVE BOTANICAL STUDY</p><h3>Look closer.<br><em>Know more.</em></h3><dl><div><dt>Common name</dt><dd>[To be verified]</dd></div><div><dt>Botanical name</dt><dd>[To be verified]</dd></div><div><dt>Traditional context</dt><dd>[Sourced entry pending]</dd></div><div><dt>Products containing it</dt><dd>No verified associations</dd></div></dl><p class="quiet-note">This drawing is not a botanical identification or an ingredient claim.</p></div></div>`, 'ingredient-panel')); }
function restoreGift() {
    if (route !== '/gift-sets')
        return;
    try {
        const data = JSON.parse(localStorage.getItem(storageKeys.gift) || 'null');
        if (data && ['forest', 'ivory', 'brown'].includes(data.wrap)) {
            const radio = document.querySelector(`input[name="wrap"][value="${data.wrap}"]`);
            if (radio)
                radio.checked = true;
            document.querySelector('.gift-note-preview')?.setAttribute('data-wrap', data.wrap);
            if (typeof data.message === 'string') {
                const input = document.getElementById('gift-message');
                input.value = data.message.slice(0, 180);
                updateGiftNote(input.value);
            }
        }
    }
    catch { }
}
function updateGiftNote(text) { const output = document.getElementById('gift-note-text'), count = document.getElementById('gift-count'); if (output)
    output.textContent = text || 'A little tradition, with a lot of love.'; if (count)
    count.textContent = String(text.length); }
function updateScrollProgress() { const max = document.documentElement.scrollHeight - innerHeight; const bar = document.querySelector('.scroll-progress i'); if (bar)
    bar.style.transform = `scaleX(${max > 0 ? scrollY / max : 0})`; }
function updatePrinciple(index, focus = false) { document.querySelectorAll('[data-action="principle"]').forEach((el, i) => { el.setAttribute('aria-selected', String(i === index)); el.tabIndex = i === index ? 0 : -1; if (focus && i === index)
    el.focus(); }); const panel = document.getElementById('principle-panel'); if (panel) {
    panel.innerHTML = principleContent(index);
    panel.setAttribute('aria-labelledby', 'principle-tab-' + index);
} }
function handleAction(btn) {
    const action = btn.dataset.action || '', id = btn.dataset.id || '';
    if (handleLandingAction(btn) || handleReferenceAction(btn) || handleV4Action(btn) || handleV3Action(btn) || handleV2Action(btn))
        return;
    if (action === 'search')
        openSearch();
    else if (action === 'menu')
        openMenu();
    else if (action === 'cart')
        openCart();
    else if (action === 'close-modal')
        closeModal();
    else if (action === 'quickview')
        quickView(id);
    else if (action === 'add' || action === 'buy-now') {
        if (route.startsWith('/products/') && query.get('state') === 'out-of-stock' && id === route.split('/')[2])
            return;
        const q = (btn.dataset.pdp || action === 'buy-now') ? productQty : 1;
        if (commerce.add(id, q)) {
            lastAddedProduct = id;
            updateV4Purchase();
            updateBagHeader();
            toast(`${findProduct(id).name} added to your demo bag.${storageAvailable ? '' : ' Storage is unavailable; the bag lasts for this session.'}`);
            if (action === 'buy-now') {
                navigate('/checkout');
            }
            else
                openCart();
        }
    }
    else if (action === 'remove') {
        const label = findProduct(id)?.name;
        commerce.remove(id);
        lastAddedProduct = '';
        updateBagHeader();
        toast(`${label} removed from your bag.`);
        if (activeModal === 'cart')
            openCart();
        else
            render(true);
    }
    else if (action === 'qty') {
        const change = Number(btn.dataset.change);
        if (btn.dataset.context === 'pdp') {
            productQty = Math.max(1, Math.min(20, productQty + change));
            updateV4Purchase();
            const container = btn.closest('.quantity');
            if (container) {
                container.outerHTML = quantity(id, productQty, 'pdp');
                document.querySelector(`[data-action="qty"][data-context="pdp"][data-change="${change}"]:not([disabled])`)?.focus({ preventScroll: true });
            }
        }
        else {
            const l = cart.find(x => x.id === id);
            if (l)
                commerce.update(id, l.qty + change);
            updateBagHeader();
            if (activeModal === 'cart') {
                openCart();
                document.querySelector(`.drawer-items [data-id="${id}"][data-action="qty"][data-change="${change}"]:not([disabled])`)?.focus({ preventScroll: true });
            }
            else {
                render(true);
                document.querySelector(`.cart-items [data-id="${id}"][data-action="qty"][data-change="${change}"]:not([disabled])`)?.focus({ preventScroll: true });
            }
        }
    }
    else if (action === 'save') {
        if (!findProduct(id))
            return;
        saved = saved.includes(id) ? saved.filter(x => x !== id) : [...saved, id];
        persist();
        const isSaved = saved.includes(id);
        document.querySelectorAll(`[data-action="save"][data-id="${id}"]`).forEach(el => { el.setAttribute('aria-pressed', String(isSaved)); el.classList.toggle('is-saved', isSaved); if (el.classList.contains('save-button'))
            el.setAttribute('aria-label', `${isSaved ? 'Unsave' : 'Save'} ${findProduct(id).name}`);
        else
            el.innerHTML = icon('heart') + ' ' + (isSaved ? 'Saved to your collection' : 'Save for a closer look'); });
        toast(isSaved ? 'Saved to your collection on this device.' : 'Removed from your saved collection.');
        if (route === '/account')
            render(true);
    }
    else if (action === 'gallery') {
        selectedGallery = btn.dataset.view || 'packaging';
        render(true);
        document.querySelector(`[data-action="gallery"][data-view="${selectedGallery}"]`)?.focus({ preventScroll: true });
    }
    else if (action === 'rotate' || action === 'reset-scene') {
        const canvas = btn.closest('.scene-widget')?.querySelector('canvas');
        const api = canvas ? sceneInstances.get(canvas) : null;
        if (api) {
            if (action === 'rotate')
                api.rotate(Number(btn.dataset.direction));
            else {
                api.reset();
                resetSceneUI(btn.closest('.scene-widget'));
            }
        }
        else {
            const widget = btn.closest('.scene-widget');
            if (widget) {
                const v = action === 'reset-scene' ? 0 : Number(widget.dataset.rotation || 0) + Number(btn.dataset.direction) * 22;
                widget.dataset.rotation = String(v);
                widget.style.setProperty('--fallback-rotation', v + 'deg');
            }
        }
    }
    else if (action === 'gift-open') {
        const scene = btn.closest('.gift-interactive')?.querySelector('.gift-scene');
        const opened = scene?.classList.toggle('is-open');
        btn.setAttribute('aria-expanded', String(!!opened));
        btn.innerHTML = (opened ? 'Close the gift box ' : 'Open the gift box ') + icon(opened ? 'minus' : 'plus');
    }
    else if (action === 'filters') {
        const aside = document.querySelector('.filter-sidebar');
        const opened = aside?.classList.toggle('filters-open');
        btn.setAttribute('aria-expanded', String(!!opened));
    }
    else if (action === 'clear-filters') {
        shopForm = 'all';
        shopMax = 1000;
        shopSort = 'featured';
        shopTerm = '';
        render(true);
    }
    else if (action === 'ingredient-filter') {
        ingredientKind = btn.dataset.kind || 'all';
        render(true);
        document.querySelector(`[data-action="ingredient-filter"][data-kind="${ingredientKind}"]`)?.focus({ preventScroll: true });
    }
    else if (action === 'ingredient-detail')
        ingredientDetail(btn.dataset.kind || 'leaf');
    else if (action === 'journal-filter') {
        journalCategory = btn.dataset.category || 'all';
        render(true);
        document.querySelector(`[data-action="journal-filter"][data-category="${journalCategory}"]`)?.focus({ preventScroll: true });
    }
    else if (action === 'principle')
        updatePrinciple(Number(btn.dataset.index));
    else if (action === 'checkout-back') {
        checkoutStep = 1;
        render(false);
    }
    else if (action === 'clear-data') {
        clearV4Data();
        cart = [];
        saved = [];
        Object.values(storageKeys).forEach(key => { try {
            localStorage.removeItem(key);
        }
        catch { } });
        render(true);
        toast('Local bag, saved items and gift concept cleared.');
    }
}
let booted = false;
function boot() {
    if (booted)
        return;
    booted = true;
    document.getElementById('app')?.removeAttribute('inert');
    document.body.classList.remove('modal-open');
    setupV3Events();
    setupV4Events();
    loadLocalState();
    loadV4State();
    readRoute();
    selectedGallery = initialProductGallery();
    document.addEventListener('click', e => { const target = e.target; const a = target.closest('a[data-route]'); if (a && !e.ctrlKey && !e.metaKey && !e.shiftKey && !e.altKey && (e.button === 0)) {
        e.preventDefault();
        const raw = a.getAttribute('href') || '/';
        navigate(raw.startsWith('#/') ? raw.slice(1) : raw);
        return;
    } const anchor = target.closest('a[href^="#"]:not([data-route])'); if (anchor) {
        const selector = anchor.getAttribute('href');
        if (selector && selector.length > 1 && !selector.startsWith('#/')) {
            try {
                const el = document.querySelector(selector);
                if (el) {
                    e.preventDefault();
                    el.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
                }
            }
            catch { }
        }
    } const btn = target.closest('[data-action]'); if (btn && !btn.hasAttribute('disabled'))
        handleAction(btn); });
    document.addEventListener('input', e => { const el = e.target; if (el.id === 'global-search') {
        const results = document.getElementById('search-results');
        if (results)
            results.innerHTML = searchResults(el.value);
    }
    else if (el.id === 'shop-search') {
        shopTerm = el.value;
        render(true, 'shop-search');
    }
    else if (el.id === 'shop-price') {
        const output = document.querySelector('label[for="shop-price"] output');
        if (output)
            output.textContent = money(Number(el.value));
    }
    else if (el.id === 'gift-message')
        updateGiftNote(el.value); });
    document.addEventListener('change', e => { const el = e.target; if (el.name === 'shop-form') {
        shopForm = el.value;
        render(true);
        document.querySelector(`input[name="shop-form"][value="${shopForm}"]`)?.focus({ preventScroll: true });
    }
    else if (el.id === 'shop-price') {
        shopMax = Number(el.value);
        render(true, 'shop-price');
    }
    else if (el.id === 'shop-sort') {
        shopSort = el.value;
        render(true, 'shop-sort');
    }
    else if (el.name === 'wrap')
        document.querySelector('.gift-note-preview')?.setAttribute('data-wrap', el.value); });
    document.addEventListener('submit', e => { const form = e.target; e.preventDefault(); if (handleV4Submit(form))
        return; if (!form.reportValidity())
        return; const data = new FormData(form); const feedback = form.querySelector('.form-feedback'); if (form.id === 'search-form') {
        navigate('/shop?q=' + encodeURIComponent(String(data.get('q') || '')));
    }
    else if (form.id === 'newsletter-form') {
        if (feedback)
            feedback.textContent = 'Preview complete. You have not been subscribed; your email was not transmitted.';
        form.reset();
    }
    else if (form.id === 'contact-form') {
        if (feedback)
            feedback.textContent = 'Enquiry preview complete. No message was sent or stored. Verified contact details are still pending.';
        form.reset();
    }
    else if (form.id === 'gift-form') {
        try {
            localStorage.setItem(storageKeys.gift, JSON.stringify({ wrap: String(data.get('wrap')), message: String(data.get('message')).slice(0, 180) }));
            if (feedback)
                feedback.textContent = 'Gift concept saved on this device. No order or enquiry was sent.';
        }
        catch {
            if (feedback)
                feedback.textContent = 'Browser storage is unavailable. Your concept remains visible for this session only.';
        }
    }
    else if (form.id === 'checkout-details') {
        checkoutDraft = {};
        for (const [k, v] of data.entries())
            if (k !== 'acknowledge')
                checkoutDraft[k] = String(v);
        checkoutStep = 2;
        render(false);
    }
    else if (form.id === 'checkout-confirm') {
        const button = form.querySelector('button');
        if (button)
            button.disabled = true;
        commerce.checkout();
        appliedOffer = '';
        lastAddedProduct = '';
        persistV4Session();
        checkoutStep = 3;
        render(false);
    } });
    document.addEventListener('keydown', e => { if (activeModal) {
        if (e.key === 'Escape') {
            e.preventDefault();
            closeModal();
            return;
        }
        if (e.key === 'Tab') {
            const dialog = document.querySelector('.modal-panel');
            const list = Array.from(dialog?.querySelectorAll('a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex="0"]') || []).filter(el => el.getClientRects().length > 0);
            if (!list.length)
                return;
            const first = list[0], last = list[list.length - 1];
            if (e.shiftKey && document.activeElement === first) {
                e.preventDefault();
                last.focus();
            }
            else if (!e.shiftKey && document.activeElement === last) {
                e.preventDefault();
                first.focus();
            }
        }
    } const el = e.target; if (el.dataset.action === 'principle' && ['ArrowDown', 'ArrowUp', 'ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(e.key)) {
        e.preventDefault();
        const index = Number(el.dataset.index);
        updatePrinciple(e.key === 'Home' ? 0 : e.key === 'End' ? 2 : (index + (e.key === 'ArrowDown' || e.key === 'ArrowRight' ? 1 : 2)) % 3, true);
    } });
    const historyChanged = () => { const before = route + '?' + query.toString(); readRoute(); if (before === route + '?' + query.toString())
        return; closeModal(false); checkoutDraft = {}; checkoutStep = 1; productQty = 1; selectedGallery = initialProductGallery(); render(false); };
    window.addEventListener('popstate', historyChanged);
    window.addEventListener('hashchange', historyChanged);
    window.addEventListener('scroll', updateScrollProgress, { passive: true });
    window.addEventListener('resize', updateScrollProgress, { passive: true });
    render(true);
}
function startPreview() { try {
    boot();
    window.CWH_READY = true;
    document.querySelector('.asset-load-warning')?.remove();
}
catch (error) {
    console.error(error);
    const msg = document.createElement('div');
    msg.className = 'startup-error';
    msg.setAttribute('role', 'alert');
    msg.textContent = 'This preview could not start. Refresh the page and check that index.html, assets and media were all uploaded together. ' + String(error);
    document.body.prepend(msg);
} }
if (typeof document !== 'undefined') {
    if (document.readyState === 'loading')
        document.addEventListener('DOMContentLoaded', () => queueMicrotask(startPreview));
    else
        queueMicrotask(startPreview);
}
/** V2 orchestration. Scroll is observed, never captured or replaced. */
let v2Cleanup = null;
let v2Chapter = -1;
function resetSceneUI(widget) {
    if (!widget)
        return;
    widget.querySelector('[data-action="zoom-scene"]')?.setAttribute('aria-pressed', 'false');
    const button = widget.querySelector('.cap-control');
    button?.setAttribute('aria-pressed', 'false');
    const text = button?.querySelector('span');
    if (text)
        text.textContent = widget.classList.contains('mortar-widget') ? 'Lift pestle' : 'Open cap';
}
function setChapter(index) {
    if (index === v2Chapter)
        return;
    v2Chapter = index;
    const chapters = [{ year: '1939', title: 'Not just a date.<br><em>A beginning.</em>', copy: 'Chaulas Wale Hakim Ji is a family Ayurvedic business with heritage dating to 1939.' }, { year: 'Generations', title: 'A story carried.<br><em>Not invented.</em>', copy: 'The family names, photographs and milestones belong here. They will be added from verified records, not imagined history.' }, { year: 'Today', title: 'Our roots remain.<br><em>The experience evolves.</em>', copy: 'A Swastha Ayurveda Pvt. Ltd. brand. A contemporary home for discovering the heritage and exploring the collection.' }];
    const chapter = chapters[index];
    if (!chapter)
        return;
    const year = document.getElementById('history-year'), title = document.getElementById('history-title'), copy = document.getElementById('history-description'), number = document.getElementById('chapter-number');
    if (year) {
        year.textContent = chapter.year;
        year.classList.toggle('is-word', index !== 0);
    }
    if (title)
        title.innerHTML = chapter.title;
    if (copy)
        copy.textContent = chapter.copy;
    if (number)
        number.textContent = '0' + (index + 1) + ' / 03';
    document.querySelectorAll('[data-action="chapter"]').forEach((el, i) => el.setAttribute('aria-pressed', String(i === index)));
}
function disposeV2() { v2Cleanup?.(); v2Cleanup = null; v2Chapter = -1; }
function initV2() {
    const section = document.getElementById('heritage'), sticky = section?.querySelector('.v2-heritage-sticky');
    if (!section || !sticky)
        return;
    let pending = 0;
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    function update() {
        pending = 0;
        if (!section || !sticky)
            return;
        const header = document.querySelector('.site-header')?.getBoundingClientRect().height || 80;
        const range = Math.max(1, section.offsetHeight - sticky.offsetHeight);
        const progress = Math.max(0, Math.min(1, (header - section.getBoundingClientRect().top) / range));
        // Reduced-motion users choose chapters directly. Scroll-driven chapter changes are off.
        if (!reduced.matches && matchMedia('(min-width: 761px)').matches)
            setChapter(Math.min(2, Math.floor(progress * 3)));
        const canvas = section.querySelector('canvas');
        if (canvas && !reduced.matches)
            sceneInstances.get(canvas)?.progress?.(progress);
    }
    const schedule = () => { if (!pending)
        pending = requestAnimationFrame(update); };
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule, { passive: true });
    reduced.addEventListener('change', schedule);
    setChapter(0);
    update();
    v2Cleanup = () => { cancelAnimationFrame(pending); window.removeEventListener('scroll', schedule); window.removeEventListener('resize', schedule); reduced.removeEventListener('change', schedule); };
}
function handleV2Action(btn) {
    const action = btn.dataset.action;
    if (action === 'select-product') {
        const p = findProduct(btn.dataset.id || ''), holder = document.getElementById('collection-scene');
        if (!p || !holder)
            return true;
        document.querySelectorAll('.v2-product-choice').forEach(b => { const chosen = b.dataset.id === p.id; b.classList.toggle('is-active', chosen); b.setAttribute('aria-pressed', String(chosen)); });
        disposeScenes(holder);
        holder.innerHTML = sceneWidget(p, 'gallery');
        const detail = document.getElementById('collection-detail');
        if (detail)
            detail.innerHTML = collectionDetail(p);
        initScenes(holder);
        const announcer = document.getElementById('route-announcer');
        if (announcer)
            announcer.textContent = p.name + ' is ready for a closer look.';
        return true;
    }
    if (action === 'open-object' || action === 'zoom-scene') {
        const widget = btn.closest('.scene-widget'), canvas = widget?.querySelector('canvas'), api = canvas ? sceneInstances.get(canvas) : null;
        if (!api)
            return true;
        if (action === 'open-object')
            api.open?.();
        else {
            const zoomed = api.zoom?.() || false;
            btn.setAttribute('aria-pressed', String(zoomed));
            const status = widget?.querySelector('.scene-status');
            if (status)
                status.textContent = zoomed ? 'Closer view.' : 'Full object view.';
        }
        return true;
    }
    if (action === 'chapter') {
        const section = document.getElementById('heritage'), sticky = section?.querySelector('.v2-heritage-sticky'), index = Number(btn.dataset.index);
        if (!section || !sticky || !Number.isInteger(index) || index < 0 || index > 2)
            return true;
        setChapter(index);
        if (!matchMedia('(prefers-reduced-motion: reduce)').matches && matchMedia('(min-width: 761px)').matches) {
            const header = document.querySelector('.site-header')?.getBoundingClientRect().height || 80;
            const range = section.offsetHeight - sticky.offsetHeight;
            const target = window.scrollY + section.getBoundingClientRect().top - header + (index === 0 ? .08 : index === 1 ? .5 : .98) * range;
            window.scrollTo({ top: target, behavior: 'instant' });
        }
        const announce = document.getElementById('route-announcer');
        if (announce)
            announce.textContent = ['1939. A beginning.', 'Generations. A story carried.', 'Today. The experience evolves.'][index];
        return true;
    }
    return false;
}
const complianceRecords = [
    { id: 'fssai', category: 'fssai', title: 'FSSAI licence', number: '', holder: '', holderRole: '', issuer: '', jurisdiction: '', scope: '', productIds: [], issueDate: '', validUntil: '', validityText: '', publication: 'draft', reviewed: false, standing: 'current', document: null, verificationUrl: '' },
    { id: 'ayush', category: 'ayush', title: 'AYUSH manufacturing licence', number: '', holder: '', holderRole: '', issuer: '', jurisdiction: '', scope: '', productIds: [], issueDate: '', validUntil: '', validityText: '', publication: 'draft', reviewed: false, standing: 'current', document: null, verificationUrl: '' }
];
// Add actual classifications only after checking the product's approved documents.
const productRegulatoryInfo = {};
// false hides incomplete brand records rather than presenting them as credentials.
const showDraftContent = true;
/** Replace a product's array with approved image paths (or approved HTTPS URLs).
 * Use a depth entry only for the photographic presentation; a true 360 model needs approved assets.
 * Every product can have a different number of images.
 */
const productMediaOverrides = {};
let inlineMedia = false;
const hostedMediaBase = typeof document !== 'undefined' && document.currentScript?.src ? new URL('../media/', document.currentScript.src).href : './media/';
function mediaURL(file) {
    if (inlineMedia && embeddedProductMedia[file])
        return embeddedProductMedia[file];
    return hostedMediaBase + file;
}
function safeContentURL(value) {
    const raw = value.trim();
    if (!raw || /[<>"'\\\x00-\x20]/.test(raw))
        return '';
    if (/^https:\/\//i.test(raw)) {
        try {
            return new URL(raw).protocol === 'https:' ? raw : '';
        }
        catch {
            return '';
        }
    }
    if (/^(?!\/\/)(?:\/?[A-Za-z0-9_-]+\/)*[A-Za-z0-9_.-]+(?:\?[A-Za-z0-9_=&%.-]+)?$/.test(raw) && !raw.split('/').includes('..')) {
        try {
            return new URL(raw.replace(/^\//, ''), new URL('../', hostedMediaBase)).href;
        }
        catch {
            return './' + raw.replace(/^\//, '');
        }
    }
    return '';
}
function productMedia(p) {
    const supplied = productMediaOverrides[p.id];
    if (supplied?.length)
        return supplied;
    const original = referenceOriginal(p), isSet = ['herbal-jari-booti-oil', 'chyawanprash'].includes(p.id);
    const image = (id, label, file, caption) => ({ id, label, kind: 'image', src: mediaURL(file), alt: `${p.name} — ${label.toLowerCase()} from the supplied reference image`, caption, concept: false });
    const front = image('front', isSet ? 'In the set' : 'Product', isSet ? original : `ref-${p.id}-cutout.webp`, isSet ? 'The supplied gift-set image. No separate high-resolution product photograph was supplied.' : 'Background-isolated crop of your supplied image. Bottle and label pixels are unchanged.');
    return [front,
        image(isSet ? 'product' : 'original', isSet ? 'Product crop' : 'Original', isSet ? `ref-${p.id}-cutout.webp` : original, isSet ? 'Isolated from the supplied gift-set photograph. Limited source resolution; no new details generated.' : 'Original image, retained as supplied. Printed claims and pack details require verification before launch.'),
        image('label', 'Label', `ref-${p.id}-label.webp`, 'Detail crop of the same supplied view, not a new photograph. No label text has been redrawn.'),
        image('crop', 'Close-up', `ref-${p.id}-crop.webp`, 'A crop of the supplied product image. Native resolution is retained; no missing detail is generated.'),
        { id: 'depth', label: 'Depth view', kind: 'depth', alt: `Interactive photo-based depth view of ${p.name}`, caption: 'Photo-based depth and zoom using the supplied image. Not a reconstructed 360° model; no unseen surfaces are invented.', concept: false }];
}
function recordReady(r) {
    return r.publication === 'published' && r.reviewed && !!(r.number.trim() && r.holder.trim() && r.issuer.trim() && r.scope.trim());
}
function recordState(r) {
    if (!recordReady(r))
        return 'Details not supplied';
    if (r.standing === 'withdrawn')
        return 'Withdrawn';
    if (r.standing === 'expired' || (r.validUntil && /^\d{4}-\d{2}-\d{2}$/.test(r.validUntil) && r.validUntil < new Date().toISOString().slice(0, 10)))
        return 'Expired';
    return 'Documented record';
}
function productRecords(p) {
    return complianceRecords.filter(r => recordReady(r) && r.productIds.includes(p.id));
}
function resolveProductImage(value) {
    if (!value)
        return '';
    if (inlineMedia && value.startsWith('/media/') && embeddedProductMedia[value.slice(7)])
        return embeddedProductMedia[value.slice(7)];
    return value;
}
/** Modern Apothecary: product media and documentary information, without invented claims. */
let expandedGalleryProduct = '';
let galleryCompare = false;
let galleryCompareIndex = 2;
let galleryZoomed = false;
let gallerySwipeStart = null;
let suppressGalleryClickUntil = 0;
function documentIcon() { return '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" aria-hidden="true"><path d="M5 3h9l5 5v13H5zM14 3v6h5M8 13h8M8 17h6"/></svg>'; }
function galleryPosition(p) { const i = productMedia(p).findIndex(m => m.id === selectedGallery); return i < 0 ? 0 : i; }
function mediaThumbnail(m) {
    return m.kind === 'depth' ? `<span class="v3-model-thumbnail">${icon('rotate')}<small>Depth</small></span>` : `<img src="${esc(resolveProductImage(m.thumbnail || m.src))}" alt="" width="160" height="160" draggable="false">`;
}
function galleryThumbnails(p, expanded = false) {
    const current = galleryPosition(p);
    return `<div class="v3-thumbnail-rail" role="group" aria-label="${esc(p.name)} gallery views">${productMedia(p).map((m, i) => `<button type="button" class="v3-thumbnail" data-action="media-select" data-product="${p.id}" data-index="${i}" data-expanded="${expanded}" aria-label="Show ${esc(m.label)} view of ${esc(p.name)}" aria-pressed="${i === current}" aria-controls="${expanded ? 'expanded-gallery-display' : 'product-gallery-display'}">${mediaThumbnail(m)}<span>${esc(m.label)}</span></button>`).join('')}</div>`;
}
function galleryImage(m, button = false) {
    const inner = `<div class="v3-image-wrap ${['front', 'crop'].includes(m.id) ? 'is-concept-object' : ''}"><img data-product-image src="${esc(resolveProductImage(m.src))}" alt="${esc(m.alt)}" width="1000" height="1000" draggable="false" decoding="async"><span class="v3-image-error" hidden>${icon('info')}<span>This image could not be loaded.<br>Try another thumbnail or retry.</span><button type="button" data-action="media-retry" class="text-link">Retry image</button></span></div>`;
    // Image wrappers are not nested buttons; separate expand controls remain accessible.
    return button ? `<div class="v3-click-to-expand" data-action="media-expand">${inner}</div>` : inner;
}
function galleryDisplay(p, expanded = false) {
    const list = productMedia(p), index = galleryPosition(p), m = list[index];
    const viewer = m.kind === 'depth' ? sceneWidget(p, 'gallery') : galleryImage(m, true);
    return `<div class="v3-media-stage" data-gallery-surface data-product="${p.id}" data-expanded="${expanded}" data-kind="${m.kind}">${viewer}<span class="v3-view-type">${m.kind === 'depth' ? 'PHOTO-BASED DEPTH' : m.concept ? 'CONCEPT IMAGE' : 'SUPPLIED IMAGE'}</span>${m.kind === 'image' ? `<button type="button" class="v3-expand-control" data-action="media-expand" aria-label="Expand ${esc(p.name)} image gallery" title="Expand gallery">${icon('zoom')}</button>` : ''}</div><div class="v3-gallery-caption"><span><b>${String(index + 1).padStart(2, '0')} / ${String(list.length).padStart(2, '0')}</b> &nbsp; ${esc(m.label)}${m.kind === 'depth' ? '' : ' view'}</span><div><button type="button" data-action="media-prev" data-product="${p.id}" class="icon-button" aria-label="Previous product view">${icon('left')}</button><button type="button" data-action="media-next" data-product="${p.id}" class="icon-button" aria-label="Next product view">${icon('right')}</button></div></div><p class="v3-gallery-disclaimer">${esc(m.caption)}</p>`;
}
function productGallery(p) {
    return `<div class="product-gallery v3-product-gallery" id="product-gallery" data-product="${p.id}" role="region" aria-label="${esc(p.name)} image gallery"><div class="v3-gallery-heading"><span>THE PRODUCT, IN DETAIL</span><button type="button" data-action="media-expand" class="v3-gallery-open">Open gallery ${arrow()}</button></div><div class="v3-gallery-layout">${galleryThumbnails(p)}<div id="product-gallery-display" class="v3-gallery-display">${galleryDisplay(p)}</div></div><p class="sr-only" id="gallery-announcer" aria-live="polite"></p></div>`;
}
function updateProductGallery(p) {
    const root = document.getElementById('product-gallery');
    if (!root || root.dataset.product !== p.id)
        return;
    const target = document.getElementById('product-gallery-display');
    if (!target)
        return;
    disposeScenes(target);
    target.innerHTML = galleryDisplay(p);
    initScenes(target);
    root.querySelectorAll('.v3-thumbnail').forEach(b => b.setAttribute('aria-pressed', String(Number(b.dataset.index) === galleryPosition(p))));
    const a = document.getElementById('gallery-announcer');
    if (a)
        a.textContent = productMedia(p)[galleryPosition(p)].label + ' view selected.';
}
function expandedGalleryBody(p) {
    const list = productMedia(p), m = list[galleryPosition(p)], images = list.map((x, i) => ({ x, i })).filter(o => o.x.kind === 'image');
    if (!images.some(o => o.i === galleryCompareIndex))
        galleryCompareIndex = images[images.length - 1]?.i || 0;
    const other = list[galleryCompareIndex];
    return `<div class="v3-lightbox-tools"><p>${m.concept ? 'Concept imagery · not approved packaging' : 'Supplied imagery · original artwork retained'}</p><div>${images.length > 1 ? `<button type="button" class="v3-tool-button" data-action="media-compare" aria-pressed="${galleryCompare}">${documentIcon()} Compare images</button>` : ''}<button type="button" class="v3-tool-button" data-action="media-zoom" aria-pressed="${galleryZoomed}" ${m.kind === 'depth' || galleryCompare ? 'disabled' : ''}>${icon('zoom')} ${galleryZoomed ? 'Fit image' : 'Zoom image'}</button></div></div><div class="v3-expanded-layout">${galleryThumbnails(p, true)}<div id="expanded-gallery-display" class="v3-expanded-display ${galleryZoomed ? 'is-zoomed' : ''}">${galleryCompare && other ? `<div class="v3-comparison"><figure>${galleryImage(m)}<figcaption>${esc(m.label)} view · selected on the left</figcaption></figure><figure>${galleryImage(other)}<figcaption><label for="compare-view">Compare with</label><select id="compare-view">${images.map(({ x, i }) => `<option value="${i}" ${i === galleryCompareIndex ? 'selected' : ''}>${esc(x.label)} view</option>`).join('')}</select></figcaption></figure></div>` : `<div class="v3-media-stage" data-gallery-surface data-product="${p.id}" data-expanded="true" data-kind="${m.kind}">${m.kind === 'depth' ? sceneWidget(p, 'gallery') : galleryImage(m)}</div>`}</div></div><div class="v3-lightbox-foot"><span>${String(galleryPosition(p) + 1).padStart(2, '0')} / ${list.length} &nbsp; ${esc(m.label)} view</span><p>${galleryCompare ? 'Choose any thumbnail to change the first image.' : 'Use thumbnails or the arrow keys to change views.'}</p><div><button type="button" data-action="media-prev" data-product="${p.id}" class="icon-button" aria-label="Previous product view">${icon('left')}</button><button type="button" data-action="media-next" data-product="${p.id}" class="icon-button" aria-label="Next product view">${icon('right')}</button></div></div>`;
}
function openExpandedGallery(p, focusSelector = '') {
    expandedGalleryProduct = p.id;
    showModal('gallery', modalTemplate(esc(p.name), expandedGalleryBody(p), 'v3-gallery-dialog'));
    if (focusSelector)
        document.querySelector('.v3-gallery-dialog ' + focusSelector)?.focus({ preventScroll: true });
}
function selectMedia(p, index, focusSelector = '') {
    const list = productMedia(p);
    const next = (index + list.length) % list.length;
    selectedGallery = list[next].id;
    galleryZoomed = false;
    if (list[next].kind === 'depth')
        galleryCompare = false;
    updateProductGallery(p);
    if (activeModal === 'gallery')
        openExpandedGallery(p, focusSelector);
}
function documentFields(r) {
    const ready = recordReady(r);
    const rows = [['Licence / certificate number', r.number], ['Licence holder / legal entity', r.holder], ['Holder role', r.holderRole], ['Issuing authority', r.issuer], ['State / jurisdiction', r.jurisdiction], ['Covered activity / scope', r.scope], ['Issue date', r.issueDate], ['Validity', r.validityText || r.validUntil], ['Products covered', r.productIds.map(id => findProduct(id)?.name || id).join(', ')]];
    return `<dl class="v3-document-fields">${rows.map(([name, value]) => `<div><dt>${name}</dt><dd class="${!ready || !value ? 'is-pending' : ''}">${ready && value ? esc(value) : 'To be supplied'}</dd></div>`).join('')}</dl>`;
}
function documentRow(r) {
    const ready = recordReady(r);
    return `<article class="v3-record-row"><span class="v3-document-glyph">${documentIcon()}</span><div><p class="eyebrow">${r.category === 'other' ? 'CERTIFICATION RECORD' : 'LICENCE RECORD'}</p><h3>${esc(r.title)}</h3><p>${ready ? esc(r.holder) : 'Number, licence holder and supporting document to be supplied.'}</p></div><div class="v3-record-identity"><span>${ready ? esc(r.number) : '—'}</span><small>${recordState(r)}</small></div><button type="button" data-action="document-open" data-id="${esc(r.id)}" class="text-link">${ready ? 'View record' : 'View record fields'} ${arrow()}</button></article>`;
}
function licensesPage() {
    const cat = query.get('category') || 'all';
    const list = complianceRecords.filter(r => (showDraftContent || recordReady(r)) && (cat === 'all' || r.category === cat));
    return `<section class="page-intro v3-documents-intro">${breadcrumb([['Licences & Certifications', '/licences']])}<p class="eyebrow">THE HOUSE / DOCUMENTATION</p><h1>Trust, with<br><em>the details in view.</em></h1><div class="v3-doc-intro-bottom"><p class="lead">Licences & certifications.<br>A clear place for the records behind the collection.</p><p class="quiet-note">Records belong to a named licence holder, activity and product scope. ${complianceRecords.some(recordReady) ? 'Select a record to see its number, issuing authority, scope and available supporting document.' : 'No licence numbers or certificate documents have been supplied for this preview.'}</p></div></section><section class="section v3-documents-section"><nav class="v3-record-filters" aria-label="Document categories">${[['all', 'All records'], ['fssai', 'FSSAI'], ['ayush', 'AYUSH'], ['other', 'Other certifications']].map(([id, label]) => `<a href="${href('/licences' + (id === 'all' ? '' : '?category=' + id))}" data-route ${cat === id ? 'aria-current="page"' : ''}>${label}</a>`).join('')}</nav><div class="v3-records">${list.length ? list.map(documentRow).join('') : `<div class="v3-record-empty">${documentIcon()}<h2>No ${cat === 'other' ? 'additional certifications' : 'records'} supplied.</h2><p>Verified records can be added here with their numbers, issuer, validity, scope and original supporting documents. No certification is being claimed.</p></div>`}</div><div class="v3-document-note"><span>01</span><p><strong>Facts before badges.</strong> Empty fields mean the information has not been supplied for the website. They do not state whether a licence exists, or whether an application is pending.</p><span>02</span><p><strong>Specific, not blanket.</strong> A record is linked to a product only after its scope is confirmed. A licence listing is not a claim of clinical benefit or government endorsement.</p></div><div class="v3-document-request"><h2>Have a question<br><em>about a document?</em></h2>${link('/contact?topic=documentation', 'Ask about documentation ' + arrow(), 'button button-outline')}</div></section>`;
}
function openDocument(id) {
    const r = complianceRecords.find(x => x.id === id);
    if (!r)
        return;
    const ready = recordReady(r), url = ready && r.document ? safeContentURL(r.document.url) : '', verify = ready ? safeContentURL(r.verificationUrl) : '';
    const media = url && r.document ? `${r.document.type === 'image' ? `<img class="v3-certificate-image" src="${esc(url)}" alt="${esc(r.document.alt || r.title + ' document')}">` : `<div class="v3-pdf-cover">${documentIcon()}<h3>Original PDF document</h3><p>${esc(r.document.fileName)}</p></div>`}<a href="${esc(url)}" target="_blank" rel="noopener noreferrer" class="button button-dark">Open original ${r.document.type === 'pdf' ? 'PDF' : 'image'} ${arrow()}</a>` : `<div class="v3-document-missing">${documentIcon()}<h3>Document not supplied.</h3><p>No certificate scan or licence number is available in this preview. No official seal or approval badge has been substituted.</p></div>`;
    showModal('document', modalTemplate(esc(r.title), `<div class="v3-document-status">${recordState(r)}</div><div class="v3-document-modal-layout"><div>${documentFields(r)}${verify ? `<a href="${esc(verify)}" target="_blank" rel="noopener noreferrer" class="text-link">Check the issuing authority’s record ${arrow()}</a>` : ''}</div><div class="v3-document-attachment">${media}</div></div><p class="v3-document-disclaimer">${ready ? 'Read this record in the context of its named holder and scope. It is not a blanket endorsement of the brand or all products.' : 'Fields shown for content setup only. Actual details and documents must be supplied and reviewed before publication.'}</p>`, 'v3-document-dialog'));
}
function storyDocumentation() {
    return `<section class="section v3-story-documentation" id="brand-documents"><div><p class="eyebrow">BEYOND THE STORY / THE RECORDS</p><h2>Heritage, told.<br><em>Details, shown.</em></h2><p>Our history and our documentation each deserve their own space. ${complianceRecords.some(recordReady) ? 'Find the published licence numbers, issuing authorities and available original records here.' : 'Find licence numbers, issuing authorities and the original records here once they are supplied and reviewed.'}</p>${link('/licences', 'Licences & certifications ' + arrow(), 'text-link')}</div><div class="v3-story-record-list">${complianceRecords.filter(r => showDraftContent || recordReady(r)).map(r => `<button type="button" data-action="document-open" data-id="${esc(r.id)}">${documentIcon()}<span><strong>${esc(r.title)}</strong><small>${recordReady(r) ? esc(r.number) : 'Number & document to be supplied'}</small></span>${arrow()}</button>`).join('')}<p class="quiet-note">No licence or certification is claimed by these placeholders.</p></div></section>`;
}
function footerDocumentation() {
    const rows = complianceRecords.filter(r => showDraftContent || recordReady(r));
    if (!rows.length)
        return '';
    return `<div class="v3-footer-documentation"><div><span class="eyebrow">LICENCES & CERTIFICATIONS</span>${link('/licences', 'View the records ' + arrow(), 'text-link')}</div><div class="v3-footer-records">${rows.map(r => `<a href="${href('/licences?category=' + r.category)}" data-route><span>${esc(r.title)}</span><strong>${recordReady(r) ? esc(r.number) : 'Details to be supplied'}</strong>${recordReady(r) ? `<small>${esc(recordState(r))}</small>` : ''}</a>`).join('')}</div></div>`;
}
function productDocuments(p, override) {
    const records = productRecords(p), rawInfo = override || productRegulatoryInfo[p.id], info = rawInfo?.reviewed ? rawInfo : undefined;
    return `<section class="section v3-product-documents" id="product-documents"><div><p class="eyebrow">THIS FORMULATION / DOCUMENTATION</p><h2>Know what<br><em>stands behind it.</em></h2><p>Product-specific records, not a row of generic certification badges.</p></div><div><dl class="v3-product-regulatory"><div><dt>Product classification</dt><dd>${esc(info?.classification || 'To be supplied and reviewed')}</dd></div><div><dt>Manufacturer / licence holder</dt><dd>${esc(info?.manufacturer || 'To be supplied and reviewed')}</dd></div></dl>${records.length ? records.map(documentRow).join('') : `<div class="v3-no-product-document">${documentIcon()}<div><strong>Applicable licence details not supplied.</strong><p>No FSSAI or AYUSH record has been linked to ${esc(p.name)}. Product classification and document scope must be confirmed first.</p></div></div>`}${link('/licences', 'View brand documentation ' + arrow(), 'text-link')}</div></section>`;
}
function currentGalleryProduct() { return findProduct(activeModal === 'gallery' ? expandedGalleryProduct : document.getElementById('product-gallery')?.dataset.product || ''); }
function handleV3Action(btn) {
    const action = btn.dataset.action || '';
    if (action === 'document-open') {
        openDocument(btn.dataset.id || '');
        return true;
    }
    if (!action.startsWith('media-'))
        return false;
    const p = currentGalleryProduct() || findProduct(btn.dataset.product || '');
    if (!p)
        return true;
    if (action === 'media-expand') {
        if (btn.classList.contains('v3-click-to-expand') && performance.now() < suppressGalleryClickUntil)
            return true;
        galleryCompare = false;
        galleryZoomed = false;
        openExpandedGallery(p);
    }
    else if (action === 'media-select') {
        const i = Number(btn.dataset.index);
        selectMedia(p, i, `[data-action="media-select"][data-index="${i}"]`);
    }
    else if (action === 'media-next' || action === 'media-prev') {
        const index = galleryPosition(p) + (action === 'media-next' ? 1 : -1);
        selectMedia(p, index, `[data-action="${action}"]`);
        if (activeModal !== 'gallery')
            document.querySelector(`#product-gallery [data-action="${action}"]`)?.focus({ preventScroll: true });
    }
    else if (action === 'media-compare') {
        galleryCompare = !galleryCompare;
        galleryZoomed = false;
        if (galleryCompare && productMedia(p)[galleryPosition(p)].kind === 'depth')
            selectMedia(p, 0);
        openExpandedGallery(p, '[data-action="media-compare"]');
    }
    else if (action === 'media-zoom') {
        galleryZoomed = !galleryZoomed;
        openExpandedGallery(p, '[data-action="media-zoom"]');
    }
    else if (action === 'media-retry') {
        const wrap = btn.closest('.v3-image-wrap'), img = wrap?.querySelector('img');
        if (img) {
            wrap?.classList.remove('image-failed');
            const error = wrap?.querySelector('.v3-image-error');
            if (error)
                error.hidden = true;
            img.hidden = false;
            const src = img.getAttribute('src') || '';
            img.removeAttribute('src');
            img.src = src;
        }
    }
    return true;
}
function setupV3Events() {
    document.addEventListener('error', e => {
        const img = e.target;
        if (img.tagName !== 'IMG' || !img.hasAttribute('data-product-image'))
            return;
        const wrap = img.closest('.v3-image-wrap');
        wrap?.classList.add('image-failed');
        img.hidden = true;
        const error = wrap?.querySelector('.v3-image-error');
        if (error)
            error.hidden = false;
    }, true);
    document.addEventListener('change', e => { const el = e.target; if (el.id === 'compare-view') {
        galleryCompareIndex = Number(el.value);
        const p = currentGalleryProduct();
        if (p)
            openExpandedGallery(p, '#compare-view');
    } });
    document.addEventListener('keydown', e => {
        const el = e.target;
        if (el.classList.contains('v3-click-to-expand') && (e.key === 'Enter' || e.key === ' ')) {
            e.preventDefault();
            handleV3Action(el);
            return;
        }
        if (el.closest('.scene-widget') || ['INPUT', 'TEXTAREA', 'SELECT'].includes(el.tagName))
            return;
        if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End'].includes(e.key))
            return;
        const thumb = el.closest('.v3-thumbnail');
        if (!thumb && activeModal !== 'gallery')
            return;
        const p = currentGalleryProduct();
        if (!p)
            return;
        const len = productMedia(p).length;
        e.preventDefault();
        const next = e.key === 'Home' ? 0 : e.key === 'End' ? len - 1 : (galleryPosition(p) + (['ArrowRight', 'ArrowDown'].includes(e.key) ? 1 : len - 1)) % len;
        selectMedia(p, next, `[data-action="media-select"][data-index="${next}"]`);
        if (activeModal !== 'gallery')
            document.querySelector(`#product-gallery .v3-thumbnail[data-index="${next}"]`)?.focus({ preventScroll: true });
    });
    document.addEventListener('pointerdown', e => {
        const stage = e.target.closest('[data-gallery-surface]');
        if (!stage || stage.dataset.kind === 'depth' || galleryZoomed || galleryCompare || e.button !== 0)
            return;
        gallerySwipeStart = { x: e.clientX, y: e.clientY, pointer: e.pointerId, product: stage.dataset.product || '', expanded: stage.dataset.expanded === 'true' };
    }, { passive: true });
    document.addEventListener('pointerup', e => {
        const start = gallerySwipeStart;
        gallerySwipeStart = null;
        if (!start || start.pointer !== e.pointerId)
            return;
        const dx = e.clientX - start.x, dy = e.clientY - start.y;
        if (Math.abs(dx) < 50 || Math.abs(dx) < Math.abs(dy) * 1.6)
            return;
        const p = findProduct(start.product);
        if (p) {
            suppressGalleryClickUntil = performance.now() + 400;
            selectMedia(p, galleryPosition(p) + (dx < 0 ? 1 : -1));
        }
    }, { passive: true });
    document.addEventListener('pointercancel', () => { gallerySwipeStart = null; }, { passive: true });
}
/**
 * V4: commercial clarity without unapproved claims.
 * All promotions run ONLY inside the local demo adapter. They are not live offers.
 * A production backend must validate prices, stock, discounts, delivery and orders.
 */
const previewOffer = {
    enabled: true,
    mode: 'demo',
    code: 'PREVIEW10',
    percent: 10,
    heading: 'A little welcome to the apothecary.',
    terms: '10% off the demo merchandise subtotal. All five sample products are included. No minimum, no stacking. This is a design-test offer, not a live promotion. Shipping and taxes are not calculated.'
};
const v4Keys = { preferences: 'cwhj:browse-preferences:v4', recent: 'cwhj:recent:v4', offer: 'cwhj:offer:v4' };
let browsePreferences = { form: 'all', budget: 1000, remember: false };
let recentProducts = [];
let appliedOffer = '';
let lastAddedProduct = '';
let homeShelfForm = 'all';
let finderStep = 1;
let finderDraft = { form: 'all', budget: 1000, remember: false };
let v4Cleanup = null;
let deliveryRequestId = 0;
function offerActive() { return previewOffer.enabled && commerce.mode === 'demo' && previewOffer.mode === 'demo'; }
function hasOffer() { return offerActive() && appliedOffer === previewOffer.code; }
function demoTotals() {
    // Calculate in integer paise; do not accumulate floating-point discount errors.
    const subtotalPaise = Math.round(cartSubtotal() * 100);
    const discountPaise = hasOffer() ? Math.round(subtotalPaise * previewOffer.percent / 100) : 0;
    return { subtotal: subtotalPaise / 100, discount: discountPaise / 100, total: (subtotalPaise - discountPaise) / 100 };
}
function validatedPreferences(value) {
    if (!value || typeof value !== 'object')
        return null;
    const v = value;
    if (!['all', 'Bottle', 'Jar'].includes(String(v.form)) || ![500, 700, 1000].includes(Number(v.budget)))
        return null;
    return { form: v.form, budget: Number(v.budget), remember: v.remember === true };
}
function loadV4State() {
    try {
        const p = validatedPreferences(JSON.parse(localStorage.getItem(v4Keys.preferences) || 'null'));
        if (p?.remember) {
            browsePreferences = p;
            shopForm = p.form;
            shopMax = p.budget;
        }
    }
    catch { }
    try {
        const r = JSON.parse(sessionStorage.getItem(v4Keys.recent) || '[]');
        if (Array.isArray(r))
            recentProducts = [...new Set(r.filter((x) => typeof x === 'string' && !!findProduct(x)))].slice(0, 5);
        if (sessionStorage.getItem(v4Keys.offer) === previewOffer.code && offerActive())
            appliedOffer = previewOffer.code;
    }
    catch { }
}
function persistV4Session() {
    try {
        sessionStorage.setItem(v4Keys.recent, JSON.stringify(recentProducts));
        sessionStorage.setItem(v4Keys.offer, appliedOffer);
    }
    catch { }
}
function clearV4Data() {
    browsePreferences = { form: 'all', budget: 1000, remember: false };
    recentProducts = [];
    appliedOffer = '';
    lastAddedProduct = '';
    try {
        localStorage.removeItem(v4Keys.preferences);
    }
    catch { }
    try {
        Object.values(v4Keys).forEach(k => sessionStorage.removeItem(k));
    }
    catch { }
}
function recordRecentView() {
    if (!route.startsWith('/products/'))
        return;
    const id = route.split('/')[2];
    if (!findProduct(id))
        return;
    recentProducts = [id, ...recentProducts.filter(x => x !== id)].slice(0, 5);
    persistV4Session();
}
function header() {
    const bar = offerActive() && !route.startsWith('/products/') ? `<div class="v4-offer-bar" role="region" aria-label="Demonstration offer"><span class="v4-preview-tag">DEMO OFFER</span><span>${hasOffer() ? '10% demo saving applied to your bag' : 'Explore with 10% off your demo bag'}</span><button type="button" data-action="v4-offer-open">${hasOffer() ? 'View offer' : previewOffer.code + ' · View offer'} ${arrow()}</button></div>` : '';
    return bar + headerV3().replace('The collection', 'Shop formulations').replace('Our story', 'Our Story').replace('</nav><div class="header-tools">', `${link('/gift-sets', 'Gifts', '')}</nav><div class="header-tools">`).replace('class="bag-trigger"', 'class="bag-trigger"').replace('<span class="bag-count">', '<span class="v4-bag-label">Bag</span><span class="bag-count">');
}
function frontPhoto(p, thumb = false) {
    return referenceCutout(p, thumb);
}
function productCard(p) {
    return `<article class="product-card v4-product-card"><div class="v4-card-visual"><a href="${href('/products/' + p.id)}" data-route aria-label="View ${esc(p.name)}">${frontPhoto(p)}</a><button type="button" class="save-button ${saved.includes(p.id) ? 'is-saved' : ''}" data-action="save" data-id="${p.id}" aria-label="${saved.includes(p.id) ? 'Unsave' : 'Save'} ${esc(p.name)}" aria-pressed="${saved.includes(p.id)}">${icon('heart')}</button><button type="button" class="v4-quick-button" data-action="quickview" data-id="${p.id}" aria-label="Quick view of ${esc(p.name)}">${icon('cube')} Quick view</button><span class="v4-concept-caption">Supplied image</span></div><div class="product-card-body"><p class="v4-product-format">${p.form} shown <span>Collection ${p.number}</span></p><h3>${link('/products/' + p.id, esc(p.name), '')}</h3><div class="v4-price-line"><strong>${money(p.previewPrice)}</strong><span>Demo price</span></div><p class="v4-card-disclosure">Product details & pack size pending.</p><button type="button" data-action="add" data-id="${p.id}" class="button button-dark full-width" aria-label="Add ${esc(p.name)} to demo bag">Add to bag ${icon('plus')}</button>${link('/products/' + p.id, 'View product details ' + arrow(), 'v4-detail-link')}</div></article>`;
}
function browseEntry() {
    return `<section class="v4-browse-entry section" aria-labelledby="browse-heading"><div><p class="eyebrow">YOUR WAY INTO THE APOTHECARY</p><h2 id="browse-heading">What brings <em>you here?</em></h2></div><div class="v4-browse-options"><button type="button" data-action="v4-finder-open"><span>${icon('filter')} I’m exploring</span><small>Help me narrow the collection</small>${arrow()}</button><button type="button" data-action="search"><span>${icon('search')} I know the name</span><small>Take me straight to my product</small>${arrow()}</button><a href="${href('/gift-sets')}" data-route><span>${icon('gift')} I’m choosing a gift</span><small>Make it a little more personal</small>${arrow()}</a></div></section>`;
}
function homeShelf() {
    const shown = products.filter(p => homeShelfForm === 'all' || p.form === homeShelfForm);
    return `<section class="v4-shelf section" id="collection" aria-labelledby="collection-heading"><div class="v4-shelf-heading"><div><p class="eyebrow">FIVE FORMULATIONS. YOUR OWN STARTING POINT.</p><h2 id="collection-heading">Meet your<br><em>apothecary.</em></h2></div><div><p>Take a closer look. Compare the views.<br>Find your way from curiosity to your bag.</p>${link('/shop', 'Shop all formulations ' + arrow(), 'text-link')}</div></div><div class="v4-shelf-toolbar"><div class="v4-segmented" role="group" aria-label="Filter concept packaging">${[['all', 'All'], ['Bottle', 'Bottles'], ['Jar', 'Jars']].map(([id, label]) => `<button type="button" data-action="v4-shelf-filter" data-value="${id}" aria-pressed="${homeShelfForm === id}">${label}</button>`).join('')}</div><div class="v4-rail-buttons"><button type="button" class="icon-button" data-action="v4-rail" data-direction="-1" aria-label="Previous products">${icon('left')}</button><button type="button" class="icon-button" data-action="v4-rail" data-direction="1" aria-label="Next products">${icon('right')}</button></div></div><div class="v4-product-rail" id="home-product-rail" role="region" aria-label="${shown.length} sample formulations" tabindex="0">${shown.map(productCard).join('')}</div><div class="v4-shelf-footer"><p>Your supplied product imagery. Sample prices; approved product information is still to come.</p><button type="button" class="text-link" data-action="v4-finder-open">Help me explore ${arrow()}</button></div></section>`;
}
function recentSection() {
    const list = recentProducts.map(findProduct).filter((p) => !!p);
    if (!list.length)
        return '';
    return `<section class="v4-recent section" aria-labelledby="recent-heading"><div class="section-head"><div><p class="eyebrow">PICK UP WHERE YOU LEFT OFF</p><h2 id="recent-heading">Still on <em>your mind?</em></h2></div><button type="button" data-action="v4-clear-recent" class="text-link">Clear recently viewed</button></div><div class="v4-recent-items">${list.map(p => `<a href="${href('/products/' + p.id)}" data-route>${frontPhoto(p, true)}<span><strong>${p.name}</strong><small>${money(p.previewPrice)} · demo price</small></span>${arrow()}</a>`).join('')}</div><p class="quiet-note">Only the products you opened in this browser tab. No account or health profile.</p></section>`;
}
function home() {
    const legacy = homeV3();
    const history = legacy.slice(legacy.indexOf('<section class="v2-heritage"'), legacy.indexOf('<section class="v2-collection'));
    const ending = legacy.slice(legacy.indexOf('<section class="v2-explore'));
    const p = products[0];
    return `<section class="v2-hero v4-hero" aria-labelledby="hero-title"><div class="v2-hero-copy"><p class="eyebrow">CHAULAS WALE HAKIM JI · SINCE 1939</p><h1 id="hero-title">Rooted.<br><em>Reimagined.</em></h1><p class="v2-hero-description">An Ayurvedic heritage, brought closer.<br>Meet the collection. Make it your own.</p><div class="v2-hero-actions"><a href="#collection" class="button button-dark">Shop formulations ${arrow()}</a><button type="button" class="text-link" data-action="v4-finder-open">Help me choose ${arrow()}</button></div><div class="v4-hero-trust"><span>Since 1939</span>${link('/licences', 'Licence records ' + arrow(), '')}</div></div><div class="v2-hero-object"><div class="v2-object-meta"><span>THE MODERN APOTHECARY</span><span>INTERACTIVE PHOTO</span></div>${sceneWidget(p, 'hero')}<div class="v4-hero-product"><div><a href="${href('/products/' + p.id)}" data-route><strong>${p.name}</strong> ${arrow()}</a><p>${money(p.previewPrice)} <span>Demo price · supplied imagery</span></p></div><button type="button" class="button button-dark" data-action="add" data-id="${p.id}">Add to bag ${icon('plus')}</button></div></div><div class="v2-hero-bottom"><span>1939 heritage. <em>2026 experience.</em></span>${link('/our-story', 'Meet the house ' + arrow(), 'text-link')}${link('/preview-notes', 'Interactive preview · no real orders', 'v2-preview-link')}</div></section>${browseEntry()}${homeShelf()}${recentSection()}<section class="v4-guidance-band section"><div><p class="eyebrow">A CHOICE SHOULD FEEL CLEAR</p><h2>Less guessing.<br><em>More understanding.</em></h2></div><div class="v4-guidance-links"><a href="${href('/licences')}" data-route>${documentIcon()}<span><strong>Look at the records</strong><small>See document status and product coverage.</small></span>${arrow()}</a><button type="button" data-action="v4-finder-open">${icon('filter')}<span><strong>Make your own shortlist</strong><small>Browse by format and demo budget, not health claims.</small></span>${arrow()}</button><a href="${href('/contact')}" data-route>${icon('mail')}<span><strong>Ask before choosing</strong><small>A place for your product questions.</small></span>${arrow()}</a></div></section>${history}${ending}`;
}
function collectionDetail(p) {
    return `<div><p class="eyebrow">FORMULATION ${p.number}</p><h3>${p.name}</h3><p>${money(p.previewPrice)} <small>Demo price</small></p></div><div class="v2-detail-actions"><button type="button" data-action="add" data-id="${p.id}" class="button button-dark">Add to bag ${icon('plus')}</button>${link('/products/' + p.id, 'View product details ' + arrow(), 'text-link')}</div>`;
}
function shop() {
    let html = shopV3();
    html = html.replace('A little closer<br><em>to the collection.</em>', 'Your <em>apothecary.</em>')
        .replace('Explore at your own pace. Read the details. Make room for questions.', 'Five formulations. Clear views. An easier way to find your next starting point.');
    const start = html.indexOf('<div class="shop-wellness">'), end = html.indexOf('</div>', start) + 6;
    if (start >= 0)
        html = html.slice(0, start) + `<div class="v4-shop-assist"><div><strong>Not sure where to start?</strong><span>Build a shortlist by format and demo budget.</span></div><button type="button" data-action="v4-finder-open" class="button button-outline">Help me choose ${arrow()}</button></div>` + html.slice(end);
    return html.replace('<section class="small-brand-banner">', `<section class="small-brand-banner v4-shop-bottom">`).replace('Understanding comes first.', 'A question before you choose?').replace('Explore our Ayurveda', 'Ask about a product').replace(href('/ayurveda'), href('/contact'));
}
function pdpOffer(p) {
    if (!offerActive())
        return '';
    const after = Math.round(p.previewPrice * 100 * (100 - previewOffer.percent) / 100) / 100;
    return `<button class="v4-pdp-offer" data-action="v4-offer-open" type="button"><span class="v4-offer-symbol">%</span><span><strong>${hasOffer() ? '10% demo offer applied' : '10% off with ' + previewOffer.code}</strong><small>${money(after)} per item after the demo offer${hasOffer() ? '' : ' · optional'}</small></span>${arrow()}</button>`;
}
function deliveryBlock(p) {
    return `<details class="v4-delivery"><summary>Delivery & returns ${icon('plus')}</summary><p>Check the delivery-interface preview. Live serviceability, charges, timelines and returns terms are not configured.</p><form id="v4-delivery-form" data-product="${p.id}"><label for="delivery-pin">PIN code <span>Use a sample six-digit code</span></label><div class="v4-input-row"><input id="delivery-pin" name="pin" inputmode="numeric" autocomplete="off" pattern="[1-9][0-9]{5}" maxlength="6" required placeholder="e.g. 110001" title="Enter six digits, starting from 1–9"><button type="submit" class="button button-outline">Check</button></div><p class="form-feedback" role="status"></p></form><div class="v4-policy-links">${link('/shipping', 'Shipping details', 'inline-link')}${link('/returns', 'Returns details', 'inline-link')}</div></details>`;
}
function offerInline() {
    if (!offerActive())
        return '';
    return `<div class="v4-offer-inline">${hasOffer() ? `<div class="v4-code-applied">${icon('check')}<span><strong>${previewOffer.code} applied</strong><small>10% demo merchandise saving</small></span><button type="button" data-action="v4-offer-remove" class="inline-link">Remove</button></div>` : `<div class="v4-offer-prompt"><span><strong>A little extra in this preview.</strong><small>10% off the demo subtotal.</small></span><button type="button" data-action="v4-offer-apply" class="text-link">Apply ${previewOffer.code}</button></div>`}<details class="v4-enter-code"><summary>Have another code?</summary><form id="v4-coupon-form" novalidate><label for="coupon-code">Demo promo code</label><div class="v4-input-row"><input id="coupon-code" name="code" maxlength="30" placeholder="Enter code" autocomplete="off" aria-describedby="coupon-status"><button type="submit" class="button button-outline">Apply</button></div><p id="coupon-status" class="form-feedback" role="status"></p></form></details></div>`;
}
function summaryBlock(button = true) {
    const t = demoTotals();
    return `<aside class="order-summary v4-order-summary"><p class="eyebrow">YOUR BAG, AT A GLANCE</p><h2>Order <em>summary.</em></h2>${offerInline()}<dl><div><dt>Subtotal (${countCart()} ${countCart() === 1 ? 'item' : 'items'})</dt><dd>${money(t.subtotal)}</dd></div>${hasOffer() ? `<div class="v4-discount-row"><dt>Demo offer · 10%</dt><dd>−${money(t.discount)}</dd></div>` : ''}<div><dt>Delivery & taxes</dt><dd>Not calculated</dd></div><div class="summary-total"><dt>Demo merchandise total</dt><dd data-demo-total>${money(t.total)}</dd></div></dl><p class="quiet-note">Sample amounts only. Not a final payable total.</p>${button ? link('/checkout', 'Continue to checkout ' + arrow(), 'button button-dark full-width') : ''}<p class="purchase-note">${icon('info')} Demo only · no payment or real order</p><p class="v4-guest-note">No account needed to try checkout.</p>${link('/shop', 'Continue shopping ' + arrow(), 'text-link')}</aside>`;
}
function openCart() {
    const t = demoTotals(), last = findProduct(lastAddedProduct);
    showModal('cart', modalTemplate(`Your bag <span class="dialog-count">(${countCart()})</span>`, cart.length ? `${last ? `<div class="v4-added-note">${icon('check')}<span><strong>Added to your bag</strong><small>${last.name}</small></span></div>` : ''}<div class="drawer-items">${cartLines(true)}</div><div class="drawer-summary v4-drawer-summary">${offerInline()}<dl class="v4-drawer-totals"><div><dt>Demo subtotal</dt><dd>${money(t.subtotal)}</dd></div>${hasOffer() ? `<div class="v4-discount-row"><dt>Demo saving</dt><dd>−${money(t.discount)}</dd></div>` : ''}<div class="v4-drawer-total"><dt>Merchandise total</dt><dd data-demo-total>${money(t.total)}</dd></div></dl><p>Shipping & taxes not calculated. Sample amounts only.</p>${link('/checkout', 'Continue to checkout ' + arrow(), 'button button-dark full-width')}<div class="v4-cart-secondary">${link('/cart', 'Review bag', 'text-link')}<button type="button" data-action="close-modal" class="text-link">Keep shopping</button></div><p class="v4-no-payment">No account required · no real payment or order</p></div>` : `<div class="empty-state drawer-empty">${icon('bag')}<h3>Your next discovery<br><em>starts here.</em></h3><p>Browse all five formulations, or let us help you make a shortlist.</p>${link('/shop', 'Shop formulations ' + arrow(), 'button button-dark')}<button type="button" class="text-link" data-action="v4-finder-open">Help me choose ${arrow()}</button></div>`, 'drawer v4-drawer'));
}
function quickView(id) {
    const p = findProduct(id);
    if (!p)
        return;
    showModal('quickview', modalTemplate(p.name, `<div class="quick-layout"><div class="quick-art">${sceneWidget(p, 'quick')}</div><div><p class="eyebrow">THE APOTHECARY / ${p.number}</p><h3>A closer look.</h3><p class="quick-price">${money(p.previewPrice)} <span>Demo price</span></p><p>Explore the supplied product image in depth, or open the original image and label details. Product facts and pack size still require confirmation.</p><button type="button" data-action="add" data-id="${p.id}" class="button button-dark full-width">Add to bag ${icon('plus')}</button>${link('/products/' + p.id, 'Images & product details ' + arrow(), 'text-link')}<p class="quiet-note">Demo shopping only. No real order or payment.</p></div></div>`, 'quick-panel'));
}
function openOffer() {
    showModal('offer', modalTemplate('A little welcome.', `<div class="v4-offer-modal"><p class="eyebrow">DEMONSTRATION OFFER · NOT A LIVE SALE</p><div class="v4-offer-number">10<span>%</span></div><h3>Off your demo bag.</h3><p>Try the complete shopping journey, including a working promotional code.</p><div class="v4-code-ticket"><code>${previewOffer.code}</code><span>Sample promotion</span></div><button type="button" class="button button-dark full-width" data-action="v4-offer-apply">${hasOffer() ? 'Offer applied · continue shopping' : 'Apply demo offer'} ${arrow()}</button><details><summary>Offer details</summary><p>${previewOffer.terms}</p></details><p class="quiet-note">No countdown, automatic subscription or payment. Final promotional terms require approval before launch.</p></div>`, 'v4-offer-dialog'));
}
function applyDemoOffer() {
    if (!offerActive())
        return;
    const was = activeModal;
    appliedOffer = previewOffer.code;
    persistV4Session();
    if (was === 'cart') {
        render(true);
        openCart();
        document.querySelector('[data-action="v4-offer-remove"]')?.focus({ preventScroll: true });
    }
    else {
        if (activeModal)
            closeModal(false);
        render(true);
        document.querySelector(route.startsWith('/products/') ? '.v4-pdp-offer' : '.v4-offer-bar button')?.focus({ preventScroll: true });
    }
    toast('PREVIEW10 applied: 10% off the demo merchandise subtotal.');
}
function preferenceMatches(p, pref = browsePreferences) { return (pref.form === 'all' || p.form === pref.form) && p.previewPrice <= pref.budget; }
function finderModal() {
    const progress = `<div class="v4-finder-progress" aria-label="Step ${Math.min(finderStep, 2)} of 2"><span class="${finderStep >= 1 ? 'is-complete' : ''}">1 · Format</span><i></i><span class="${finderStep >= 2 ? 'is-complete' : ''}">2 · Budget</span></div>`;
    const rows = finderStep === 1 ? [['all', 'Open to every format', 'See the whole collection.'], ['Bottle', 'Bottle concepts', 'Browse products shown in bottle packaging.'], ['Jar', 'Jar concepts', 'Browse products shown in jar packaging.']] : [['1000', 'Any demo price', 'Explore without a price limit.'], ['500', 'Up to ₹500', 'A smaller demo budget.'], ['700', 'Up to ₹700', 'A little more room to explore.']];
    const matches = products.filter(p => preferenceMatches(p, finderDraft));
    const body = finderStep < 3 ? `${progress}<p class="eyebrow">A SHORTLIST, NOT A PRESCRIPTION</p><h3>${finderStep === 1 ? 'How would you like to browse?' : 'What feels right for your budget?'}</h3><p class="v4-finder-intro">${finderStep === 1 ? 'Start with the packaging format. These are concept formats, not confirmed formulation types.' : 'These are sample prices, not actual selling prices. Your shortlist stays based on the choices you make.'}</p><div class="v4-finder-options" role="group" aria-label="${finderStep === 1 ? 'Packaging preference' : 'Demo budget'}">${rows.map(([v, t, d]) => `<button type="button" data-action="v4-finder-option" data-value="${v}" aria-pressed="${finderStep === 1 ? finderDraft.form === v : finderDraft.budget === Number(v)}"><span><strong>${t}</strong><small>${d}</small></span><span class="v4-selection-mark">${icon('check')}</span></button>`).join('')}</div><div class="v4-finder-nav">${finderStep === 2 ? '<button type="button" class="text-link" data-action="v4-finder-back">Back</button>' : '<span>No account or health questions.</span>'}<button type="button" class="button button-dark" data-action="v4-finder-next">${finderStep === 1 ? 'Continue' : 'Show my shortlist'} ${arrow()}</button></div>` : `<p class="eyebrow">BASED ONLY ON YOUR CHOICES</p><h3>${matches.length ? 'Your own starting point.' : 'No exact match. No forced suggestion.'}</h3><p class="v4-finder-intro">${finderDraft.form === 'all' ? 'All concept formats' : finderDraft.form + ' concepts'} · ${finderDraft.budget === 1000 ? 'Any demo price' : 'Up to ' + money(finderDraft.budget)}. ${matches.length} ${matches.length === 1 ? 'match' : 'matches'}.</p><div class="v4-finder-results">${matches.length ? matches.map(p => `<article>${frontPhoto(p, true)}<div><h4>${link('/products/' + p.id, p.name, '')}</h4><p>${money(p.previewPrice)} · demo price</p><small>${p.form} concept${finderDraft.budget < 1000 ? ' · within your chosen budget' : ''}</small><div class="v4-result-actions">${link('/products/' + p.id, 'View details ' + arrow(), 'text-link')}<button type="button" class="button button-dark" data-action="add" data-id="${p.id}">Add ${icon('plus')}</button></div></div></article>`).join('') : `<div class="v4-finder-empty"><p>No ${finderDraft.form.toLowerCase()} concept falls within this sample budget. Raise your budget or explore all formats.</p><button type="button" class="button button-outline" data-action="v4-finder-edit">Change my choices ${arrow()}</button></div>`}</div><label class="checkbox-label v4-remember"><input type="checkbox" id="remember-preferences" ${finderDraft.remember ? 'checked' : ''}> Remember these browsing preferences on this device</label><p class="quiet-note">Optional. No health data, email or account is collected. Clear preferences any time.</p><div class="v4-finder-nav"><button type="button" class="text-link" data-action="v4-finder-edit">Edit choices</button><button type="button" class="button button-dark" data-action="v4-finder-shop">${matches.length ? 'See my collection' : 'Browse all formulations'} ${arrow()}</button></div>`;
    showModal('finder', modalTemplate('Find your starting point.', `<div class="v4-finder">${body}<p class="v4-finder-safety">Matching is by concept packaging and demo budget only. Product ingredients, benefits and suitability have not been supplied; this is not a health recommendation.</p></div>`, 'v4-finder-dialog'));
    if (finderStep === 3)
        document.querySelector('.v4-finder h3')?.setAttribute('tabindex', '-1');
}
function savePreferences() {
    browsePreferences = { ...finderDraft };
    try {
        if (browsePreferences.remember)
            localStorage.setItem(v4Keys.preferences, JSON.stringify(browsePreferences));
        else
            localStorage.removeItem(v4Keys.preferences);
    }
    catch {
        toast('Preferences stay in this page session; device storage is unavailable.');
    }
}
function handleV4Action(btn) {
    const action = btn.dataset.action || '';
    if (!action.startsWith('v4-'))
        return false;
    if (action === 'v4-offer-open')
        openOffer();
    else if (action === 'v4-offer-apply')
        applyDemoOffer();
    else if (action === 'v4-offer-remove') {
        appliedOffer = '';
        persistV4Session();
        const was = activeModal;
        render(true);
        if (was === 'cart')
            openCart();
        toast('Demo offer removed.');
        document.querySelector('[data-action="v4-offer-apply"]')?.focus({ preventScroll: true });
    }
    else if (action === 'v4-finder-open') {
        finderStep = 1;
        finderDraft = { ...browsePreferences };
        finderModal();
    }
    else if (action === 'v4-finder-option') {
        if (finderStep === 1 && ['all', 'Bottle', 'Jar'].includes(btn.dataset.value || ''))
            finderDraft.form = btn.dataset.value;
        else if (finderStep === 2 && [500, 700, 1000].includes(Number(btn.dataset.value)))
            finderDraft.budget = Number(btn.dataset.value);
        document.querySelectorAll('.v4-finder-options button').forEach(el => el.setAttribute('aria-pressed', String(el === btn)));
    }
    else if (action === 'v4-finder-next') {
        finderStep = Math.min(3, finderStep + 1);
        if (finderStep === 3)
            savePreferences();
        finderModal();
    }
    else if (action === 'v4-finder-back' || action === 'v4-finder-edit') {
        finderStep = action === 'v4-finder-back' ? 1 : 1;
        finderModal();
    }
    else if (action === 'v4-finder-shop') {
        savePreferences();
        const matches = products.filter(p => preferenceMatches(p));
        shopForm = matches.length ? browsePreferences.form : 'all';
        shopMax = matches.length ? browsePreferences.budget : 1000;
        shopSort = 'featured';
        shopTerm = '';
        navigate('/shop');
    }
    else if (action === 'v4-clear-preferences') {
        browsePreferences = { form: 'all', budget: 1000, remember: false };
        finderDraft = { ...browsePreferences };
        shopForm = 'all';
        shopMax = 1000;
        try {
            localStorage.removeItem(v4Keys.preferences);
        }
        catch { }
        render(true);
        toast('Browsing preferences cleared.');
    }
    else if (action === 'v4-clear-recent') {
        recentProducts = [];
        persistV4Session();
        render(true);
        toast('Recently viewed products cleared for this tab.');
    }
    else if (action === 'v4-shelf-filter') {
        const v = btn.dataset.value;
        if (v === 'all' || v === 'Bottle' || v === 'Jar') {
            homeShelfForm = v;
            const old = document.querySelector('.v4-shelf');
            if (old) {
                old.outerHTML = homeShelf();
                document.getElementById('home-product-rail')?.addEventListener('scroll', updateRailButtons, { passive: true });
                document.querySelector(`[data-action="v4-shelf-filter"][data-value="${v}"]`)?.focus({ preventScroll: true });
            }
            updateRailButtons();
        }
    }
    else if (action === 'v4-rail') {
        const rail = document.getElementById('home-product-rail');
        rail?.scrollBy({ left: Number(btn.dataset.direction) * (rail.querySelector('article')?.getBoundingClientRect().width || 300) + Number(btn.dataset.direction) * 24, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
    }
    return true;
}
function handleV4Submit(form) {
    if (form.id === 'v4-coupon-form') {
        const field = form.querySelector('input[name="code"]'), feedback = form.querySelector('.form-feedback');
        const code = field.value.trim().toUpperCase();
        if (code !== previewOffer.code || !offerActive()) {
            field.setAttribute('aria-invalid', 'true');
            feedback.textContent = code ? 'That code is not recognised in this preview. Try PREVIEW10.' : 'Enter a demo code, or use PREVIEW10.';
            field.focus();
        }
        else {
            field.removeAttribute('aria-invalid');
            applyDemoOffer();
        }
        return true;
    }
    if (form.id === 'v4-delivery-form') {
        if (!form.reportValidity())
            return true;
        const button = form.querySelector('button'), feedback = form.querySelector('.form-feedback');
        const request = ++deliveryRequestId;
        button.disabled = true;
        button.textContent = 'Checking…';
        feedback.textContent = 'Testing the delivery-check interface…';
        form.setAttribute('aria-busy', 'true');
        window.setTimeout(() => { if (request !== deliveryRequestId || !form.isConnected)
            return; button.disabled = false; button.textContent = 'Check'; form.removeAttribute('aria-busy'); feedback.textContent = 'PIN format accepted. Live delivery availability, date, charges and cash-on-delivery eligibility are not connected. No delivery promise has been made.'; }, 450);
        return true;
    }
    return false;
}
function setupV4Events() {
    document.addEventListener('change', e => { const el = e.target; if (el.id === 'remember-preferences') {
        finderDraft.remember = el.checked;
        savePreferences();
    } });
}
function updateV4Purchase() {
    if (!route.startsWith('/products/'))
        return;
    const p = findProduct(route.split('/')[2]);
    if (!p)
        return;
    document.querySelectorAll('[data-purchase-total]').forEach(el => el.textContent = `${productQty} ${productQty === 1 ? 'item' : 'items'} · ${money(p.previewPrice * productQty)} · demo`);
}
function updateRailButtons() {
    const rail = document.getElementById('home-product-rail');
    if (!rail)
        return;
    const prev = document.querySelector('[data-action="v4-rail"][data-direction="-1"]'), next = document.querySelector('[data-action="v4-rail"][data-direction="1"]');
    if (prev)
        prev.disabled = rail.scrollLeft < 3;
    if (next)
        next.disabled = rail.scrollLeft + rail.clientWidth >= rail.scrollWidth - 3;
}
function disposeV4() { v4Cleanup?.(); v4Cleanup = null; deliveryRequestId++; }
function initV4() {
    const purchase = document.getElementById('primary-purchase'), dock = document.querySelector('.v4-purchase-dock');
    // IntersectionObserver alone misses an anchor jump from below the viewport to
    // above it: the target can stay non-intersecting throughout. Check scroll
    // position as well, at most once per animation frame.
    const updateDock = () => { if (purchase && dock)
        dock.classList.toggle('is-visible', purchase.getBoundingClientRect().bottom <= 90); };
    let dockFrame = 0;
    const queueDock = () => { if (!dockFrame)
        dockFrame = requestAnimationFrame(() => { dockFrame = 0; updateDock(); }); };
    const observer = purchase && dock ? new IntersectionObserver(updateDock, { threshold: 0, rootMargin: '-90px 0px 0px 0px' }) : null;
    if (purchase && observer)
        observer.observe(purchase);
    window.addEventListener('scroll', queueDock, { passive: true });
    window.addEventListener('resize', queueDock, { passive: true });
    updateDock();
    const rail = document.getElementById('home-product-rail');
    rail?.addEventListener('scroll', updateRailButtons, { passive: true });
    window.addEventListener('resize', updateRailButtons, { passive: true });
    updateRailButtons();
    // Page-rendered shop preserves the explicit preference, with an obvious undo.
    if (route === '/shop' && (browsePreferences.remember || browsePreferences.form !== 'all' || browsePreferences.budget !== 1000)) {
        const assist = document.querySelector('.v4-shop-assist');
        if (assist)
            assist.insertAdjacentHTML('afterend', `<p class="v4-preference-note">Your last browsing choices: ${browsePreferences.form === 'all' ? 'all concept formats' : browsePreferences.form + ' concepts'}, ${browsePreferences.budget === 1000 ? 'any demo price' : 'up to ' + money(browsePreferences.budget)}. <button type="button" class="inline-link" data-action="v4-clear-preferences">Forget preferences</button></p>`);
    }
    v4Cleanup = () => { observer?.disconnect(); if (dockFrame)
        cancelAnimationFrame(dockFrame); window.removeEventListener('scroll', queueDock); window.removeEventListener('resize', queueDock); rail?.removeEventListener('scroll', updateRailButtons); window.removeEventListener('resize', updateRailButtons); };
}
/** Supplied-image studio. This is a 2.5D photographic presentation, NOT a 360°
 * reconstruction. All product texture comes from the user's original pixels. */
function wordmark() {
    return `<span class="wordmark reference-wordmark"><img src="${mediaURL('brand-mark-right.webp')}" alt="Chaulas Wale Hakim Ji — Since 1939" width="786" height="701"></span>`;
}
function referenceOriginal(p) {
    const source = { 'herbal-jari-booti-oil': 'gift-green', 'chyawanprash': 'gift-wood' };
    return `ref-${source[p.id] || p.id}-original.jpg`;
}
function referenceCutout(p, thumb = false) {
    return `<img class="reference-cutout reference-${p.id}" src="${mediaURL(`ref-${p.id}-${thumb ? 'thumb' : 'cutout'}.webp`)}" alt="${esc(p.name)} — isolated from the supplied image, original packaging retained" loading="lazy" decoding="async" width="400" height="650" draggable="false">`;
}
function referenceStudio(p, mode = 'single') {
    const smallSource = ['herbal-jari-booti-oil', 'chyawanprash'].includes(p.id);
    return `<div class="scene-widget reference-studio ${mode === 'hero' ? 'reference-hero-studio' : ''} ${smallSource ? 'small-source' : ''}" data-photo-studio data-product="${p.id}" data-surface="ivory" data-view="depth"><div class="reference-studio-tabs" role="group" aria-label="Product presentation"><button type="button" data-action="ref-view" data-value="depth" aria-pressed="true">Depth view</button><button type="button" data-action="ref-view" data-value="original" aria-pressed="false">Original image</button><button type="button" data-action="ref-about" class="ref-about" aria-label="About the photographic depth view">${icon('info')}</button></div><div class="reference-depth-surface" tabindex="0" role="group" aria-label="Interactive ${esc(p.name)} photograph. Move the pointer or drag to explore depth. Arrow keys tilt, Home resets. Not a 360-degree model."><div class="reference-ambient" aria-hidden="true"></div><div class="reference-floor-shadow" aria-hidden="true"></div><div class="reference-depth-object">${referenceCutout(p)}</div><span class="reference-gesture">${icon('rotate')} Move to explore</span></div><div class="reference-original-surface" hidden><img src="${mediaURL(referenceOriginal(p))}" alt="Original supplied ${esc(p.name)} ${smallSource ? 'gift-set ' : ''}image, retained without retouching" width="1408" height="768" decoding="async"></div><div class="reference-studio-controls"><div class="reference-surfaces" role="group" aria-label="Studio background"><button type="button" data-action="ref-surface" data-value="ivory" aria-label="Ivory studio background" aria-pressed="true"><i></i></button><button type="button" data-action="ref-surface" data-value="charcoal" aria-label="Charcoal studio background" aria-pressed="false"><i></i></button></div><div class="reference-toolset"><button type="button" data-action="ref-motion" aria-pressed="false">${icon('rotate')}<span>Animate</span></button><button type="button" data-action="ref-zoom" aria-pressed="false" aria-label="Zoom product photograph">${icon('zoom')}</button><button type="button" data-action="ref-reset" aria-label="Reset product photograph view">${icon('reset')}</button></div></div><p class="reference-studio-note">${smallSource ? 'Product crop from supplied gift-set image.' : 'Your original packaging. Nothing redrawn.'}</p><span class="sr-only reference-status" role="status"></span></div>`;
}
const referenceScenes = new Map();
function initReferenceScenes(root = document) {
    root.querySelectorAll('[data-photo-studio]').forEach(el => {
        if (referenceScenes.has(el))
            return;
        const area = el.querySelector('.reference-depth-surface');
        const reduce = matchMedia('(prefers-reduced-motion: reduce)');
        let frame = 0, running = false, zoomed = false, drag = false, visible = true, hover = false, rx = 0, ry = 0, dx = 0, dy = 0;
        const write = (x, y) => { rx = x; ry = y; el.style.setProperty('--ref-rx', x + 'deg'); el.style.setProperty('--ref-ry', y + 'deg'); el.style.setProperty('--ref-dx', (y * 1.15) + 'px'); el.style.setProperty('--ref-dy', (-x * .6) + 'px'); };
        const point = (e) => { if (e.pointerType === 'touch' && !drag)
            return; const b = area.getBoundingClientRect(); const x = (e.clientX - b.left) / b.width * 2 - 1, y = (e.clientY - b.top) / b.height * 2 - 1; write(-Math.max(-1, Math.min(1, y)) * 4, Math.max(-1, Math.min(1, x)) * 7); };
        const down = (e) => { if (e.button !== 0)
            return; drag = true; dx = e.clientX; dy = e.clientY; hover = true; area.classList.add('is-dragging'); if (e.pointerType === 'mouse')
            area.setPointerCapture(e.pointerId); point(e); };
        const move = (e) => { if (e.pointerType === 'touch' && Math.abs(e.clientY - dy) > Math.abs(e.clientX - dx) * 1.5) {
            drag = false;
            return;
        } point(e); };
        const enter = () => { hover = true; };
        const leave = () => { hover = false; drag = false; area.classList.remove('is-dragging'); write(0, 0); };
        const up = () => { drag = false; area.classList.remove('is-dragging'); };
        const key = (e) => { if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home'].includes(e.key))
            return; e.preventDefault(); e.stopPropagation(); hover = true; if (e.key === 'Home')
            write(0, 0);
        else
            write(Math.max(-6, Math.min(6, rx + (e.key === 'ArrowUp' ? 2 : e.key === 'ArrowDown' ? -2 : 0))), Math.max(-9, Math.min(9, ry + (e.key === 'ArrowRight' ? 3 : e.key === 'ArrowLeft' ? -3 : 0)))); };
        const tick = (t) => { frame = 0; if (!running || !visible || document.hidden)
            return; if (!hover && el.dataset.view === 'depth')
            write(Math.sin(t * .0008) * 1.8, Math.sin(t * .0005) * 4.5); frame = requestAnimationFrame(tick); };
        const sync = () => { if (frame) {
            cancelAnimationFrame(frame);
            frame = 0;
        } if (running && visible && !document.hidden)
            frame = requestAnimationFrame(tick); };
        const motionChange = () => { if (reduce.matches) {
            running = false;
            el.querySelector('[data-action="ref-motion"]')?.setAttribute('aria-pressed', 'false');
            write(0, 0);
        } sync(); };
        const observer = new IntersectionObserver(entries => { visible = entries[0]?.isIntersecting || false; sync(); }, { rootMargin: '40px' });
        observer.observe(el);
        area.addEventListener('pointerenter', enter);
        area.addEventListener('pointerleave', leave);
        area.addEventListener('pointerdown', down);
        area.addEventListener('pointermove', move, { passive: true });
        area.addEventListener('pointerup', up);
        area.addEventListener('pointercancel', leave);
        area.addEventListener('keydown', key);
        document.addEventListener('visibilitychange', sync);
        reduce.addEventListener('change', motionChange);
        referenceScenes.set(el, { reset() { zoomed = false; running = false; el.classList.remove('is-zoomed'); write(0, 0); sync(); }, zoom() { zoomed = !zoomed; el.classList.toggle('is-zoomed', zoomed); return zoomed; }, motion() { running = !running; hover = false; sync(); return running; }, dispose() { if (frame)
                cancelAnimationFrame(frame); observer.disconnect(); area.removeEventListener('pointerenter', enter); area.removeEventListener('pointerleave', leave); area.removeEventListener('pointerdown', down); area.removeEventListener('pointermove', move); area.removeEventListener('pointerup', up); area.removeEventListener('pointercancel', leave); area.removeEventListener('keydown', key); document.removeEventListener('visibilitychange', sync); reduce.removeEventListener('change', motionChange); } });
    });
}
function disposeReferenceScenes(root = document) {
    for (const [el, scene] of referenceScenes) {
        if (root === document || root.contains(el)) {
            scene.dispose();
            referenceScenes.delete(el);
        }
    }
}
function handleReferenceAction(btn) {
    const action = btn.dataset.action || '';
    if (!action.startsWith('ref-'))
        return false;
    if (action === 'ref-gift-select') {
        const id = btn.dataset.id;
        if (!['wood', 'green', 'paper'].includes(id || ''))
            return true;
        const img = document.getElementById('gift-reference-image');
        if (img) {
            img.src = mediaURL('ref-gift-' + id + '-original.jpg');
            img.alt = 'Supplied ' + ({ wood: 'wooden', green: 'ivory and green', paper: 'parchment' }[id] || '') + ' gift-box image, unchanged';
        }
        document.querySelectorAll('[data-action="ref-gift-select"]').forEach(x => x.setAttribute('aria-pressed', String(x === btn)));
        return true;
    }
    if (action === 'ref-about') {
        showModal('photo-info', modalTemplate('The image is the source.', `<div class="reference-about-copy"><p>These are the supplied product images—not newly generated packaging. Background-isolated views and detail crops preserve the original bottle, label and cap artwork.</p><p>The interactive stage adds restrained photographic depth, background lighting and zoom. It is <strong>not a 360° reconstruction</strong>, and does not invent the back of the product or an opening mechanism.</p><p>Full-turn 3D can be connected when an approved model or sufficient matching reference views and label artwork are available.</p><button class="button button-dark" type="button" data-action="close-modal">Back to the product ${arrow()}</button></div>`, 'reference-info-dialog'));
        return true;
    }
    const el = btn.closest('[data-photo-studio]');
    if (!el)
        return true;
    const api = referenceScenes.get(el);
    if (action === 'ref-view') {
        const original = btn.dataset.value === 'original';
        el.dataset.view = original ? 'original' : 'depth';
        const d = el.querySelector('.reference-depth-surface'), o = el.querySelector('.reference-original-surface');
        d.hidden = original;
        o.hidden = !original;
        el.querySelectorAll('[data-action="ref-view"]').forEach(x => x.setAttribute('aria-pressed', String(x === btn)));
        el.querySelectorAll('.reference-studio-controls button').forEach(x => x.disabled = original);
    }
    else if (action === 'ref-surface') {
        if (!['ivory', 'charcoal'].includes(btn.dataset.value || ''))
            return true;
        el.dataset.surface = btn.dataset.value;
        el.querySelectorAll('[data-action="ref-surface"]').forEach(x => x.setAttribute('aria-pressed', String(x === btn)));
    }
    else if (action === 'ref-motion')
        btn.setAttribute('aria-pressed', String(api?.motion() || false));
    else if (action === 'ref-zoom')
        btn.setAttribute('aria-pressed', String(api?.zoom() || false));
    else if (action === 'ref-reset') {
        api?.reset();
        el.querySelector('[data-action="ref-motion"]')?.setAttribute('aria-pressed', 'false');
        el.querySelector('[data-action="ref-zoom"]')?.setAttribute('aria-pressed', 'false');
    }
    const status = el.querySelector('.reference-status');
    if (status)
        status.textContent = action === 'ref-reset' ? 'Photograph view reset.' : action === 'ref-view' ? (el.dataset.view === 'original' ? 'Original supplied image.' : 'Photographic depth view.') : action === 'ref-zoom' ? (btn.getAttribute('aria-pressed') === 'true' ? 'Closer photographic view.' : 'Full photographic view.') : 'Photographic presentation updated.';
    return true;
}
/** Shared UI primitives; each product page composes these differently. */
function plLines(value) { return esc(value).replace(/\n/g, '<br>'); }
function plHeading(value) { const [first, ...rest] = value.split('\n'); return esc(first) + (rest.length ? '<br><em>' + rest.map(esc).join('<br>') + '</em>' : ''); }
function plOriginal(c, cls = '', eager = false) {
    return `<img class="${cls}" src="${mediaURL(c.hero.original)}" alt="${esc(c.hero.alt)}" width="1408" height="768" ${eager ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async" draggable="false">`;
}
function plCutout(p, cls = '', eager = false) {
    return `<img class="pl-product-image ${cls}" src="${mediaURL('ref-' + p.id + '-cutout.webp')}" alt="${esc(p.name)} — isolated from the supplied packaging image" width="560" height="900" ${eager ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async" draggable="false">`;
}
function plGalleryButton(p, label = 'Explore the images', cls = 'text-link') {
    return `<button type="button" class="${cls}" data-action="pl-gallery" data-id="${p.id}">${label} ${icon('zoom')}</button>`;
}
function plChapterNav(p) {
    const items = [['experience', 'Overview'], ['atelier', 'In 3D'], ['packaging', 'Packaging'], ['gallery', 'Gallery'], ['ingredients', 'Ingredients'], ['product-documents', 'Documents'], ['voices', 'Reviews'], ['essentials', 'Essentials']];
    return `<nav class="pl-chapters" aria-label="${esc(p.name)} page chapters"><a href="${href('/shop')}" data-route class="pl-back" aria-label="Back to all formulations">${icon('left')}<span>Collection ${p.number}</span></a><div class="pl-chapter-links">${items.map(([id, label]) => `<a href="#${id}" data-pl-chapter="${id}" ${id === 'experience' ? 'aria-current="location"' : ''}>${label}</a>`).join('')}</div><button type="button" class="pl-motion-toggle" data-action="pl-motion" aria-pressed="false" aria-label="Pause decorative page motion">${icon('sun')}<span>Motion on</span></button></nav>`;
}
function plHeroFooter(p, c) {
    return `<div class="pl-hero-annotation"><p>${plLines(c.hero.tagline)}</p><a href="#essentials" class="text-link">Product essentials ${arrow()}</a></div><div class="pl-hero-gallery">${plGalleryButton(p, 'Open the gallery')}<span>Original imagery. A closer encounter.</span></div>`;
}
function plIntroduction(p, c) {
    const approved = c.information.approved && c.information.description;
    return `<section class="pl-introduction pl-section" data-pl-section="introduction"><p class="pl-overline">THE HOUSE / THE FORMULATION</p><div><h2>${plHeading(c.hero.tagline)}</h2><p class="pl-lead">${esc(approved ? c.information.description : c.hero.introduction)}</p><p class="pl-context">A Chaulas Wale Hakim Ji formulation. A Swastha Ayurveda Pvt. Ltd. brand, with heritage dating to 1939.</p>${!approved ? `<p class="pl-status"><span></span>Approved formulation description to be supplied.</p>` : ''}</div><span class="pl-edition-mark" aria-hidden="true">${c.edition}</span></section>`;
}
function plStudy(p, c) {
    const initial = c.packaging.initialStudy || 0, s = c.packaging.studies[initial];
    const small = ['herbal-jari-booti-oil', 'chyawanprash'].includes(p.id);
    const filmURL = c.film.approved ? safeContentURL(c.film.src) : '';
    const film = filmURL ? `<div class="pl-film"><video controls playsinline preload="none" poster="${mediaURL(c.film.poster)}" aria-label="${esc(p.name)} product film"><source src="${esc(filmURL)}" type="video/mp4"></video><p>${esc(c.film.caption)}</p>${c.film.transcript ? `<details><summary>Read the film transcript</summary><p>${esc(c.film.transcript)}</p></details>` : ''}</div>` : '';
    return `<section class="pl-study pl-section ${small ? 'pl-study-small' : ''}" id="packaging" data-pl-section="packaging"><div class="pl-study-intro"><p class="pl-overline">01 / THE OBJECT, CONSIDERED</p><h2>${plHeading(c.packaging.title)}</h2><p>${esc(c.packaging.description)}</p><div class="pl-study-tabs" role="tablist" aria-label="${esc(p.name)} packaging details">${c.packaging.studies.map((v, i) => `<button type="button" role="tab" id="pl-study-tab-${i}" aria-controls="pl-study-panel" aria-selected="${i === initial}" tabindex="${i === initial ? 0 : -1}" data-action="pl-study" data-index="${i}" data-id="${p.id}"><span>0${i + 1}</span>${esc(v.label)}${arrow()}</button>`).join('')}</div><div class="pl-study-copy" id="pl-study-panel" role="tabpanel" aria-labelledby="pl-study-tab-${initial}" tabindex="0"><h3>${esc(s.title)}</h3><p>${esc(s.caption)}</p></div>${plGalleryButton(p, 'Open all images')}</div><div class="pl-study-visual"><div class="pl-study-image ${s.image.includes('original') ? 'is-original' : ''}" data-pl-study-frame data-image-type="${s.image.includes('label') ? 'label' : s.image.includes('cutout') ? 'cutout' : 'original'}"><img id="pl-study-image" src="${mediaURL(s.image)}" alt="${esc(p.name + ' — ' + s.label.toLowerCase() + ', supplied image or crop')}" width="1000" height="900" loading="lazy" decoding="async" draggable="false"><button type="button" class="icon-button pl-study-expand" data-action="pl-gallery" data-id="${p.id}" aria-label="Expand ${esc(p.name)} gallery">${icon('zoom')}</button></div><div class="pl-study-foot"><span data-pl-study-label>${esc(s.label)}</span><span data-pl-study-count>${String(initial + 1).padStart(2, '0')} / ${String(c.packaging.studies.length).padStart(2, '0')}</span></div><p class="pl-image-note">${small ? 'Gift-set reference and detail crops. A standalone product shoot is still to come.' : 'Your supplied photograph and its crops. No reconstructed or invented angles.'}</p></div>${film}</section>`;
}
function plGallerySection(p, c) {
    return `<section class="pl-gallery pl-section" id="gallery" data-pl-section="gallery"><div class="pl-section-heading"><div><p class="pl-overline">02 / EVERY VISIBLE DETAIL</p><h2>A closer <em>look.</em></h2></div><p>Switch between the supplied image and its detail crops. Open the gallery to zoom or compare two views.</p></div>${productGallery(p)}</section>`;
}
function plIngredients(p, c) {
    const info = c.information, ready = info.approved && info.ingredients.length > 0;
    return `<section class="pl-ingredients pl-section" id="ingredients" data-pl-section="ingredients"><div class="pl-ingredients-heading"><p class="pl-overline">03 / INSIDE THE FORMULATION</p><h2>What goes in<br><em>deserves its own story.</em></h2><p>Ingredients for ${esc(p.name)}, separate from the story of its packaging.</p>${link('/ingredients', 'Visit the botanical library ' + arrow(), 'text-link')}</div><div class="pl-ingredient-record">${ready ? `<dl>${info.ingredients.map(i => `<div><dt>${esc(i.name)}</dt><dd>${esc(i.quantity)}<p>${esc(i.description)}</p></dd></div>`).join('')}</dl><p>${esc(info.allergens || 'Allergen information has not been supplied.')}</p>` : `<p class="pl-record-label">FORMULATION RECORD <span>NOT YET SUPPLIED</span></p><dl><div><dt>Complete ingredient list</dt><dd>Awaiting the approved formula</dd></div><div><dt>Ingredient quantities</dt><dd>Not supplied</dd></div><div><dt>Allergens & suitability</dt><dd>Awaiting approved information</dd></div></dl><p class="pl-record-note">No ingredient or benefit has been inferred from the name, packaging, or herbs in the photograph.</p>`}</div></section>`;
}
function plDocuments(p) {
    const info = landingStories[p.id]?.information;
    const regulatory = info?.approved && (info.classification || info.manufacturer) ? { classification: info.classification, manufacturer: info.manufacturer, reviewed: true } : undefined;
    return `<div class="pl-documents" data-pl-section="product-documents">${productDocuments(p, regulatory)}</div>`;
}
function plVoices(p, c) {
    const reviews = c.information.approved ? c.information.reviews.filter(r => r.permissionConfirmed) : [];
    return `<section class="pl-voices pl-section" id="voices" data-pl-section="voices"><div><p class="pl-overline">04 / CUSTOMER VOICES</p><h2>Experiences,<br><em>in their own words.</em></h2></div><div class="pl-voices-content">${reviews.length ? reviews.map(r => `<figure class="pl-review"><blockquote>${esc(r.quote)}</blockquote><figcaption>${esc(r.name)}${r.date ? ' · ' + esc(r.date) : ''}</figcaption></figure>`).join('') : `<span class="pl-quote-mark" aria-hidden="true">“</span><h3>Room for real stories.</h3><p>Approved customer feedback for ${esc(p.name)} has not been supplied. This space is reserved for genuine experiences, without invented ratings or testimonials.</p><p class="pl-status"><span></span>Customer feedback to be added.</p>`}</div></section>`;
}
function plEssentials(p, c) {
    const i = c.information, ready = i.approved;
    const field = (text, fallback) => esc(ready && text ? text : fallback);
    const rows = [['Approved product description', field(i.description, 'To be supplied for ' + p.name + '.')], ['Traditional context', field(i.traditionalContext, 'Reviewed traditional-use information has not been supplied. It will be kept separate from substantiated product claims.')], ['Substantiated product information', field(i.substantiatedInformation, 'No verified product benefits or clinical evidence have been supplied for this website.')], ['Directions, cautions & suitability', field(i.directions, 'Approved directions have not been supplied.') + ' ' + field(i.cautions, 'Cautions have not been supplied.') + ' ' + field(i.suitability, 'Product suitability has not been confirmed.')], ['Storage & pack information', field(i.storage, 'Storage guidance is not supplied.') + ' ' + field(i.packSize, 'Actual pack size is not confirmed. The supplied artwork is a reference, not an approved product label.')]];
    return `<section class="pl-essentials pl-section" id="essentials" data-pl-section="essentials"><div><p class="pl-overline">05 / CLARITY BEFORE CHOOSING</p><h2>The essentials.<br><em>All in one place.</em></h2><p>Take the time you need. Product information, documentary records and purchase details should be easy to find.</p><p class="pl-safety-note">This is a design and shopping preview. Do not choose or use a product on the basis of unapproved information shown here.</p>${link('/contact?product=' + p.id, 'Ask about ' + p.name + ' ' + arrow(), 'text-link')}</div><div class="pl-essentials-record"><p class="pl-record-label">${esc(p.name.toUpperCase())} <span>${ready ? 'APPROVED CONTENT' : 'CONTENT PENDING'}</span></p>${rows.map(([title, body], n) => `<details ${n === 0 ? 'open' : ''}><summary>${title}${icon('plus')}</summary><p>${body}</p></details>`).join('')}${deliveryBlock(p)}</div></section>`;
}
function plQuantity(p, location) {
    const disabled = query.get('state') === 'out-of-stock';
    return `<div class="pl-quantity" role="group" aria-label="${esc(p.name)} quantity, ${location}"><button type="button" data-action="pl-qty" data-id="${p.id}" data-change="-1" aria-label="Decrease ${esc(p.name)} quantity" ${productQty <= 1 || disabled ? 'disabled' : ''}>${icon('minus')}</button><output data-pl-quantity aria-live="polite">${productQty}</output><button type="button" data-action="pl-qty" data-id="${p.id}" data-change="1" aria-label="Increase ${esc(p.name)} quantity" ${productQty >= 20 || disabled ? 'disabled' : ''}>${icon('plus')}</button></div>`;
}
function plBuyButtons(p) {
    const disabled = query.get('state') === 'out-of-stock';
    return `<button type="button" class="button button-outline pl-add" data-action="add" data-id="${p.id}" data-pdp="true" ${disabled ? 'disabled' : ''}>${disabled ? 'Unavailable' : 'Add to bag'}</button><button type="button" class="button button-dark pl-buy" data-action="buy-now" data-id="${p.id}" ${disabled ? 'disabled' : ''}>${disabled ? 'Unavailable' : 'Buy now'} ${disabled ? '' : arrow()}</button>`;
}
function plFinale(p, c) {
    const next = products[(products.indexOf(p) + 1) % products.length], disabled = query.get('state') === 'out-of-stock';
    return `<section class="pl-finale pl-section" id="choose" data-pl-section="choose"><div class="pl-finale-object">${plCutout(p)}<span>COLLECTION ${c.edition}</span></div><div class="pl-finale-copy"><p class="pl-overline">YOUR NEXT CHAPTER</p><h2>${esc(p.name)}.<br><em>A place in your collection.</em></h2><div class="pl-finale-price"><strong>${money(p.previewPrice)}</strong><span>Demo price per item · pack size not confirmed</span></div>${disabled ? '<p class="pl-status">Out-of-stock demonstration. No real inventory claim.</p>' : ''}<div class="pl-finale-actions">${plQuantity(p, 'final purchase')}${plBuyButtons(p)}</div><p class="pl-purchase-note">Demo checkout only. No payment or real order.</p><button type="button" class="text-link pl-save" data-action="save" data-id="${p.id}" aria-pressed="${saved.includes(p.id)}">${icon('heart')} ${saved.includes(p.id) ? 'Saved to your collection' : 'Save for a closer look'}</button></div></section><a class="pl-next-product" href="${href('/products/' + next.id)}" data-route><span><small>CONTINUE THROUGH THE COLLECTION</small><strong>Discover ${esc(next.name)}</strong></span>${arrow()}</a>`;
}
function plPurchaseDock(p) {
    return `<aside class="pl-purchase-dock" aria-label="Purchase ${esc(p.name)}"><div class="pl-dock-inner"><div class="pl-dock-identity">${plCutout(p)}<div><strong>${esc(p.name)}</strong><span>Demo only · no payment</span></div></div><div class="pl-dock-price"><strong data-pl-total>${money(p.previewPrice * productQty)}</strong><span>Demo subtotal</span></div><div class="pl-dock-controls">${plQuantity(p, 'sticky purchase bar')}${plBuyButtons(p)}</div></div><div class="pl-dock-progress" aria-hidden="true"><i></i></div></aside>`;
}
/** Generated from content/product-landings. Edit the JSON sources. */
const landingStories = { "chyawanprash": { "id": "chyawanprash", "name": "Chyawanprash", "design": "heirloom", "edition": "05", "hero": { "kicker": "THE HERITAGE EDITION", "tagline": "Tradition,\nin good company.", "introduction": "A name in the collection, pictured within the wooden gift-box reference. Discover Chyawanprash at your own pace.", "original": "ref-gift-wood-original.jpg", "alt": "The supplied wooden gift-box reference containing Chyawanprash." }, "packaging": { "title": "The setting tells\npart of the story.", "description": "The wooden gift-box image is the only supplied visual context for this product. It remains a reference, not a verified record of the gift-set contents or product claims.", "studies": [{ "label": "The setting", "image": "ref-gift-wood-original.jpg", "title": "The wooden-box reference.", "caption": "The complete supplied composition. The printed customer count and other claims require confirmation before public use." }, { "label": "Product crop", "image": "ref-chyawanprash-cutout.webp", "title": "A closer look at the jar.", "caption": "An isolated crop of the jar shown in the box. Its limited source resolution is preserved, not invented." }, { "label": "Label crop", "image": "ref-chyawanprash-label.webp", "title": "The visible front label.", "caption": "A detail crop from the gift-box reference, not an additional photograph or a verified ingredient list." }], "initialStudy": 1 }, "information": { "approved": false, "description": "", "traditionalContext": "", "substantiatedInformation": "", "packSize": "", "classification": "", "manufacturer": "", "directions": "", "cautions": "", "storage": "", "suitability": "", "ingredients": [], "allergens": "", "reviews": [] }, "film": { "approved": false, "src": "", "poster": "ref-gift-wood-original.jpg", "caption": "", "transcript": "" }, "contentStatus": "Preview: approved product information and original licence documents have not been supplied.", "imageProvenance": "Images are supplied packaging references; crops are not new viewing angles. Printed claims require verification." }, "herbal-jari-booti-oil": { "id": "herbal-jari-booti-oil", "name": "Herbal Jari Booti Oil", "design": "botanical", "edition": "04", "hero": { "kicker": "THE BOTANICAL EDITION", "tagline": "A botanical name.\nA considered introduction.", "introduction": "Meet Herbal Jari Booti Oil through the supplied gift-set image, then explore the formulation information and records in one place.", "original": "ref-gift-green-original.jpg", "alt": "The supplied gift-set image containing Herbal Jari Booti Oil." }, "packaging": { "title": "From the set,\nto the detail.", "description": "The current reference shows this product inside the ivory-and-green gift box. The complete photograph is preserved; the individual crop is deliberately kept small.", "studies": [{ "label": "In the set", "image": "ref-gift-green-original.jpg", "title": "The full presentation.", "caption": "The original gift-box reference. Set contents, pack information and printed claims are not yet approved for sale." }, { "label": "Product crop", "image": "ref-herbal-jari-booti-oil-cutout.webp", "title": "The jar within the set.", "caption": "A small crop of the product visible in the gift-box reference. No standalone high-resolution photograph has been supplied." }, { "label": "Label crop", "image": "ref-herbal-jari-booti-oil-label.webp", "title": "The visible label.", "caption": "Limited-resolution crop from the supplied gift-set image. No text or fine detail has been regenerated." }], "initialStudy": 1 }, "information": { "approved": false, "description": "", "traditionalContext": "", "substantiatedInformation": "", "packSize": "", "classification": "", "manufacturer": "", "directions": "", "cautions": "", "storage": "", "suitability": "", "ingredients": [], "allergens": "", "reviews": [] }, "film": { "approved": false, "src": "", "poster": "ref-gift-green-original.jpg", "caption": "", "transcript": "" }, "contentStatus": "Preview: approved product information and original licence documents have not been supplied.", "imageProvenance": "Images are supplied packaging references; crops are not new viewing angles. Printed claims require verification." }, "majun-jalali": { "id": "majun-jalali", "name": "Majun Jalali", "design": "editorial", "edition": "02", "hero": { "kicker": "THE JAR EDITION", "tagline": "A different expression\nof the apothecary.", "introduction": "An amber-toned jar, a dark lid and a label with a character of its own. Take your time with Majun Jalali.", "original": "ref-majun-jalali-original.jpg", "alt": "The supplied Majun Jalali jar photograph." }, "packaging": { "title": "A study in\nform and lettering.", "description": "The circular label and broad jar create a different visual rhythm within the collection. This is the supplied Majun Jalali image, not a new packaging design.", "studies": [{ "label": "The jar", "image": "ref-majun-jalali-cutout.webp", "title": "A form of its own.", "caption": "The isolated jar preserves the supplied label and dark screw-top lid." }, { "label": "The label", "image": "ref-majun-jalali-label.webp", "title": "Lettering worth a closer look.", "caption": "A crop of the same front view. The image is a packaging reference, not a verified formulation sheet." }, { "label": "The setting", "image": "ref-majun-jalali-original.jpg", "title": "Seen in natural light.", "caption": "The full supplied image, including the window, counter and background vessels." }], "initialStudy": 1 }, "information": { "approved": false, "description": "", "traditionalContext": "", "substantiatedInformation": "", "packSize": "", "classification": "", "manufacturer": "", "directions": "", "cautions": "", "storage": "", "suitability": "", "ingredients": [], "allergens": "", "reviews": [] }, "film": { "approved": false, "src": "", "poster": "ref-majun-jalali-original.jpg", "caption": "", "transcript": "" }, "contentStatus": "Preview: approved product information and original licence documents have not been supplied.", "imageProvenance": "Images are supplied packaging references; crops are not new viewing angles. Printed claims require verification." }, "ras-e-faulad": { "id": "ras-e-faulad", "name": "Ras e Faulad", "design": "nocturne", "edition": "03", "hero": { "kicker": "THE SMALL-FORMAT EDITION", "tagline": "Small in scale.\nRich in detail.", "introduction": "A dropper silhouette. A matching carton. A closer look at Ras e Faulad, without losing sight of the whole.", "original": "ref-ras-e-faulad-original.jpg", "alt": "The supplied Ras e Faulad bottle-and-carton photograph." }, "packaging": { "title": "Bottle and carton.\nOne visual language.", "description": "The supplied photograph brings the dropper bottle and its carton together. Explore the front label, the bottle silhouette and the complete composition.", "studies": [{ "label": "Bottle & carton", "image": "ref-ras-e-faulad-original.jpg", "title": "The complete composition.", "caption": "Your original photograph, with the bottle and carton together. No packaging has been replaced." }, { "label": "The bottle", "image": "ref-ras-e-faulad-cutout.webp", "title": "The dropper silhouette.", "caption": "A background-isolated crop from the same reference image. It is not a new angle." }, { "label": "The label", "image": "ref-ras-e-faulad-label.webp", "title": "A closer reading.", "caption": "The original front-label crop. The printed wording is not a substitute for approved product information." }], "initialStudy": 0 }, "information": { "approved": false, "description": "", "traditionalContext": "", "substantiatedInformation": "", "packSize": "", "classification": "", "manufacturer": "", "directions": "", "cautions": "", "storage": "", "suitability": "", "ingredients": [], "allergens": "", "reviews": [] }, "film": { "approved": false, "src": "", "poster": "ref-ras-e-faulad-original.jpg", "caption": "", "transcript": "" }, "contentStatus": "Preview: approved product information and original licence documents have not been supplied.", "imageProvenance": "Images are supplied packaging references; crops are not new viewing angles. Printed claims require verification." }, "ras-e-jalali": { "id": "ras-e-jalali", "name": "Ras e Jalali", "design": "signature", "edition": "01", "hero": { "kicker": "THE AMBER EDITION", "tagline": "A familiar name.\nA closer encounter.", "introduction": "Amber tones, parchment lettering and the detail of a dark cap. Meet Ras e Jalali, in its own space.", "original": "ref-ras-e-jalali-original.jpg", "alt": "The supplied Ras e Jalali bottle photograph." }, "packaging": { "title": "The signature,\nin the details.", "description": "A warm amber silhouette. An ornate label. A dark, rounded cap. Explore the packaging exactly as it appears in the supplied product image.", "studies": [{ "label": "The silhouette", "image": "ref-ras-e-jalali-cutout.webp", "title": "The bottle, uninterrupted.", "caption": "An isolated view of the supplied bottle. Its proportions, cap and label have not been redrawn." }, { "label": "The lettering", "image": "ref-ras-e-jalali-label.webp", "title": "Read a little closer.", "caption": "A detail crop of the original front label. Printed product information still needs approval before launch." }, { "label": "In its setting", "image": "ref-ras-e-jalali-original.jpg", "title": "The apothecary setting.", "caption": "The complete image as supplied, with its original setting and lighting." }], "initialStudy": 1 }, "information": { "approved": false, "description": "", "traditionalContext": "", "substantiatedInformation": "", "packSize": "", "classification": "", "manufacturer": "", "directions": "", "cautions": "", "storage": "", "suitability": "", "ingredients": [], "allergens": "", "reviews": [] }, "film": { "approved": false, "src": "", "poster": "ref-ras-e-jalali-original.jpg", "caption": "", "transcript": "" }, "contentStatus": "Preview: approved product information and original licence documents have not been supplied.", "imageProvenance": "Images are supplied packaging references; crops are not new viewing angles. Printed claims require verification." } };
/** Stable routes, distinct experiences, one shared commerce state. */
function productLandingPage(p) {
    const c = landingStories[p.id];
    if (!c)
        return notFound();
    const pages = {
        'ras-e-jalali': rasEJalaliLanding, 'majun-jalali': majunJalaliLanding,
        'ras-e-faulad': rasEFauladLanding, 'herbal-jari-booti-oil': herbalJariBootiLanding,
        'chyawanprash': chyawanprashLanding
    };
    return `<article class="product-landing pl-${c.design}" data-product-landing="${p.id}" data-content-status="${c.information.approved ? 'approved' : 'draft'}">${plChapterNav(p)}${pages[p.id](p, c)}</article>${plPurchaseDock(p)}`;
}
function initialProductGallery() {
    return ['/products/ras-e-jalali', '/products/ras-e-faulad'].includes(route) ? 'original' : 'front';
}
/** Progressive enhancement. No scroll hijacking; all sections start readable. */
let plCleanup = null;
let plMotionPaused = false;
function syncLandingQuantity() {
    const p = findProduct(document.querySelector('[data-product-landing]')?.dataset.productLanding || '');
    if (!p)
        return;
    const unavailable = query.get('state') === 'out-of-stock';
    document.querySelectorAll('[data-pl-quantity]').forEach(el => el.textContent = String(productQty));
    document.querySelectorAll('[data-pl-total]').forEach(el => el.textContent = money(p.previewPrice * productQty));
    document.querySelectorAll('[data-action="pl-qty"]').forEach(el => el.disabled = unavailable || (el.dataset.change === '-1' ? productQty <= 1 : productQty >= 20));
}
function selectLandingStudy(id, index, focus = false) {
    const c = landingStories[id], s = c?.packaging.studies[index];
    if (!s)
        return;
    const image = document.getElementById('pl-study-image');
    if (image) {
        image.src = mediaURL(s.image);
        image.alt = c.name + ' — ' + s.label.toLowerCase() + ', supplied image or crop';
    }
    const frame = document.querySelector('[data-pl-study-frame]');
    frame?.classList.toggle('is-original', s.image.includes('original'));
    if (frame)
        frame.dataset.imageType = s.image.includes('label') ? 'label' : s.image.includes('cutout') ? 'cutout' : 'original';
    document.querySelectorAll('[data-action="pl-study"]').forEach((el, i) => { el.setAttribute('aria-selected', String(i === index)); el.tabIndex = i === index ? 0 : -1; if (focus && i === index)
        el.focus({ preventScroll: true }); });
    const panel = document.getElementById('pl-study-panel');
    if (panel) {
        panel.setAttribute('aria-labelledby', 'pl-study-tab-' + index);
        panel.innerHTML = `<h3>${esc(s.title)}</h3><p>${esc(s.caption)}</p>`;
    }
    const label = document.querySelector('[data-pl-study-label]'), count = document.querySelector('[data-pl-study-count]');
    if (label)
        label.textContent = s.label;
    if (count)
        count.textContent = String(index + 1).padStart(2, '0') + ' / ' + String(c.packaging.studies.length).padStart(2, '0');
}
function handleLandingAction(btn) {
    const action = btn.dataset.action || '';
    if (!action.startsWith('pl-'))
        return false;
    const id = btn.dataset.id || '', p = findProduct(id);
    if (action === 'pl-gallery' && p) {
        galleryCompare = false;
        galleryZoomed = false;
        openExpandedGallery(p);
    }
    else if (action === 'pl-study')
        selectLandingStudy(id, Number(btn.dataset.index));
    else if (action === 'pl-qty' && p && query.get('state') !== 'out-of-stock') {
        const currentGroup = btn.closest('.pl-quantity');
        productQty = Math.max(1, Math.min(20, productQty + Number(btn.dataset.change)));
        syncLandingQuantity();
        updateV4Purchase();
        if (btn.hasAttribute('disabled'))
            currentGroup?.querySelector('button:not([disabled])')?.focus({ preventScroll: true });
    }
    else if (action === 'pl-motion') {
        plMotionPaused = !plMotionPaused;
        document.dispatchEvent(new Event('pl-motion-change'));
    }
    return true;
}
function disposeProductLanding() { plCleanup?.(); plCleanup = null; document.body.classList.remove('has-product-landing'); document.documentElement.classList.remove('is-product-experience'); document.documentElement.style.removeProperty('--pl-dock-height'); }
function initProductLanding() {
    const root = document.querySelector('[data-product-landing]');
    if (!root)
        return;
    document.body.classList.add('has-product-landing');
    document.documentElement.classList.add('is-product-experience');
    const reduce = matchMedia('(prefers-reduced-motion: reduce)'), header = document.querySelector('.site-header'), dock = document.querySelector('.pl-purchase-dock');
    const chapters = Array.from(root.querySelectorAll('[data-pl-section]'));
    const hero = root.querySelector('.pl-hero'), object = root.querySelector('[data-pl-parallax]');
    let scheduled = 0;
    const geometry = () => { root.style.setProperty('--pl-header-height', (header?.getBoundingClientRect().height || 106) + 'px'); document.documentElement.style.setProperty('--pl-dock-height', (dock?.getBoundingClientRect().height || 100) + 'px'); };
    const update = () => {
        scheduled = 0;
        const top = (header?.getBoundingClientRect().height || 106) + 80;
        let active = 'experience';
        for (const el of chapters) {
            if (el.getBoundingClientRect().top <= top)
                active = el.dataset.plSection || active;
        }
        root.querySelectorAll('[data-pl-chapter]').forEach(a => { if (a.dataset.plChapter === active)
            a.setAttribute('aria-current', 'location');
        else
            a.removeAttribute('aria-current'); });
        const max = Math.max(1, root.scrollHeight - innerHeight);
        const progress = Math.max(0, Math.min(1, -root.getBoundingClientRect().top / max));
        const bar = dock?.querySelector('.pl-dock-progress i');
        if (bar)
            bar.style.transform = `scaleX(${progress})`;
        if (object && hero) {
            const y = reduce.matches || plMotionPaused ? 0 : Math.min(35, Math.max(0, -hero.getBoundingClientRect().top) * .055);
            object.style.setProperty('--pl-drift', y + 'px');
        }
    };
    const schedule = () => { if (!scheduled)
        scheduled = requestAnimationFrame(update); };
    const motion = () => {
        const paused = plMotionPaused || reduce.matches;
        root.classList.toggle('pl-motion-off', paused);
        const button = root.querySelector('[data-action="pl-motion"]');
        if (button) {
            button.setAttribute('aria-pressed', String(paused));
            button.setAttribute('aria-label', reduce.matches ? 'Decorative motion is off: reduced-motion preference' : paused ? 'Enable decorative page motion' : 'Pause decorative page motion');
            button.disabled = reduce.matches;
            const span = button.querySelector('span');
            if (span)
                span.textContent = paused ? 'Motion off' : 'Motion on';
        }
        root.querySelectorAll('.pl-pending-reveal').forEach(el => { if (paused)
            el.classList.remove('pl-pending-reveal'); });
        schedule();
    };
    const reveal = 'IntersectionObserver' in window ? new IntersectionObserver(entries => { for (const e of entries)
        if (e.isIntersecting) {
            e.target.classList.remove('pl-pending-reveal');
            reveal?.unobserve(e.target);
        } }, { rootMargin: '0px 0px 40px 0px', threshold: 0.06 }) : null;
    if (!reduce.matches && !plMotionPaused && reveal) {
        root.querySelectorAll('.pl-section-heading,.pl-introduction>div,.pl-ingredients-heading,.pl-finale-copy').forEach(el => { if (el.getBoundingClientRect().top > innerHeight) {
            el.classList.add('pl-pending-reveal');
            reveal.observe(el);
        } });
    }
    const resize = 'ResizeObserver' in window ? new ResizeObserver(() => { geometry(); schedule(); }) : null;
    if (header)
        resize?.observe(header);
    if (dock)
        resize?.observe(dock);
    const key = (e) => { const target = e.target; if (target.dataset.action !== 'pl-study' || !['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End'].includes(e.key))
        return; e.preventDefault(); const c = landingStories[target.dataset.id || '']; if (!c)
        return; const max = c.packaging.studies.length, n = Number(target.dataset.index); const next = e.key === 'Home' ? 0 : e.key === 'End' ? max - 1 : (n + (['ArrowRight', 'ArrowDown'].includes(e.key) ? 1 : max - 1)) % max; selectLandingStudy(c.id, next, true); };
    const jump = (e) => { const a = e.target.closest('[data-pl-chapter]'); if (!a)
        return; const id = a.dataset.plChapter; const target = id ? document.getElementById(id) : null; if (target) {
        target.setAttribute('tabindex', '-1');
        window.setTimeout(() => { if (target.isConnected)
            target.focus({ preventScroll: true }); }, reduce.matches ? 0 : 400);
    } };
    root.addEventListener('keydown', key);
    root.addEventListener('click', jump);
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule, { passive: true });
    document.addEventListener('pl-motion-change', motion);
    reduce.addEventListener('change', motion);
    syncLandingQuantity();
    geometry();
    motion();
    update();
    plCleanup = () => { if (scheduled)
        cancelAnimationFrame(scheduled); reveal?.disconnect(); resize?.disconnect(); root.removeEventListener('keydown', key); root.removeEventListener('click', jump); window.removeEventListener('scroll', schedule); window.removeEventListener('resize', schedule); document.removeEventListener('pl-motion-change', motion); reduce.removeEventListener('change', motion); };
}
/** Heirloom edition: photo-led, using the complete wooden gift-box reference. */
function chyawanprashLanding(p, c) {
    return `<section class="pl-hero pl-hero-heirloom" id="experience" data-pl-section="experience"><div class="pl-heirloom-title"><div><p class="pl-overline">${esc(c.hero.kicker)} / 05</p><h1>${esc(p.name)}<em>.</em></h1></div><p>${plLines(c.hero.tagline)}</p></div><figure class="pl-heirloom-photo">${plOriginal(c, '', true)}</figure><div class="pl-heirloom-foot"><p>Shown in the supplied wooden gift-box reference.<br>Gift contents and printed claims are not yet verified.</p>${plGalleryButton(p, 'Enter the gallery')}</div></section>${plSpatialSection(p, c)}${plIntroduction(p, c)}${plGallerySection(p, c)}${plStudy(p, c)}${plDocuments(p)}${plIngredients(p, c)}${plVoices(p, c)}${plEssentials(p, c)}${plFinale(p, c)}`;
}
/** Botanical edition: gift-set context is used instead of a fabricated studio shot. */
function herbalJariBootiLanding(p, c) {
    return `<section class="pl-hero pl-hero-botanical" id="experience" data-pl-section="experience"><div class="pl-botanical-top"><p class="pl-overline">${esc(c.hero.kicker)} / 04</p><span>THE COLLECTION, CONSIDERED</span></div><h1>Herbal Jari<br><em>Booti Oil.</em></h1><div class="pl-botanical-story"><p>${plLines(c.hero.tagline)}</p>${plGalleryButton(p, 'Explore the imagery')}</div><figure class="pl-botanical-photo">${plOriginal(c, '', true)}<figcaption>Pictured in the supplied gift set. Contents and printed claims await approval.</figcaption></figure></section>${plSpatialSection(p, c)}${plIntroduction(p, c)}${plIngredients(p, c)}${plStudy(p, c)}${plGallerySection(p, c)}${plEssentials(p, c)}${plDocuments(p)}${plVoices(p, c)}${plFinale(p, c)}`;
}
/** Editorial spread: an asymmetric title and the original full photograph. */
function majunJalaliLanding(p, c) {
    return `<section class="pl-hero pl-hero-editorial" id="experience" data-pl-section="experience"><div class="pl-editorial-heading"><p class="pl-overline">${esc(c.hero.kicker)} / 02</p><h1>Majun<br><em>Jalali.</em></h1><p>${plLines(c.hero.tagline)}</p><a href="#gallery" class="text-link">Explore this edition ${arrow()}</a></div><figure class="pl-editorial-photograph">${plOriginal(c, '', true)}<figcaption>MAJUN JALALI / THE SUPPLIED PHOTOGRAPH</figcaption></figure><div class="pl-editorial-foot"><span>A FORM OF ITS OWN.</span>${plGalleryButton(p, 'View all images')}</div></section>${plSpatialSection(p, c)}${plGallerySection(p, c)}${plIntroduction(p, c)}${plStudy(p, c)}${plIngredients(p, c)}${plVoices(p, c)}${plDocuments(p)}${plEssentials(p, c)}${plFinale(p, c)}`;
}
/** A charcoal product portrait with the bottle kept at faithful proportions. */
function rasEFauladLanding(p, c) {
    return `<section class="pl-hero pl-hero-nocturne" id="experience" data-pl-section="experience"><p class="pl-overline">${esc(c.hero.kicker)} / 03</p><h1><span>Ras e</span><span><em>Faulad.</em></span></h1><div class="pl-nocturne-object" data-pl-parallax>${plCutout(p, '', true)}</div><div class="pl-nocturne-caption"><p>${plLines(c.hero.tagline)}</p><span>RAS E FAULAD / THE DROPPER SILHOUETTE</span></div><div class="pl-nocturne-gallery">${plGalleryButton(p, 'Bottle, carton & details')}<a href="#essentials" class="text-link">Read the essentials ${arrow()}</a></div></section>${plSpatialSection(p, c)}${plStudy(p, c)}${plIntroduction(p, c)}${plIngredients(p, c)}${plGallerySection(p, c)}${plDocuments(p)}${plEssentials(p, c)}${plVoices(p, c)}${plFinale(p, c)}`;
}
/** Signature composition: quiet centre stage, not a purchase/details split. */
function rasEJalaliLanding(p, c) {
    return `<section class="pl-hero pl-hero-signature" id="experience" data-pl-section="experience"><div class="pl-hero-title"><p class="pl-overline">${esc(c.hero.kicker)} / 01</p><h1>${esc(p.name)}</h1></div><div class="pl-signature-object" data-pl-parallax>${plCutout(p, '', true)}</div><div class="pl-signature-shadow" aria-hidden="true"></div>${plHeroFooter(p, c)}<a class="pl-scroll-cue" href="#packaging" aria-label="Explore Ras e Jalali packaging">${icon('down')}</a></section>${plSpatialSection(p, c)}${plIntroduction(p, c)}${plStudy(p, c)}${plGallerySection(p, c)}${plIngredients(p, c)}${plDocuments(p)}${plVoices(p, c)}${plEssentials(p, c)}${plFinale(p, c)}`;
}
/** A progressively enhanced 3D chapter, independent of navigation and shopping. */
function plSpatialSection(p, c) {
    const jar = p.form === 'Jar', small = ['herbal-jari-booti-oil', 'chyawanprash'].includes(p.id);
    const part = jar ? 'lid' : p.id === 'ras-e-faulad' ? 'dropper' : 'cap';
    return `<section class="spatial-chapter ${c.design === 'nocturne' ? 'spatial-nocturne' : ''}" id="atelier" data-pl-section="atelier" data-spatial-product="${p.id}" data-texture="${mediaURL('model-' + p.id + '-atlas.jpg')}" data-part="${part}">
 <header class="spatial-heading"><div><p class="pl-overline">THE PACKAGING ATELIER / INTERACTIVE 3D</p><h2>Turn. Open.<br><em>Discover.</em></h2></div><p>A different perspective on ${esc(p.name)}. Scroll to turn the ${jar ? 'jar' : 'bottle'}, lift the ${part}, and look a little closer.</p></header>
 <div class="spatial-scroll-track"><div class="spatial-pin"><div class="spatial-stage">
 <div class="spatial-stage-meta"><span>PACKAGING STUDY <b>0${products.indexOf(p) + 1}</b></span><span class="spatial-state" role="status">Loading 3D…</span></div>
 <div class="spatial-shadow" aria-hidden="true"></div>
 <img class="spatial-poster" src="${mediaURL('ref-' + p.id + '-cutout.webp')}" alt="${esc(p.name)} supplied packaging reference" width="280" height="720" loading="lazy">
 <canvas class="spatial-canvas" tabindex="0" role="img" aria-label="Interactive three-dimensional packaging mockup for ${esc(p.name)}" aria-describedby="spatial-help-${p.id}"></canvas>
 <div class="spatial-stage-bottom"><span class="spatial-phase">01 / THE SILHOUETTE</span><span>SCROLL TO EXPLORE ${icon('down')}</span></div>
 </div><div class="spatial-toolbar" role="group" aria-label="3D packaging controls"><button type="button" data-spatial-action="cap" aria-pressed="false">${icon('plus')}<span>Open ${part}</span></button><button type="button" data-spatial-action="turn">${icon('rotate')}<span>Turn once</span></button><button type="button" data-spatial-action="reset" aria-label="Reset packaging model">${icon('reset')}<span>Reset</span></button><button type="button" data-spatial-action="scroll" aria-pressed="true"><span class="spatial-toggle-dot"></span><span>Scroll linked</span></button></div>
 <p class="spatial-caption" id="spatial-help-${p.id}">Drag or use ← → to rotate. <button type="button" data-spatial-action="info" aria-expanded="false">About this model</button></p>
 <div class="spatial-disclosure" hidden><p>Interactive 3D mockup based on your supplied photograph, not a scan. The visible front artwork is photo-derived; rear surfaces, dimensions and opening mechanisms are illustrative.${small ? ' This product appears inside a gift-set photo, so its texture detail is limited by that source.' : ''} The original photos remain in the gallery.</p><a href="#gallery" class="text-link">View the original images ${arrow()}</a></div>
 <div class="spatial-progress" aria-hidden="true"><i></i></div>
 </div><div class="spatial-story"><div class="spatial-beat"><span>01 / THE SILHOUETTE</span><h3>A form worth<br><em>looking closer at.</em></h3><p>Begin with the ${jar ? 'jar' : 'bottle'}. The front artwork is drawn from your supplied image, not a newly designed label.</p></div><div class="spatial-beat"><span>02 / THE OPENING</span><h3>A small turn.<br><em>A new perspective.</em></h3><p>Watch the ${part} lift away as you scroll. This opening sequence is an illustrative packaging study.</p></div><div class="spatial-beat"><span>03 / THE FULL TURN</span><h3>Take your time.<br><em>Make it your own.</em></h3><p>Let the object turn, or explore it yourself. Your gallery and purchase controls are always within reach.</p><a href="#gallery" class="text-link">Explore the original images ${arrow()}</a></div></div></div></section>`;
}
