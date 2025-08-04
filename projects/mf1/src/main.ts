import { createApplication } from '@angular/platform-browser';
import { ChangeDetectionStrategy, Component, computed, provideZoneChangeDetection } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { createCustomElement } from '@angular/elements';

import { Observable } from 'rxjs';

@Component({
  selector: 'app-mf1',
  imports: [AsyncPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h3>Mf1 (zone.js)</h3>
    <div>globalThis.___value (signal): {{ value() }}</div>
    <div>globalThis.___valueObs (obs): {{ valueObs$ | async }}</div>`,
})
class MfComponent {
  // NOT reacting to shell changes
  protected readonly value = computed(() => `${(globalThis as any).___value()}`);

  // reacting to shell changes
  protected readonly valueObs$ = ((globalThis as any).___valueObs as Observable<string>);
}

(async () => {
  const app = await createApplication({
    providers: [provideZoneChangeDetection({ eventCoalescing: true, runCoalescing: true })],
  });
  const element = createCustomElement(MfComponent, { injector: app.injector });
  customElements.define('app-mf1', element);
})();
