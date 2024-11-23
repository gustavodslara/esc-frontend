import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { provideToastr, ToastrModule } from 'ngx-toastr';
import { provideAnimations } from '@angular/platform-browser/animations';

export const appConfig: ApplicationConfig = {
  providers: [provideToastr({
    timeOut: 3500,
    positionClass: 'toast-top-right',
    preventDuplicates: true,
    toastClass:"toast"
}), provideAnimations() ,provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes), provideHttpClient()]
};

