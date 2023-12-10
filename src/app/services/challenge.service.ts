import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {lastValueFrom, Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {environment} from 'src/environments/environment';
import {Challenge} from '../interfaces/challenge';

@Injectable({
  providedIn: 'root'
})
export class ChallengeService {

  constructor(private http: HttpClient) { }

  public getChallenges(params: HttpParams): Observable<Challenge[]> {
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', 'Basic YmF0YXRhOnhxZGw=');

    return this.http.get<Challenge[]>(`${environment.apiUrl}${environment.challengeUrl}`, { headers, params });
  }

  public getChallengeById(id: string): Observable<Challenge> {
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', 'Basic YmF0YXRhOnhxZGw=');

    // let params = new HttpParams({ fromObject: {id: id} });

    return this.http.get<Challenge>(`${environment.apiUrl}${environment.challengeUrl}/` + id, { headers});
  }

  public getChallengeByIdPromise(id: string): Promise<Challenge> {
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', 'Basic YmF0YXRhOnhxZGw=');

    // let params = new HttpParams({ fromObject: {id: id} });

    return lastValueFrom(this.http.get<Challenge>(`${environment.apiUrl}${environment.challengeUrl}/` + id, { headers}));
  }

  saveChallenge(challenge: Challenge): Observable<Challenge> {

    let headers = new HttpHeaders();
    headers = headers.set('Authorization', 'Basic YmF0YXRhOnhxZGw=');

    return this.http.post<Challenge>(`${environment.apiUrl}${environment.challengeUrl}`, challenge, {headers})
        .pipe(map((challenge: Challenge) => {
            if (challenge == null) {
                throw new Error('Erro ao cadastrar desafio.');
            }
            return challenge;
        }));
  }

  public createChallengeObject(...args: any[]): Challenge {
    return {
      id: args[0],
      titulo: args[1],
      descricao: args[2],
      dataFinal: args[3],
      usuario: args[4],
      situacao: args[5],
      dataInclusao: new Date(),
    };
  }
}
