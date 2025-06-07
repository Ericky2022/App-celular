import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { IAService } from '../services/ia.service'; // Importe o serviço de IA
import { HttpErrorResponse } from '@angular/common/http';
import { TextToSpeechService } from '../services/text-to-speech.service';

@Component({
  selector: 'app-sentimento-modal',
  templateUrl: './sentimento-modal.component.html',
  styleUrls: ['./sentimento-modal.component.scss'],
})
export class SentimentoModalComponent {
  sentimento: string = '';
  versiculo: string = '';
  reflexao: string = '';
  mensagemErro: string = '';
  sugestoes: string[] = [];

  // sentimentosVersiculos: { [key: string]: string } = {
  //   'feliz': 'Salmos 118:24 - Este é o dia que o Senhor fez; regozijemo-nos e alegremo-nos nele.',
  //   'triste': 'Salmos 34:18 - Perto está o Senhor dos que têm o coração quebrantado.',
  //   'ansioso': 'Filipenses 4:6-7 - Não andeis ansiosos de coisa alguma.',
  //   'grato': '1 Tessalonicenses 5:18 - Em tudo dai graças.'
  // };

  sentimentosVersiculos: { [key: string]: string[] } = {
    'feliz': [
      'Salmos 118:24 - Este é o dia que o Senhor fez; regozijemo-nos e alegremo-nos nele.',
      'Salmos 37:4 - Agrada-te do Senhor, e ele satisfará os desejos do teu coração.',
      'Salmos 16:11 - Tu me farás conhecer a vereda da vida; na tua presença há plenitude de alegria.',
      'Salmos 30:5 - O choro pode durar uma noite, mas a alegria vem pela manhã.',
      'Provérbios 17:22 - O coração alegre é bom remédio.',
      'Salmos 126:3 - Grandes coisas fez o Senhor por nós; por isso estamos alegres.',
      'Salmos 97:12 - Alegrem-se os justos no Senhor, e louvem o seu santo nome.',
      'Salmos 118:1 - Louva ao Senhor, porque ele é bom; a sua misericórdia dura para sempre.',
      'Provérbios 15:13 - O coração alegre aformoseia o rosto.',
      'Romanos 15:13 - O Deus de esperança vos encha de toda alegria e paz.',
      'Neemias 8:10 - A alegria do Senhor é a nossa força.',
      'João 15:11 - Estas coisas vos tenho dito para que a minha alegria permaneça em vós.',
      'Salmos 5:11 - Alegrem-se todos os que em ti confiam.',
      'Salmos 147:11 - O Senhor se compraz nos que o temem.',
      'Lucas 10:20 - Alegrai-vos, porém, porque os vossos nomes estão arrolados nos céus.',
      'Salmos 32:11 - Alegrai-vos no Senhor e exultai, justos.',
      'Salmos 126:5 - Os que semeiam em lágrimas, com alegria ceifarão.'
    ],
    'triste': [
      'Salmos 34:18 - Perto está o Senhor dos que têm o coração quebrantado.',
      'Mateus 5:4 - Bem-aventurados os que choram, pois serão consolados.',
      'Salmos 42:11 - Por que estás abatida, ó minha alma?',
      'Salmos 34:18 - Perto está o Senhor dos que têm o coração quebrantado.',
      'Mateus 5:4 - Bem-aventurados os que choram, pois serão consolados.',
      'Salmos 56:8 - Contas as minhas andanças; coloca as minhas lágrimas em teu odre.',
      'Salmos 147:3 - Sara os quebrantados de coração.',
      'João 14:27 - A minha paz vos dou; não a dou como o mundo a dá.',
      '2 Coríntios 1:3-4 - Bendito seja o Deus e Pai de nosso Senhor Jesus Cristo, que nos consola em toda a nossa tribulação.',
      'Salmos 73:26 - O meu coração e a minha carne podem fraquejar, mas Deus é a força do meu coração.',
      'Lamentações 3:22-23 - As misericórdias do Senhor são a causa de não sermos consumidos.',
      'Salmos 119:28 - A minha alma se consome de tristeza; fortalece-me segundo a tua palavra.',
      'Romanos 12:15 - Alegrai-vos com os que se alegram e chorai com os que choram.',
      'Mateus 11:28 - Vinde a mim, todos os que estais cansados e sobrecarregados, e eu vos aliviarei.',
      'Salmos 30:11 - Transformaste o meu pranto em dança.',
      'Salmos 40:1-2 - Esperei com paciência no Senhor; ele se inclinou para mim e ouviu o meu clamor.',
      '1 Pedro 5:7 - Lançando sobre ele toda a vossa ansiedade.'
    ],
    'ansioso': [
      'Filipenses 4:6-7 - Não andeis ansiosos de coisa alguma.',
      'Mateus 6:34 - Não vos inquieteis, pois o dia de amanhã cuidará de si mesmo.',
      'Filipenses 4:6-7 - Não andeis ansiosos de coisa alguma.',
      'Mateus 6:34 - Não vos inquieteis, pois, pelo dia de amanhã.',
      'Salmos 55:22 - Lança o teu cuidado sobre o Senhor, e ele te sustentará.',
      '1 Pedro 5:7 - Lançando sobre ele toda a vossa ansiedade.',
      'Isaías 41:10 - Não temas, pois eu sou contigo.',
      'João 14:1 - Não se turbe o vosso coração.',
      'Salmos 94:19 - Quando a multidão dos meus pensamentos dentro de mim se multiplicar, as tuas consolações recrearão a minha alma.',
      'Mateus 11:28-30 - Vinde a mim, todos os que estais cansados e sobrecarregados.',
      'Salmos 139:23-24 - Sonda-me, ó Deus, e conhece o meu coração.',
      'Romanos 8:28 - Sabemos que todas as coisas cooperam para o bem daqueles que amam a Deus.',
      'Hebreus 13:6 - O Senhor é o meu ajudador, não temerei.',
      'Salmos 37:5 - Entrega o teu caminho ao Senhor; confia nele.',
      'Tiago 1:5 - Se alguém de vós tem falta de sabedoria, peça a Deus.',
      'Provérbios 12:25 - A ansiedade no coração do homem o abate.',
      'Salmos 18:6 - Na minha angústia invoquei ao Senhor.'
    ],
    'grato': [
      '1 Tessalonicenses 5:18 - Em tudo dai graças.',
      'Salmos 100:4 - Entrai pelas portas dele com gratidão, e em seus átrios, com louvor.',
      '1 Tessalonicenses 5:18 - "Em tudo dai graças."',
      'Salmos 107:1 - Louvai ao Senhor, porque ele é bom; a sua misericórdia dura para sempre.',
      'Colossenses 3:15 - E seja a paz de Cristo, a árbitra em vosso coração, e sede agradecidos.',
      'Salmos 136:1 - Louvai ao Senhor, porque ele é bom, porque a sua misericórdia dura para sempre.',
      'Salmos 103:2 - Bendize, ó minha alma, ao Senhor, e não te esqueças de nenhum de seus benefícios.',
      'Filipenses 4:6 - Em tudo sejam conhecidas as vossas petições diante de Deus.',
      'Salmos 69:30 - Louvarei o nome de Deus com cântico e exaltá-lo-ei com ação de graças.',
      'Salmos 95:2 - Apresentemo-nos diante dele com ações de graças.',
      'Colossenses 4:2 - Perseverai na oração, velando com ações de graças.',
      'Romanos 1:21 - Porquanto, tendo conhecido a Deus, não o glorificaram como Deus, nem lhe deram graças.',
      'Salmos 118:29 - Louva ao Senhor, porque ele é bom; a sua misericórdia dura para sempre.',
      'Efésios 5:20 - Dando sempre graças por tudo a nosso Deus e Pai.',
      'Salmos 136:26 - Dai graças ao Deus dos céus, porque a sua misericórdia dura para sempre.',
      'Salmos 30:12 - Para que meu coração cante louvores a ti e não se cale.',
      '2 Coríntios 9:15 - Graças a Deus por seu dom indescritível.'
    ]
  };


  constructor(private modalController: ModalController, private iaService: IAService, private tts: TextToSpeechService) {}

  // verificarSentimento() {
  //   const sentimentoLower = this.sentimento.toLowerCase();
  //   this.sugestoes = Object.keys(this.sentimentosVersiculos).filter(sentimento =>
  //     sentimento.startsWith(sentimentoLower)
  //   );

  //   if (this.sentimentosVersiculos[sentimentoLower]) {
  //     this.versiculo = this.sentimentosVersiculos[sentimentoLower];
  //     this.mensagemErro = ''; // Limpa a mensagem de erro
  //   } else {
  //     this.versiculo = ''; // Limpa o versículo
  //     this.mensagemErro = 'Desculpe, não consegui gerar uma reflexão no momento.';
  //   }
  // }
  verificarSentimento() {
    const sentimentoLower = this.sentimento.toLowerCase();
    this.sugestoes = Object.keys(this.sentimentosVersiculos).filter(sentimento =>
      sentimento.startsWith(sentimentoLower)
    );

    if (this.sentimentosVersiculos[sentimentoLower]) {
      const versiculos = this.sentimentosVersiculos[sentimentoLower];
      this.versiculo = versiculos[Math.floor(Math.random() * versiculos.length)]; // Seleciona um versículo aleatório
      this.mensagemErro = ''; // Limpa a mensagem de erro
    } else {
      this.versiculo = ''; // Limpa o versículo
      this.mensagemErro = 'Desculpe, não consegui gerar uma reflexão no momento.';
    }
  }

  selecionarSugestao(sentimento: string) {
    this.sentimento = sentimento;
    const versiculos = this.sentimentosVersiculos[sentimento];
    this.versiculo = versiculos[Math.floor(Math.random() * versiculos.length)]; // Seleciona um versículo aleatório
    this.sugestoes = []; // Limpa as sugestões após a seleção
  }

  async gerarReflexao() {
    if (this.versiculo) {
      try {
        const response = await this.iaService.gerarReflexao(this.versiculo).toPromise();
        this.reflexao = response.choices[0].message.content;
        this.closeModal();
      } catch (error) {
        // Verifica se o erro tem a propriedade 'status'
        if ((error as HttpErrorResponse).status) {
          const httpError = error as HttpErrorResponse;
          if (httpError.status === 429) {
            console.warn('Limite de requisições atingido. Tentando novamente em 5 segundos...');
            setTimeout(() => this.gerarReflexao(), 5000);
          } else {
            console.error('Erro ao gerar reflexão:', httpError.message);
            this.reflexao = 'Desculpe, não consegui gerar uma reflexão no momento.';
          }
        } else {
          console.error('Erro desconhecido:', error);
          this.reflexao = 'Desculpe, ocorreu um erro inesperado.';
        }
      }
    }
  }

  lerTexto(versiculo: string) {
    this.tts.speak(versiculo);
  }


  delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  closeModal() {
    this.modalController.dismiss({ versiculo: this.versiculo });
  }
}
