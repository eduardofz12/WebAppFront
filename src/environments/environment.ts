// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080/api/v1/',
  usuariosUrl: 'usuarios',
  challengeUrl: 'desafios',
  activityUrl: 'atividades',
  ideaUrl: 'ideias',
  situacaoUrl: 'situacoes',
  innovationProjectUrl: 'projetos',
  minDate: new Date(2021, 0, 1),
  maxDate: new Date(2050, 11, 31),
  situacoes: [
    {value: '0', viewValue: 'Todas'},
    {value: '1', viewValue: 'Aberto'},
    {value: '2', viewValue: 'Fechado'}
  ],
  status: [
    {id: '1', descricao: 'EM ANÁLISE'},
    {id: '2', descricao: 'PARA FAZER'},
    {id: '3', descricao: 'EM PROGRESSO'},
    {id: '4', descricao: 'FINALIZADO'}
  ]
};

export const MY_FORMATS = {
  parse: {
      dateInput: 'LL'
  },
  display: {
      dateInput: 'YYYY-MM-DD',
      monthYearLabel: 'YYYY',
      dateA11yLabel: 'LL',
      monthYearA11yLabel: 'YYYY'
  }
};
/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
