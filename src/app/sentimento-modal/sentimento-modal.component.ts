import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-sentimento-modal',
  templateUrl: './sentimento-modal.component.html',
  styleUrls: ['./sentimento-modal.component.scss'],
})
export class SentimentoModalComponent {
  sentimento: string = '';
  versiculo: string = '';
  sentimentosVersiculos: { [key: string]: string } = {
    'feliz': 'Salmos 118:24 - Este é o dia que o Senhor fez; regozijemo-nos e alegremo-nos nele.',
    'triste': 'Salmos 34:18 - Perto está o Senhor dos que têm o coração quebrantado.',
    'ansioso': 'Filipenses 4:6-7 - Não andeis ansiosos de coisa alguma.',
    'grato': '1 Tessalonicenses 5:18 - Em tudo dai graças.'
  };

  constructor(private modalController: ModalController) {}

  verificarSentimento() {
    this.versiculo = this.sentimentosVersiculos[this.sentimento.toLowerCase()] || 'Desculpe, não tenho um versículo para isso.';
  }

  closeModal() {
    this.modalController.dismiss({ versiculo: this.versiculo });
  }
}
