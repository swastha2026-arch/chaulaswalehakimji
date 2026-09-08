"use strict";
let v6MotionCleanup = null;
function mountV6Motion() {
    v6MotionCleanup?.();
    const root = document.getElementById('app');
    if (!root)
        return;
    const reduce = matchMedia('(prefers-reduced-motion: reduce)'), running = new Set();
    const disabled = () => reduce.matches || (typeof plMotionPaused !== 'undefined' && plMotionPaused);
    const headings = Array.from(root.querySelectorAll('main h1,main h2,.footer-intro h2'));
    const reveal = (heading) => {
        if (heading.dataset.textRevealed)
            return;
        heading.dataset.textRevealed = 'true';
        if (disabled() || !heading.animate)
            return;
        const walker = document.createTreeWalker(heading, NodeFilter.SHOW_TEXT);
        const nodes = [];
        let node;
        while ((node = walker.nextNode()))
            if (node.textContent?.trim())
                nodes.push(node);
        for (const text of nodes) {
            const fragment = document.createDocumentFragment();
            for (const token of (text.nodeValue || '').split(/(\s+)/)) {
                if (!token)
                    continue;
                if (/^\s+$/.test(token))
                    fragment.append(document.createTextNode(token));
                else {
                    const span = document.createElement('span');
                    span.className = 'v6-text-word';
                    span.textContent = token;
                    fragment.append(span);
                }
            }
            text.replaceWith(fragment);
        }
        heading.querySelectorAll('.v6-text-word').forEach((word, index) => { word.style.display = 'inline-block'; const animation = word.animate([{ opacity: 0, transform: 'translate3d(0,20px,0)', filter: 'blur(3px)' }, { opacity: 1, transform: 'translate3d(0,0,0)', filter: 'blur(0px)' }], { duration: 750, delay: Math.min(index * 42, 294), easing: 'cubic-bezier(.2,.7,.2,1)', fill: 'both' }); running.add(animation); animation.finished.then(() => { animation.cancel(); running.delete(animation); }).catch(() => running.delete(animation)); });
    };
    const observer = 'IntersectionObserver' in window ? new IntersectionObserver(entries => { for (const entry of entries)
        if (entry.isIntersecting) {
            reveal(entry.target);
            observer?.unobserve(entry.target);
        } }, { threshold: .12, rootMargin: '0px 0px -25px 0px' }) : null;
    headings.forEach(h => observer ? observer.observe(h) : reveal(h));
    const update = () => {
        if (disabled())
            running.forEach(a => a.cancel());
        document.documentElement.classList.toggle('v6-motion-reduced', disabled());
        const button = document.querySelector('.v6-motion-control');
        if (button) {
            button.setAttribute('aria-pressed', String(disabled()));
            button.disabled = reduce.matches;
            button.textContent = disabled() ? 'Motion off' : 'Reduce motion';
        }
        document.dispatchEvent(new Event('cwh:motion'));
    };
    const geometry = () => { const header = document.querySelector('.site-header'), chapter = document.querySelector('.pl-chapters'), dock = document.querySelector('.pl-purchase-dock'); const style = document.documentElement.style; style.setProperty('--header-h', (header?.getBoundingClientRect().height || 0) + 'px'); style.setProperty('--chapter-h', (chapter?.getBoundingClientRect().height || 0) + 'px'); style.setProperty('--dock-h', (dock?.getBoundingClientRect().height || 0) + 'px'); };
    const sizes = 'ResizeObserver' in window ? new ResizeObserver(geometry) : null;
    for (const selector of ['.site-header', '.pl-chapters', '.pl-purchase-dock']) {
        const element = document.querySelector(selector);
        if (element)
            sizes?.observe(element);
    }
    const keyboard = () => { const active = document.activeElement; const input = active instanceof HTMLInputElement || active instanceof HTMLTextAreaElement; document.body.classList.toggle('keyboard-open', input && !!visualViewport && visualViewport.height < innerHeight * .77); };
    window.addEventListener('resize', geometry, { passive: true });
    visualViewport?.addEventListener('resize', keyboard, { passive: true });
    document.addEventListener('focusin', keyboard);
    document.addEventListener('focusout', keyboard);
    reduce.addEventListener('change', update);
    document.addEventListener('pl-motion-change', update);
    geometry();
    update();
    v6MotionCleanup = () => { observer?.disconnect(); sizes?.disconnect(); running.forEach(a => a.cancel()); window.removeEventListener('resize', geometry); visualViewport?.removeEventListener('resize', keyboard); document.removeEventListener('focusin', keyboard); document.removeEventListener('focusout', keyboard); reduce.removeEventListener('change', update); document.removeEventListener('pl-motion-change', update); document.body.classList.remove('keyboard-open'); };
}
if (typeof document !== 'undefined') {
    document.addEventListener('cwh:before-render', () => { v6MotionCleanup?.(); v6MotionCleanup = null; });
    document.addEventListener('cwh:render', mountV6Motion);
}
