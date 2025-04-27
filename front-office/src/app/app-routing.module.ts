import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthComponent } from './features/auth/auth.component';
import { HomeComponent } from './features/home/home.component';
import { ProfileComponent } from './features/profile/profile.component';
import { EditProfileComponent } from './features/profile/edit-profile/edit-profile.component';
import { BuzzDetailComponent } from './features/buzz-detail/buzz-detail.component';
import { CreateBuzzComponent } from './features/create-buzz/create-buzz.component';
import { SearchComponent } from './features/search/search.component';
import { TrendingComponent } from './features/trending/trending.component';
import { BookmarksComponent } from './features/bookmarks/bookmarks.component';
import { NotFoundComponent } from './features/not-found/not-found.component';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', component: HomeComponent, canActivate: [authGuard] },
  { path: 'auth', component: AuthComponent },
  { path: 'profile/edit', component: EditProfileComponent, canActivate: [authGuard] },
  { path: 'profile/:username', component: ProfileComponent, canActivate: [authGuard] },
  { path: 'buzz/:id', component: BuzzDetailComponent, canActivate: [authGuard] },
  { path: 'create', component: CreateBuzzComponent, canActivate: [authGuard] },
  { path: 'search', component: SearchComponent, canActivate: [authGuard] },
  { path: 'trending', component: TrendingComponent, canActivate: [authGuard] },
  { path: 'bookmarks', component: BookmarksComponent, canActivate: [authGuard] },
  { path: '**', component: NotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
