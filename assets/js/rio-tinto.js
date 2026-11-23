/* Progressive enhancement: all project content and original image links work without JavaScript. */
(() => {
  'use strict';
  if (document.body.dataset.project !== 'rio-tinto') return;

  document.querySelectorAll('[data-tabs]').forEach(group => {
    const list = group.querySelector('[role="tablist"]');
    const tabs = [...list.querySelectorAll('[role="tab"]')];
    const panels = tabs.map(tab => document.getElementById(tab.getAttribute('aria-controls')));
    if (panels.some(panel => !panel)) return;
    const select = (index, focus = false) => {
      tabs.forEach((tab, i) => {
        tab.setAttribute('aria-selected', String(i === index));
        tab.tabIndex = i === index ? 0 : -1;
        panels[i].hidden = i !== index;
      });
      if (focus) tabs[index].focus();
    };
    tabs.forEach((tab, index) => {
      tab.addEventListener('click', () => select(index));
      tab.addEventListener('keydown', event => {
        let next;
        if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
        if (event.key === 'ArrowLeft') next = (index - 1 + tabs.length) % tabs.length;
        if (event.key === 'Home') next = 0;
        if (event.key === 'End') next = tabs.length - 1;
        if (next !== undefined) { event.preventDefault(); select(next, true); }
      });
    });
    list.hidden = false;
    select(0);
  });

  const dialog = document.getElementById('rt-lightbox');
  if (!dialog || typeof dialog.showModal !== 'function') return;
  let previousFocus;
  document.querySelectorAll('[data-enlarge]').forEach(link => link.addEventListener('click', event => {
    if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    previousFocus = link;
    const sourceImage = link.querySelector('img');
    const image = document.getElementById('rt-lightbox-image');
    image.src = link.href;
    image.alt = sourceImage.alt;
    document.getElementById('rt-lightbox-title').textContent = link.dataset.figureTitle || 'Project figure';
    document.getElementById('rt-lightbox-caption').textContent = link.closest('figure').querySelector('figcaption').textContent;
    document.body.classList.add('rt-modal-open');
    dialog.showModal();
    dialog.querySelector('.rt-close').focus();
  }));
  dialog.querySelector('.rt-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {
    const box = dialog.getBoundingClientRect();
    if (event.target === dialog && (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom)) dialog.close();
  });
  dialog.addEventListener('close', () => {
    document.body.classList.remove('rt-modal-open');
    if (previousFocus) previousFocus.focus();
  });
})();
