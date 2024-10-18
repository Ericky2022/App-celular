import { Component, OnInit, ViewChild, AfterViewInit, ChangeDetectorRef, Input } from '@angular/core';
import { IonInput, ModalController } from '@ionic/angular';
import { EmocaoServiceService } from 'src/app/services/emocao.service.service';

@Component({
  selector: 'app-emocoes-modal',
  templateUrl: './modal-emocao.component.html',
  styleUrls: ['./modal-emocao.component.scss']
})
export class EmocoesModalComponent implements OnInit, AfterViewInit {
  @ViewChild('sentimentoInput', { static: false }) sentimentoInputElement!: IonInput;
  @Input() sentimentoInicial: string = ''; // Recebe o sentimento inicial

  emocoes: string[] = [];
  sugestoes: string[] = [];
  sentimento: string = '';
  versiculo: string = '';
  reflexao: string = '';
  mensagemErro: string = '';
  mensagemErro2: string = '';
  termoBusca: string = '';  // Para armazenar o que o usuário digita
  dadosEmocao: any = {};  // Para armazenar os dados da emoção correspondente
  audio: HTMLAudioElement = new Audio();  // Para o áudio da música de fundo
  leituraEmAndamento: boolean = false;

  constructor(private emocaoService: EmocaoServiceService, private modalController: ModalController, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    // Carrega as emoções ao inicializar o modal
    this.emocaoService.getEmocoes().subscribe(data => {
      this.dadosEmocao = data.sentimentos;

      // Se houver um sentimento inicial, sorteia o versículo automaticamente
      if (this.sentimentoInicial) {
        this.termoBusca = this.sentimentoInicial;
        this.buscarEmocao(); // Busca e sorteia o versículo para o sentimento inicial
      }
    });

    // Inicializa o áudio da música de fundo
    // this.audio = new Audio('assets/louvor2.mp3');
    this.audio.loop = true;  // Para a música continuar em loop enquanto a reflexão é lida
  }

  audioPaths: string[] = [
    'assets/louvor-teste.mp3',
    'assets/louvor2.mp3',
    'assets/louvor3.mp3',
  ];

  ngAfterViewInit(): void {
      // Define o foco no campo de input assim que o modal estiver pronto
      setTimeout(() => {
        this.sentimentoInputElement.setFocus();
      }, 0);
    }
  // audio: HTMLAudioElement = new Audio();

  tocarAudioAleatorio(): void {
    const indiceAleatorio = Math.floor(Math.random() * this.audioPaths.length);
    const caminhoAudio = this.audioPaths[indiceAleatorio];

    // Pausa qualquer áudio que já esteja tocando
    this.audio.pause();
    this.audio.currentTime = 0;

    // Define o novo caminho e toca o áudio
    this.audio.src = caminhoAudio;
    this.audio.loop = true;
    this.audio.play();
  }

  // Função chamada ao digitar no campo de busca
  buscarEmocao(): void {
    const sentimentoLower = this.termoBusca.toLowerCase();
    this.sugestoes = Object.keys(this.dadosEmocao).filter(sentimento =>
      sentimento.startsWith(sentimentoLower)
    );

    if (this.sugestoes.length > 0) {
      const sentimentoAleatorio = this.sugestoes[Math.floor(Math.random() * this.sugestoes.length)];

      if (this.dadosEmocao[sentimentoAleatorio]) {
        const versiculos = this.dadosEmocao[sentimentoAleatorio];
        const versiculoSorteado = versiculos[Math.floor(Math.random() * versiculos.length)];
        this.versiculo = versiculoSorteado.versiculo; // Acessa o versículo
        this.mensagemErro = ''; // Limpa a mensagem de erro
        this.mensagemErro2 = ''; // Limpa a mensagem de erro
      }
    } else {
      this.reflexao = ''; // Limpa a reflexão
      this.versiculo = ''; // Limpa o versículo
      this.mensagemErro = 'Desculpe, não consegui gerar uma reflexão no momento.';
      this.mensagemErro2 = 'Desculpe, não entendi o que você está sentindo.';
    }
    console.log("Mensagem de erro", this.mensagemErro2)
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

  // Verifica se há versículos para a emoção
  if (!versiculos) {
    console.error("Nenhum versículo encontrado para a emoção:", emocao);
    return;
  }

  const versiculoSelecionado = versiculos.find((v: { versiculo: string }) => v.versiculo === this.versiculo);

  if (versiculoSelecionado) {
    // Verifica se a reflexão é uma string ou um array
    if (typeof versiculoSelecionado.reflexao === 'string') {
      this.reflexao = versiculoSelecionado.reflexao.split('\n\n');
    } else if (Array.isArray(versiculoSelecionado.reflexao)) {
      this.reflexao = versiculoSelecionado.reflexao;
    } else {
      console.error("O formato da reflexão não é suportado:", versiculoSelecionado.reflexao);
      return;
    }

    setTimeout(() => {
      this.atualizarInterface();
    }, 0);
  } else {
    console.error("Versículo não encontrado:", this.versiculo);
  }
}



  // Método para atualizar a interface
  atualizarInterface(): void {
    const versiculoElemento = document.getElementById('versiculo');
    const reflexaoElemento = document.getElementById('reflexao');

    if (versiculoElemento) {
      versiculoElemento.innerText = this.versiculo;
    }

    if (reflexaoElemento) {
      reflexaoElemento.innerHTML = ""; // Limpa o conteúdo anterior

      // Verifica se 'this.reflexao' é um array de strings
      if (Array.isArray(this.reflexao)) {
        this.reflexao.forEach((paragrafo: string) => {
          const p = document.createElement('p');
          p.innerText = paragrafo.trim(); // Remove espaços em branco extras
          reflexaoElemento.appendChild(p);
        });
      } else if (typeof this.reflexao === 'string') {
        // Se for uma string única, cria um parágrafo com ela
        const p = document.createElement('p');
        p.innerText = this.reflexao.trim();
        reflexaoElemento.appendChild(p);
      }
    }
    console.log("Interface atualizada");
  }




  // Função para ler a reflexão em voz alta e tocar a música de fundo
lerReflexao(): void {
  console.log('Iniciando leitura da reflexão');
  console.log('Reflexão:', this.reflexao);
  // Se a leitura já está em andamento, para a leitura e o áudio
  if (this.leituraEmAndamento) {
    window.speechSynthesis.cancel(); // Cancela a leitura em andamento
    this.audio.pause(); // Pausa a música de fundo
    this.audio.currentTime = 0; // Reinicia a música para a próxima vez
    this.leituraEmAndamento = false;
    return;
  }

  if (!this.reflexao) {
    return;
  }

  // Inicializar a síntese de voz
  const utterance = new SpeechSynthesisUtterance(this.reflexao);
  utterance.lang = 'pt-BR';
  utterance.rate = 1;

  // Iniciar a leitura e tocar o áudio
  utterance.onstart = () => {
    this.audio.volume = 0.5; // diminue o volume sdo audio
    this.tocarAudioAleatorio(); // Inicia o áudio apenas quando a leitura começar
    this.leituraEmAndamento = true;
  };

  // Parar a música e atualizar o estado ao finalizar a leitura
  utterance.onend = () => {
    this.audio.volume = 1.0;
    this.audio.pause();
    this.audio.currentTime = 0;  // Reinicia a música para a próxima vez
    this.leituraEmAndamento = false;
  };

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
