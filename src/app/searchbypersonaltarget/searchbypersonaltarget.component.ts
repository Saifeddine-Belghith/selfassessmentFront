import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EmployeeService } from '../employee-details/employee.service';
import { PersonalTargetService } from '../personal-target/personal-target.service';
import { SkillService } from '../skill/skill.service';
import { Assessment } from '../assessment/assessment.model';
import { Employee } from '../employee-details/employee.model';
import { TargetArea, SupportedValue, TargetStatus } from '../personal-target/personal-target.model';
import { Skill } from '../skill/skill.model';

@Component({
  selector: 'app-searchbypersonaltarget',
  templateUrl: './searchbypersonaltarget.component.html',
  styleUrls: ['./searchbypersonaltarget.component.css']
})
export class SearchbypersonaltargetComponent implements OnInit {

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
    private router: Router) { }

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

  searchConsultantsbyTarget(): void {
    const payload = {
      skill: this.skill,
      // targetArea: this.selectedTargetArea ? [this.selectedTargetArea] : this.selectedTargetAreas,
      // supportedValue: this.selectedSupportedValue ? [this.selectedSupportedValue] : this.selectedSupportedValues,
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
              console.log('Consultants now:', this.consultants);
              this.filteredEmployees = filteredConsultants;
              console.log('Employees now:', this.filteredEmployees);
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

  sendEmail(email: string) {
    const subject = encodeURIComponent("Subject of the email");
    const body = encodeURIComponent("Body of the email");
    const mailtoLink = `mailto:${email}?subject=${subject}&body=${body}`;
    window.open(mailtoLink);
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
  goToAssistance() { this.router.navigate(['/assistance']) }
  goToSearchByPersonalTarget() { this.router.navigate(['/searchbypersonaltarget']) }

}
