import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BibliaService {

  private jsonURL = 'assets/almeida_ra.json';

  livro: string = '';
  capitulo: number = 0;
  versiculo: number = 0;
  textoVersiculo: string = '';
  modalAberto: boolean = false;

  constructor(private http: HttpClient) { }

  getBiblia(): Observable<any> {
    return this.http.get<any>(this.jsonURL);
  }
}
