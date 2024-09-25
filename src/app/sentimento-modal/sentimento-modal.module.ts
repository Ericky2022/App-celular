import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { SentimentoModalComponent } from './sentimento-modal.component';

@NgModule({
  declarations: [SentimentoModalComponent],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule // Adicione aqui
  ],
})
export class SentimentoModalModule {}
