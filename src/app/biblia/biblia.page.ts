import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { BibliaService } from '../services/biblia.service';
import { VersiculoModalComponent } from '../versiculo-modal/versiculo-modal.component';

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

@Component({
  selector: 'app-biblia',
  templateUrl: './biblia.page.html',
  styleUrls: ['./biblia.page.scss'],
})
export class BibliaPage implements OnInit {
  livros: Livro[] = [];
  livrosFiltrados: Livro[] = [];
  livroExpandido: string | null = null;
  livroSelecionado: string | null = null;
  capituloSelecionado: number | null = null;
  searchTerm: string = '';
  resultados: string[] = [];


  constructor(private bibliaService: BibliaService, private modalController: ModalController) {}

  ngOnInit() {
    this.bibliaService.getBiblia().subscribe(data => {
      this.organizarLivros(data.verses);
      this.livrosFiltrados = this.livros;
      console.log(this.livros);
    });
  }

  organizarLivros(versiculos: Versiculo[]) {
    const livrosMap = new Map<string, Livro>();

    versiculos.forEach(versiculo => {
      const livro = versiculo.book_name;
      const capitulo = versiculo.chapter;

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
    const term = event.target.value.toLowerCase();
    this.resultados = [];

    // Filtra livros
    const livrosEncontrados = this.livros.filter(livro =>
      livro.name.toLowerCase().includes(term)
    );
    this.resultados.push(...livrosEncontrados.map(l => l.name));

    // Filtra versículos
    this.livros.forEach(livro => {
      Object.keys(livro.capitulos).forEach(capitulo => {
        const numCapitulo = Number(capitulo);
        livro.capitulos[numCapitulo].forEach(versiculo => {
          if (versiculo.text.toLowerCase().includes(term)) {
            this.resultados.push(`${livro.name} ${numCapitulo}:${versiculo.verse}`);
          }
        });
      });
    });
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

  // Método para alternar o livro expandido
  toggleLivro(livro: string) {
    this.livroExpandido = this.livroExpandido === livro ? null : livro;
    this.livroExpandido = this.livroExpandido ? livro : null;
    console.log("toggleLivro", this.livroExpandido);
  }
}
