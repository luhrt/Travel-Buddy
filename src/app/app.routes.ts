import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' }, // redireciona '/' para '/home'
  { path: 'home', component: HomeComponent }
];
