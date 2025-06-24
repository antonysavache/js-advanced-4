import './header-example.component.scss';
import headerTemplate from './header-example.component.html?raw';
import {BaseComponent} from "../../shared/models/component.abc.ts";

export class HeaderExampleComponent extends BaseComponent {
  private button: HTMLElement | null = null;

  constructor() {
    super(headerTemplate);
  }

  initializeElements(): void {
    this.button = this.querySelector('.header-example__button');
  }

  bindEvents(): void {
    this.button?.addEventListener('click', this.handleClick.bind(this));
  }

  removeEvents(): void {
    this.button?.removeEventListener('click', this.handleClick.bind(this));
  }

  private handleClick(): void {
    console.log('Header button clicked!');
  }
}

customElements.define('app-header-example', HeaderExampleComponent);
