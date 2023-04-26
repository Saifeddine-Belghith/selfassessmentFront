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
  private apiUrl = 'http://localhost:8081';
  employee!: Employee;
  idSkill!: number;
  name!: string;
  coach!: Employee;
  id!: number;
  
  skillName: string[] | undefined;
  isCoach: boolean = false;
  isManager: boolean = false;

  constructor(private http: HttpClient, private employeeService: EmployeeService, private route: ActivatedRoute, public skillService: SkillService, private router: Router) { }

  ngOnInit(): void {
    this.idEmployee = parseInt(localStorage.getItem('idEmployee') || '');
    // assign a value to the skill property from the skills array
    // const skillName = this.skills.find(skill => skill.skillName === this.skillName);
    // if (skillName) {
    //   this.skill = skillName;
    //   console.log('Skill found:', this.skill);
    // }
   
    // this.skills.forEach(skill => {
    //   this.skill.skillName = skill.skillName;
    // });
    // console.log('Skill Name =', this.skill.skillName);
    // this.employeeService.getEmployeeById(this.idEmployee).subscribe(employee => {
    //   this.employee = employee;
    // });
    // this.idEmployee = +this.route.snapshot.paramMap.get('idEmployee')!;
    // // console.log('employee id is =', this.idEmployee);
    // console.log('Skill Name =', this.skill.skillName);
    console.log('id of this employee is ' + this.idEmployee);
    this.employeeService.getEmployeeById(this.idEmployee).subscribe(coach => {
      this.coach = coach;
      this.isCoach = this.coach?.isCoach;
      this.isManager = this.coach?.isManager;
      console.log("is coch", this.isCoach);
      console.log("is manager", this.isManager);
    });
    
    
    // this.skillName = this.skill.skillName;
    // console.log('Skill Name =', this.skill.skillName);
    // console.log('employee id is =', this.idEmployee);
    // example idSkill
    // const skill = this.assessments.find(s => s.idSkill === this.idSkill);
    // if (skill) {
    //   const nameSkill = skill.skillName;
    //   console.log(nameSkill); // prints the nameSkill corresponding to the idSkill
    // } else {
    //   console.log(`Skill with id ${this.idSkill} not found`);
    // }
    
    
    const url = `http://localhost:8081/assessments/employee/${this.idEmployee}`;
    this.http.get<Assessment[]>(url).subscribe(data => {
      this.assessments = data;
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
    
      
    // console.log('id skill', this.assessments.find(skill => skill.skillName === this.skillName));
    //   const skillNames = data.map(assessment => {
    //     const skill = this.assessments.find(skill => assessment.idSkill === skill.idSkill);
    //     return skill ? skill.skillName : 'Unknown skill';
    //   });
    //   // console.log(`Skill with id  are:`, skillNames)
    
    //   this.skillService.getSkills()
    //     .subscribe((skills: any[]) => {
    //       this.skills = skills;
    //       this.skillName = skills.map(skill => skill.skillName);
    //       console.log('Skill names:', this.skillName);
    //     });
    //   console.log('Skill names:', this.skillName);
    // };
    this.name = this.getSkillName(this.assessment.idSkill);
    console.log('skilllll name', this.name);
  
  }
  getSkillName(idSkill: number): string {
    const skill = this.skills.find(skill => skill.idSkill === idSkill);
    return skill ? skill.skillName : 'Unknown skill';
  }
  goToHome() {
    this.router.navigateByUrl('/home');
  }

  goToProfile() {
    console.log('id before' + this.idEmployee)
    this.router.navigate(['/employees', this.idEmployee]);
  }

  goToAssessment() {
    this.router.navigate(['/assessment']);
  }
  goToPeople() {
    console.log('id notre emplyee' + this.idEmployee)
    // console.log('notre url :' + `${this.apiUrl}/assessments/all/${this.idEmployee}`)
    this.router.navigate(['/people']);
    // this.http.get(`${this.apiUrl}/assessments/all/${this.id}`);
    // console.log('notre url :' + `${this.router}`)
  }
  goToMyAssessmentHistory() {
    this.router.navigate(['/myassessmenthistory']);
  }
}

