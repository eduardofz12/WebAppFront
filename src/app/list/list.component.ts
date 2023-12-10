import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { NavigationStart, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { DialogAtividadeEditComponent } from '../dialogs/dialog-atividade-edit/dialog-atividade-edit.component';
import { Activity } from '../interfaces/activity';
import { CardSchema } from '../interfaces/cardschema';
import { CardStore } from '../interfaces/cardstore';
import { ListSchema } from '../interfaces/listschema';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit   {

  @Input() list !: ListSchema;
  @Input() cardStore !: CardStore;
  @Input() projectId !: number;
  @Output() loading = new EventEmitter<boolean>();
  @Output() updateLists = new EventEmitter<object>();

  card !: Activity;
  newStatus !: any;
  displayAddCard = false;

  constructor(public dialog: MatDialog,
              private router: Router) {}

  ngOnInit(): void {}

  toggleDisplayAddCard() {
    this.displayAddCard = !this.displayAddCard;
  }

  allowDrop($event :any) {
    $event.preventDefault();
  }

  setUpdatedCard(updatedCard : Activity) {
    if (updatedCard) {
      this.list.cards.forEach((currentValue, index) => {
        if(currentValue.id == updatedCard.id) {
          this.list.cards[index] = updatedCard;
        }
      });
    }
  }

  setUpdateCardStatus(card : Activity, oldList : number, newList: number) {
    this.updateLists.emit({card: JSON.stringify(card), oldList: oldList, newList : newList});
  }

  updateStatus($event :any) {
    try {
      this.loading.emit(true);
      $event.preventDefault();
      this.card = JSON.parse($event.dataTransfer.getData("card"));
      const listaAntiga = $event.dataTransfer.getData("listAntiga");
      this.list.cards;
      if(listaAntiga != this.list.id) {
        this.setUpdateCardStatus(this.card, listaAntiga, this.list.id)
      }
    } catch (error) {
      this.loading.emit(false);
    }
  }

  drop($event :any) {
    // $event.preventDefault();
    // this.card = JSON.parse($event.dataTransfer.getData("card"));
    // const listaAntiga = $event.dataTransfer.getData("listAntiga");
    // this.list.cards;
    // if(listaAntiga != this.list.id) {
    //   this.setUpdateCardStatus(this.card, listaAntiga, this.list.id)
    // }
    // this.newStatus = $event.target.id;
    // this.newStatus = this.newStatus.charAt(0);
    // const data = $event.dataTransfer.getData("id");
    // let target = $event.target;
    // const targetClassName = target.className;
    // while (target.className !== "list") {
    //   target = target.parentNode;
    // }
    // target = target.querySelector(".cards");
    // if (targetClassName === "card") {
    //   $event.target.parentNode.insertBefore(
    //     document.getElementById(data),
    //     $event.target
    //   );
    // } else if (targetClassName === "list__title") {
    //   if (target.children.length) {
    //     target.insertBefore(document.getElementById(data), target.children[0]);
    //   } else {
    //     target.appendChild(document.getElementById(data));
    //   }
    // } else {
    //   target.appendChild(document.getElementById(data));
    // }
  }

  createAtividade(statusCod: any, name: any) {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.width = "50%";
    dialogConfig.autoFocus = true;

    dialogConfig.data = {
      statusCod: statusCod,
      statusDesc: name,
      projetoCod: this.projectId
    };

    const dialogRef = this.dialog.open(DialogAtividadeEditComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        this.list.cards.push(result);
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
