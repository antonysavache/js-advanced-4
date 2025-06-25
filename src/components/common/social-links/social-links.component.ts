import socialLinksTemplate from './social-links.component.html?raw';
import './social-links.component.scss';
import { BaseComponent } from '../../../shared/models/component.abc.ts';

export class SocialLinksComponent extends BaseComponent {
  static get observedAttributes() {
    return ['color-style']; // Observe the 'color-style' attribute
  }

  constructor() {
    super(socialLinksTemplate);
  }

  connectedCallback(): void {
    this.updateColorStyle();
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string): void {
    if (name === 'color-style' && oldValue !== newValue) {
      this.updateColorStyle();
    }
  }

  updateColorStyle(): void {
    const style = this.getAttribute('color-style');
    switch (style) {
      case 'dark':
        this.classList.add('social-links--dark');
        this.classList.remove('social-links--light');
        break;
      case 'light':
        this.classList.add('social-links--light');
        this.classList.remove('social-links--dark');
        break;
      default:
        this.classList.remove('social-links--dark', 'social-links--light');
        break;
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  initializeElements(): void {}

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  bindEvents(): void {}

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  removeEvents(): void {}

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onReady(): void {}
}

customElements.define('app-social-links', SocialLinksComponent);
