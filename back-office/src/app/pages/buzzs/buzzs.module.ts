import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';

import { BuzzsComponent } from './buzzs.component';

const routes: Routes = [
  {
    path: '',
    component: BuzzsComponent
  }
];

@NgModule({
  declarations: [
    BuzzsComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes)
  ]
})
export class BuzzsModule { }
