import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from 'src/environments/environment';
import { User } from 'src/app/interfaces/user';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';

@Injectable({ 
    providedIn: 'root' 
})
export class AuthService {
    private currentUserSubject!: BehaviorSubject<User | any>;
    public currentUser!: Observable<User>;

    constructor(
        private router: Router,
        private http: HttpClient,
        private route: Router,
        private dialog: MatDialog) {
            const storageValue = sessionStorage.getItem('currentUser');
            if (storageValue != null) {
                this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(storageValue));
                this.currentUser = this.currentUserSubject.asObservable();
            }
        }

    public get currentUserValue(): User {
        return this.currentUserSubject?.value;
    }

    login(user: User, remindLogin: boolean): Observable<User> {

        let headers = new HttpHeaders();
        headers = headers.set('Authorization', 'Basic YmF0YXRhOnhxZGw=');
        
        return this.http.post<User>(`${environment.apiUrl}${environment.usuariosUrl}/login`, user, {headers})
            .pipe(map((user: User) => {
                if(user == null) {
                    throw new Error("Usuário não encontrado.");
                }
                user.desafios = [];
                sessionStorage.setItem('currentUser', JSON.stringify(user));
                if (remindLogin) {
                    localStorage.setItem('ultimoLogin', user.email);
                } else {
                    localStorage.removeItem('ultimoLogin');
                }
                
                this.currentUserSubject = new BehaviorSubject<User>(user);
                this.currentUser = this.currentUserSubject.asObservable();
                
                return user;
            }));
    }

    logout() {
        sessionStorage.removeItem('currentUser');
        sessionStorage.removeItem('lastItem');
        this.currentUserSubject.next(null);
        this.router.navigate(['/login']);
    }

    usuarioLogado() {
        return this.currentUserSubject.value;
    }
}
