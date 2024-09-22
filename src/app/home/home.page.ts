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
  sentimento: string = '';
  versiculoSentimento: string = '';

  constructor(private bibliaService: BibliaService) {
    this.bibliaService.getBiblia().subscribe(data => {
      this.versiculos = data.verses;
      this.livros = data.livros;
    });
  }

  ngOnInit() {
    this.bibliaService.getBiblia().subscribe(data => {
      this.versiculos = data.verses; // Armazena os versículos
      this.livros = data.livros;
    });
    console.log(this.livros); // Mostra os versículos no console
  }

  sentimentosVersiculos: { [key: string]: string } = {
    'feliz': 'Salmos 118:24 - Este é o dia que o Senhor fez; regozijemo-nos e alegremo-nos nele.',
    'triste': 'Salmos 34:18 - Perto está o Senhor dos que têm o coração quebrantado.',
    'ansioso': 'Filipenses 4:6-7 - Não andeis ansiosos de coisa alguma.',
    'grato': '1 Tessalonicenses 5:18 - Em tudo dai graças.'
    // Adicione mais sentimentos e versículos conforme necessário
  };

  verificarSentimento() {
    const versiculo = this.sentimentosVersiculos[this.sentimento.toLowerCase()];
    this.versiculoSentimento = versiculo ? versiculo : 'Desculpe, não tenho um versículo para isso.';
  }
}
