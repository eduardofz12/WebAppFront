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
            .pipe(map((userR: User) => {
                if (userR == null) {
                    throw new Error('Usuário não encontrado.');
                }
                userR.desafios = [];
                sessionStorage.setItem('currentUser', JSON.stringify(userR));
                if (remindLogin) {
                    localStorage.setItem('ultimoLogin', userR.email);
                } else {
                    localStorage.removeItem('ultimoLogin');
                }

                this.currentUserSubject = new BehaviorSubject<User>(userR);
                this.currentUser = this.currentUserSubject.asObservable();

                return userR;
            }));
    }

    logout(): void {
        sessionStorage.removeItem('currentUser');
        sessionStorage.removeItem('lastItem');
        this.currentUserSubject.next(null);
        this.router.navigate(['/login']);
    }

    usuarioLogado(): User|any {
        return this.currentUserSubject.value;
    }
}
