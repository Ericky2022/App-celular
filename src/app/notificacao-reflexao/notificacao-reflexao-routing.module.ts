import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NotificacaoReflexaoPage } from './notificacao-reflexao.page';

const routes: Routes = [
  {
    path: '',
    component: NotificacaoReflexaoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NotificacaoReflexaoPageRoutingModule {}
