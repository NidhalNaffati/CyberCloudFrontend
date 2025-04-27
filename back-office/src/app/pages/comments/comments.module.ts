import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';

import { CommentsComponent } from './comments.component';

const routes: Routes = [
  {
    path: '',
    component: CommentsComponent
  }
];

@NgModule({
  declarations: [
    CommentsComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes)
  ]
})
export class CommentsModule { }
