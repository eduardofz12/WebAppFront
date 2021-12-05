import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {MatDialog} from '@angular/material/dialog';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {BehaviorSubject, fromEvent, merge, Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import { FormGroup, FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import {MatSelectModule} from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { environment } from 'src/environments/environment';
import {MatSnackBar} from '@angular/material/snack-bar';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { ChallengeService } from 'src/app/services/challenge.service';
import { IdeaService } from 'src/app/services/idea.service';
import { Challenge } from 'src/app/interfaces/challenge';
import { Idea } from 'src/app/interfaces/idea';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/interfaces/user';
import { InnovationProject } from 'src/app/interfaces/innovation-project';
import { InnovationProjectService } from 'src/app/services/innovation-project.service';
import { UserDateAdapter } from 'src/app/util/UserDateAdapter';
import { SituacaoService } from 'src/app/services/situacao.service';

@Component({
  selector: 'app-innovation-project-edit',
  templateUrl: './innovation-project-edit.component.html',
  styleUrls: ['./innovation-project-edit.component.css']
})
export class InnovationProjectEditComponent implements OnInit {

  form!: FormGroup;
  subscription!: Subscription;
  loading = false;
  challenges = Array<Challenge>();
  error = '';
  idea !: Idea;
  id !: any;
  minDate = environment.minDate;
  maxDate = environment.maxDate;
  usuario !: User;
  innovationProject!: InnovationProject;

  constructor(private snackBar: MatSnackBar,
              private challengeService: ChallengeService,
              private ideaService: IdeaService,
              private authService: AuthService,
              private router: Router,
              private activatedRoute: ActivatedRoute,
              private usuarioService: UserService,
              private projectService: InnovationProjectService,
              private dateAdapter: UserDateAdapter,
              private situacaoService: SituacaoService) {
  }

  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort!: MatSort;

  ngOnInit() {
    this.form = new FormGroup({
      titulo: new FormControl(''),
      descricao: new FormControl(''),
      ideiaCodigo: new FormControl(''),
      ideiaTitulo: new FormControl(''),
      responsavelCodigo: new FormControl(''),
      responsavelNome: new FormControl(''),
      dataInicio: new FormControl(''),
      dataTermino: new FormControl('')
    });
  }

  setNenhumDesafioEncontrado() {
    if(this.challenges.length == 0) {
      this.challenges.push(this.challengeService.createChallengeObject(0,'Nenhum desafio encontrado'));
    }
  }

  onSubmit() {
    if (this.form.invalid) {
      this.openSnackBar("Faltam campos para serem preenchidos.", "Fechar");
      return;
    }

    this.loading = true;
    let json: InnovationProject = this.projectService.createInovationProjectObject(null,
      this.f.titulo.value,
      this.f.descricao.value,
      this.ideaService.createIdeaObject(this.f.ideiaCodigo.value),
      this.usuarioService.createUserObject(this.f.responsavelCodigo.value),
      this.f.dataInicio.value,
      this.f.dataTermino.value,
      this.authService.currentUserValue,
      new Date,
      this.situacaoService.createSituacaoObject(2));

    this.loading = true;
    this.projectService.saveInovationProject(json)
      .subscribe(
        data => {
          this.innovationProject = data;
          this.loading = false;
          if (this.innovationProject && this.innovationProject.id) {
            this.openSnackBar("Projeto de inovação salvo com sucesso. Código: " + this.innovationProject.id + ".", "Fechar");
          }
        },
        error => {
          this.error = error;
          this.loading = false;
          this.openSnackBar("Erro ao cadastrar projeto de inovação.", "Fechar");
        });
  }

  public hasError = (controlName: string, errorName: string) => {
    return this.form.controls[controlName].hasError(errorName);
  }

  openDialog() {
    throw new Error('Method not implemented.');
  }

  findResponsavel(event : any) {
    if(!event.target.value){
      return;
    }

    this.loading = true;
    this.usuarioService.getUserById(event.target.value)
      .subscribe(
        data => {
          this.usuario = data;
          if(this.usuario) {
            this.f.responsavelNome.setValue(this.usuario.name);
          } else {
            this.f.responsavelCodigo.setValue("");
            this.openSnackBar("Usuário não encontrado.", "Fechar");
          }
          this.loading = false;
        },
        error => {
          this.error = error;
          this.openSnackBar("Usuário não encontrado.", "Fechar");
          this.loading = false;
          this.f.responsavelNome.setValue("");
        });
  }

  findIdeia(event : any) {
    if(!event.target.value){
      return;
    }

    this.loading = true;
    this.ideaService.getIdeaById(event.target.value)
      .subscribe(
        data => {
          this.idea = data;
          if(this.idea) {
            this.f.ideiaTitulo.setValue(this.idea.titulo);
          } else {
            this.f.ideiaTitulo.setValue("");
            this.openSnackBar("Ideia não encontrada.", "Fechar");
          }
          this.loading = false;
        },
        error => {
          this.error = error;
          this.openSnackBar("Ideia não encontrada.", "Fechar");
          this.loading = false;
          this.f.ideiaTitulo.setValue("");
        });
  }

  get f() { return this.form.controls; }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 3000,
    });
  }

}
