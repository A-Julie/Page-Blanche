import { Routes } from '@angular/router';
import { LoginForm } from './pages/login-form/login-form';
import { Register } from './pages/register/register';
import { Home } from './pages/home/home';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'login-form', component: LoginForm },
  { path: 'register', component: Register },
];
