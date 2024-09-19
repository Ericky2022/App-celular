import { Component, OnInit } from '@angular/core';
import { BibliaService } from '../services/biblia.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  versiculos: any = [];
  livros: any = [];

  constructor(private bibliaService: BibliaService) { }

  ngOnInit() {
    this.bibliaService.getBiblia().subscribe(data => {
      this.versiculos = data.verses; // Armazena os versículos
      this.livros = data.livros;
    });
    console.log(this.livros); // Mostra os versículos no console
  }
}
