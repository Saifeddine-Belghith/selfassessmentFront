import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AssessmentTableComponent } from './assessment-table/assessment-table.component';
import { ViewallassessmentComponent } from './assessment/viewallassessment/viewallassessment.component';
import { CoachComponent } from './coach/coach.component';
import { EmployeeDetailsComponent } from './employee-details/employee-details.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { MyassessmenthistoryComponent } from './myassessmenthistory/myassessmenthistory.component';


const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'employees/:id', component: EmployeeDetailsComponent },
  { path: 'assessment', component: AssessmentTableComponent },
  { path: ':id/assessment', component: AssessmentTableComponent },
  { path: 'home', component: HomeComponent },
  { path: 'viewallassessment', component: ViewallassessmentComponent },
  { path: 'myassessmenthistory', component: MyassessmenthistoryComponent },
  {path:'people', component: CoachComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
