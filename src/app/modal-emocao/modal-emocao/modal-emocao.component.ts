import { Component, OnInit, ViewChild } from '@angular/core';
import { IonInput, ModalController } from '@ionic/angular';
import { EmocaoServiceService } from 'src/app/services/emocao.service.service';

@Component({
  selector: 'app-emocoes-modal',
  templateUrl: './modal-emocao.component.html',
  styleUrls: ['./modal-emocao.component.scss']
})
export class EmocoesModalComponent implements OnInit {
  @ViewChild('sentimentoInput', { static: false }) sentimentoInputElement!: IonInput;

  emocoes: string[] = [];
  sugestoes: string[] = [];
  sentimento: string = '';
  versiculo: string = '';
  reflexao: string = '';
  mensagemErro: string = '';
  termoBusca: string = '';  // Para armazenar o que o usuário digita
  dadosEmocao: any = {};  // Para armazenar os dados da emoção correspondente
  audio: HTMLAudioElement = new Audio();  // Para o áudio da música de fundo

  constructor(private emocaoService: EmocaoServiceService, private modalController: ModalController) {}

  ngOnInit(): void {
    // Carrega as emoções ao inicializar o modal
    this.emocaoService.getEmocoes().subscribe(data => {
      this.dadosEmocao = data.sentimentos;
    });

    // Inicializa o áudio da música de fundo
    // this.audio = new Audio('assets/louvor-teste.mp3');
    this.audio = new Audio('assets/louvor2.mp3');
    this.audio.loop = true;  // Para a música continuar em loop enquanto a reflexão é lida
  }

  // Função chamada ao digitar no campo de busca
  buscarEmocao(): void {
    // const emocao = this.termoBusca.toLowerCase();
    // if (this.dadosEmocao[emocao]) {
    //   this.sortearVersiculo(emocao);
    // } else {
    //   this.versiculo = '';
    //   this.reflexao = '';
    // }
    const sentimentoLower = this.termoBusca.toLowerCase(); // Certifique-se de que 'termoBusca' é a variável correta
    this.sugestoes = Object.keys(this.dadosEmocao).filter(sentimento =>
      sentimento.startsWith(sentimentoLower)
    );

    if (this.sugestoes.length > 0) {
      const sentimentoAleatorio = this.sugestoes[Math.floor(Math.random() * this.sugestoes.length)];

      // Verifica se o sentimentoAleatorio existe nos dadosEmocao
      if (this.dadosEmocao[sentimentoAleatorio]) {
        const versiculos = this.dadosEmocao[sentimentoAleatorio];
        const versiculoSorteado = versiculos[Math.floor(Math.random() * versiculos.length)];
        this.versiculo = versiculoSorteado.versiculo; // Acessa o versículo
        // this.reflexao = versiculoSorteado.reflexao; // Acessa a reflexão
        this.mensagemErro = ''; // Limpa a mensagem de erro
      }
    } else {
      this.versiculo = ''; // Limpa o versículo
      this.reflexao = ''; // Limpa a reflexão
      this.mensagemErro = 'Desculpe, não consegui gerar uma reflexão no momento.';
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

  closeModal() {
    // Pausar a música de fundo
    this.audio.pause();
    this.audio.currentTime = 0; // Reinicia a música para a próxima vez

    // Parar a leitura em voz alta
    window.speechSynthesis.cancel(); // Cancela qualquer leitura em andamento
    this.modalController.dismiss({ versiculo: this.versiculo });
  }
}
