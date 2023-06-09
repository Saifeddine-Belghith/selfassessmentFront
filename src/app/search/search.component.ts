import { Component, OnInit } from '@angular/core';
import { Employee } from '../employee-details/employee.model';
import { EmployeeService } from '../employee-details/employee.service';
import { Router } from '@angular/router';
import { SkillService } from '../skill/skill.service';
import { Skill } from '../skill/skill.model';
import { SupportedValue, TargetArea, TargetStatus } from '../personal-target/personal-target.model';
import { PersonalTargetService } from '../personal-target/personal-target.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  employee!: Employee;
  id!: number;
  isCoach!: boolean;
  isManager!: boolean;
  skills!: Skill[];
  selectedSkill!: Skill;
  selectedSkills: Skill[] = [];
  selectedRatings: number[] = [];
  consultants: Employee[] = [];
  selectedTargetAreas: TargetArea[] = [];
  selectedSupportedValues: SupportedValue[] = [];
  selectedStatuses: TargetStatus[] = [];
  selectedTargetArea!: TargetArea;
  selectedSupportedValue!: SupportedValue;
  selectedStatus!: TargetStatus;




  constructor(private employeeService: EmployeeService, private router: Router, private skillService: SkillService, private personalTargetService:PersonalTargetService) { }

  ngOnInit(): void {
    this.id = parseInt(localStorage.getItem('idEmployee') || '');
    console.log('id of this employee' + this.id);


    
    this.employeeService.getEmployeeById(this.id).subscribe(employee => {
      this.employee = employee;
      this.isCoach = this.employee?.isCoach;
      this.isManager = this.employee?.isManager;
      console.log("is coach", this.isCoach)
    });
    console.log("id emp", this.id)
    this.getSkills();
  
  }

  getSkills(): void {
    this.skillService.getSkills()
      .subscribe(skills => {
        this.skills = skills;
      });
  }

  searchConsultantsbySkill(): void {
    // Perform the search using selectedSkills and selectedRatings
    const selectedSkillNames = this.selectedSkills.map(skill => skill.skillName);
    const payload = {
      skills: selectedSkillNames,
      ratings: this.selectedRatings
    };

    // Call your API endpoint here with the payload
    this.employeeService.searchConsultantsBySkillsAndRatings(payload)
      .subscribe(
        consultants => {
          // Iterate through the consultants
          consultants.forEach(consultant => {
            // Fetch additional details for each consultant
            this.employeeService.getEmployeeById(consultant.idEmployee)
              .subscribe(
                employee => {
                  // Add the fetched employee details to the consultant object
                  consultant.employeeDetails = employee;
                },
                error => {
                  console.error('Error fetching employee details:', error);
                }
              );
          });

          // Handle the response data
          console.log('Consultants:', consultants);
          // Update your component's data or perform any other actions
          this.consultants = consultants;
        },
        error => {
          // Handle the error
          console.error('Error:', error);
          // Display an error message or perform any other error handling
        }
      );
  }

  searchConsultantsbyTarget(): void {
    const payload = {
      targetArea: this.selectedTargetArea ? [this.selectedTargetArea] : this.selectedTargetAreas,
      supportedValue: this.selectedSupportedValue ? [this.selectedSupportedValue] : this.selectedSupportedValues,
      targetStatus: this.selectedStatus ? [this.selectedStatus] : this.selectedStatuses
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
              // Handle the response data
              console.log('Consultants:', filteredConsultants);
              // Update your component's data or perform any other actions
              this.consultants = filteredConsultants;
            })
            .catch(error => {
              // Handle the error
              console.error('Error:', error);
              // Display an error message or perform any other error handling
            });
        },
        error => {
          // Handle the error
          console.error('Error:', error);
          // Display an error message or perform any other error handling
        }
      );
  }





  goToHome() { this.router.navigateByUrl('/home'); }

  goToProfile() {
    console.log('id before' + this.id)
    this.router.navigate(['/employees', this.id]);
  }

  goToAssessment() { this.router.navigate(['/assessment']); }
  goToPeople() {
    console.log('id notre emplyee' + this.id)
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
  goToSearch(){this.router.navigate(['/search'])}
}

