import { RouterModule, Routes } from '@angular/router';
import { EditarCursoModalComponent } from './pages/editar-curso-modal/editar-curso-modal.component';
import { ListaCursosComponent } from './pages/lista-cursos/lista-cursos.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { SobreComponent } from './pages/sobre/sobre.component';
import { NotificacoesComponent } from './pages/notificacoes/notificacoes.component';

import { AppLoginComponent } from './pages/app-login/app-login.component';
import { NgModule } from '@angular/core';
import { authguardGuard } from './guards/authguard.guard';
import { AppLoginConfigComponent } from './components/app-login-config/app-login-config.component';

export const routes: Routes = [
  
  {
    path: 'editar-curso/:idCurso/:isEditando',
    component: EditarCursoModalComponent,
    canActivate:[authguardGuard]
  },
  { path: 'lista-cursos', component: ListaCursosComponent ,   canActivate: [authguardGuard]},
  { path: '', pathMatch: 'full', redirectTo: 'lista-cursos' },
  { path: 'sobre', component: SobreComponent ,   canActivate: [authguardGuard]},
  { path: 'acoes-educacionais', redirectTo:'lista-cursos' },
  { path: 'dashboard', component: DashboardComponent ,   canActivate: [authguardGuard] },
  { path: 'app-notificacoes', component: NotificacoesComponent ,   canActivate: [authguardGuard]},
  { path: 'login', component: AppLoginComponent },
  { path: 'loginconfig', component: AppLoginConfigComponent, canActivate:[authguardGuard]},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

