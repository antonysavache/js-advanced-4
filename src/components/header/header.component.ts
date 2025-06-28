import './header.component.scss';
import headerTemplate from './header.component.html?raw';
import { BaseComponent } from '../../shared/models/component.abc.ts';

export class HeaderComponent extends BaseComponent {
  private navButtons!: NodeListOf<HTMLElement>;
  private burgerBtn!: HTMLButtonElement;
  private closeBtn!: HTMLButtonElement;
  private mobileMenu!: HTMLElement;
  private mobileMenuLinks!: NodeListOf<HTMLAnchorElement>;

  constructor() {
    super(headerTemplate);
  }

  initializeElements(): void {
    /* inside header */
    this.navButtons = this.querySelectorAll('.nav__button');
    this.burgerBtn = this.querySelector<HTMLButtonElement>('.burger')!;

    /* single panel in global DOM */
    this.mobileMenu = document.querySelector<HTMLElement>('.mobile-menu')!;
    this.closeBtn = this.mobileMenu.querySelector<HTMLButtonElement>('.mobile-menu__close')!;

    this.mobileMenuLinks =
      this.mobileMenu.querySelectorAll<HTMLAnchorElement>('.mobile-menu__links a');
  }

  bindEvents(): void {
    this.navButtons.forEach(b => b.addEventListener('click', this.onNavClick));
    //this.burgerBtn.addEventListener('click', this.toggleMenu);
    //this.closeBtn .addEventListener('click', this.toggleMenu);
    this.burgerBtn.addEventListener('click', this.openMenu);
    this.closeBtn.addEventListener('click', this.closeMenu);
    this.mobileMenuLinks.forEach(link => link.addEventListener('click', this.closeMenu));
  }

  removeEvents(): void {
    this.navButtons.forEach(b => b.removeEventListener('click', this.onNavClick));
    //this.burgerBtn.removeEventListener('click', this.toggleMenu);
    //this.closeBtn .removeEventListener('click', this.toggleMenu);
    this.mobileMenuLinks.forEach(link => link.removeEventListener('click', this.closeMenu));

    document.removeEventListener('click', this.handleOutsideClick);
    document.removeEventListener('keydown', this.handleEscapePress);
  }

  private onNavClick = (e: Event): void => {
    const clicked = e.currentTarget as HTMLElement;
    this.navButtons.forEach(b => b.classList.remove('nav__button--active'));
    clicked.classList.add('nav__button--active');
    this.mobileMenu.classList.remove('mobile-menu--open');
  };

  //private toggleMenu = (): boolean =>
  //this.mobileMenu.classList.toggle('mobile-menu--open');

  private openMenu = (): void => {
    this.mobileMenu.classList.add('mobile-menu--open');
    document.addEventListener('click', this.handleOutsideClick);
    document.addEventListener('keydown', this.handleEscapePress);
  };

  private closeMenu = (): void => {
    this.mobileMenu.classList.remove('mobile-menu--open');
    document.removeEventListener('click', this.handleOutsideClick);
    document.removeEventListener('keydown', this.handleEscapePress);
  };

  // Close when clicked outside the menu
  private handleOutsideClick = (e: MouseEvent): void => {
    const target = e.target as HTMLElement;
    if (
      this.mobileMenu.classList.contains('mobile-menu--open') &&
      !this.mobileMenu.contains(target) &&
      !this.burgerBtn.contains(target)
    ) {
      this.closeMenu();
    }
  };

  // Close by ESC
  private handleEscapePress = (e: KeyboardEvent): void => {
    if (e.key === 'Escape' && this.mobileMenu.classList.contains('mobile-menu--open')) {
      this.closeMenu();
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onReady(): void {}
}
customElements.define('app-header', HeaderComponent);
