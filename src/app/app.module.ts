import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { EmployeeDetailsComponent } from './employee-details/employee-details.component';
import { CategoryComponent } from './category/category.component';
import { SkillComponent } from './skill/skill.component';
import { AssessmentComponent } from './assessment/assessment.component';
import { AssessmentTableComponent } from './assessment-table/assessment-table.component';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { ViewallassessmentComponent } from './assessment/viewallassessment/viewallassessment.component';
import { MyassessmenthistoryComponent } from './myassessmenthistory/myassessmenthistory.component';
import { CoachComponent } from './coach/coach.component';
import { RatingChangesComponent } from './rating-changes/rating-changes.component';
import { TeamAverageComponent } from './team-average/team-average.component';
import { PersonalTargetComponent } from './personal-target/personal-target.component';
import { ComparisonComponent } from './comparison/comparison.component';
import { SearchComponent } from './search/search.component';
import { ClientfeedbackComponent } from './clientfeedback/clientfeedback.component';
import { AssistanceComponent } from './assistance/assistance.component';
import { SearchbypersonaltargetComponent } from './searchbypersonaltarget/searchbypersonaltarget.component';
import { ProfileRoleComponent } from './profile-role/profile-role.component';

@NgModule({
  declarations: [
    AppComponent,
    EmployeeDetailsComponent,
    CategoryComponent,
    SkillComponent,
    AssessmentComponent,
    AssessmentTableComponent,
    LoginComponent,
    HomeComponent,
    ViewallassessmentComponent,
    MyassessmenthistoryComponent,
    CoachComponent,
    RatingChangesComponent,
    TeamAverageComponent,
    PersonalTargetComponent,
    ComparisonComponent,
    SearchComponent,
    ClientfeedbackComponent,
    AssistanceComponent,
    SearchbypersonaltargetComponent,
    ProfileRoleComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    FormsModule,
    CommonModule,
    FormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
