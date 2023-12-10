import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChallengeEditComponent } from './challenge/challenge-edit/challenge-edit.component';
import { ChallengeSearchComponent } from './challenge/challenge-search/challenge-search.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { PageNotFoundComponent } from './dialogs/page-not-found/page-not-found.component';
import { HomeComponent } from './home/home.component';
import { IdeaEditComponent } from './idea/idea-edit/idea-edit.component';
import { IdeaSearchComponent } from './idea/idea-search/idea-search.component';
import { InnovationProjectEditComponent } from './innovationProject/innovation-project-edit/innovation-project-edit.component';
import { InnovationProjectManageComponent } from './innovationProject/innovation-project-manage/innovation-project-manage.component';
import { InnovationProjectSearchComponent } from './innovationProject/innovation-project-search/innovation-project-search.component';
import { InnovationProjectActivityEditComponent } from './innovationProjectActivity/innovation-project-activity-edit/innovation-project-activity-edit.component';
import { InnovationProjectActivitySearchComponent } from './innovationProjectActivity/innovation-project-activity-search/innovation-project-activity-search.component';
import { LoginComponent } from './login/login.component';
import { OrganizationEditComponent } from './organization/organization-edit/organization-edit.component';
import { OrganizationProfileComponent } from './organization/organization-profile/organization-profile.component';
import { OrganizationSearchComponent } from './organization/organization-search/organization-search.component';
import { PartnerEntityEditComponent } from './partnerEntity/partner-entity-edit/partner-entity-edit.component';
import { PartnerEntityProfileComponent } from './partnerEntity/partner-entity-profile/partner-entity-profile.component';
import { PartnerEntitySearchComponent } from './partnerEntity/partner-entity-search/partner-entity-search.component';
import { ResearcherEditComponent } from './researcher/researcher-edit/researcher-edit.component';
import { ResearcherProfileComponent } from './researcher/researcher-profile/researcher-profile.component';
import { ResearcherSearchComponent } from './researcher/researcher-search/researcher-search.component';
import { AuthGuardService } from './services/auth-guard.service';
import { SolutionEditComponent } from './solution/solution-edit/solution-edit.component';
import { SolutionSearchComponent } from './solution/solution-search/solution-search.component';

const routes: Routes = [
  {path: '', pathMatch: 'full', redirectTo: 'login'},
  {path: 'login', component: LoginComponent},
  {path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuardService], children: [
    {path: 'home', component: HomeComponent},
    {path: 'challenge', component: ChallengeSearchComponent},
    {path: 'challenge/edit', component: ChallengeEditComponent},
    {path: 'challenge/edit/:id', component: ChallengeEditComponent},
    {path: 'challenge/solution', component: SolutionSearchComponent},
    {path: 'challenge/solution/edit', component: SolutionEditComponent},
    {path: 'idea', component: IdeaSearchComponent},
    {path: 'idea/edit', component: IdeaEditComponent},
    {path: 'idea/edit/:id', component: IdeaEditComponent},
    {path: 'project', component: InnovationProjectSearchComponent},
    {path: 'project/edit', component: InnovationProjectEditComponent},
    {path: 'project/manage/:id', component: InnovationProjectManageComponent},
    {path: 'project/activity', component: InnovationProjectActivitySearchComponent},
    {path: 'project/activity/edit', component: InnovationProjectActivityEditComponent},
    {path: 'organization', component: OrganizationSearchComponent},
    {path: 'organization/edit', component: OrganizationEditComponent},
    {path: 'organization/profile', component: OrganizationProfileComponent},
    {path: 'partner', component: PartnerEntitySearchComponent},
    {path: 'partner/edit', component: PartnerEntityEditComponent},
    {path: 'partner/profile', component: PartnerEntityProfileComponent},
    {path: 'researcher', component: ResearcherSearchComponent},
    {path: 'researcher/edit', component: ResearcherEditComponent},
    {path: 'researcher/profile', component: ResearcherProfileComponent}
  ]},
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
