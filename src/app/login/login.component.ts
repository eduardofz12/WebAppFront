import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth.service';
import { DialogIncorrectUserComponent } from 'src/app/dialogs/dialog-incorrect-user/dialog-incorrect-user.component';
import { MatDialog } from '@angular/material/dialog';
import { UserService } from '../services/user.service';
import { User2 } from '../interface/user2';
import { HttpErrorResponse } from '@angular/common/http';
import { User } from '../interfaces/user';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
    loginForm!: FormGroup;
    loading = false;
    submitted = false;
    error = '';
    users!: User2[];
    usuarios!: User[];
    usuario!: User;

    constructor(
        private formBuilder: FormBuilder,
        private router: Router,
        private authenticationService: AuthService,
        private dialog: MatDialog,
        private userService: UserService
    ) {
        // redirect to home if already logged in
        if (this.authenticationService.currentUserValue) {
            this.router.navigate(['/dashboard/home']);
        }
    }

    public getUsers(): void {
        this.userService.getUsers().subscribe(
            (response: User2[]) => {
                this.users = response
            },
            (error: HttpErrorResponse) => {
                alert(error.message)
            }
        );
    }

    public getAllUsuarios(): void {
        this.userService.getAllUsuarios().subscribe(
            (response: User[]) => {
                this.usuarios = response
            },
            (error: HttpErrorResponse) => {
                alert(error.message)
            }
        );
    }

    ngOnInit() {
        this.loginForm = this.formBuilder.group({
            Login: [localStorage.getItem('ultimoLogin') || '', Validators.required],
            Senha: [localStorage.getItem('ultimaSenha') || '', Validators.required],
            remindLogin: new FormControl(false)
        });
        if (localStorage.getItem('ultimoLogin') != null) {
            this.loginForm.controls.remindLogin.setValue(true);
        }
    }

    // convenience getter for easy access to form fields
    get f() { return this.loginForm.controls; }

    onSubmit() {
        this.submitted = true;
        // stop here if form is invalid
        if (this.loginForm.invalid) {
            return;
        }

        this.loading = true;
        let json: User = this.userService.createUserObject(null,
            this.f.Login.value,
            this.f.Senha.value);

        this.loading = true;
        this.authenticationService.login(json, this.f.remindLogin.value)
            .subscribe(
                data => {
                    let route = sessionStorage.getItem('lastItem');
                    if (!route) {
                        route = '/dashboard/home';
                    }
                    this.router.navigate([route]);
                    this.loading = false;
                },
                error => {
                    this.error = error;
                    this.loading = false;
                    this.openDialog();
                });
    }

    openDialog(): void {
        this.dialog.open(DialogIncorrectUserComponent);
    }

}