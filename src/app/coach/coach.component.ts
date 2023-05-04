import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { url } from 'inspector';
import { forkJoin, Observable } from 'rxjs';
import { Assessment } from '../assessment/assessment.model';
import { AssessmentService } from '../assessment/assessment.service';
import { Employee } from '../employee-details/employee.model';
import { EmployeeService } from '../employee-details/employee.service';
import { Skill } from '../skill/skill.model';
import { SkillService } from '../skill/skill.service';

@Component({
  selector: 'app-coach',
  templateUrl: './coach.component.html',
  styleUrls: ['./coach.component.css']
})
export class CoachComponent implements OnInit {
  coach!: Employee;
  coacheeList!: Employee[];
  manager!: Employee;
  employeeList!: Employee[];
  selectedCoacheeId: number | null = null;
  assessments: Assessment[] = [];
  skillNames: string[] = [];
  private apiUrl = 'http://10.66.12.54:8081/assessments';
  id: number | null = null;

  assessment!: Assessment;
  skills: Skill[] = [];
  skill!: Skill;
  idEmployee!: number;
  // private apiUrl = 'http://10.66.12.54:8081';
  employee!: Employee;
  idSkill!: number;
  name!: string;
  isCoach: boolean = false;
  isManager: boolean = false;

  skillName: string[] | undefined;
  errorMessage!: string;



  constructor(private employeeService: EmployeeService, private route: ActivatedRoute, private router: Router, public skillService: SkillService, private assessmentService: AssessmentService, private http: HttpClient) { }

  ngOnInit(): void {
    const idEmployee = parseInt(localStorage.getItem('idEmployee') || '');
    this.employeeService.getEmployeeById(idEmployee).subscribe(coach => {

      this.coach = coach;
      this.isCoach = this.coach?.isCoach;
      this.isManager = this.coach?.isManager;
      console.log("is coach", this.isCoach);
      console.log("is manager", this.isManager);
      if (this.isCoach === true) {
        this.getCoachees();
      }
      else if (this.isManager === true) {
        this.getEmployees();
      }
      // console.log("is coach", this.isCoach);
      // console.log("is manager", this.isManager);
    });
    this.id = parseInt(localStorage.getItem('idEmployee') || '');
    console.log('id of this employee' + this.id);
    const selectedCoacheeId = this.onCoacheeSelect;
    // this.name = this.getSkillName(this.assessment.idSkill);
    // console.log('skilllll name', this.name);
    const id = this.onCoacheeSelect;
    const url = `http://10.66.12.54:8081/assessments/employee/${this.selectedCoacheeId}`;
    // this.http.get<Assessment[]>(url).subscribe(data => {
    //   this.assessments = data;
    //   console.log('Our DATA IS', data);

    //   const skillObservables = data.map(assessment => {
    //     return this.skillService.getSkillById(assessment.idSkill);
    //   });

    //   forkJoin(skillObservables).subscribe(skills => {
    //     const skillNames = skills.map(skill => skill.skillName);
    //     console.log('Skill names:', skillNames);
    //   });
    //   const id = this.skillService.getSkillName(this.assessment.idSkill)

    // });
    this.name = this.getSkillName(this.assessment.idSkill);
    console.log('skilllll name', this.name);
    console.log("id selected :", this.assessment.idSkill);

  }



  getCoachees(): void {
    this.employeeService.getCoacheesByCoachId(this.coach.idEmployee).subscribe(coachees => {
      this.coacheeList = coachees;
    });
  }
  getEmployees(): void {
    // this.idEmployee = parseInt(localStorage.getItem('idEmployee') || '');
    this.employeeService.getEmployeesByManagerId(this.coach.idEmployee).subscribe(employees => {
      console.log("id employee", this.coach.idEmployee)
      this.employeeList = employees;
      console.log("list employee", this.employeeList)
    });
  }

  onCoacheeSelect(coacheeId: number): void {
    this.selectedCoacheeId = coacheeId;
    if (coacheeId) {
      this.employeeService.getAssessmentsByEmployeeId(coacheeId).subscribe(assessments => {
        this.assessments = assessments;
        this.errorMessage = '';
        const skillObservables = assessments.map(assessment => {
          return this.skillService.getSkillById(assessment.idSkill);
        });
        forkJoin(skillObservables).subscribe(skills => {
          const skillNames = skills.map(skill => skill.skillName);
          console.log('Skill names:', skillNames);
        });
      }, error => {
        this.errorMessage = error.message; // set the error message here
        this.assessments = []; // clear the assessments array
      }
      );
    } else {
      this.assessments = [];
    }
    const url = `http://10.66.12.54:8081/assessments/employee/${this.selectedCoacheeId}`;
    console.log("id selected :", coacheeId)
    console.log("url", url)
  }
  onRatingSelect(coacheeId: number): void {
    this.selectedCoacheeId = coacheeId;
    console.log("id selected :", coacheeId)
    this.router.navigate(['/rating-changes/' + this.selectedCoacheeId]);
  }
  // getAssessments(id: number): Observable<Assessment[]> {
  //   this.id=this.selectedCoacheeId
  //   return this.http.get<Assessment[]>(`${this.apiUrl}/all/${id}`);
  // }

  getSkillName(idSkill: number): string {
    const skill = this.skills.find(skill => skill.idSkill === idSkill);
    return skill ? skill.skillName : 'Unknown skill';
  }
  // getAssessments(idEmployee: number): void {
  //   this.assessmentService.getAssessmentsByEmployeeId(idEmployee).subscribe(assessments => {
  //     this.assessments = assessments;
  //     this.skillNames = [];

  //     for (let i = 0; i < this.assessments.length; i++) {
  //       this.skillService.getSkillById(this.assessments[i].idSkill).subscribe(skill => {
  //         this.skillNames.push(skill.skillName);
  //       });
  //     }
  //   });
  // }
  goToHome() {
    this.router.navigateByUrl('/home');
  }

  goToProfile() {
    console.log('id before' + this.id)
    this.router.navigate(['/employees', this.id]);
  }

  goToAssessment() {
    this.router.navigate(['/assessment']);
  }
  goToPeople() {
    console.log('id notre emplyee' + this.id)
    // console.log('notre url :' + `${this.apiUrl}/assessments/all/${this.idEmployee}`)
    this.router.navigate(['/people']);
    // this.http.get(`${this.apiUrl}/assessments/all/${this.id}`);
    // console.log('notre url :' + `${this.router}`)
  }
  goToMyAssessmentHistory() {
    this.router.navigate(['/myassessmenthistory']);
  }

}