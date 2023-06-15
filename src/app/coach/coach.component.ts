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
import { SupportedValue, TargetArea, TargetStatus } from '../personal-target/personal-target.model';
import { PersonalTargetService } from '../personal-target/personal-target.service';

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

  selectedTargetAreas: TargetArea[] = [];
  selectedSupportedValues: SupportedValue[] = [];
  selectedStatuses: TargetStatus[] = [];
  selectedTargetArea!: TargetArea;
  selectedSupportedValue!: SupportedValue;
  selectedStatus!: TargetStatus;
  targetDate!: number;
  selectedQuarters: string[] = [];
  selectedQuarter!: string;
  searchPersonalTargedPerformed: boolean = false;

  filteredConsultants: Employee[] = []; // Stores results of search by skills and ratings
  filteredEmployees: Employee[] = [];   // Stores results of search by personal targets



  constructor(private employeeService: EmployeeService, private route: ActivatedRoute, private router: Router,
    public skillService: SkillService, private assessmentService: AssessmentService,
    private http: HttpClient, private personalTargetService: PersonalTargetService) {
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
        this.filteredConsultants = consultants;
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

  searchConsultantsbyTarget(): void {
    const payload = {
      targetArea: this.selectedTargetArea ? [this.selectedTargetArea] : this.selectedTargetAreas,
      supportedValue: this.selectedSupportedValue ? [this.selectedSupportedValue] : this.selectedSupportedValues,
      targetStatus: this.selectedStatus ? [this.selectedStatus] : this.selectedStatuses,
      targetDate: this.targetDate,
      quarter: this.selectedQuarter ? [this.selectedQuarter] : this.selectedQuarters,
    };

    this.personalTargetService.searchConsultantsByTarget(payload)
      .subscribe(
        consultants => {
          const uniqueConsultants = new Set<number>();
          const filteredConsultants: Employee[] = [];

          consultants.forEach(consultant => {
            if (!uniqueConsultants.has(consultant.idEmployee)) {
              uniqueConsultants.add(consultant.idEmployee);
              filteredConsultants.push(consultant);
            }
          });

          // Fetch additional details for each consultant
          const fetchDetailsPromises = filteredConsultants.map(consultant => {
            return this.employeeService.getEmployeeById(consultant.idEmployee)
              .toPromise()
              .then(employee => {
                consultant.employeeDetails = employee;
              })
              .catch(error => {
                console.error('Error fetching employee details:', error);
              });
          });

          Promise.all(fetchDetailsPromises)
            .then(() => {

              console.log('Consultants:', filteredConsultants);

              this.consultants = filteredConsultants;
              this.filteredEmployees = filteredConsultants;
            })
            .catch(error => {
              console.error('Error:', error);
            });
        },
        error => {
          console.error('Error:', error);
        }
      );
    this.searchPersonalTargedPerformed = true;
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
    console.log("id selected :", coacheeId)
  }
  getFilteredConsultants(): Employee[] {
    return this.filteredConsultants;
  }

  getFilteredEmployees(): Employee[] {
    return this.filteredEmployees;
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

  onClientFeedbackSelect(coacheeId: number): void {
    this.router.navigate(['/client-feedback/' + coacheeId]);
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
  goToSearch() { this.router.navigate(['/search']) }
  goToClientFeedback() { this.router.navigate(['/client-feedback', this.id]) }
}