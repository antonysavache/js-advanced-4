import './header.component.scss';
import headerTemplate from './header.component.html?raw';
import { BaseComponent } from '../../shared/models/component.abc.ts';

export class HeaderComponent extends BaseComponent {
  #button;

  constructor() {
    super(headerTemplate);
  }

  initializeElements(): void {
    this.#button = this.querySelector('.header__button');
  }

  bindEvents(): void {
    this.#button?.addEventListener('click', this.#handleClick);
  }

  #handleClick = () => {
    alert('Header button clicked!');
  };

  removeEvents(): void {
    this.#button?.removeEventListener('click', this.#handleClick);
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onReady(): void {}
}

customElements.define('app-header', HeaderComponent);
