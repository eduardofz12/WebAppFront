import {Component, OnInit} from '@angular/core';
import {CardStore} from 'src/app/interfaces/cardstore';
import {ListSchema} from 'src/app/interfaces/listschema';

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
    this.lists = [
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
        id: 5,
        name: 'Done',
        cards: []
      }
    ];
  }

  ngOnInit() {
    this.setMockData();
  }

}
