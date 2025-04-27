import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';

import { UsersComponent } from './users.component';
import { BannedUsersComponent } from './banned-users/banned-users.component';
import { UserConnectionsComponent } from './user-connections/user-connections.component';

const routes: Routes = [
  {
    path: '',
    component: UsersComponent
  },
  {
    path: 'banned',
    component: BannedUsersComponent
  },
  {
    path: 'connections',
    component: UserConnectionsComponent
  }
];

@NgModule({
  declarations: [
    UsersComponent,
    BannedUsersComponent,
    UserConnectionsComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes)
  ]
})
export class UsersModule { }
