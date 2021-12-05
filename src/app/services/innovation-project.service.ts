import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { InnovationProject } from '../interfaces/innovation-project';

@Injectable({
  providedIn: 'root'
})
export class InnovationProjectService {

  constructor(private http: HttpClient) { }

  public getInovationProjects(params: HttpParams): Observable<InnovationProject[]> {
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', 'Basic YmF0YXRhOnhxZGw=');

    return this.http.get<InnovationProject[]>(`${environment.apiUrl}${environment.innovationProjectUrl}`, { headers, params });
  }

  public getInovationProjectById(id: string): Observable<InnovationProject> {
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', 'Basic YmF0YXRhOnhxZGw=');

    return this.http.get<InnovationProject>(`${environment.apiUrl}${environment.innovationProjectUrl}/` + id, { headers});
  }

  saveInovationProject(innovationProject: InnovationProject): Observable<InnovationProject> {

    let headers = new HttpHeaders();
    headers = headers.set('Authorization', 'Basic YmF0YXRhOnhxZGw=');
    
    return this.http.post<InnovationProject>(`${environment.apiUrl}${environment.innovationProjectUrl}`, innovationProject, {headers})
        .pipe(map((innovationProject: InnovationProject) => {
            if(innovationProject == null) {
                throw new Error("Erro ao cadastrar projeto de inovação.");
            }
            return innovationProject;
        }));
  }

  public createInovationProjectObject(...args: any[]): InnovationProject {
    let innovationProject : InnovationProject = {
      id: args[0],
      titulo: args[1],
      descricao: args[2],
      ideia: args[3],
      responsavel: args[4],
      dataInicio: args[5],
      dataTermino: args[6],
      usuarioInclusao: args[7],
      dataInclusao: args[8],
      situacao: args[9]
    };

    return innovationProject;
  }
}
