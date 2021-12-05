import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DataService } from '../../services/data.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { FormGroup, FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Challenge } from 'src/app/interfaces/challenge';
import { ChallengeService } from 'src/app/services/challenge.service';
import { Router, ActivatedRoute, RouterEvent, NavigationStart } from '@angular/router';
import { UserDateAdapter } from 'src/app/util/UserDateAdapter';
import { TableDataSource } from 'src/app/util/TableDataSource';
import { DialogChallengeDetailsComponent } from 'src/app/dialogs/dialog-challenge-details/dialog-challenge-details.component';
import { filter } from 'rxjs/operators';
import { SituacaoService } from 'src/app/services/situacao.service';
import { Situacao } from 'src/app/interfaces/situacao';

@Component({
  selector: 'app-challenge-search',
  templateUrl: './challenge-search.component.html',
  styleUrls: ['./challenge-search.component.css']
})

export class ChallengeSearchComponent implements OnInit {
  displayedColumns = ['id', 'titulo', 'situacao', 'actions'];
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

  situacoes = Array<Situacao>();

  constructor(
    public httpClient: HttpClient,
    public dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute,
    private dataService: DataService,
    private challengeService: ChallengeService,
    private dateAdapter: UserDateAdapter,
    private situacaoService: SituacaoService) { }

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
      dataFinalFim: new FormControl('')
    });

    this.situacoes = await this.situacaoService.getAllSituacoesPromise();
    this.situacoes.push({id:1, descricao:"Todas", ativa:"S"});
    this.f.situacao.setValue(1);
    
    this.loading = false;
  }

  get f() { return this.form.controls; }

  refresh() {
    this.loadData();
  }

  bombastik() {
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
        dataInclusaoInicio: this.f.dataInclusaoInicio.value,
        dataInclusaoFim: this.f.dataInclusaoFim.value,
        dataFinalInicio: this.f.dataFinalInicio.value,
        dataFinalFim: this.f.dataFinalFim.value
      }
    });

    this.challengeService.getChallenges(params)
      .subscribe(
        data => {
          this.challenges = data;
          this.loadData();
          this.loading = false;
        },
        error => {
          this.error = error;
          this.loading = false;
          this.openDialog();
        });
  }
  openDialog() {
    throw new Error('Method not implemented.');
  }

  openChallengeDetails(id: string) {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.autoFocus = true;

    dialogConfig.data = {
      id: id
    };

    const dialogRef = this.dialog.open(DialogChallengeDetailsComponent, dialogConfig);

    this.router.events
     .pipe(
       filter((event => event instanceof NavigationStart)),
       filter(() => !!dialogRef)
     )
     .subscribe(() => {
       dialogRef.close();
     });
  }

  editChallenge(id: string) {
    this.router.navigate(["edit/", id], { relativeTo: this.route });
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



  // startEdit(i: number, id: number, title: string, state: string, url: string, created_at: string, updated_at: string) {
  //   this.id = id;
  //   // index row is used just for debugging proposes and can be removed
  //   this.index = i;
  //   console.log(this.index);
  //   const dialogRef = this.dialog.open(EditDialogComponent, {
  //     data: {id: id, title: title, state: state, url: url, created_at: created_at, updated_at: updated_at}
  //   });

  //   dialogRef.afterClosed().subscribe(result => {
  //     if (result === 1) {
  //       if(this.exampleDatabase != null) {
  //         // When using an edit things are little different, firstly we find record inside DataService by id
  //         const foundIndex = this.exampleDatabase.dataChange.value.findIndex(x => x.id === this.id);
  //         // Then you update that record using data from dialogData (values you enetered)
  //         this.exampleDatabase.dataChange.value[foundIndex] = this.dataService.getDialogData();
  //       }
  //       // And lastly refresh table
  //       this.refreshTable();
  //     }
  //   });
  // }

  // deleteItem(i: number, id: number, title: string, state: string, url: string) {
  //   this.index = i;
  //   this.id = id;
  //   const dialogRef = this.dialog.open(DeleteDialogComponent, {
  //     data: {id: id, title: title, state: state, url: url}
  //   });

  //   dialogRef.afterClosed().subscribe(result => {
  //     if (result === 1) {
  //       if(this.exampleDatabase != null) {
  //         const foundIndex = this.exampleDatabase.dataChange.value.findIndex(x => x.id === this.id);
  //         // for delete we use splice in order to remove single object from DataService
  //         this.exampleDatabase.dataChange.value.splice(foundIndex, 1);
  //       }
  //       this.refreshTable();
  //     }
  //   });
  // }


  private refreshTable() {
    // Refreshing table using paginator
    // Thanks yeager-j for tips
    // https://github.com/marinantonio/angular-mat-table-crud/issues/12
    this.paginator._changePageSize(this.paginator.pageSize);
  }

  public loadData() {
    this.exampleDatabase = new DataService(this.httpClient);
    this.exampleDatabase.setDataChange(this.challenges);
    this.dataSource = new TableDataSource(this.exampleDatabase, this.paginator, this.sort);
  }
}


