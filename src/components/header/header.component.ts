import './header.component.scss';
import headerTemplate from './header.component.html?raw';
import { BaseComponent } from '../../shared/models/component.abc.ts';

export class HeaderComponent extends BaseComponent {
  #navButtons: NodeListOf<HTMLAnchorElement> | null = null;

  constructor() {
    super(headerTemplate);
  }

  initializeElements(): void {
    this.#navButtons = this.querySelectorAll('.nav__button');
  }

  bindEvents(): void {
    this.#navButtons?.forEach(button => {
      button.addEventListener('click', this.#handleNavClick);
    });
  }

  removeEvents(): void {
    this.#navButtons?.forEach(button => {
      button.removeEventListener('click', this.#handleNavClick);
    });
  }

  #handleNavClick = (event: Event): void => {
    const clicked = event.currentTarget as HTMLAnchorElement;

    this.#navButtons?.forEach(btn => {
      btn.classList.remove('nav__button--active');
    });

    clicked.classList.add('nav__button--active');
  };

  onReady(): void {}
}

customElements.define('app-header', HeaderComponent);
