import { bootstrapApplication } from '@angular/platform-browser';
import { Component, computed, CUSTOM_ELEMENTS_SCHEMA, inject, provideZoneChangeDetection, signal } from '@angular/core';

import { MfLoaderService } from './mf-loader.service';
import { interval, tap } from 'rxjs';

@Component({
  selector: 'app-shell',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <h3>Shell (attaching a signal to globalThis)</h3>
    <div>globalThis.value: {{ value() }}</div>
    <hr>
    <app-mf1></app-mf1>
    <hr>
    <app-mf2></app-mf2>`,
})
export class ShellComponent {
  mfLoader = inject(MfLoaderService);
  value = computed(() => `${(globalThis as any).___value()}`);

  subId = interval(1000)
    .pipe(tap(() => (globalThis as any).___value.update((v: number) => v + 1)))
    .subscribe();

  constructor() {
    (globalThis as any).___value = signal(0);

    Promise.all([
      this.mfLoader.loadElement({ elementId: 'mf1', tag: 'app-mf1' }),
      this.mfLoader.loadElement({ elementId: 'mf2', tag: 'app-mf2' }),
    ]);
  }
}

bootstrapApplication(ShellComponent, {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true, runCoalescing: true }),
  ],
})
  .catch((err) => console.error(err));
