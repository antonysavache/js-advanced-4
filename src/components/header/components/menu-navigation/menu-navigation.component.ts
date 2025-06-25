import navigationTemplate from './menu-navigation.component.html?raw';
import './menu-navigation.component.scss';
import { BaseComponent } from '../../../../shared/models/component.abc.ts';

export class MenuNavigationComponent extends BaseComponent {
  constructor() {
    super(navigationTemplate);
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

customElements.define('app-menu-navigation', MenuNavigationComponent);
