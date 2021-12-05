import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {DataService} from '../../services/data.service';
import {HttpClient} from '@angular/common/http';
import {MatDialog} from '@angular/material/dialog';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {Issue} from '../../models/issue';
import {DataSource} from '@angular/cdk/collections';
import {BehaviorSubject, fromEvent, merge, Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import { FormGroup, FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import {MatSelectModule} from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { environment } from 'src/environments/environment';

interface situacao {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-solution-search',
  templateUrl: './solution-search.component.html',
  styleUrls: ['./solution-search.component.css']
})
export class SolutionSearchComponent implements OnInit {
  displayedColumns = ['id', 'title', 'state', 'actions'];
  exampleDatabase!: DataService;
  dataSource!: ExampleDataSource;
  index!: number;
  id!: number;
  minDate =  environment.minDate;
  maxDate = environment.maxDate;

  situacoes: situacao[] = [
    {value: '0', viewValue: 'Todas'},
    {value: '1', viewValue: 'Aberto'},
    {value: '2', viewValue: 'Fechado'}
  ];
  selectedSit = this.situacoes[0].value;

  form!: FormGroup;
  subscription!: Subscription;

  constructor(public httpClient: HttpClient,
              public dialog: MatDialog,
              public dataService: DataService) {
              }

  @ViewChild(MatPaginator, { static: true })
  paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true })
  sort!: MatSort;
  @ViewChild('filter', { static: true })
  filter!: ElementRef;

  ngOnInit() {
    this.form = new FormGroup({
      titulo: new FormControl(''),
      descricao: new FormControl(''),
      dataInicial: new FormControl(''),
      dataFinal: new FormControl('')
    });
  }

  refresh() {
    this.loadData();
  }

  onSubmit() {
    this.refreshTable();
    this.form.reset();
    this.loadData();
  }

  public hasError = (controlName: string, errorName: string) => {
    if(this.form != undefined) {
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
    this.dataSource = new ExampleDataSource(this.exampleDatabase, this.paginator, this.sort);
  }
}

export class ExampleDataSource extends DataSource<Issue> {
  _filterChange = new BehaviorSubject('');

  get filter(): string {
    return this._filterChange.value;
  }

  set filter(filter: string) {
    this._filterChange.next(filter);
  }

  filteredData: Issue[] = [];
  renderedData: Issue[] = [];

  constructor(public _exampleDatabase: DataService,
              public _paginator: MatPaginator,
              public _sort: MatSort) {
    super();
    // Reset to the first page when the user changes the filter.
    this._filterChange.subscribe(() => this._paginator.pageIndex = 0);
  }

  /** Connect function called by the table to retrieve one stream containing the data to render. */
  connect(): Observable<Issue[]> {
    // Listen for any changes in the base data, sorting, filtering, or pagination
    const displayDataChanges = [
      this._exampleDatabase.dataChange,
      this._sort.sortChange,
      this._filterChange,
      this._paginator.page
    ];
// 
    // this._exampleDatabase.getAllIssues();


    return merge(...displayDataChanges).pipe(map( () => {
        // Filter data
        this.filteredData = this._exampleDatabase.data.slice().filter((issue: Issue) => {
          const searchStr = (issue.id + issue.title + issue.created_at).toLowerCase();
          return searchStr.indexOf(this.filter.toLowerCase()) !== -1;
        });

        // Sort filtered data
        const sortedData = this.sortData(this.filteredData.slice());

        // Grab the page's slice of the filtered sorted data.
        const startIndex = this._paginator.pageIndex * this._paginator.pageSize;
        this.renderedData = sortedData.splice(startIndex, this._paginator.pageSize);
        return this.renderedData;
      }
    ));
  }

  disconnect() {}


  /** Returns a sorted copy of the database data. */
  sortData(data: Issue[]): Issue[] {
    if (!this._sort.active || this._sort.direction === '') {
      return data;
    }

    return data.sort((a, b) => {
      let propertyA: number | string = '';
      let propertyB: number | string = '';

      switch (this._sort.active) {
        case 'id': [propertyA, propertyB] = [a.id, b.id]; break;
        case 'title': [propertyA, propertyB] = [a.title, b.title]; break;
        case 'state': [propertyA, propertyB] = [a.state, b.state]; break;
        case 'created_at': [propertyA, propertyB] = [a.created_at, b.created_at]; break;
        case 'updated_at': [propertyA, propertyB] = [a.updated_at, b.updated_at]; break;
      }

      const valueA = isNaN(+propertyA) ? propertyA : +propertyA;
      const valueB = isNaN(+propertyB) ? propertyB : +propertyB;

      return (valueA < valueB ? -1 : 1) * (this._sort.direction === 'asc' ? 1 : -1);
    });
  }
}
