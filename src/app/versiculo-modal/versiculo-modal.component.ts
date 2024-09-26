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
  lendo: boolean = false;  // Indica se está em modo de leitura
  indiceAtual: number = 0; // Índice do versículo atual
  isPlaying: boolean = false;
  repetindoTodos: boolean = false; // Para rastrear se está repetindo todos


  constructor(private modalController: ModalController, private tts: TextToSpeechService) {}

  fecharModal() {
    this.modalClosed.emit(); // Emitir evento ao fechar
    this.modalController.dismiss();
  }

  lerVersiculo(text: string, versiculo: any) {
    this.versiculoAtual = versiculo;  // Define o versículo atual como sendo lido
    versiculo.lido = false;  // Define como não lido antes da leitura
    this.lendo = true; // Marca que está lendo
    this.tts.speak(text);

    const tempoLeitura = text.split(' ').length * 300; // Aproximadamente 300ms por palavra
    setTimeout(() => {
      this.versiculoAtual = null;  // Limpa o versículo atual após a leitura
      versiculo.lido = true;  // Marca o versículo como lido após a leitura
      this.lendo = false; // Marca que parou de ler
    }, tempoLeitura);
  }

  playPauseLeitura() {
    if (!this.lendo && this.versiculos[this.indiceAtual]) {
      // Inicia a leitura do versículo atual se não estiver lendo
      this.lerVersiculo(this.versiculos[this.indiceAtual].text, this.versiculos[this.indiceAtual]);
    } else {
      // Pausa a leitura (dependendo da implementação do TTS)
      this.tts.stop(); // Implementação fictícia, ajuste conforme o serviço TTS
      this.lendo = false;
    }
  }

  pararLeitura() {
    this.tts.stop(); // Para a leitura imediatamente
    this.lendo = false;
    this.versiculoAtual = null;
  }

  avancarVersiculo() {
    if (this.indiceAtual < this.versiculos.length - 1) {
      this.indiceAtual++;
      this.playPauseLeitura();
    }
  }

  voltarVersiculo() {
    if (this.indiceAtual > 0) {
      this.indiceAtual--;
      this.playPauseLeitura();
    }
  }

  toggleMarcacao(versiculo: any) {
    versiculo.marcado = !versiculo.marcado; // Alterna o estado da marcação
  }

  isVersiculoFocado(versiculo: any): boolean {
    return this.versiculoFocado && versiculo.verse === this.versiculoFocado.verse;
  }
}
