import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login-form/login-form';

export const routes: Routes = [
  { path: 'login-form', component: LoginComponent },
  { path: '', redirectTo: 'login-form', pathMatch: 'full' }, // redirection par défaut
];