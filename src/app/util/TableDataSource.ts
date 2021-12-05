import { DataSource } from "@angular/cdk/collections";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { BehaviorSubject, merge, Observable } from "rxjs";
import { map } from "rxjs/operators";
import { DataService } from "../services/data.service";

export class TableDataSource extends DataSource<any> {
    _filterChange = new BehaviorSubject('');
    data !: any[];

    get filter(): string {
        return this._filterChange.value;
    }

    set filter(filter: string) {
        this._filterChange.next(filter);
    }

    filteredData: any[] = [];
    renderedData: any[] = [];

    constructor(public _exampleDatabase: DataService,
        public _paginator: MatPaginator,
        public _sort: MatSort) {
        super();
        // Reset to the first page when the user changes the filter.
        this._filterChange.subscribe(() => this._paginator.pageIndex = 0);
    }

    /** Connect function called by the table to retrieve one stream containing the data to render. */
    connect(): Observable<any[]> {
        // Listen for any changes in the base data, sorting, filtering, or pagination
        const displayDataChanges = [
            this._exampleDatabase.dataChange,
            this._sort.sortChange,
            this._filterChange,
            this._paginator.page
        ];

        return merge(...displayDataChanges).pipe(map(() => {
            // Filter data
            this.filteredData = this._exampleDatabase.data.slice().filter((any: any) => {
                const searchStr = (any.id.toString()).toLowerCase();
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

    disconnect() { }


    /** Returns a sorted copy of the database data. */
    sortData(data: any[]): any[] {
        if (!this._sort.active || this._sort.direction === '') {
            return data;
        }

        return data.sort((a, b) => {
            let propertyA: number | string | Date = '';
            let propertyB: number | string | Date = '';

            // switch (this._sort.active) {
            //     case 'id': [propertyA, propertyB] = [a.id, b.id]; break;
            //     case 'titulo': [propertyA, propertyB] = [a.titulo, b.titulo]; break;
            //     case 'situacao': [propertyA, propertyB] = [a.situacao, b.situacao]; break;
            //     case 'dataInclusao': [propertyA, propertyB] = [a.dataInclusao, b.dataInclusao]; break;
            //     case 'updated_at': [propertyA, propertyB] = [a.dataFinal, b.dataFinal]; break;
            // }

            propertyA = a[this._sort.active];
            propertyB = b[this._sort.active];

            const valueA = isNaN(+propertyA) ? propertyA : +propertyA;
            const valueB = isNaN(+propertyB) ? propertyB : +propertyB;

            return (valueA < valueB ? -1 : 1) * (this._sort.direction === 'asc' ? 1 : -1);
        });
    }
}