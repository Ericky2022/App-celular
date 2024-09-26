import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { TextToSpeechService } from '../services/text-to-speech.service';

@Component({
  selector: 'app-versiculo-modal',
  templateUrl: './versiculo-modal.component.html',
  styleUrls: ['./versiculo-modal.component.scss'],
})
export class VersiculoModalComponent {
  @Input() versiculos: any[] = [];
  @Input() livro: string = '';
  @Input() capitulo: number = 0;
  @Output() modalClosed = new EventEmitter<void>();
  @Input() versiculoFocado: any;

  versiculoAtual: any = null;
  lendo: boolean = false;
  indiceAtual: number = 0;
  isPlaying: boolean = false;
  repetindoTodos: boolean = false;
  repeticaoHabilitada: boolean = false; // Para saber se a repetição está ativada

  constructor(private modalController: ModalController, private tts: TextToSpeechService) {}

  fecharModal() {
    this.modalClosed.emit();
    this.modalController.dismiss();
  }

  isVersiculoFocado(versiculo: any): boolean {
    return this.versiculoFocado && this.versiculoFocado.verse === versiculo.verse;
  }

  lerVersiculo(text: string, versiculo: any) {
    this.versiculoAtual = versiculo;
    versiculo.lido = false;
    this.lendo = true;
    this.tts.speak(text);

    const tempoLeitura = text.split(' ').length * 300;
    setTimeout(() => {
      this.versiculoAtual = null;
      versiculo.lido = true;
      this.lendo = false;

      // Se repetição está habilitada, repetir o versículo ou todos
      if (this.repeticaoHabilitada) {
        this.repetirVersiculoOuTodos();
      }
    }, tempoLeitura);
  }

  playPauseLeitura() {
    if (!this.lendo && this.versiculos[this.indiceAtual]) {
      this.lerVersiculo(this.versiculos[this.indiceAtual].text, this.versiculos[this.indiceAtual]);
    } else {
      this.tts.stop();
      this.lendo = false;
    }
  }

  pararLeitura() {
    this.tts.stop();
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

  // Alterna repetição entre habilitada e desabilitada
  toggleRepeticao() {
    this.repeticaoHabilitada = !this.repeticaoHabilitada;
  }

  // Função para repetir o versículo atual ou todos os versículos
  repetirVersiculoOuTodos() {
    if (this.repetindoTodos) {
      this.repetirTodosVersiculos();
    } else {
      this.lerVersiculo(this.versiculos[this.indiceAtual].text, this.versiculos[this.indiceAtual]);
    }
  }

  // Função para repetir todos os versículos
  repetirTodosVersiculos() {
    this.indiceAtual = 0;
    this.repetirProximoVersiculo();
  }

  // Repetir o próximo versículo, se houver
  repetirProximoVersiculo() {
    if (this.indiceAtual < this.versiculos.length) {
      this.lerVersiculo(this.versiculos[this.indiceAtual].text, this.versiculos[this.indiceAtual]);
      this.indiceAtual++;
    } else {
      this.indiceAtual = 0; // Reiniciar a leitura
    }
  }

  toggleMarcacao(versiculo: any) {
    versiculo.marcado = !versiculo.marcado;
  }


  // Detecta dois cliques rápidos no botão de repetição
  handleDoubleClickRepeticao() {
    if (!this.repetindoTodos) {
      this.repetindoTodos = true;
      this.repetirTodosVersiculos();
    } else {
      this.repetindoTodos = false;
    }
  }
}
