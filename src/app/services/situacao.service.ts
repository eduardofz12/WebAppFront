import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { Situacao } from "../interfaces/situacao";

@Injectable({
  providedIn: 'root'
})
export class SituacaoService {

  constructor(private http: HttpClient) { }

  public getAllSituacoes(): Observable<Situacao[]> {
    return this.http.get<Situacao[]>(`${environment.apiUrl}${environment.situacaoUrl}`);
  }

  public getAllSituacoesPromise(): Promise<Situacao[]> {
    return this.http.get<Situacao[]>(`${environment.apiUrl}${environment.situacaoUrl}`).toPromise();
  }

  public createSituacaoObject(...args: any[]): Situacao {
    let situacao : Situacao = {
        id: args[0],
        descricao: args[1],
        ativa: args[2]
    };
    return situacao;
  }
}
