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
import { AppCadastroComponent } from './pages/app-cadastro/app-cadastro.component';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AppSugestoesComponent } from './pages/app-sugestoes/app-sugestoes.component';
import { AppMatrizComponent } from './pages/app-matriz/app-matriz.component';

export const routes: Routes = [
  
  {
    path: 'editar-curso/:idCurso/:isEditando',
    component: EditarCursoModalComponent,
    canActivate:[authguardGuard]
  },
  { path: 'lista-cursos', component: ListaCursosComponent ,   canActivate: [authguardGuard]},
  { path: '', pathMatch: 'full', redirectTo: 'lista-cursos' },
  { path: 'sobre', component: SobreComponent },
  { path: 'acoes-educacionais', redirectTo:'lista-cursos' },
  { path: 'dashboard', component: DashboardComponent ,   canActivate: [authguardGuard] },
  { path: 'app-notificacoes', component: NotificacoesComponent },
  { path: 'login', component: AppLoginComponent },
  { path: 'loginconfig', component: AppLoginConfigComponent, canActivate: [authguardGuard]},
  { path: 'app-cadastro', component: AppCadastroComponent, canActivate: [authguardGuard]},
  { path: 'sugestoes', component: AppSugestoesComponent, canActivate: [authguardGuard]},
  { path: 'app-app-matriz', component: AppMatrizComponent, canActivate: [authguardGuard]},


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule,BrowserModule, FormsModule]
})
export class AppRoutingModule { }

