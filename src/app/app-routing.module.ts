import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'biblia',
    loadChildren: () => import('./biblia/biblia.module').then( m => m.BibliaPageModule)
  },  {
    path: 'notificacao-reflexao',
    loadChildren: () => import('./notificacao-reflexao/notificacao-reflexao.module').then( m => m.NotificacaoReflexaoPageModule)
  },

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
