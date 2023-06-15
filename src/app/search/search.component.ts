import { Component, OnInit } from '@angular/core';
import { EmployeeService } from '../employee-details/employee.service';
import { Employee } from '../employee-details/employee.model';
import { Skill } from '../skill/skill.model';
import { Assessment } from '../assessment/assessment.model';
import { SkillService } from '../skill/skill.service';
import { SupportedValue, TargetArea, TargetStatus } from '../personal-target/personal-target.model';
import { PersonalTargetService } from '../personal-target/personal-target.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  idEmployee!: number;
  id!: number;
  isCoach: boolean = false;
  isManager: boolean = false;
  coach!: Employee;
  skills!: Skill[];
  skill!: Skill;
  assessments: Assessment[] = [];
  skillNames: string[] = [];
  assessment!: Assessment;
  idSkill!: number;
  searchSkills!: string;
  searchRatings!: string;
  searchCriteria: { skill: string; rating: number }[] = [];
  searchPerformed: boolean = false;
  consultants: Employee[] = [];
  consultant!: Employee;
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


  constructor(private employeeService: EmployeeService, private skillService: SkillService,
    private personalTargetService: PersonalTargetService, private route: ActivatedRoute,
    private router: Router,) { 
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
      this.getSkills();
    });
    this.id = parseInt(localStorage.getItem('idEmployee') || '');
    console.log('id of this employee' + this.id);
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

  getFilteredConsultants(): Employee[] {
    return this.filteredConsultants;
  }

  getFilteredEmployees(): Employee[] {
    return this.filteredEmployees;
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
