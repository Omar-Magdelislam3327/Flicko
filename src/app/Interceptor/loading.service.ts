import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoadingService {
  private renderer: Renderer2;

  private _isLoading = new BehaviorSubject<boolean>(false);
  isLoading$ = this._isLoading.asObservable();
  constructor(rendererFactory: RendererFactory2) {
    this.renderer = rendererFactory.createRenderer(null, null);

  }
  show() {
    this._isLoading.next(true);
    this.renderer.addClass(document.documentElement, 'no-scroll');
    this.renderer.addClass(document.body, 'no-scroll');
  }

  hide() {
    this._isLoading.next(false);
    this.renderer.removeClass(document.documentElement, 'no-scroll');
    this.renderer.removeClass(document.body, 'no-scroll');
  }
}
