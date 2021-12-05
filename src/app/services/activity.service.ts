import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Activity } from '../interfaces/activity';

@Injectable({
  providedIn: 'root'
})
export class ActivityService {

  constructor(private http: HttpClient) { }

  public getActivitys(params: HttpParams): Observable<Activity[]> {
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', 'Basic YmF0YXRhOnhxZGw=');

    return this.http.get<Activity[]>(`${environment.apiUrl}${environment.activityUrl}`, { headers, params });
  }

  public getActivitysPromise(params: HttpParams): Promise<Activity[]> {
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', 'Basic YmF0YXRhOnhxZGw=');

    return this.http.get<Activity[]>(`${environment.apiUrl}${environment.activityUrl}`, { headers, params }).toPromise();
  }

  public getActivityById(id: string): Observable<Activity> {
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', 'Basic YmF0YXRhOnhxZGw=');

    return this.http.get<Activity>(`${environment.apiUrl}${environment.activityUrl}/` + id, { headers});
  }

  public getActivityByIdPromise(id: string): Promise<Activity> {
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', 'Basic YmF0YXRhOnhxZGw=');

    return this.http.get<Activity>(`${environment.apiUrl}${environment.activityUrl}/` + id, { headers}).toPromise();
  }

  saveActivity(activity: Activity): Observable<Activity> {

    let headers = new HttpHeaders();
    headers = headers.set('Authorization', 'Basic YmF0YXRhOnhxZGw=');
    
    return this.http.post<Activity>(`${environment.apiUrl}${environment.activityUrl}`, activity, {headers})
        .pipe(map((activity: Activity) => {
            if(activity == null) {
                throw new Error("Erro ao cadastrar atividade.");
            }
            return activity;
        }));
  }

  public createActivityObject(...args: any[]): Activity {
    let atividade : Activity = {
      id: args[0],
      titulo: args[1],
      descricao: args[2],
      dataInicio: args[3],
      dataTermino: args[4],
      status: args[5],
      ultimaAlteracaoData: args[6],
      ultimaAlteracaoUsuario: args[7],
      projetoInovacao: args[8],
      dataInclusao: args[9],
      responsavel: args[10]
    };
    return atividade;
  }

}
