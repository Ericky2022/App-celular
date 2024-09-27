import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmocaoServiceService {

  private jsonURL = 'assets/sentimento.json'; // Localização do arquivo JSON

  constructor(private http: HttpClient) {}

  getEmocoes(): Observable<any> {
    return this.http.get(this.jsonURL);
  }
}
