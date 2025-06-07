import { Component, EventEmitter, Input, Output, AfterViewInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { TextToSpeechService } from '../services/text-to-speech.service';

@Component({
  selector: 'app-versiculo-modal',
  templateUrl: './versiculo-modal.component.html',
  styleUrls: ['./versiculo-modal.component.scss'],
})
export class VersiculoModalComponent implements AfterViewInit {
  @Input() versiculos: any[] = []; // Inicialize como um array vazio
  @Input() livro: string = ''; // Inicialize como string vazia
  @Input() capitulo: number = 0; // Inicialize como 0
  @Output() modalClosed = new EventEmitter<void>(); // Novo EventEmitter
  @Input() versiculoFocado: any; // Adicionado para receber o versículo focado

  constructor(private modalController: ModalController, private tts: TextToSpeechService) { }

  ngAfterViewInit() {
    if (this.versiculoFocado) {
      setTimeout(() => {
        const el = document.getElementById(`versiculo-${this.versiculoFocado.verse}`);
        el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 0);
    }
  }

  fecharModal() {
    this.modalClosed.emit(); // Emitir evento ao fechar
    this.modalController.dismiss();
  }

  lerVersiculo(versiculo: string) {
    this.tts.speak(versiculo);
  }

  toggleMarcacao(versiculo: any) {
    versiculo.marcado = !versiculo.marcado; // Alterna o estado da marcação
  }

  isVersiculoFocado(versiculo: any): boolean {
    return this.versiculoFocado && versiculo.verse === this.versiculoFocado.verse;
  }
}
