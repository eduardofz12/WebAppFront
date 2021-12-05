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
import { Challenge } from 'src/app/interfaces/challenge';
import { ChallengeService } from 'src/app/services/challenge.service';

@Component({
  selector: 'app-solution-edit',
  templateUrl: './solution-edit.component.html',
  styleUrls: ['./solution-edit.component.css']
})
export class SolutionEditComponent implements OnInit {

  form!: FormGroup;
  subscription!: Subscription;
  challenges = Array<Challenge>();
  loading = false;
  error = '';
  isChallengeSelected = false;

  constructor(private snackBar: MatSnackBar,
    private challengeService: ChallengeService) {
  }

  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort!: MatSort;

  ngOnInit() {
    this.form = new FormGroup({
      titulo: new FormControl(''),
      descricao: new FormControl(''),
      desafio: new FormControl(''),
      dataInicial: new FormControl(''),
      dataFinal: new FormControl('')
    });
    console.log(history.state.data);
    this.loading = true;
    if (history.state?.data) {
      this.challengeService.getChallengeById(history.state.data)
        .subscribe(
          data => {
            this.challenges.push(data);
            this.isChallengeSelected = true;
            this.f.desafio.setValue(this.challenges[0].id);
            this.loading = false;
          },
          error => {
            this.error = error;
            this.loading = false;
            this.openDialog();
          });
    } else {
      let params = new HttpParams({
        fromObject:
        {
          titulo: '',
          situacao: environment.situacoes[1].value
        }
      });
  
      this.challengeService.getChallenges(params)
        .subscribe(
          data => {
            this.challenges = data;
            this.loading = false;
          },
          error => {
            this.error = error;
            this.loading = false;
            this.openDialog();
          });
    }
  }

  get f() { return this.form.controls; }

  onSubmit() {
    this.openSnackBar('Promoção cadastrada', 'Fechar');
    this.form.reset();
  }

  openDialog() {
    throw new Error('Method not implemented.');
  }

  public hasError = (controlName: string, errorName: string) => {
    return this.form.controls[controlName].hasError(errorName);
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 3000,
    });
  }
  
}

