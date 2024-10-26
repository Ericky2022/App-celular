import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular'; // Importar NavController para navegação
import { TextToSpeechService } from '../services/text-to-speech.service';

@Component({
  selector: 'app-notificacao-reflexao',
  templateUrl: './notificacao-reflexao.page.html',
  styleUrls: ['./notificacao-reflexao.page.scss'],
})
export class NotificacaoReflexaoPage implements OnInit {
  versiculo: string = '';
  reflexao: string = '';
  mostrarReflexao: boolean = false;
  saudacao: string = '';
  fontSize: number = 16;
  isReading = false;
  audio: HTMLAudioElement = new Audio();  // Para o áudio da música de fundo

  constructor(private route: ActivatedRoute, private navCtrl: NavController, private ttsService: TextToSpeechService) {} // Injetar NavController

  ngOnInit() {
    this.versiculo = this.route.snapshot.paramMap.get('versiculo') || 'Versículo não encontrado.';
    this.reflexao = this.route.snapshot.paramMap.get('reflexao') || 'Reflexão não disponível.';
    this.definirSaudacao(); // Define a saudação de acordo com o horário
    console.log('versiculo: ', this.versiculo)
    console.log('reflexao: ', this.reflexao)
  }

  audioPaths: string[] = [
    'assets/louvor-teste.mp3',
    'assets/louvor2.mp3',
    'assets/louvor3.mp3',
    'assets/louvor4.mp3',
    'assets/louvor5.mp3',
    'assets/louvor6.mp3',
    'assets/louvor7.mp3',
    'assets/louvor8.mp3',
  ];

  showReflection() {
    this.mostrarReflexao = true;
    this.reflexao = this.getReflexao()
    console.log('clicou em reflexão ',this.reflexao)
  }

  definirSaudacao() {
    const horaAtual = new Date().getHours();

    if (horaAtual >= 6 && horaAtual < 12) {
      this.saudacao = 'Bom dia!';
    } else if (horaAtual >= 18 && horaAtual < 24) {
      this.saudacao = 'Boa noite!';
    } else {
      this.saudacao = 'Olá!';
    }
  }

  goToHome() {
    this.navCtrl.navigateRoot('/home');
  }

  goBack() {
    this.navCtrl.back();
  }

  getReflexao(): string {
    return this.reflexao;
  }

  tocarAudioAleatorio(): void {
    const indiceAleatorio = Math.floor(Math.random() * this.audioPaths.length);
    const caminhoAudio = this.audioPaths[indiceAleatorio];

    // Pausa qualquer áudio que já esteja tocando
    this.audio.pause();
    this.audio.currentTime = 0;

    // Define o novo caminho e toca o áudio
    this.audio.src = caminhoAudio;
    this.audio.loop = false; // Defina como false se não quiser que toque em loop
    this.audio.play().catch(error => {
      console.error('Erro ao tentar tocar o áudio:', error);
    });
  }

  lerVersiculo(versiculo: string) {
    if (this.isReading) {
      this.ttsService.stop(); // Para a leitura
      if (this.audio) {
        this.audio.pause();
        this.audio.currentTime = 0;
        this.audio.volume = 1;
      }
      this.isReading = false;
    } else {
      console.log('Início da leitura');
      this.tocarAudioAleatorio();

      if (this.audio) {
        this.audio.volume = 0.25; // Diminui o volume do áudio enquanto o texto é lido
      }

      this.isReading = true;

      // Iniciar a leitura com uma velocidade normal
      this.iniciarLeituraComVelocidade(versiculo, 1); // Velocidade inicial
    }
  }

  iniciarLeituraComVelocidade(versiculo: string, rate: number) {
    const utterance = new SpeechSynthesisUtterance(versiculo);
    utterance.rate = rate; // Define a velocidade de leitura

    utterance.onend = () => {
      this.pararLeitura();
    };

    // Fala o versículo
    window.speechSynthesis.speak(utterance);

    // Diminuir a velocidade no final (quando faltar 4 palavras)
    const palavras = versiculo.split(' ');
    const pontoDiminuirVelocidade = palavras.length - 8;

    let palavrasFaladas = 0;
    utterance.onboundary = (event) => {
      palavrasFaladas++;
      if (palavrasFaladas >= pontoDiminuirVelocidade) {
        utterance.rate = 0.7; // Reduz a velocidade
      }
    };
  }

  pararLeitura() {
    this.ttsService.stop(); // Garante que o TTS pare
    if (this.audio) {
      this.audio.pause(); // Pausa o áudio
      this.audio.currentTime = 0; // Reseta o áudio
      this.audio.volume = 1; // Restaura o volume original
    }
    this.isReading = false; // Atualiza o estado
  }



}
