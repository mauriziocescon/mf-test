import { createApplication } from '@angular/platform-browser';
import { Component, computed, provideExperimentalZonelessChangeDetection } from '@angular/core';
import { createCustomElement } from '@angular/elements';

@Component({
  selector: 'app-mf2',
  standalone: true,
  template: `
    <h3>Mf2 (zoneless)</h3>
    <div>globalThis.value: {{ value() }}</div>`,
})
class MfComponent {
  value = computed(() => `${(globalThis as any).___value()}`);
}

(async () => {
  const app = await createApplication({
    providers: [
      provideExperimentalZonelessChangeDetection(),
    ],
  });
  const element = createCustomElement(MfComponent, { injector: app.injector });
  customElements.define('app-mf2', element);
})();
