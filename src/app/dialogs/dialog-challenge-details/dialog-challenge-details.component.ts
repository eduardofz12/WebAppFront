import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Challenge } from 'src/app/interfaces/challenge';
import { ChallengeService } from 'src/app/services/challenge.service';
import { NgxLoadingComponent } from 'ngx-loading';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dialog-challenge-details',
  templateUrl: './dialog-challenge-details.component.html',
  styleUrls: ['./dialog-challenge-details.component.css']
})
export class DialogChallengeDetailsComponent implements OnInit {

  form!: FormGroup;
  challenge!: Challenge;
  error = '';
  loading = false;
  id!: string;

  constructor(private dialogRef: MatDialogRef<DialogChallengeDetailsComponent>,
              @Inject(MAT_DIALOG_DATA) _data: any,
              private challengeService: ChallengeService,
              private router: Router) {
                this.id = _data.id;
  }

  async ngOnInit() {
    this.form = new FormGroup({
      titulo: new FormControl(''),
      descricao: new FormControl(''),
      dataInicial: new FormControl(''),
      dataFinal: new FormControl('')
    });

    this.loading = true;

    if (this.id) {
      this.challenge = await this.challengeService.getChallengeByIdPromise(this.id)
    }
    
    this.loading = false;
  }

  get f() { return this.form.controls; }

  save() {
    this.dialogRef.close(this.form.value);
  }

  close() {
    this.dialogRef.close();
  }

  openDialog() {
    throw new Error('Method not implemented.');
  }

  goToIdea() {
    this.router.navigate(['/dashboard/idea/edit/'], {state : {data: this.challenge.id}});
  }
}
