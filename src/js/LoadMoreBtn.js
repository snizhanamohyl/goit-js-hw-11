export default class LoadMoreBtn {
  constructor({ selector, hidden = false }) {
    this.btnEl = document.querySelector(selector);

    hidden && this.hide();
  }

  enable() {
    this.btnEl.disabled = false;
    this.btnEl.textContent = 'Load more';
  }

  disable() {
    this.btnEl.disabled = true;
    this.btnEl.textContent = 'Loading...';
  }

  show() {
    this.btnEl.classList.remove('hidden');
  }

  hide() {
    this.btnEl.classList.add('hidden');
  }
}
