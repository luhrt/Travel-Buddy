import { Routes } from '@angular/router';
import { RoteiroComponent } from './roteiro/roteiro.component';
import { ExplorarComponent } from './explorar/explorar.component';
import { LoginComponent } from './login/login.component';
import { CadastroComponent } from './cadastro/cadastro.component';

export const routes: Routes = [
    { path: 'roteiro', component: RoteiroComponent },
    { path: 'explorar', component: ExplorarComponent },
    { path: 'login', component: LoginComponent },
    { path: 'cadastro', component: CadastroComponent },
    
    { path: '', redirectTo: '/login', pathMatch: 'full' }
];