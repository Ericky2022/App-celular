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
  searchTerm: string = ''; // Propriedade para armazenar o termo de busca

  constructor(private bibliaService: BibliaService, private modalController: ModalController) {}

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
    this.modalController.create({
      component: VersiculoModalComponent,
      componentProps: {
        versiculos: this.livros.find(l => l.name === livro)?.capitulos[capitulo],
        livro: livro,
        capitulo: capitulo
      }
    }).then(modal => modal.present());
  }

  // Método para alternar o livro expandido
  toggleLivro(livro: string) {
    this.livroExpandido = this.livroExpandido === livro ? null : livro;
    console.log("toggleLivro", this.livroExpandido);
  }
}
