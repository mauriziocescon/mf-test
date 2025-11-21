import { createApplication } from '@angular/platform-browser';
import { ChangeDetectionStrategy, Component, computed } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { createCustomElement } from '@angular/elements';

import { Observable } from 'rxjs';

@Component({
  selector: 'app-mf2',
  imports: [AsyncPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h3>Mf2</h3>
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
  const app = await createApplication();
  const element = createCustomElement(MfComponent, { injector: app.injector });
  customElements.define('app-mf2', element);
})();
