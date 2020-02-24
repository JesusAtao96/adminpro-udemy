import { NgModule } from '@angular/core';

// Rutas
import { PAGES_ROUTES } from './pages.routes';

// Modulos
import { SharedModule } from '../shared/shared.module';

import { PagesComponent } from './pages.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProgressComponent } from './progress/progress.component';
import { Graficas1Component } from './graficas1/graficas1.component';

@NgModule({
  declarations:  [
    PagesComponent,
    DashboardComponent,
    ProgressComponent,
    Graficas1Component
  ],
  imports: [ SharedModule, PAGES_ROUTES ],
  exports: [
    DashboardComponent,
    ProgressComponent,
    Graficas1Component
  ]
})
export class PagesModule { }
