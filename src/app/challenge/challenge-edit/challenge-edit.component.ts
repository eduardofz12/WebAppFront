import { Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { BehaviorSubject, fromEvent, merge, Observable } from 'rxjs';
import { first, map } from 'rxjs/operators';
import { FormGroup, FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { environment } from 'src/environments/environment';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Challenge } from 'src/app/interfaces/challenge';
import { ChallengeService } from 'src/app/services/challenge.service';
import { NgxLoadingComponent } from 'ngx-loading';
import { UserDateAdapter } from 'src/app/util/UserDateAdapter';
import { User } from 'src/app/interfaces/user';
import { AuthGuardService } from 'src/app/services/auth-guard.service';
import { AuthService } from 'src/app/services/auth.service';
import { Situacao } from 'src/app/interfaces/situacao';
import { SituacaoService } from 'src/app/services/situacao.service';

@Component({
  selector: 'app-challenge-edit',
  templateUrl: './challenge-edit.component.html',
  styleUrls: ['./challenge-edit.component.css']
})
export class ChallengeEditComponent implements OnInit {

  form!: FormGroup;
  subscription!: Subscription;
  id: any;
  challenge!: Challenge;
  loading = false;
  error = '';
  situacoes = Array<Situacao>();

  constructor(private snackBar: MatSnackBar,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private challengeService: ChallengeService,
    private dateAdapter: UserDateAdapter,
    private authService: AuthService,
    private situacaoService: SituacaoService) {
  }

  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort!: MatSort;

  async ngOnInit() {
    this.loading = true;
    this.form = new FormGroup({
      titulo: new FormControl(''),
      descricao: new FormControl(''),
      dataInicial: new FormControl(''),
      dataFinal: new FormControl(''),
      situacao: new FormControl('')
    });
    this.activatedRoute.paramMap.subscribe(params => {
      this.id = params.get('id');
    });

    this.situacoes = await this.situacaoService.getAllSituacoesPromise();
    this.f.situacao.setValue(2);
    if (this.id) {
      this.loading = true;
      this.challengeService.getChallengeById(this.id)
        .subscribe(
          data => {
            this.challenge = data;
            if (this.challenge) {
              this.f.titulo.setValue(this.challenge.titulo);
              this.f.descricao.setValue(this.challenge.descricao);
              this.f.dataFinal.setValue(this.challenge.dataFinal);
              this.f.situacao.setValue(this.challenge.situacao.id);
            }
            this.loading = false;
          },
          error => {
            this.error = error;
            this.loading = false;
            this.openDialog();
          });
    }
    this.loading = false;
  }

  get f() { return this.form.controls; }

  openDialog() {
    throw new Error('Method not implemented.');
  }

  onSubmit() {
    if (this.form.invalid) {
      return;
    }
    this.loading = true;
    let json: Challenge = this.challengeService.createChallengeObject(this.challenge ? this.challenge.id : null,
      this.f.titulo.value,
      this.f.descricao.value,
      this.f.dataFinal.value,
      this.authService.currentUserValue,
      this.situacaoService.createSituacaoObject(2));

    this.loading = true;
    this.challengeService.saveChallenge(json)
      .subscribe(
        data => {
          this.challenge = data;
          this.loading = false;
          if (this.challenge && this.challenge.id) {
            this.openSnackBar("Desafio salvo com sucesso.", "Fechar");
            this.router.navigate(['/dashboard/challenge/edit/' + this.challenge.id]);
          }
        },
        error => {
          this.error = error;
          this.loading = false;
          this.openSnackBar("Erro ao salvar desafio.", "Fechar");
        });
  }

  public hasError = (controlName: string, errorName: string) => {
    return this.form.controls[controlName].hasError(errorName);
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 5000,
    });
  }

  public findInvalidControls() {
    const invalid = [];
    const controls = this.form.controls;
    for (const name in controls) {
      if (controls[name].invalid) {
        invalid.push(name);
      }
    }
    return invalid;
  }

  newChallenge() {
    this.router.navigate(['/dashboard/challenge/edit/']);
  }

}
