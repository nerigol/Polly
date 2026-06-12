(function () {
  'use strict';

  /* ── state ── */
  let active = false;
  let selectedEl = null;
  let toolbar = null;

  /* ── editable selectors ── */
  const EDITABLE = [
    'h1','h2','h3','h4','h5','h6',
    'p','li','a','span','label',
    '.hero-title','.hero-subtitle','.section-title',
    '.card-title','.card-text','.nav-link',
    '[data-editable]'
  ].join(',');

  /* ── build toolbar ── */
  function buildToolbar() {
    const bar = document.createElement('div');
    bar.id = 'deck-editor-toolbar';
    bar.dir = 'ltr';
    bar.innerHTML = `
      <button data-cmd="bold"        title="Bold"><b>B</b></button>
      <button data-cmd="italic"      title="Italic"><i>I</i></button>
      <button data-cmd="underline"   title="Underline"><u>U</u></button>
      <button data-cmd="strikeThrough" title="Strike">S̶</button>
      <span class="sep"></span>
      <button data-cmd="justifyRight"  title="Align right">⇥</button>
      <button data-cmd="justifyCenter" title="Center">≡</button>
      <button data-cmd="justifyLeft"   title="Align left">⇤</button>
      <span class="sep"></span>
      <button id="dte-color-btn"    title="Text color">A</button>
      <input  id="dte-color-input"  type="color" value="#000000" style="display:none">
      <span class="sep"></span>
      <button id="dte-save-btn"     title="Save HTML to file">💾 שמור</button>
      <button id="dte-exit-btn"     title="Exit edit mode">✕ יציאה</button>
    `;
    document.body.appendChild(bar);

    bar.querySelectorAll('[data-cmd]').forEach(btn => {
      btn.addEventListener('mousedown', e => {
        e.preventDefault();
        document.execCommand(btn.dataset.cmd, false, null);
      });
    });

    bar.querySelector('#dte-color-btn').addEventListener('click', () => {
      bar.querySelector('#dte-color-input').click();
    });
    bar.querySelector('#dte-color-input').addEventListener('input', e => {
      document.execCommand('foreColor', false, e.target.value);
    });

    bar.querySelector('#dte-save-btn').addEventListener('click', saveHTML);
    bar.querySelector('#dte-exit-btn').addEventListener('click', exitEditMode);

    return bar;
  }

  /* ── highlight hover ── */
  function onMouseOver(e) {
    const el = e.target.closest(EDITABLE);
    if (el && el !== selectedEl) el.classList.add('dte-hover');
  }
  function onMouseOut(e) {
    const el = e.target.closest(EDITABLE);
    if (el) el.classList.remove('dte-hover');
  }

  /* ── select element for editing ── */
  function onElementClick(e) {
    const el = e.target.closest(EDITABLE);
    if (!el) return;
    if (el.tagName === 'A') e.preventDefault();

    if (selectedEl && selectedEl !== el) deselect(selectedEl);
    selectedEl = el;
    el.contentEditable = 'true';
    el.classList.add('dte-active');
    el.focus();
  }

  function deselect(el) {
    el.contentEditable = 'false';
    el.classList.remove('dte-active','dte-hover');
  }

  /* ── click outside deselects ── */
  function onDocClick(e) {
    if (!selectedEl) return;
    if (toolbar && toolbar.contains(e.target)) return;
    if (!selectedEl.contains(e.target)) deselect(selectedEl);
  }

  /* ── save ── */
  function saveHTML() {
    const clone = document.documentElement.cloneNode(true);
    /* strip editor artefacts */
    clone.querySelectorAll('[contenteditable]').forEach(el => el.removeAttribute('contenteditable'));
    clone.querySelectorAll('.dte-hover,.dte-active').forEach(el => {
      el.classList.remove('dte-hover','dte-active');
    });
    clone.querySelector('#deck-editor-toolbar')?.remove();
    const blob = new Blob(['<!DOCTYPE html>\n' + clone.outerHTML], {type:'text/html'});
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = location.pathname.split('/').pop() || 'page.html';
    a.click();
    URL.revokeObjectURL(a.href);
  }

  /* ── enter / exit ── */
  function enterEditMode() {
    if (active) return;
    active = true;
    document.body.classList.add('dte-mode');
    toolbar = buildToolbar();
    document.addEventListener('mouseover', onMouseOver);
    document.addEventListener('mouseout',  onMouseOut);
    document.addEventListener('click',     onElementClick, true);
    document.addEventListener('click',     onDocClick);
  }

  function exitEditMode() {
    if (!active) return;
    active = false;
    document.body.classList.remove('dte-mode');
    if (selectedEl) deselect(selectedEl);
    selectedEl = null;
    toolbar?.remove();
    toolbar = null;
    document.removeEventListener('mouseover', onMouseOver);
    document.removeEventListener('mouseout',  onMouseOut);
    document.removeEventListener('click',     onElementClick, true);
    document.removeEventListener('click',     onDocClick);
  }

  /* ── floating toggle button ── */
  const toggleBtn = document.createElement('button');
  toggleBtn.id = 'deck-edit-toggle';
  toggleBtn.textContent = '✏️ עריכה';
  toggleBtn.title = 'Toggle edit mode';
  toggleBtn.addEventListener('click', () => active ? exitEditMode() : enterEditMode());
  document.body.appendChild(toggleBtn);
})();
