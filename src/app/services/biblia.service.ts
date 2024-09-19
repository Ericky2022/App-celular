import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BibliaService {

  private jsonURL = 'assets/almeida_ra.json';

  constructor(private http: HttpClient) { }

  getBiblia(): Observable<any> {
    return this.http.get(this.jsonURL);
  }
}
