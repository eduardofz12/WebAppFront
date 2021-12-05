import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Idea } from '../interfaces/idea';
import { ChallengeService } from './challenge.service';

@Injectable({
  providedIn: 'root'
})
export class IdeaService {

  constructor(private http: HttpClient) { }

  public getIdeas(params: HttpParams): Observable<Idea[]> {
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', 'Basic YmF0YXRhOnhxZGw=');

    return this.http.get<Idea[]>(`${environment.apiUrl}${environment.ideaUrl}`, { headers, params });
  }

  public getIdeaById(id: string): Observable<Idea> {
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', 'Basic YmF0YXRhOnhxZGw=');

    return this.http.get<Idea>(`${environment.apiUrl}${environment.ideaUrl}/` + id, { headers});
  }

  saveIdea(idea: Idea): Observable<Idea> {

    let headers = new HttpHeaders();
    headers = headers.set('Authorization', 'Basic YmF0YXRhOnhxZGw=');
    
    return this.http.post<Idea>(`${environment.apiUrl}${environment.ideaUrl}`, idea, {headers})
        .pipe(map((idea: Idea) => {
            if(idea == null) {
                throw new Error("Erro ao cadastrar ideia.");
            }
            return idea;
        }));
  }

  public createIdeaObject(...args: any[]): Idea {
    let idea : Idea = {
      id : args[0],
      titulo : args[1],
      descricao: args[2],
      desafio: args[3],
      dataInclusao: args[4],
      situacao: args[5],
      autor: args[6]
    };

    return idea;
  }
}
