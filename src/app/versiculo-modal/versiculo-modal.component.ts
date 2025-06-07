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

  constructor(private modalController: ModalController, private tts: TextToSpeechService) { }

  ionViewDidEnter() {
    if (this.versiculoFocado) {
      const id = `versiculo-${this.capitulo}-${this.versiculoFocado.verse}`;
      const el = document.getElementById(id);
      el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
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
