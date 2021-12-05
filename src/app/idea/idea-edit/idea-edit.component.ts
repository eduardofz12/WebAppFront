import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { BehaviorSubject, fromEvent, merge, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { FormGroup, FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { environment } from 'src/environments/environment';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Challenge } from 'src/app/interfaces/challenge';
import { ChallengeService } from 'src/app/services/challenge.service';
import { Idea } from 'src/app/interfaces/idea';
import { IdeaService } from 'src/app/services/idea.service';
import { AuthService } from 'src/app/services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SituacaoService } from 'src/app/services/situacao.service';

@Component({
  selector: 'app-idea-edit',
  templateUrl: './idea-edit.component.html',
  styleUrls: ['./idea-edit.component.css']
})
export class IdeaEditComponent implements OnInit {

  form!: FormGroup;
  subscription!: Subscription;
  challenges = Array<Challenge>();
  loading = false;
  error = '';
  isChallengeSelected = false;
  challenge !: Challenge;
  idea !: Idea;
  id !: any;

  constructor(private snackBar: MatSnackBar,
              private challengeService: ChallengeService,
              private ideaService: IdeaService,
              private authService: AuthService,
              private router: Router,
              private activatedRoute: ActivatedRoute,
              private situacaoService: SituacaoService) {
  }

  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort!: MatSort;

  ngOnInit() {
    this.form = new FormGroup({
      titulo: new FormControl(''),
      descricao: new FormControl(''),
      desafio: new FormControl('')
    });

    this.activatedRoute.paramMap.subscribe(params => {
      this.id = params.get('id');
    });

    this.loading = true;
    if (history.state?.data) {
      this.challengeService.getChallengeById(history.state.data)
        .subscribe(
          data => {
            if(!data) {
              this.openDialog();
            }
            this.challenges.push(data);
            this.isChallengeSelected = true;
            this.f.desafio.setValue(this.challenges[0].id);
            this.setNenhumDesafioEncontrado();
            this.loading = false;
          },
          error => {
            this.error = error;
            this.loading = false;
            this.openDialog();
          });
    } else {
      let params = new HttpParams({
        fromObject:
        {
          titulo: '',
          situacao: '1'
        }
      });
  
      this.challengeService.getChallenges(params)
        .subscribe(
          data => {
            this.challenges = data;
            this.setNenhumDesafioEncontrado();
            this.loading = false;
          },
          error => {
            this.error = error;
            this.loading = false;
            this.setNenhumDesafioEncontrado();
            this.openDialog();
          });
    }
  }

  isDesafioRequired() : boolean {
    return this.challenges.length == 1 && this.challenges[0].id != 0;
  }
  setNenhumDesafioEncontrado() {
    if(this.challenges.length == 0) {
      this.challenges.push(this.challengeService.createChallengeObject(0,'Nenhum desafio encontrado'));
    }
  }

  get f() { return this.form.controls; }

  onSubmit() {
    if (this.form.invalid) {
      return;
    }
    this.loading = true;
    let json: Idea = this.ideaService.createIdeaObject(this.idea ? this.idea.id : null,
      this.f.titulo.value,
      this.f.descricao.value,
      this.f.desafio.value ? this.challengeService.createChallengeObject(this.f.desafio.value) : null,
      new Date,
      this.situacaoService.createSituacaoObject(2),
      this.authService.currentUserValue);

    this.loading = true;
    this.ideaService.saveIdea(json)
      .subscribe(
        data => {
          this.idea = data;
          this.loading = false;
          if (this.idea && this.idea.id) {
            this.openSnackBar("Ideia salva com sucesso.", "fechar");
          }
        },
        error => {
          this.error = error;
          this.loading = false;
          this.openSnackBar("Erro ao cadastrar ideia.", "Fechar");
        });
  }

  openDialog() {
    throw new Error('Method not implemented.');
  }

  public hasError = (controlName: string, errorName: string) => {
    return this.form.controls[controlName].hasError(errorName);
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 3000,
    });
  }

  newIdea() {
    this.router.navigate(['/dashboard/idea/edit/']);
  }

}
