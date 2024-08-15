import { createApplication } from '@angular/platform-browser';
import { Component, computed, inject, NgZone, provideExperimentalZonelessChangeDetection } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { createCustomElement } from '@angular/elements';

import { Observable } from 'rxjs';

import { runInZone } from './run-in-zone.operator';

@Component({
  selector: 'app-mf2',
  standalone: true,
  imports: [AsyncPipe],
  template: `
    <h3>Mf2 (zoneless)</h3>
    <div>globalThis.___value (signal): {{ value() }}</div>
    <div>globalThis.___valueObs (obs): {{ valueObs$ | async }}</div>`,
})
class MfComponent {
  zone = inject(NgZone);
  value = computed(() => `${(globalThis as any).___value()}`);
  valueObs$ = ((globalThis as any).___valueObs as Observable<number>).pipe(runInZone(this.zone));
}

(async () => {
  const app = await createApplication({
    providers: [provideExperimentalZonelessChangeDetection()],
  });
  const element = createCustomElement(MfComponent, { injector: app.injector });
  customElements.define('app-mf2', element);
})();
