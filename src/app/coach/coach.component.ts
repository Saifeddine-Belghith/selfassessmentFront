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
  skills!: Skill[];
  skill!: Skill;
  idEmployee!: number;
  // private apiUrl = 'http://10.66.12.54:8081';
  employee!: Employee;
  idSkill!: number;
  name!: string;
  isCoach: boolean = false;
  isManager: boolean = false;
  coacheeId!: number;

  skillName: string[] | undefined;
  errorMessage!: string;
  searchSkills!: string;
  searchRatings!: string;
  searchCriteria: { skill: string; rating: number }[] = [];
  consultants: Employee[] = [];
  consultant!: Employee;
  searchPerformed: boolean = false;

  constructor(private employeeService: EmployeeService, private route: ActivatedRoute, private router: Router, public skillService: SkillService, private assessmentService: AssessmentService, private http: HttpClient) {
    this.searchCriteria = [{ skill: '', rating: 0 }];
  }

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
        this.getOtherEmployees(idEmployee);
      }
    });
    this.getSkills();
    this.id = parseInt(localStorage.getItem('idEmployee') || '');
    console.log('id of this employee' + this.id);
    const url = `http://10.66.12.54:8081/assessments/employee/${this.selectedCoacheeId}`;
    this.name = this.getSkillName(this.assessment.idSkill);
    console.log('skilllll name', this.name);
    console.log("id selected :", this.assessment.idSkill);

  }

  getSkills(): void {
    this.skillService.getSkills().subscribe(
      (response) => {
        this.skills = response;
        console.log('Skills:', this.skills); // Check if the skills are logged correctly
      },
      (error) => {
        console.error('Error fetching skills:', error);
      }
    );
  }


  addCriteria() {
    this.searchCriteria.push({ skill: '', rating: 0 });
  }
  searchConsultantsBySkillsAndRatings(): void {
    // Perform the search using searchCriteria
    const payload = this.searchCriteria.reduce(
      (result, criteria) => {
        result.skills.push(criteria.skill);
        result.ratings.push(criteria.rating);
        return result;
      },
      { skills: [] as string[], ratings: [] as number[] } // Explicitly define the types
    );

    this.employeeService.searchConsultantsBySkillsAndRatings(payload).subscribe(
      (consultants) => {
        consultants.forEach((consultant) => {
          this.employeeService.getEmployeeById(consultant.idEmployee).subscribe(
            (employee) => {
              consultant.employeeDetails = employee;
            },
            (error) => {
              console.error('Error fetching employee details:', error);
            }
          );
        });

        console.log('Consultants:', consultants);
        this.consultants = consultants;
      },
      (error) => {
        console.error('Error:', error);
      }
    );
    this.searchPerformed = true;
  }
  deleteCriteria(index: number): void {
    this.searchCriteria.splice(index, 1);
  }


  getCoachees(): void {
    this.employeeService.getCoacheesByCoachId(this.coach.idEmployee).subscribe(coachees => {
      this.coacheeList = coachees;
    });
  }
  getOtherEmployees(idEmployee: number): void {
    this.idEmployee = idEmployee;
    this.employeeService.getOtherEmployees(idEmployee).subscribe(employees => {
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
  getFilteredConsultants(): Employee[] {
    return this.consultants.filter(consultant => this.coacheeList.some(coachee => coachee.idEmployee === consultant.idEmployee));
  }
  getFilteredEmployees(): Employee[] {
    return this.consultants.filter(consultant => this.employeeList.some(coachee => coachee.idEmployee === consultant.idEmployee));
  }


  onRatingSelect(coacheeId: number): void {
    this.selectedCoacheeId = coacheeId;
    console.log("id selected onRatingSelect :", coacheeId)
    this.router.navigate(['/rating-changes/' + this.selectedCoacheeId]);
  }
  onPersonalTargetSelect(coacheeId: number): void {
    this.selectedCoacheeId = coacheeId;
    console.log("id selected onPersonalTargetSelect :", coacheeId)
    this.router.navigate(['/personal-target/' + this.selectedCoacheeId]);
  }
  onAssessmentSelect(coacheeId: number): void {
    this.selectedCoacheeId = coacheeId;
    console.log("id selected onAssessmentSelect :", coacheeId)
    this.router.navigate(['/myassessmenthistory/' + coacheeId]);
  }

  getSkillName(idSkill: number): string {
    const skill = this.skills.find(skill => skill.idSkill === idSkill);
    return skill ? skill.skillName : 'Unknown skill';
  }


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
    this.router.navigate(['/people']);
  }
  goToMyAssessmentHistory() {
    this.router.navigate(['/myassessmenthistory', this.id]);
  }
  goToMyRating() {
    console.log('id before' + this.id)
    this.router.navigate(['/rating-changes', this.id]);
  }
  goToTarget() {
    console.log('id before' + this.id)
    this.router.navigate(['/personal-target', this.id]);
  }
  goToSkillsOverview() {
    this.router.navigate(['/team-levels'])
  }
  goToCompare() { this.router.navigate(['/qualification-comparison']) }

}