import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoginComponent } from './login/login.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RegistrationComponent } from './registration/registration.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NavComponent } from './nav/nav.component';
import { LayoutModule } from '@angular/cdk/layout';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { HomeComponent } from './home/home.component';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatMenuModule } from '@angular/material/menu';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ChallengeSearchComponent } from './challenge/challenge-search/challenge-search.component';
import { ChallengeEditComponent } from './challenge/challenge-edit/challenge-edit.component';
import { PartnerEntitySearchComponent } from './partnerEntity/partner-entity-search/partner-entity-search.component';
import { PartnerEntityProfileComponent } from './partnerEntity/partner-entity-profile/partner-entity-profile.component';
import { PartnerEntityEditComponent } from './partnerEntity/partner-entity-edit/partner-entity-edit.component';
import { OrganizationSearchComponent } from './organization/organization-search/organization-search.component';
import { OrganizationProfileComponent } from './organization/organization-profile/organization-profile.component';
import { OrganizationEditComponent } from './organization/organization-edit/organization-edit.component';
import { ResearcherEditComponent } from './researcher/researcher-edit/researcher-edit.component';
import { ResearcherProfileComponent } from './researcher/researcher-profile/researcher-profile.component';
import { ResearcherSearchComponent } from './researcher/researcher-search/researcher-search.component';
import { UserSearchComponent } from './user/user-search/user-search.component';
import { UserProfileComponent } from './user/user-profile/user-profile.component';
import { UserEditComponent } from './user/user-edit/user-edit.component';
import { SolutionEditComponent } from './solution/solution-edit/solution-edit.component';
import { SolutionSearchComponent } from './solution/solution-search/solution-search.component';
import { IdeaSearchComponent } from './idea/idea-search/idea-search.component';
import { IdeaEditComponent } from './idea/idea-edit/idea-edit.component';
import { InnovationProjectEditComponent } from './innovationProject/innovation-project-edit/innovation-project-edit.component';
import { InnovationProjectSearchComponent } from './innovationProject/innovation-project-search/innovation-project-search.component';
import { InnovationProjectActivitySearchComponent } from './innovationProjectActivity/innovation-project-activity-search/innovation-project-activity-search.component';
import { InnovationProjectActivityEditComponent } from './innovationProjectActivity/innovation-project-activity-edit/innovation-project-activity-edit.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatDialogModule } from '@angular/material/dialog';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import {DataService} from './services/data.service';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatNativeDateModule } from '@angular/material/core';
import {MatSelectModule} from '@angular/material/select';
import { DialogIncorrectUserComponent } from './dialogs/dialog-incorrect-user/dialog-incorrect-user.component';
import { DialogSessionOutComponent } from './dialogs/dialog-session-out/dialog-session-out.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { UserDateAdapter } from './util/UserDateAdapter';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { NgxLoadingModule } from 'ngx-loading';
import { DialogChallengeDetailsComponent } from './dialogs/dialog-challenge-details/dialog-challenge-details.component';
import { ListComponent } from './list/list.component';
import { CardComponent } from './card/card.component';
import { InnovationProjectManageComponent } from './innovationProject/innovation-project-manage/innovation-project-manage.component';
import { PageNotFoundComponent } from './dialogs/page-not-found/page-not-found.component';
import { DialogAtividadeEditComponent } from './dialogs/dialog-atividade-edit/dialog-atividade-edit.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegistrationComponent,
    NavComponent,
    HomeComponent,
    DashboardComponent,
    ChallengeSearchComponent,
    ChallengeEditComponent,
    PartnerEntitySearchComponent,
    PartnerEntityProfileComponent,
    PartnerEntityEditComponent,
    OrganizationSearchComponent,
    OrganizationProfileComponent,
    OrganizationEditComponent,
    ResearcherEditComponent,
    ResearcherProfileComponent,
    ResearcherSearchComponent,
    UserSearchComponent,
    UserProfileComponent,
    UserEditComponent,
    SolutionEditComponent,
    SolutionSearchComponent,
    IdeaSearchComponent,
    IdeaEditComponent,
    InnovationProjectEditComponent,
    InnovationProjectSearchComponent,
    InnovationProjectActivitySearchComponent,
    InnovationProjectActivityEditComponent,
    DialogIncorrectUserComponent,
    DialogSessionOutComponent,
    DialogChallengeDetailsComponent,
    ListComponent,
    CardComponent,
    InnovationProjectManageComponent,
    PageNotFoundComponent,
    DialogAtividadeEditComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatToolbarModule,
    FormsModule,
    HttpClientModule,
    LayoutModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatGridListModule,
    MatMenuModule,
    MatExpansionModule,
    MatDialogModule,
    MatPaginatorModule,
    MatSortModule,
    MatTableModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    MatCheckboxModule,
    MatSnackBarModule,
    NgxLoadingModule.forRoot({})
  ],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'pt-br' },
      DataService,
      { provide: DateAdapter, useClass: UserDateAdapter }],
  bootstrap: [AppComponent],
})
export class AppModule { }
