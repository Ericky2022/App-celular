import { Component, OnInit } from '@angular/core';
import { BibliaService } from '../services/biblia.service';
import { ModalController, Platform } from '@ionic/angular';
import { SentimentoModalComponent } from '../sentimento-modal/sentimento-modal.component';
import { EmocoesModalComponent } from '../modal-emocao/modal-emocao/modal-emocao.component';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  versiculos: any = [];
  livros: any = [];
  sentimento: string = '';
  versiculoSentimento: string = '';

  constructor(private bibliaService: BibliaService, private modalController: ModalController, private platform: Platform) {
    this.bibliaService.getBiblia().subscribe(data => {
      this.versiculos = data.verses;
      this.livros = data.livros;
    });

    this.platform.backButton.subscribeWithPriority(10, () => {
      this.fecharApp();
    });
  }

  ngOnInit() {
    console.log(this.livros);
  }

  async abrirModal() {
    const modal = await this.modalController.create({
      component: SentimentoModalComponent
    });

    modal.onDidDismiss().then((result) => {
      if (result.data) {
        this.versiculoSentimento = result.data.versiculo;
      }
    });

    await modal.present();
  }

  async abrirModalEmocoes() {
    const modal = await this.modalController.create({
      component: EmocoesModalComponent
    });
    return await modal.present();
  }

  sentimentosVersiculos: { [key: string]: string } = {
    'feliz': 'Salmos 118:24 - Este é o dia que o Senhor fez; regozijemo-nos e alegremo-nos nele.',
    'triste': 'Salmos 34:18 - Perto está o Senhor dos que têm o coração quebrantado.',
    'ansioso': 'Filipenses 4:6-7 - Não andeis ansiosos de coisa alguma.',
    'grato': '1 Tessalonicenses 5:18 - Em tudo dai graças.'
  };

  verificarSentimento() {
    const versiculo = this.sentimentosVersiculos[this.sentimento.toLowerCase()];
    this.versiculoSentimento = versiculo ? versiculo : 'Desculpe, não tenho um versículo para isso.';
  }

  fecharApp() {
    // Fecha o aplicativo
    navigator.app.exitApp(); // Agora deve funcionar sem erro
  }
}
