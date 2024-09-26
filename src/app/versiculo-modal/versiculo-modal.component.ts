import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { TextToSpeechService } from '../services/text-to-speech.service';

@Component({
  selector: 'app-versiculo-modal',
  templateUrl: './versiculo-modal.component.html',
  styleUrls: ['./versiculo-modal.component.scss'],
})
export class VersiculoModalComponent {
  @Input() versiculos: any[] = []; // Inicialize como um array vazio
  @Input() livro: string = ''; // Inicialize como string vazia
  @Input() capitulo: number = 0; // Inicialize como 0
  @Output() modalClosed = new EventEmitter<void>(); // Novo EventEmitter
  @Input() versiculoFocado: any; // Adicionado para receber o versículo focado
  versiculoAtual: any = null;  // Propriedade para rastrear o versículo em leitura

  constructor(private modalController: ModalController, private tts: TextToSpeechService) { }

  fecharModal() {
    this.modalClosed.emit(); // Emitir evento ao fechar
    this.modalController.dismiss();
  }

  lerVersiculo(text: string, versiculo: any) {
    this.versiculoAtual = versiculo;  // Define o versículo atual como sendo lido
    versiculo.lido = false;  // Define como não lido antes da leitura
    this.tts.speak(text);

    // Simula o tempo de leitura, substitua por um callback do serviço de leitura se necessário
    const tempoLeitura = text.split(' ').length * 300; // Aproximadamente 200ms por palavra
    setTimeout(() => {
      this.versiculoAtual = null;  // Limpa o versículo atual após a leitura
      versiculo.lido = true;  // Marca o versículo como lido após a leitura
    }, tempoLeitura);
  }

  toggleMarcacao(versiculo: any) {
    versiculo.marcado = !versiculo.marcado; // Alterna o estado da marcação
  }

  isVersiculoFocado(versiculo: any): boolean {
    return this.versiculoFocado && versiculo.verse === this.versiculoFocado.verse;
  }
}
