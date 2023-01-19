export default class LoadMoreBtn {
  constructor({ selector, hidden = false }) {
    this.isPressed = false;
    this.refs = this.getRefs(selector);

    hidden && this.hide();
  }

  getRefs(selector) {
    const refs = {};
    refs.button = document.querySelector(selector);
    refs.label = refs.button.querySelector('.label');
    refs.spinner = refs.button.querySelector('.spinner');

    return refs;
  }

  enable() {
    this.refs.button.disabled = false;
  }

  disable() {
    this.refs.button.disabled = true;
  }

  enableScroll() {
    this.enable();
    this.refs.label.textContent = 'Show more';
    this.refs.spinner.classList.add('is-hidden');
  }

  disableScroll() {
    this.disable();
    this.refs.label.textContent = 'Loading...';
    this.refs.spinner.classList.remove('is-hidden');
  }

  show() {
    this.refs.button.classList.remove('is-hidden');
  }

  hide() {
    this.refs.button.classList.add('is-hidden');
  }
}
