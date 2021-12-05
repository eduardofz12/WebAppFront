import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DataService } from '../../services/data.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Issue } from '../../models/issue';
import { DataSource } from '@angular/cdk/collections';
import { BehaviorSubject, fromEvent, merge, Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { FormGroup, FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { environment } from 'src/environments/environment';
import { Router, ActivatedRoute, NavigationStart } from '@angular/router';
import { DialogChallengeDetailsComponent } from 'src/app/dialogs/dialog-challenge-details/dialog-challenge-details.component';
import { Challenge } from 'src/app/interfaces/challenge';
import { Situacao } from 'src/app/interfaces/situacao';
import { ChallengeService } from 'src/app/services/challenge.service';
import { SituacaoService } from 'src/app/services/situacao.service';
import { TableDataSource } from 'src/app/util/TableDataSource';
import { UserDateAdapter } from 'src/app/util/UserDateAdapter';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/interfaces/user';
import { MatSnackBar } from '@angular/material/snack-bar';
import { InnovationProject } from 'src/app/interfaces/innovation-project';
import { InnovationProjectService } from 'src/app/services/innovation-project.service';

@Component({
  selector: 'app-innovation-project-search',
  templateUrl: './innovation-project-search.component.html',
  styleUrls: ['./innovation-project-search.component.css']
})
export class InnovationProjectSearchComponent implements OnInit {
  displayedColumns = ['id', 'titulo', 'situacao', 'responsavel', 'actions'];
  exampleDatabase!: DataService;
  dataSource!: TableDataSource;
  index!: number;
  id!: number;
  minDate = environment.minDate;
  maxDate = environment.maxDate;
  loading = false;
  submitted = false;
  form!: FormGroup;
  subscription!: Subscription;
  challenges!: Challenge[];
  error: '' | undefined;
  cond_vall = false;
  show = true;
  usuario!: User;
  projetos!: InnovationProject[];

  situacoes = Array<Situacao>();

  constructor(private snackBar: MatSnackBar,
    public httpClient: HttpClient,
    public dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute,
    private dataService: DataService,
    private challengeService: ChallengeService,
    private dateAdapter: UserDateAdapter,
    private situacaoService: SituacaoService,
    private usuarioService: UserService,
    private projectService: InnovationProjectService) { }

  @ViewChild(MatPaginator, { static: true })
  paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true })
  sort!: MatSort;
  @ViewChild('filter', { static: true })
  filter!: ElementRef;

  async ngOnInit() {

    this.loading = true;

    this.form = new FormGroup({
      titulo: new FormControl(''),
      situacao: new FormControl(),
      dataInclusaoInicio: new FormControl(''),
      dataInclusaoFim: new FormControl(''),
      dataFinalInicio: new FormControl(''),
      dataFinalFim: new FormControl(''),
      responsavelCodigo: new FormControl(''),
      responsavelNome: new FormControl('')
    });

    this.situacoes = await this.situacaoService.getAllSituacoesPromise();
    this.situacoes.push({ id: 1, descricao: "Todas", ativa: "S" });
    this.f.situacao.setValue(1);

    this.loading = false;
  }

  get f() { return this.form.controls; }

  refresh() {
    this.loadData();
  }

  onSubmit() {
    this.submitted = true;
    // stop here if form is invalid
    if (this.form.invalid) {
      return;
    }

    this.loading = true;
    let params = new HttpParams({
      fromObject:
      {
        titulo: this.f.titulo.value,
        situacao: this.f.situacao.value,
        responsavel: this.f.responsavelCodigo.value,
        dataInclusaoInicio: this.f.dataInclusaoInicio.value,
        dataInclusaoFim: this.f.dataInclusaoFim.value,
        dataFinalInicio: this.f.dataFinalInicio.value,
        dataFinalFim: this.f.dataFinalFim.value
      }
    });

    this.projectService.getInovationProjects(params)
      .subscribe(
        data => {
          this.projetos = data;
          this.loadData();
          if(this.projetos.length == 0) {
            this.openSnackBar("Nenhum projeto encontrado.", "Fechar");
          }
          this.loading = false;
        },
        error => {
          this.error = error;
          this.loading = false;
          this.openSnackBar("Nenhum projeto encontrado.", "Fechar");
        });
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

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 3000,
    });
  }

  goToProjectManage(id: string) {
    this.router.navigate(["manage/", id], { relativeTo: this.route });
  }

  clearDate(picker: string) {
    this.form.get(picker)?.setValue('');
  }

  public hasError = (controlName: string, errorName: string) => {
    if (this.form != undefined) {
      return this.form.controls[controlName].hasError(errorName);
    }
    return null;
  }

  public loadData() {
    this.exampleDatabase = new DataService(this.httpClient);
    this.exampleDatabase.setDataChange(this.projetos);
    this.dataSource = new TableDataSource(this.exampleDatabase, this.paginator, this.sort);
  }
}
