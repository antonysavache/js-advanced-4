import './header.component.scss';
import headerTemplate from './header.component.html?raw';
import { BaseComponent } from '../../shared/models/component.abc.ts';

export class HeaderComponent extends BaseComponent {
  // accepts <a> *or* <button>
  #navButtons: NodeListOf<HTMLElement> | null = null;

  constructor() {
    super(headerTemplate);
  }

  initializeElements(): void {
    this.#navButtons = this.querySelectorAll('.nav__button');
  }

  bindEvents(): void {
    this.#navButtons?.forEach(btn =>
      btn.addEventListener('click', this.#handleNavClick)
    );
  }

  removeEvents(): void {
    this.#navButtons?.forEach(btn =>
      btn.removeEventListener('click', this.#handleNavClick)
    );
  }

  #handleNavClick = (event: Event): void => {
    const clicked = event.currentTarget as HTMLElement;

    // clear all
    this.#navButtons?.forEach(btn =>
      btn.classList.remove('nav__button--active')
    );

    // activate clicked
    clicked.classList.add('nav__button--active');
  };

  onReady(): void {}
}

customElements.define('app-header', HeaderComponent);
