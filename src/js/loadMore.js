export default class LoadMore {
  constructor({ selector, hidden = false }) {
    this.refs = this.getRefs(selector);

    hidden && this.hide();
  }

  getRefs(selector) {
    const refs = {};
    refs.button = document.querySelector(selector);
    refs.text = refs.button.querySelector('.search-more__text');
    refs.spiner = refs.button.querySelector('.spinner');

    return refs;
  }

  enable() {
    this.refs.button.disabled = false;
    this.refs.text.textContect = 'Show More';
    this.refs.spiner.classList.add('is-hidden');
  }

  disable() {
    this.refs.button.disabled = true;
    this.refs.text.textContect = 'Loading...';
    this.refs.spiner.classList.remove('is-hidden');
  }
  show() {
    this.refs.button.classList.remove('is-hidden');
  }
  hide() {
    this.refs.button.classList.add('is-hidden');
  }
}
