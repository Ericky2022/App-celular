import { Component, OnInit } from '@angular/core';
import { IAService } from '../services/ia.service';

@Component({
  selector: 'app-test-ia',
  templateUrl: './test-ia.component.html',
  styleUrls: ['./test-ia.component.scss']
})
export class TestIAComponent implements OnInit {
  versiculo: string = 'João 3:16'; // Versículo para teste
  reflexao: string = '';

  constructor(private iaService: IAService) {}

  ngOnInit() {
    this.gerarReflexao();
  }

  gerarReflexao() {
    this.iaService.gerarReflexao(this.versiculo).subscribe({
      next: (response) => {
        this.reflexao = response.choices[0].message.content;
        console.log('Reflexão recebida:', this.reflexao);
      },
      error: (error) => {
        console.error('Erro ao gerar reflexão:', error);
      }
    });
  }
}
