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
  livroExpandido: string | null = null; // Adicionado para controlar o livro expandido

  constructor(private bibliaService: BibliaService, private modalController: ModalController) { }

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

      if (!livroObj.capitulos[capitulo]) {
        livroObj.capitulos[capitulo] = [];
      }

      livroObj.capitulos[capitulo].push(versiculo);
    });

     // Ordenar os livros e os capítulos
  this.livros = Array.from(livrosMap.values()).map(livro => {
    const capitulosOrdenados = Object.keys(livro.capitulos)
      .sort((a, b) => parseInt(a) - parseInt(b)) // Usar parseInt para a comparação
      .reduce((acc, key) => {
        acc[parseInt(key)] = livro.capitulos[parseInt(key)];
        return acc;
      }, {} as { [key: number]: Versiculo[] });

    return { ...livro, capitulos: capitulosOrdenados };
  });
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

  // Função para converter string para número
  toNumber(value: string): number {
    return Number(value);
  }

  // Método para alternar o livro expandido
  toggleLivro(livro: string) {
    this.livroExpandido = this.livroExpandido === livro ? null : livro;
    console.log("toggleLivro", this.livroExpandido)
  }
}
