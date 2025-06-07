import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { BibliaService } from '../services/biblia.service';
import { VersiculoModalComponent } from '../versiculo-modal/versiculo-modal.component';
import { TextToSpeechService } from '../services/text-to-speech.service';
import { BibliaHistoricaService } from '../services/biblia-historica.service';

interface Versiculo {
  book_name: string;
  chapter: number;
  verse: number;
  text: string;
}

interface Livro {
  name: string; // Nome do livro
  capitulos: { [capitulo: number]: Versiculo[] }; // Capitulos do livro
}

// Defina a interface 'LivroHistorico' aqui
interface LivroHistorico {
  name: string;
  contexto: string;
  paragrafos: string[];
}

@Component({
  selector: 'app-biblia',
  templateUrl: './biblia.page.html',
  styleUrls: ['./biblia.page.scss'],
})
export class BibliaPage implements OnInit {
  livros: Livro[] = [];
  livrosFiltrados: Livro[] = [];
  allVerses: Versiculo[] = [];
  livroExpandido: string | null = null;
  livroSelecionado: string | null = null;
  capituloSelecionado: number | null = null;
  searchTerm: string = '';
  resultados: string[] = [];
  livrosHistoricos: LivroHistorico[] = [];
  historicoAtual: string[] = [];
  contextoHistorico: string = '';
  private _searchTimeout: any;


  constructor(
    private bibliaService: BibliaService,
    private modalController: ModalController,
    private tts: TextToSpeechService,
    private bibliaHistoricaService: BibliaHistoricaService
  ) {}

  ngOnInit() {
    this.bibliaService.getBiblia().subscribe(data => {
      this.organizarLivros(data.verses);
      this.livrosFiltrados = this.livros;
      console.log(this.livros);
    });
    this.livrosHistoricos = this.bibliaHistoricaService.getLivrosHistoricos();
  }

  obterHistorico(livro: string) {
    const livroHistorico = this.bibliaHistoricaService.getLivroHistorico(livro);
    if (livroHistorico) {
      this.contextoHistorico = livroHistorico.paragrafos.join('<br><br>');
    }
    // this.contextoHistorico = this.bibliaHistoricaService.historicoLivro += livroHistorico?.paragrafos ;
    console.log('historico', this.contextoHistorico);
  }

  lerVersiculo(versiculo: string) {
    this.tts.speak(versiculo);
  }

  organizarLivros(versiculos: Versiculo[]) {
    const livrosMap = new Map<string, Livro>();

    versiculos.forEach(versiculo => {
      const livro = versiculo.book_name;
      const capitulo = versiculo.chapter;

      this.allVerses.push(versiculo);

      if (!livrosMap.has(livro)) {
        livrosMap.set(livro, { name: livro, capitulos: {} });
      }

      const livroObj = livrosMap.get(livro)!; // Type assertion, porque sabemos que existe

      // Adiciona o versículo sem reordenação
      if (!livroObj.capitulos[capitulo]) {
        livroObj.capitulos[capitulo] = [];
      }

      livroObj.capitulos[capitulo].push(versiculo);
    });

    // Converte de volta para array, mantendo a ordem de inserção
    this.livros = Array.from(livrosMap.values());
  }

  filterLivros() {
    const term = this.searchTerm.toLowerCase();
    this.livrosFiltrados = this.livros.filter(livro =>
      livro.name.toLowerCase().includes(term)
    );
  }

  getCapitulos(capitulos: { [capitulo: number]: Versiculo[] }): number[] {
    return Object.keys(capitulos).map(Number); // Converte as chaves para números
  }

  getCapitulosExpandido(): number[] | null {
    if (this.livroExpandido) {
      const livro = this.livrosFiltrados.find(l => l.name === this.livroExpandido);
      return livro ? this.getCapitulos(livro.capitulos) : null;
    }
    return null;
  }

  abrirModal(capitulo: number, livro: string, versiculoFocado?: Versiculo) {
    this.livroSelecionado = livro;
    this.capituloSelecionado = capitulo;

    this.modalController.create({
      component: VersiculoModalComponent,
      componentProps: {
        versiculos: this.livros.find(l => l.name === livro)?.capitulos[capitulo],
        livro: livro,
        capitulo: capitulo,
        versiculoFocado: versiculoFocado // Passa o versículo focado
      }
    }).then(modal => {
      modal.onDidDismiss().then(() => {
        this.filterLivros();
        this.livroExpandido = livro;
      });
      modal.present();
    });
    console.log('Livro ',this.livroExpandido, 'versiculo focado', versiculoFocado?.verse);
  }

  filtrarResultados(event: any) {
    const searchValue = event.detail?.value ?? event.target?.value ?? '';
    clearTimeout((this as any)._searchTimeout);
    (this as any)._searchTimeout = setTimeout(() => {
      const term = searchValue.toLowerCase();
      this.searchTerm = searchValue;
      this.filterLivros();
      this.resultados = [];

      const livrosEncontrados = this.livros.filter(livro =>
        livro.name.toLowerCase().includes(term)
      );
      this.resultados.push(...livrosEncontrados.map(l => l.name));

      this.allVerses.forEach(v => {
        if (v.text.toLowerCase().includes(term)) {
          this.resultados.push(`${v.book_name} ${v.chapter}:${v.verse}`);
        }
      });
    }, 300);
  }

  abrirResultado(resultado: string) {
    const partes = resultado.split(' ');
    if (partes.length === 1) { // É um livro
      this.toggleLivro(resultado);
    } else if (partes.length === 2) { // É um versículo
      const [livro, capituloVersiculo] = partes;
      const [capitulo, versiculo] = capituloVersiculo.split(':');

      // Encontrar o versículo correspondente
      const versiculos = this.livros.find(l => l.name === livro)?.capitulos[Number(capitulo)];
      const versiculoEncontrado = versiculos?.find(v => v.verse === Number(versiculo));
      console.log('versiculoEncontrado ',versiculoEncontrado?.verse);

      if (versiculoEncontrado?.verse) {
        this.abrirModal(Number(capitulo), livro, versiculoEncontrado); // Passa o versículo encontrado
      }
    }
  }

  termoPesquisa(){
    this.filterLivros();
    // this.filtrarResultados();
    console.log("termoPesquisa", this.searchTerm);
  }

  // toggleLivro(livro: string) {
  //   this.obterHistorico(livro);
  //   console.log('Antes: ', this.livroExpandido); // Log do estado anterior
  //   if (this.livroExpandido === livro) {
  //     this.livroExpandido = null; // Fecha o accordion
  //   } else {
  //     this.livroExpandido = livro; // Expande o novo livro
  //   }
  //   console.log('Depois: ', this.livroExpandido); // Log do novo estado
  // }
  toggleLivro(livro: string) {
    // Se o livro clicado já está expandido, fecha ele, senão expande apenas ele e fecha os outros
    if (this.livroExpandido === livro) {
      this.livroExpandido = null; // Fecha o livro se ele já estava expandido
    } else {
      this.livroExpandido = livro; // Expande o novo livro e fecha os outros
    }

    // Obter o contexto histórico do livro expandido
    this.obterHistorico(livro);
    console.log('Livro Expandido: ', this.livroExpandido);
  }

}
