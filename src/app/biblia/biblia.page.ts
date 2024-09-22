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
  livrosFiltrados: Livro[] = []; // Nova propriedade para livros filtrados
  livroExpandido: string | null = null; // Adicionado para controlar o livro expandido
  livroSelecionado: string | null = null; // Variável para manter o livro selecionado
  capituloSelecionado: number | null = null; // Variável para manter o capítulo selecionado
  searchTerm: string = ''; // Para armazenar o termo de busca
  resultados: string[] = []; // Para armazenar os resultados da pesquisa


  constructor(private bibliaService: BibliaService, private modalController: ModalController) {
    // Inicializa com a lista de livros do arquivo json
    this.bibliaService.getBiblia();
    console.log('construtor biblia',this.bibliaService.getBiblia());
    this.livrosFiltrados = this.livros; // Inicia com a lista original
    this.resultados = []; // Limpa os resultados da pesquisa quando o componente é inicializado


  }

  ngOnInit() {
    this.bibliaService.getBiblia().subscribe(data => {
      this.organizarLivros(data.verses);
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

  abrirModal(capitulo: number, livro: string) {
    this.livroSelecionado = livro; // Atualiza o livro selecionado
    this.capituloSelecionado = capitulo; // Atualiza o capítulo selecionado
    this.modalController.create({
      component: VersiculoModalComponent,
      componentProps: {
        versiculos: this.livros.find(l => l.name === livro)?.capitulos[capitulo],
        livro: livro,
        capitulo: capitulo
      }
    }).then(modal => {
      modal.onDidDismiss().then(() => {
        // Aqui você pode atualizar a lista de versículos ou executar qualquer ação desejada
        this.filterLivros(); // Por exemplo, se você quiser re-aplicar a filtragem
        this.livroExpandido = livro;
      });
      modal.present();
    });
  }

  filtrarResultados(res: any) {
    this.resultados = []; // Limpa resultados a cada nova busca

    let busca = res.target.value;
    if (!busca) {
      this.resultados = []; // Limpa resultados se o campo de busca estiver vazio
      return;
      // Filtra livros
      const livrosEncontrados = this.livros.filter(l => l.name.toLowerCase().includes(this.searchTerm.toLowerCase()));
      this.resultados.push(...livrosEncontrados.map(l => l.name));

      // Filtra versículos
      this.livros.forEach(livro => {
        Object.keys(livro.capitulos).forEach(capitulo => {
          const numCapitulo = Number(capitulo);
          livro.capitulos[numCapitulo].forEach(versiculo => {
            if (versiculo.text.toLowerCase().includes(this.searchTerm.toLowerCase())) {
              this.resultados.push(`${livro.name} ${numCapitulo}:${versiculo.verse}`);
            }
          });
        });
      });
    }

  }

  abrirResultado(resultado: any) {
    const digi = resultado.target.value.trim();

    // Verifica se o campo de busca não está vazio
    if (digi) {
      // Verifica se é um livro da Bíblia
      const livroEncontrado = this.livros.find(l => l.name.toLowerCase() === digi.toLowerCase());

      if (livroEncontrado) {
        // Se é um livro, expande o livro e mostra capítulos
        this.toggleLivro(livroEncontrado.name);
      } else {
        // Se não é um livro, procura por versículos
        let versiculosEncontrados: string[] = [];

        this.livros.forEach(livro => {
          Object.keys(livro.capitulos).forEach(capitulo => {
            const numCapitulo = Number(capitulo);
            livro.capitulos[numCapitulo].forEach(versiculo => {
              if (versiculo.text.toLowerCase().includes(digi.toLowerCase())) {
                versiculosEncontrados.push(`${livro.name} ${numCapitulo}:${versiculo.verse}`);
              }
            });
          });
        });

        // Se encontrou versículos, você pode abrir o modal aqui
        if (versiculosEncontrados.length > 0) {
          // Exemplo: abrir o modal para o primeiro versículo encontrado
          const primeiroVersiculo = versiculosEncontrados[0];
          const [livro, capituloVersiculo] = primeiroVersiculo.split(' ');
          const [capitulo, verse] = capituloVersiculo.split(':');
          this.abrirModal(Number(capitulo), livro); // Abre o modal do primeiro versículo encontrado
        } else {
          console.log('Nenhum versículo encontrado.');
        }
      }
    }

    console.log(resultado);
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
