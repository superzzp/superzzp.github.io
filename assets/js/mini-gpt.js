/* Progressive enhancement: all project content and original image links work without JavaScript. */
(() => {
  'use strict';
  if (document.body.dataset.project !== 'mini-gpt') return;

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

  // Transcribed from images/mini-gpt/Inference-PPO-GPT-NeoX-samples.png.
  const samples = [
    { prompt: 'I chose to see', before: 'I chose to see this movie nearly alone, which is a', after: 'I chose to see this movie which is a celebration of', beforeScore: '−1.165', afterScore: '1.515' },
    { prompt: 'My 3rd-', before: 'My 3rd-grade teacher who’s name is Marcella Inner', after: 'My 3rd-year film studies are blossoming! How absolutely amazing is this? This is a', beforeScore: '0.3942', afterScore: '2.4687' },
    { prompt: 'How a director of', before: 'How a director of 90’s movie (usually cheap and desperate of budget) shoot a', after: 'How a director of Altman’s skill can exhilarate your senses and pull your attention', beforeScore: '−1.1206', afterScore: '2.2367' }
  ];
  const controls = document.querySelector('.mg-sample-controls');
  if (controls) {
    const buttons = [...controls.querySelectorAll('[data-sample]')];
    buttons.forEach(button => button.addEventListener('click', () => {
      const sample = samples[Number(button.dataset.sample)];
      if (!sample) return;
      buttons.forEach(item => item.setAttribute('aria-pressed', String(item === button)));
      Object.entries({ 'mg-prompt': sample.prompt, 'mg-before': sample.before, 'mg-after': sample.after, 'mg-before-score': sample.beforeScore, 'mg-after-score': sample.afterScore }).forEach(([id, text]) => { document.getElementById(id).textContent = text; });
    }));
    controls.hidden = false;
  }

  const dialog = document.getElementById('mg-lightbox');
  if (!dialog || typeof dialog.showModal !== 'function') return;
  let previousFocus;
  document.querySelectorAll('[data-enlarge]').forEach(link => link.addEventListener('click', event => {
    if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    previousFocus = link;
    const sourceImage = link.querySelector('img');
    const image = document.getElementById('mg-lightbox-image');
    image.src = link.href;
    image.alt = sourceImage.alt;
    document.getElementById('mg-lightbox-title').textContent = 'Original project figure';
    document.getElementById('mg-lightbox-caption').textContent = link.closest('figure').querySelector('figcaption').textContent;
    document.body.classList.add('mg-modal-open');
    dialog.showModal();
    dialog.querySelector('.mg-close').focus();
  }));
  dialog.querySelector('.mg-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {
    const box = dialog.getBoundingClientRect();
    if (event.target === dialog && (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom)) dialog.close();
  });
  dialog.addEventListener('close', () => {
    document.body.classList.remove('mg-modal-open');
    if (previousFocus) previousFocus.focus();
  });
})();
