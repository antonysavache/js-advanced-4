import './header.component.scss';
import headerTemplate from './header.component.html?raw';
import { BaseComponent } from '../../shared/models/component.abc.ts';

export class HeaderComponent extends BaseComponent {
  private navButtons!: NodeListOf<HTMLElement>;
  private burgerBtn!: HTMLButtonElement;
  private closeBtn!: HTMLButtonElement;
  private mobileMenu!: HTMLElement;

  constructor() { super(headerTemplate); }

  initializeElements(): void {
    /* inside header */
    this.navButtons = this.querySelectorAll('.nav__button');
    this.burgerBtn  = this.querySelector<HTMLButtonElement>('.burger')!;

    /* single panel in global DOM */
    this.mobileMenu = document.querySelector<HTMLElement>('.mobile-menu')!;
    this.closeBtn   = this.mobileMenu.querySelector<HTMLButtonElement>('.mobile-menu__close')!;
  }

  bindEvents(): void {
    this.navButtons.forEach(b => b.addEventListener('click', this.onNavClick));
    this.burgerBtn.addEventListener('click', this.toggleMenu);
    this.closeBtn .addEventListener('click', this.toggleMenu);
  }

  removeEvents(): void {
    this.navButtons.forEach(b => b.removeEventListener('click', this.onNavClick));
    this.burgerBtn.removeEventListener('click', this.toggleMenu);
    this.closeBtn .removeEventListener('click', this.toggleMenu);
  }

  private onNavClick = (e: Event): void => {
    const clicked = e.currentTarget as HTMLElement;
    this.navButtons.forEach(b => b.classList.remove('nav__button--active'));
    clicked.classList.add('nav__button--active');
    this.mobileMenu.classList.remove('mobile-menu--open');
  };

  private toggleMenu = (): void =>
    this.mobileMenu.classList.toggle('mobile-menu--open');

  onReady(): void {}
}
customElements.define('app-header', HeaderComponent);
