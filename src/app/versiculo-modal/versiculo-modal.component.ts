import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ModalController } from '@ionic/angular';

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

  constructor(private modalController: ModalController) { }

  fecharModal() {
    this.modalClosed.emit(); // Emitir evento ao fechar
    this.modalController.dismiss();
  }

  toggleMarcacao(versiculo: any) {
    versiculo.marcado = !versiculo.marcado; // Alterna o estado da marcação
  }
}
