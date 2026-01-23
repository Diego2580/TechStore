import { Routes } from '@angular/router';
import { Home } from './views/home/home';
import { Servicios } from './views/servicios/servicios';
import { Acerca } from './views/acerca/acerca';
import { Contacto } from './views/contacto/contacto';
import { Login } from './views/login/login';
import { Register } from './views/register/register';
import { AdminPanel } from './views/admin-panel/admin-panel';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
	{ path: '', component: Home },
	{ path: 'servicios', component: Servicios },
	{ path: 'acerca', component: Acerca },
	{ path: 'contacto', component: Contacto },
	{ path: 'login', component: Login },
	{ path: 'register', component: Register },
	{ path: 'admin', component: AdminPanel, canActivate: [authGuard] },
	{ path: '**', redirectTo: '' }
];
