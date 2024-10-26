import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NotificacaoReflexaoPageRoutingModule } from './notificacao-reflexao-routing.module';

import { NotificacaoReflexaoPage } from './notificacao-reflexao.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NotificacaoReflexaoPageRoutingModule
  ],
  declarations: [NotificacaoReflexaoPage]
})
export class NotificacaoReflexaoPageModule {}
