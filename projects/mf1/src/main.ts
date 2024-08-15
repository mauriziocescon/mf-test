import { createApplication } from '@angular/platform-browser';
import { Component, computed, provideZoneChangeDetection } from '@angular/core';
import { createCustomElement } from '@angular/elements';

@Component({
  selector: 'app-mf1',
  standalone: true,
  template: `
    <h3>Mf1 (zone.js)</h3>
    <div>globalThis.value: {{ value() }}</div>`,
})
class MfComponent {
  value = computed(() => `${(globalThis as any).___value()}`);
}

(async () => {
  const app = await createApplication({
    providers: [
      provideZoneChangeDetection({ eventCoalescing: true }),
    ],
  });
  const element = createCustomElement(MfComponent, { injector: app.injector });
  customElements.define('app-mf1', element);
})();
