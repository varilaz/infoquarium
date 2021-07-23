
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ModuleWithProviders, NgModule } from '@angular/core';

import { AuthInterceptor } from './auth.interceptor';
import { ErrorInterceptor } from './error.interceptors';

@NgModule({
  declarations: [],
  imports: [],
  exports: [],
})
export class InterceptoreModule {
  public static forRoot(): ModuleWithProviders {
    return {
      ngModule: InterceptoreModule,
      providers: [
        {
          provide: HTTP_INTERCEPTORS,
          useClass: AuthInterceptor,
          multi: true,
        },
        {
          provide: HTTP_INTERCEPTORS,
          useClass: ErrorInterceptor,
          multi: true,
        }
      ]
    };
  }
}
