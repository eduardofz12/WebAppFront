import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {HttpClient} from '@angular/common/http';
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
import { CardStore } from 'src/app/interfaces/cardstore';
import { ListSchema } from 'src/app/interfaces/listschema';
import { ListComponent } from 'src/app/list/list.component';

@Component({
  selector: 'app-innovation-project-activity-edit',
  templateUrl: './innovation-project-activity-edit.component.html',
  styleUrls: ['./innovation-project-activity-edit.component.css']
})
export class InnovationProjectActivityEditComponent implements OnInit {
  
  cardStore!: CardStore;
  lists!: ListSchema[];

  loading = false;

  setLoading(loading: boolean) {
    this.loading = loading;
  }

  constructor() { }

  setMockData(): void {
    this.cardStore = new CardStore();
    const lists: ListSchema[] = [
      {
        id: 1,
        name: 'To Do',
        cards: []
      },
      {
        id: 2,
        name: 'Doing',
        cards: []
      },
      {
        id: 3,
        name: 'To Test',
        cards: []
      },
      {
        id: 4,
        name: 'Testing',
        cards: []
      },
      {
        id:5,
        name: 'Done',
        cards: []
      }
    ]
    this.lists = lists;
  }

  ngOnInit() {
    this.setMockData();
  }

}
