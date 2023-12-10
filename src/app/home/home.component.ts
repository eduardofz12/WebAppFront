import { Component } from '@angular/core';
import { map } from 'rxjs/operators';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  /** Based on the screen size, switch from standard to one column per row */
  cards;

  constructor(private breakpointObserver: BreakpointObserver) {
    this.cards = breakpointObserver.observe(Breakpoints.Handset).pipe(
      map(({ matches }) => {
        if (matches) {
          return [
            { title: 'Projeto de inovação', cols: 1, rows: 1 },
            { title: 'Desafio', cols: 1, rows: 1 },
            { title: 'Ideias cadastradas', cols: 1, rows: 1 },
            { title: 'Desafio', cols: 1, rows: 1 }
          ];
        }

        return [
          { title: 'Projeto de inovação', cols: 2, rows: 1 },
          { title: 'Desafio', cols: 1, rows: 1 },
          { title: 'Ideias cadastradas', cols: 1, rows: 2 },
          { title: 'Desafio', cols: 1, rows: 1 }
        ];
      })
    );
  }
}
