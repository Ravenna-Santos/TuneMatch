import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class MusicaService {
  private apiUrl = 'http://localhost:8080/musicas';

  constructor(private http: HttpClient) {}

  getMusicas(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  recomendarMusicas(ids: string[]) {
    return this.http.post<any[]>(`${this.apiUrl}/recomendar`, ids);
  }

  getMusicasPorGenero(genero: string): Observable<any[]> {
    return this.http.get<any[]>(`http://localhost:8080/musicas/genero/${genero}`);
  }
  
}
