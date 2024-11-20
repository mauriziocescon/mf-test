import { bootstrapApplication } from '@angular/platform-browser';
import { Component, computed, CUSTOM_ELEMENTS_SCHEMA, inject, provideZoneChangeDetection, signal } from '@angular/core';
import { AsyncPipe } from '@angular/common';

import { interval } from 'rxjs';

import { MfLoaderService } from './mf-loader.service';

@Component({
  selector: 'app-shell',
  imports: [AsyncPipe],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <h3>Shell (attaching signal / obs to globalThis)</h3>
    <div>globalThis.___value (signal): {{ value() }}</div>
    <div>globalThis.___valueObs (obs): {{ interval$ | async }}</div>
    <hr>
    <app-mf1></app-mf1>
    <hr>
    <app-mf2></app-mf2>`,
})
export class ShellComponent {
  mfLoader = inject(MfLoaderService);
  value = computed(() => `${(globalThis as any).___value()}`);

  intervalId = setInterval(() => (globalThis as any).___value.update((v: number) => v + 1), 1000);
  interval$ = interval(1000);

  constructor() {
    // attaching objs to global scope
    (globalThis as any).___value = signal(0);
    (globalThis as any).___valueObs = this.interval$;

    // elements loading
    Promise.all([
      this.mfLoader.loadElement({ elementId: 'mf1', tag: 'app-mf1' }),
      this.mfLoader.loadElement({ elementId: 'mf2', tag: 'app-mf2' }),
    ]);
  }
}

bootstrapApplication(ShellComponent, {
  providers: [provideZoneChangeDetection({ eventCoalescing: true, runCoalescing: true })],
}).catch((err) => console.error(err));
