import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class MfLoaderService {

  loadElement(metadata: { elementId: string, tag: string }): Promise<void> {
    if (!customElements.get(metadata.tag)) {
      const url = `elements/${metadata.elementId}/index.js`;

      return new Promise<void>((resolve, reject) => {
        // index.js contains all modules from the bundle
        const index: HTMLScriptElement = document.createElement('script');
        index.setAttribute('src', url);
        index.setAttribute('type', 'module');
        const onLoadIndex = () => {
          index.removeEventListener('load', onLoadIndex);
          index.removeEventListener('error', onErrorIndex);
          resolve();
        };
        const onErrorIndex = (error: any) => {
          index.removeEventListener('load', onLoadIndex);
          index.removeEventListener('error', onErrorIndex);
          document.head.removeChild(index);
          const reason = `url: ${typeof error === 'string' ? error : JSON.stringify(error)}`;
          reject(reason);
        };

        index.addEventListener('load', onLoadIndex);
        index.addEventListener('error', onErrorIndex);
        document.head.appendChild(index);
      })
        .catch(error => Promise.reject(error.message || error));
    }

    return Promise.resolve();
  }
}
