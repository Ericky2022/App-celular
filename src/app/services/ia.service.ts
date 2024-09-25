import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class IAService {
  private apiUrl = 'http://localhost:3000/api/gerarReflexao'; // Chamada ao backend

  constructor(private http: HttpClient) {}

  gerarReflexao(versiculo: string): Observable<any> {
    // O corpo da requisição que será enviado ao backend
    const body = { versiculo };

    // Cabeçalhos da requisição
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    // Faz a chamada HTTP POST ao backend
    return this.http.post<any>(this.apiUrl, body, { headers });
  }
}
