import { createApplication } from '@angular/platform-browser';
import { Component, computed, inject, NgZone, provideZoneChangeDetection } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { createCustomElement } from '@angular/elements';

import { Observable } from 'rxjs';

@Component({
  selector: 'app-mf1',
  standalone: true,
  imports: [AsyncPipe],
  template: `
    <h3>Mf1 (zone.js)</h3>
    <div>globalThis.___value (signal): {{ value() }}</div>
    <div>globalThis.___valueObs (obs): {{ valueObs$ | async }}</div>`,
})
class MfComponent {
  zone = inject(NgZone);

  // NOT reacting to shell changes
  value = computed(() => `${(globalThis as any).___value()}`);

  // reacting to shell changes
  valueObs$ = ((globalThis as any).___valueObs as Observable<number>);
}

(async () => {
  const app = await createApplication({
    providers: [provideZoneChangeDetection({ eventCoalescing: true, runCoalescing: true })],
  });
  const element = createCustomElement(MfComponent, { injector: app.injector });
  customElements.define('app-mf1', element);
})();
