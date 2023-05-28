import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { Assessment } from '../assessment/assessment.model';
import { Employee } from '../employee-details/employee.model';
import { EmployeeService } from '../employee-details/employee.service';
import { Skill } from '../skill/skill.model';
import { SkillService } from '../skill/skill.service';

@Component({
  selector: 'app-myassessmenthistory',
  templateUrl: './myassessmenthistory.component.html',
  styleUrls: ['./myassessmenthistory.component.css']
})
export class MyassessmenthistoryComponent implements OnInit {
  assessments: Assessment[] = [];
  assessment!: Assessment;
  skills: Skill[] = [];
  skill!: Skill;
  idEmployee!: number;
  private apiUrl = 'http://10.66.12.54:8081';
  employee!: Employee;
  idSkill!: number;
  name!: string;
  coach!: Employee;
  id!: number;
  coacheeId!: number;

  skillName: string[] | undefined;
  isCoach: boolean = false;
  isManager: boolean = false;

  constructor(private http: HttpClient, private activatedRoute: ActivatedRoute, private employeeService: EmployeeService, private route: ActivatedRoute, public skillService: SkillService, private router: Router) { }

  ngOnInit(): void {
    this.id = parseInt(localStorage.getItem('idEmployee') || '');
    console.log('id of this employee' + this.id);
    this.coacheeId = this.activatedRoute.snapshot.params['id'];
    console.log('coachee ID:', this.coacheeId);
    this.employeeService.getEmployeeById(this.id).subscribe(employee => {
      this.employee = employee;
    });
    this.isCoach = this.employee?.isCoach;
    this.isManager = this.employee?.isManager;
    console.log("is coach", this.isCoach)
    // this.id = parseInt(localStorage.getItem('id') || '');
    console.log("id emp", this.id)
    const url = `http://10.66.12.54:8081/assessments/employee/${this.coacheeId}`;
    this.http.get<Assessment[]>(url).subscribe(data => {
      this.assessments = data;
      console.log('OUR ID IS ', this.id)
      console.log('Our DATA IS', data);
      const skillObservables = data.map(assessment => {
        return this.skillService.getSkillById(assessment.idSkill);
      });
      forkJoin(skillObservables).subscribe(skills => {
        const skillNames = skills.map(skill => skill.skillName);
        console.log('Skill names:', skillNames);
      });
      const id = this.skillService.getSkillName(this.assessment.idSkill)
    });
    this.name = this.getSkillName(this.assessment.idSkill);
    console.log('skilllll name', this.name);
  }
  getSkillName(idSkill: number): string {
    const skill = this.skills.find(skill => skill.idSkill === idSkill);
    return skill ? skill.skillName : 'Unknown skill';
  }
  goToHome() { this.router.navigateByUrl('/home'); }

  goToProfile() {
    console.log('id before' + this.id)
    this.router.navigate(['/employees', this.id]);
  }

  goToAssessment() { this.router.navigate(['/assessment']); }
  goToPeople() {
    console.log('id notre emplyee' + this.idEmployee)
    this.router.navigate(['/people']);
  }
  goToMyAssessmentHistory() { this.router.navigate(['/myassessmenthistory', this.id]); }
  goToMyRating() {
    console.log('id before' + this.id)
    this.router.navigate(['/rating-changes', this.id]);
  }
  goToTarget() {
    console.log('id before ' + this.id)
    this.router.navigate(['/personal-target', this.id]);
  }
  goToSkillsOverview() { this.router.navigate(['/team-levels']) }
}

