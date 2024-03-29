import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AssessmentTableComponent } from './assessment-table/assessment-table.component';
import { ViewallassessmentComponent } from './assessment/viewallassessment/viewallassessment.component';
import { CoachComponent } from './coach/coach.component';
import { EmployeeDetailsComponent } from './employee-details/employee-details.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { MyassessmenthistoryComponent } from './myassessmenthistory/myassessmenthistory.component';
import { PersonalTargetComponent } from './personal-target/personal-target.component';
import { RatingChangesComponent } from './rating-changes/rating-changes.component';
import { TeamAverageComponent } from './team-average/team-average.component';
import { ComparisonComponent } from './comparison/comparison.component';
import { SearchComponent } from './search/search.component';
import { ClientfeedbackComponent } from './clientfeedback/clientfeedback.component';
import { AssistanceComponent } from './assistance/assistance.component';
import { SearchbypersonaltargetComponent } from './searchbypersonaltarget/searchbypersonaltarget.component';
import { TargetRoleComponent } from './target-role/target-role.component';



const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'employees/:id', component: EmployeeDetailsComponent },
  { path: 'assessment', component: AssessmentTableComponent },
  { path: ':id/assessment', component: AssessmentTableComponent },
  { path: 'home', component: HomeComponent },
  { path: 'viewallassessment', component: ViewallassessmentComponent },
  { path: 'myassessmenthistory/:id', component: MyassessmenthistoryComponent },
  { path: 'people', component: CoachComponent },
  { path: 'rating-changes/:id', component: RatingChangesComponent },
  { path: 'team-levels', component: TeamAverageComponent },
  { path: 'personal-target/:id', component: PersonalTargetComponent },
  { path: 'qualification-comparison', component: ComparisonComponent },
  { path: 'search', component:SearchComponent},
  { path: 'client-feedback/:id', component: ClientfeedbackComponent },
  { path: 'assistance', component: AssistanceComponent },
  { path: 'searchbypersonaltarget', component: SearchbypersonaltargetComponent },
  { path: 'target-role/:id', component: TargetRoleComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
}) 
export class AppRoutingModule { }
