import { Component, OnInit } from '@angular/core';
import { EmocaoServiceService } from 'src/app/services/emocao.service.service';

@Component({
  selector: 'app-emocoes-modal',
  templateUrl: './modal-emocao.component.html',
  styleUrls: ['./modal-emocao.component.scss']
})
export class EmocoesModalComponent implements OnInit {
  emocoes: string[] = [];
  versiculo: string = '';
  reflexao: string = '';
  termoBusca: string = '';  // Para armazenar o que o usuário digita
  dadosEmocao: any = {};  // Para armazenar os dados da emoção correspondente
  audio: HTMLAudioElement = new Audio();  // Para o áudio da música de fundo

  constructor(private emocaoService: EmocaoServiceService) {}

  ngOnInit(): void {
    // Carrega as emoções ao inicializar o modal
    this.emocaoService.getEmocoes().subscribe(data => {
      this.dadosEmocao = data.sentimentos;
    });

    // Inicializa o áudio da música de fundo
    this.audio = new Audio('assets/louvor-teste.mp3');
    this.audio.loop = true;  // Para a música continuar em loop enquanto a reflexão é lida
  }

  // Função chamada ao digitar no campo de busca
  buscarEmocao(): void {
    const emocao = this.termoBusca.toLowerCase();
    if (this.dadosEmocao[emocao]) {
      this.sortearVersiculo(emocao);
    } else {
      this.versiculo = '';
      this.reflexao = '';
    }
  }

  // Função para sortear um versículo aleatório da emoção correspondente
  sortearVersiculo(emocao: string): void {
    const versiculos = this.dadosEmocao[emocao];
    const indiceAleatorio = Math.floor(Math.random() * versiculos.length);
    const versiculoSorteado = versiculos[indiceAleatorio];
    this.versiculo = versiculoSorteado.versiculo;
    this.reflexao = '';  // Reseta a reflexão até o botão ser clicado
  }

  // Função para exibir a reflexão após o botão ser clicado
  mostrarReflexao(): void {
    const emocao = this.termoBusca.toLowerCase();
    const versiculos = this.dadosEmocao[emocao];
    const versiculoSelecionado = versiculos.find((v: { versiculo: string, reflexao: string }) => v.versiculo === this.versiculo);

    if (versiculoSelecionado) {
      this.reflexao = versiculoSelecionado.reflexao;
    }
  }

  // Função para ler a reflexão em voz alta e tocar a música de fundo
  lerReflexao(): void {
    if (!this.reflexao) {
      return;
    }

    // Iniciar a música de fundo
    this.audio.play();

    // Inicializar a síntese de voz
    const utterance = new SpeechSynthesisUtterance(this.reflexao);
    utterance.lang = 'pt-BR';  // Define o idioma para Português (Brasil)
    utterance.rate = 1;  // Velocidade da leitura

    // Parar a música ao finalizar a leitura
    utterance.onend = () => {
      this.audio.pause();
      this.audio.currentTime = 0;  // Reinicia a música para a próxima vez
    };

    // Iniciar a leitura
    window.speechSynthesis.speak(utterance);
  }
}
