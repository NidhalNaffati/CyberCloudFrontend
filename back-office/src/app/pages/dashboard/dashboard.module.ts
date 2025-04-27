import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { DashboardComponent } from './dashboard.component';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent
  }
];

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes),
    DashboardComponent // Import standalone component
  ],
  providers: [
    provideCharts(withDefaultRegisterables()) // Provide ng2-charts configuration
  ]
})
export class DashboardModule { }