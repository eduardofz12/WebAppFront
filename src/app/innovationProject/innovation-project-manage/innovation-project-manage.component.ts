import { HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Activity } from 'src/app/interfaces/activity';
import { CardStore } from 'src/app/interfaces/cardstore';
import { InnovationProject } from 'src/app/interfaces/innovation-project';
import { ListSchema } from 'src/app/interfaces/listschema';
import { Situacao } from 'src/app/interfaces/situacao';
import { User } from 'src/app/interfaces/user';
import { ActivityService } from 'src/app/services/activity.service';
import { AuthService } from 'src/app/services/auth.service';
import { InnovationProjectService } from 'src/app/services/innovation-project.service';
import { SituacaoService } from 'src/app/services/situacao.service';
import { UserService } from 'src/app/services/user.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-innovation-project-manage',
  templateUrl: './innovation-project-manage.component.html',
  styleUrls: ['./innovation-project-manage.component.css']
})
export class InnovationProjectManageComponent implements OnInit {

  form!: FormGroup;
  cardStore!: CardStore;
  lists!: ListSchema[];
  projeto !: InnovationProject;
  loading = false;
  id!: any;
  error = '';
  usuario!: User;
  minDate = environment.minDate;
  maxDate = environment.maxDate;
  situacoes = Array<Situacao>();
  cards1 = Array<Activity>();
  cards2 = Array<Activity>();
  cards3 = Array<Activity>();
  cards4 = Array<Activity>();
  allAtividades !: Activity[];
  naoEncontrado = false;
  card !: Activity;

  setLoading(loading: boolean) {
    this.loading = loading;
  }

  constructor(private snackBar: MatSnackBar,
              private activatedRoute: ActivatedRoute,
              private router: Router,
              private projectService: InnovationProjectService,
              private usuarioService: UserService,
              private situacaoService: SituacaoService,
              private activityService: ActivityService,
              private authService: AuthService) { }

  async setMockData(): Promise<void> {

    let params = new HttpParams({
      fromObject: {
        projetoId: this.projeto.id.toString()
      }
    });
    this.allAtividades = await this.activityService.getActivitysPromise(params);
    this.cardStore = new CardStore();
    const lists: ListSchema[] = [
      {
        id: 0,
        name: 'EM ANÁLISE',
        cards: this.cards1
      },
      {
        id: 1,
        name: 'PARA FAZER',
        cards: this.cards2
      },
      {
        id: 2,
        name: 'EM PROGRESSO',
        cards: this.cards3
      },
      {
        id: 3,
        name: 'FINALIZADO',
        cards: this.cards4
      }
    ]
    this.lists = lists;
    this.setLists();
  }

  setLists() {
    if (this.allAtividades) {
      this.allAtividades.forEach((currentValue) => {
        this.lists[currentValue.status].cards.push(currentValue);
      });
    }
  }

  updateLists(json :object){
    this.loading = true;
    let object = Object.values(json);
    this.card = JSON.parse(object[0]);
    let oldList = object[1];
    let newList = object[2];
    
    let jsonEnvio: Activity = this.activityService.createActivityObject(this.card.id,
      this.card.titulo,
      this.card.descricao,
      this.card.dataInicio,
      this.card.dataTermino,
      newList,
      new Date,
      this.authService.currentUserValue,
      this.projectService.createInovationProjectObject(this.card.projetoInovacao.id),
      this.card.dataInclusao,
      this.f.responsavelCodigo.value ? this.usuarioService.createUserObject(this.f.responsavelCodigo.value) : null
    );

    this.activityService.saveActivity(jsonEnvio)
      .subscribe(
        data => {
          this.card = data;
          this.loading = false;
          if (this.card && this.card.id) {
            this.lists[oldList].cards.forEach((currentValue, index) => {
              if(currentValue.id == this.card.id) {
                this.lists[oldList].cards.splice(index, 1);
              }
            });
            this.lists[newList].cards.push(this.card);
            this.openSnackBar("Atividade atualizada com sucesso.", "Fechar");
          }
        },
        error => {
          this.error = error;
          this.loading = false;
          this.openSnackBar("Erro ao atualizar atividade.", "Fechar");
        }
      );
  }

  async ngOnInit() {
    try {

      this.loading = true;

      this.form = new FormGroup({
        titulo: new FormControl({ disabled: true, value: '' }),
        descricao: new FormControl({ disabled: true, value: '' }),
        ideiaCodigo: new FormControl({ disabled: true, value: '' }),
        ideiaTitulo: new FormControl({ disabled: true, value: '' }),
        responsavelCodigo: new FormControl(''),
        responsavelNome: new FormControl(''),
        dataInicio: new FormControl(''),
        dataTermino: new FormControl(''),
        dataInclusao: new FormControl({ disabled: true, value: '' }),
        situacao: new FormControl('')
      });


      this.situacoes = await this.situacaoService.getAllSituacoesPromise();

      this.activatedRoute.paramMap.subscribe(params => {
        this.id = params.get('id');
      });

      if (this.id) {

        this.loading = true;
        this.projectService.getInovationProjectById(this.id)
          .subscribe(
            data => {
              this.projeto = data;
              if (this.projeto) {
                this.loadCard();
                this.setMockData();
              }
              this.loading = false;
            },
            error => {
              this.error = error;
              this.naoEncontrado = true;
              this.loading = false;
              this.openSnackBar("Projeto não encontrado", "Fechar");
            });
      }
    } catch (error) {
      this.naoEncontrado = true;
      this.loading = false;
    }
  }

  onSubmit() {
    this.loading = true;

    let json: InnovationProject = this.projectService.createInovationProjectObject(this.projeto.id,
      this.projeto.titulo,
      this.projeto.descricao,
      this.projeto.ideia,
      this.usuarioService.createUserObject(this.f.responsavelCodigo.value),
      this.f.dataInicio.value,
      this.f.dataTermino.value,
      this.projeto.usuarioInclusao,
      this.projeto.dataInclusao,
      this.situacaoService.createSituacaoObject(this.f.situacao.value));

    this.projectService.saveInovationProject(json)
      .subscribe(
        data => {
          this.projeto = data;
          this.loading = false;
          if (this.projeto && this.projeto.id) {
            this.openSnackBar("Alterações salvas com sucesso.", "Fechar");
          }
        },
        error => {
          this.error = error;
          this.loading = false;
          this.openSnackBar("Erro ao salvar alterações.", "Fechar");
        }
      );
  }

  loadCard() {
    try {
      this.f.titulo.setValue(this.projeto.titulo);
      this.f.descricao.setValue(this.projeto.descricao);
      this.f.ideiaCodigo.setValue(this.projeto.ideia.id);
      this.f.ideiaTitulo.setValue(this.projeto.ideia.titulo);
      this.f.responsavelCodigo.setValue(this.projeto.responsavel.id);
      this.f.responsavelNome.setValue(this.projeto.responsavel.name);
      if (this.projeto.dataInicio) {
        this.f.dataInicio.setValue(this.projeto.dataInicio);
        this.f.dataInicio.disable();
      }
      if (this.projeto.dataTermino) {
        this.f.dataTermino.setValue(this.projeto.dataTermino);
        this.f.dataTermino.disable();
      }
      this.f.situacao.setValue(this.projeto.situacao.id);
      this.f.dataInclusao.setValue(this.projeto.dataInclusao);
    } catch (error) {
      this.openSnackBar("Projeto está com dados inválidos, é necessário entrar em contato com o administrador do sistema.", "Fechar", 10000);
      this.loading = false;
      this.router.navigate(["/dashboard/home"]);
    }
  }

  openSnackBar(message: string, action: string, time?: number) {
    this.snackBar.open(message, action, {
      duration: time ? time : 5000,
    });
  }


  get f() { return this.form.controls; }

  findResponsavel(event: any) {
    if (!event.target.value) {
      return;
    }

    this.loading = true;
    this.usuarioService.getUserById(event.target.value)
      .subscribe(
        data => {
          this.usuario = data;
          if (this.usuario) {
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

}
