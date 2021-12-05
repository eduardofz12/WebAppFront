import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { User2 } from '../interface/user2';
import { User } from '../interfaces/user';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserService {

    constructor(private http: HttpClient) {}

    public getUsers(): Observable<User2[]> {
        return this.http.get<User2[]>(`https://jsonplaceholder.typicode.com/users`);
    }

    public getUser(): Observable<User2> {
        return this.http.get<User2>(`https://jsonplaceholder.typicode.com/users/1`);
    }

    public getAllUsuarios(): Observable<User[]> {
        let headers = new HttpHeaders();
        headers = headers.set('Authorization', 'Basic YmF0YXRhOnhxZGw=');

        return this.http.get<User[]>(`${environment.apiUrl}${environment.usuariosUrl}`, {headers});
    }

    public getUserById(id: string): Observable<User> {

        let headers = new HttpHeaders();
        headers = headers.set('Authorization', 'Basic YmF0YXRhOnhxZGw=');

        return this.http.get<User>(`${environment.apiUrl}${environment.usuariosUrl}/` + id, {headers});
    }

    public createUserObject(...args: any[]): User {
        let user : User = {
            id: args[0],
            email: args[1],
            password: args[2],
            name: args[3],
            username: args[4],
            desafios: args[5]
        };

        return user;
    }

    // public login(user: User, remindLogin: boolean): Observable<User> {
    //     let headers = new HttpHeaders();
    //     headers = headers.set('Authorization', 'Basic YmF0YXRhOnhxZGw=');

    //     return this.http.post<User>(`${environment.apiUrl}${environment.usuariosUrl}/login`, user, {headers})
    //     .pipe(map(user => {
    //         if(user == null) {
    //             throw new Error("Usuário não encontrado.");
    //         }
    //         // store user details and jwt token in local storage to keep user logged in between page refreshes
    //         sessionStorage.setItem('currentUser', JSON.stringify(user));
    //         if (remindLogin) {
    //             localStorage.setItem('ultimoLogin', user.email);
    //         } else {
    //             localStorage.removeItem('ultimoLogin');
    //         }
    //         return user;
    //     }));
    // }
}
