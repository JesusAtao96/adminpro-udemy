import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

// Rutas
import { PAGES_ROUTES } from './pages.routes';

// Modulos
import { SharedModule } from '../shared/shared.module';

// ng2-charts
import { ChartsModule } from 'ng2-charts';

import { PagesComponent } from './pages.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProgressComponent } from './progress/progress.component';
import { Graficas1Component } from './graficas1/graficas1.component';

// Component temporal
import { IncrementadorComponent } from '../components/incrementador/incrementador.component';
import { GraficoDonaComponent } from '../components/grafico-dona/grafico-dona.component';

@NgModule({
  declarations:  [
    PagesComponent,
    DashboardComponent,
    ProgressComponent,
    Graficas1Component,
    IncrementadorComponent,
    GraficoDonaComponent
  ],
  imports: [ FormsModule, ChartsModule, SharedModule, PAGES_ROUTES ],
  exports: [
    DashboardComponent,
    ProgressComponent,
    Graficas1Component
  ]
})
export class PagesModule { }
