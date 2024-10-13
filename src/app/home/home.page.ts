import { Component, OnInit } from '@angular/core';
import { ModalController, Platform } from '@ionic/angular';
import { SentimentoModalComponent } from '../sentimento-modal/sentimento-modal.component';
import { EmocoesModalComponent } from '../modal-emocao/modal-emocao/modal-emocao.component';
import { EmocaoServiceService } from '../services/emocao.service.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  sentimento: string = '';
  versiculoSentimento: string = '';
  versiculoDia: string = ''; // Para armazenar o versículo do dia
  dadosEmocao: any = {};

  constructor(
    private modalController: ModalController,
    private platform: Platform,
    private emocaoService: EmocaoServiceService
  ) {
    this.platform.backButton.subscribeWithPriority(10, () => {
      this.fecharApp();
    });
  }

  ngOnInit() {
    // Carrega os dados das emoções
    this.emocaoService.getEmocoes().subscribe(data => {
      this.dadosEmocao = data.sentimentos;
      this.sortearVersiculoDia();
    });
  }

  sortearVersiculoDia() {
    // Verifica se já existe um versículo armazenado para o dia atual
    const versiculoArmazenado = localStorage.getItem('versiculoDia');
    const dataArmazenada = localStorage.getItem('dataVersiculo');

    // Obtém a data atual no formato 'YYYY-MM-DD' para comparação
    const dataAtual = new Date().toISOString().split('T')[0];

    if (versiculoArmazenado && dataArmazenada === dataAtual) {
      // Se o versículo já foi sorteado hoje, utiliza o armazenado
      this.versiculoDia = versiculoArmazenado;
    } else {
      // Caso contrário, sorteia um novo versículo
      const versiculosFeliz = this.dadosEmocao['feliz'];

      if (versiculosFeliz && versiculosFeliz.length > 0) {
        const indiceAleatorio = Math.floor(Math.random() * versiculosFeliz.length);
        const versiculoSorteado = versiculosFeliz[indiceAleatorio];
        this.versiculoDia = versiculoSorteado.versiculo;

        // Armazena o versículo sorteado e a data atual no localStorage
        localStorage.setItem('versiculoDia', this.versiculoDia);
        localStorage.setItem('dataVersiculo', dataAtual);
      } else {
        console.error('Nenhum versículo encontrado para o sentimento feliz.');
      }
    }
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

  async abrirModalEmocoesComSentimento(sentimento: string) {
    const modal = await this.modalController.create({
      component: EmocoesModalComponent,
      componentProps: { sentimentoInicial: sentimento } // Passa o sentimento como propriedade
    });

    return await modal.present();
  }

  fecharApp() {
    // Fecha o aplicativo
    navigator.app.exitApp();
  }
}
