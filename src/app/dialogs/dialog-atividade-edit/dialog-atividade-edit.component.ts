import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Activity } from 'src/app/interfaces/activity';
import { Challenge } from 'src/app/interfaces/challenge';
import { User } from 'src/app/interfaces/user';
import { ActivityService } from 'src/app/services/activity.service';
import { AuthService } from 'src/app/services/auth.service';
import { ChallengeService } from 'src/app/services/challenge.service';
import { InnovationProjectService } from 'src/app/services/innovation-project.service';
import { SituacaoService } from 'src/app/services/situacao.service';
import { UserService } from 'src/app/services/user.service';
import { environment } from 'src/environments/environment';
import { DialogChallengeDetailsComponent } from '../dialog-challenge-details/dialog-challenge-details.component';

@Component({
  selector: 'app-dialog-atividade-edit',
  templateUrl: './dialog-atividade-edit.component.html',
  styleUrls: ['./dialog-atividade-edit.component.css']
})
export class DialogAtividadeEditComponent implements OnInit {
  form!: FormGroup;
  atividade!: Activity;
  error = '';
  loading = false;
  id!: string;
  statusCod!: any;
  statusDesc!: any;
  projetoCod!: any;
  usuario!: User;
  minDate = environment.minDate;
  maxDate = environment.maxDate;
  allStatus = environment.status;

  constructor(private dialogRef: MatDialogRef<DialogChallengeDetailsComponent>,
              @Inject(MAT_DIALOG_DATA) _data: any,
              private router: Router,
              private activityService :ActivityService,
              private snackBar: MatSnackBar,
              private activatedRoute: ActivatedRoute,
              private projectService: InnovationProjectService,
              private usuarioService: UserService,
              private situacaoService: SituacaoService,
              private authService: AuthService) {
                this.id = _data.id;
                this.statusCod = _data.statusCod;
                this.statusDesc = _data.statusDesc;
                this.projetoCod = _data.projetoCod;
  }

  async ngOnInit() {

    try {
      this.loading = true;
      this.form = new FormGroup({
        titulo: new FormControl(''),
        descricao: new FormControl(''),
        ideiaCodigo: new FormControl(''),
        ideiaTitulo: new FormControl(''),
        responsavelCodigo: new FormControl(''),
        responsavelNome: new FormControl(''),
        dataInicio: new FormControl(''),
        dataTermino: new FormControl(''),
        dataInclusao: new FormControl({disabled: true, value: ''}),
        statusF: new FormControl({disabled: true, value: this.statusDesc})
      });

      if (this.id != null) {
        this.atividade = await this.activityService.getActivityByIdPromise(this.id);
        this.loadCard();
      }
    } catch (error) {

    } finally{
      this.loading = false;
    }
  }

  get f() { return this.form.controls; }

  save() {
    this.loading = true;

    let json: Activity = this.activityService.createActivityObject(this.atividade ? this.atividade.id : null,
      this.f.titulo.value,
      this.f.descricao.value,
      this.f.dataInicio.value,
      this.f.dataTermino.value,
      this.atividade ? this.atividade.status : this.statusCod,
      new Date,
      this.authService.currentUserValue,
      this.projectService.createInovationProjectObject(this.atividade ? this.atividade.projetoInovacao.id : this.projetoCod),
      new Date,
      this.f.responsavelCodigo.value ? this.usuarioService.createUserObject(this.f.responsavelCodigo.value) : null
    );

    this.activityService.saveActivity(json)
      .subscribe(
        data => {
          this.atividade = data;
          this.loading = false;
          if (this.atividade && this.atividade.id) {
            this.openSnackBar("Atividade salva com sucesso.", "Fechar");
            this.dialogRef.close(this.atividade);
          }
        },
        error => {
          this.error = error;
          this.loading = false;
          this.openSnackBar("Erro ao salvar atividade.", "Fechar");
        }
      );
  }

  close() {
    this.dialogRef.close();
  }

  findResponsavel(event : any) {
    if(!event.target.value){
      return;
    }

    this.loading = true;
    this.usuarioService.getUserById(event.target.value)
      .subscribe(
        data => {
          this.usuario = data;
          if(this.usuario) {
            this.f.responsavelNome.setValue(this.usuario.name);
          } else {
            this.f.responsavelCodigo.setValue("");
            this.openSnackBar("Usuário não encontrado.", "Fechar");
          }
          this.loading = false;
        },
        error => {
          this.error = error;
          this.openSnackBar("Usuário não encontrado.", "Fechar");
          this.loading = false;
          this.f.responsavelNome.setValue("");
        });
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 5000,
    });
  }

  loadCard(){
    this.f.titulo.setValue(this.atividade.titulo);
    this.f.descricao.setValue(this.atividade.descricao);
    if(this.atividade.responsavel != null) {
      this.f.responsavelCodigo.setValue(this.atividade.responsavel.id);
      this.f.responsavelNome.setValue(this.atividade.responsavel.name);
    }
    if(this.atividade.dataInicio) {
      this.f.dataInicio.setValue(this.atividade.dataInicio);
      this.f.dataInicio.disable();
    }
    if(this.atividade.dataTermino) {
      this.f.dataTermino.setValue(this.atividade.dataTermino);
      this.f.dataTermino.disable();
    }
    this.f.dataInclusao.setValue(this.atividade.dataInclusao);
    this.f.statusF.setValue(this.allStatus[this.atividade.status].descricao);
  }

}
