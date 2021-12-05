import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { NavigationStart, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { DialogAtividadeEditComponent } from '../dialogs/dialog-atividade-edit/dialog-atividade-edit.component';
import { Activity } from '../interfaces/activity';
import { CardSchema } from '../interfaces/cardschema';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css']
})
export class CardComponent implements OnInit {

  @Input() card!: Activity;
  @Input() listNumber!: any;
  @Output() cardUpdated = new EventEmitter<Activity>();

  constructor(public dialog: MatDialog,
              private router: Router) {}
              
  ngOnInit() {}

  dragStart(ev : any) {
    ev.dataTransfer.setData("card", JSON.stringify(this.card));
    ev.dataTransfer.setData("id", ev.target.id);
    ev.dataTransfer.setData("listAntiga", this.listNumber);
  }

  createAtividade(id: any) {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.width = "50%";
    dialogConfig.autoFocus = true;

    dialogConfig.data = {
      id: id
    };

    const dialogRef = this.dialog.open(DialogAtividadeEditComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        this.cardUpdated.emit(result);
      }
    });

    this.router.events
     .pipe(
       filter((event => event instanceof NavigationStart)),
       filter(() => !!dialogRef)
     )
     .subscribe(() => {
       dialogRef.close();
     });
  }
}
