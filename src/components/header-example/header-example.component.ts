import './header-example.component.scss';
import headerTemplate from './header-example.component.html?raw';
import { BaseComponent } from '../../shared/models/component.abc.ts';

export class HeaderExampleComponent extends BaseComponent {
  #button: HTMLElement | null = null;

  constructor() {
    super(headerTemplate);
  }

  initializeElements(): void {
    this.#button = this.querySelector('.header-example__button');
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
}

customElements.define('app-header-example', HeaderExampleComponent);
