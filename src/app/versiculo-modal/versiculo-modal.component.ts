import { Component, Input } from '@angular/core';
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

  constructor(private modalController: ModalController) { }

  fecharModal() {
    this.modalController.dismiss();
  }
}
