import { Component, OnInit } from '@angular/core';
import { BibliaService } from '../services/biblia.service';

@Component({
  selector: 'app-biblia',
  templateUrl: './biblia.page.html',
  styleUrls: ['./biblia.page.scss'],
})
export class BibliaPage implements OnInit {
  versiculos: any = [];

  constructor(private bibliaService: BibliaService) { }

  ngOnInit() {
    this.bibliaService.getBiblia().subscribe(data => {
      this.versiculos = data.verses; // Armazena os versículos
    });
  }
}
