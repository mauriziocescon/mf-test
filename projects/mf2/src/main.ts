import { createApplication } from '@angular/platform-browser';
import { Component, computed, provideExperimentalZonelessChangeDetection } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { createCustomElement } from '@angular/elements';

import { Observable } from 'rxjs';

@Component({
  selector: 'app-mf2',
  imports: [AsyncPipe],
  template: `
    <h3>Mf2 (zoneless)</h3>
    <div>globalThis.___value (signal): {{ value() }}</div>
    <div>globalThis.___valueObs (obs): {{ valueObs$ | async }}</div>`,
})
class MfComponent {
  // NOT reacting to shell changes
  value = computed(() => `${(globalThis as any).___value()}`);

  // reacting to shell changes
  valueObs$ = ((globalThis as any).___valueObs as Observable<number>);
}

(async () => {
  const app = await createApplication({
    providers: [provideExperimentalZonelessChangeDetection()],
  });
  const element = createCustomElement(MfComponent, { injector: app.injector });
  customElements.define('app-mf2', element);
})();
