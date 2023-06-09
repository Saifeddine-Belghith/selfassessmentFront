import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { PersonalTarget, SupportedValue, TargetArea, TargetStatus } from './personal-target.model';
import { PersonalTargetService } from './personal-target.service';
import { Employee } from '../employee-details/employee.model';
import { EmployeeService } from '../employee-details/employee.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-personal-target',
  templateUrl: './personal-target.component.html',
  styleUrls: ['./personal-target.component.css']
})
export class PersonalTargetComponent implements OnInit {
  personalTargets!: PersonalTarget[];
  idEmployee!: number;
  targetAreas!: TargetArea[];  // Update the type based on your implementation
  targetStatus!: TargetStatus[];  // Update the type based on your implementation
  supportedValues!: SupportedValue[];  // Update the type based on your implementation
  personalTarget!: PersonalTarget;
  tempStatus: TargetStatus = TargetStatus.IN_PROGRESS; // Temporary status variable
  showAlert: boolean = false;
  targetToDelete!: PersonalTarget | null; // Declare targetToDelete property as PersonalTarget or null
  targetToUpdate!: PersonalTarget | null;
  employee!: Employee;
  isCoach: boolean = false;
  isManager: boolean = false;
  id!: number;
  coacheeId!: number;
  coacheeFirstName: string = '';
  coacheeLastName: string = '';

  constructor(private personalTargetService: PersonalTargetService, private employeeService: EmployeeService, private router: Router, private route: ActivatedRoute,) { }

  ngOnInit(): void {
    this.coacheeId = parseInt(this.route.snapshot.params['id']);
    this.idEmployee = parseInt(localStorage.getItem('idEmployee') || '');
    this.idEmployee = parseInt(localStorage.getItem('idEmployee') || '');
    console.log('coachee ID:', this.coacheeId);
    this.getCoacheeDetails(this.coacheeId);
    this.targetAreas = Object.values(TargetArea);
    this.targetStatus = Object.values(TargetStatus);
    this.supportedValues = Object.values(SupportedValue);
    this.resetPersonalTargetForm();
    this.getPersonalTargets();
    this.id = +this.route.snapshot.paramMap.get('id')!;
    this.employeeService.getEmployeeById(this.idEmployee).subscribe(employee => {
      this.employee = employee;
    });
    this.isCoach = this.employee?.isCoach;
    this.isManager = this.employee?.isManager;
    console.log("is coach", this.isCoach)
    this.id = parseInt(localStorage.getItem('idEmployee') || '');
    console.log("id emp", this.id)
    this.idEmployee = parseInt(localStorage.getItem('idEmployee') || '');
  }

  resetPersonalTargetForm(): void {
    this.personalTarget = {
      idPersonalTarget: 0,
      description: '',
      acceptanceCriteria:'',
      targetArea: TargetArea.TRAINING,
      status: TargetStatus.IN_PROGRESS,
      origin: {} as Employee,
      definedBy: '',
      employee: {} as Employee,
      targetDate: new Date(),
      quarter: 'First Quarter',
      supportedValue: SupportedValue.FEEDBACK
    };
  }

  getPersonalTargets(): void {
    this.personalTargetService.getPersonalTargetsByEmployee(this.coacheeId).subscribe(
      (personalTargets: PersonalTarget[]) => {
        this.personalTargets = personalTargets;
      },
      (error) => {
        console.log('Error retrieving personal targets:', error);
      }
    );
  }

  createPersonalTarget(personalTarget: PersonalTarget): void {
    this.personalTargetService.createPersonalTarget(this.idEmployee, personalTarget).subscribe(
      (createdPersonalTarget: PersonalTarget) => {
        console.log('Personal target created:', createdPersonalTarget);
        this.getPersonalTargets();
      },
      (error) => {
        console.log('Error creating personal target:', error);
      }
    );
  }
  assignPersonalTarget(personalTarget: PersonalTarget): void {
    const originId = this.idEmployee // Assign the ID of the coach or manager here
      this.personalTargetService.assignPersonalTarget(personalTarget, this.coacheeId, originId).subscribe(
        (createdPersonalTarget: PersonalTarget) => {
          console.log('Personal target assigned:', createdPersonalTarget);
          this.getPersonalTargets();
        },
        (error) => {
          console.log('Error assigning personal target:', error);
        }
      );
  }
  getCoacheeDetails(coacheeId: number): void {
    this.employeeService.getEmployeeById(coacheeId).subscribe(
      (coachee: Employee) => {
        this.coacheeFirstName = coachee.firstName;
        this.coacheeLastName = coachee.lastName;
      },
      (error) => {
        console.log('Error retrieving coachee details:', error);
      }
    );
  }

  updatePersonalTargetStatus(personalTarget: PersonalTarget): void {
    this.tempStatus = personalTarget.status;
  }
  updateTarget(): void {
    if (this.targetToUpdate) {
      this.personalTargetService.updatePersonalTargetStatus(this.targetToUpdate.idPersonalTarget, this.targetToUpdate.status).subscribe(
        (updatedPersonalTarget: PersonalTarget) => {
          console.log('Personal target updated:', updatedPersonalTarget);
          this.getPersonalTargets();
        },
        (error) => {
          console.log('Error updating personal target:', error);
        }
      );
    }
    this.targetToUpdate = null; // Reset the target to be updated
    this.showAlert = false; // Hide the confirmation alert
  }

  confirmUpdate(personalTarget: PersonalTarget): void {
    this.targetToUpdate = { ...personalTarget };
    this.showAlert = true; // Show the confirmation alert
  }



  confirmDelete(target: PersonalTarget): void {
    this.showAlert = true; // Show the confirmation alert
    this.targetToDelete = target; // Store the target to be deleted for later use in the continue method
  }



  continue(): void {
    if (this.targetToUpdate) {
      this.personalTargetService.updatePersonalTargetStatus(this.targetToUpdate.idPersonalTarget, this.targetToUpdate.status)
        .subscribe(
          (updatedPersonalTarget: PersonalTarget) => {
            console.log('Personal target updated:', updatedPersonalTarget);
            this.getPersonalTargets();
          },
          (error) => {
            console.log('Error updating personal target:', error);
          }
        );
    } else if (this.targetToDelete) {
      this.personalTargetService.deletePersonalTarget(this.targetToDelete.idPersonalTarget).subscribe(
        () => {
          console.log('Personal target deleted');
          this.getPersonalTargets();
        },
        (error) => {
          console.log('Error deleting personal target:', error);
        }
      );
    }

    this.targetToUpdate = null; // Reset the target to be updated
    this.tempStatus = TargetStatus.IN_PROGRESS; // Reset the temporary status
    this.targetToDelete = null; // Reset the target to be deleted
    this.showAlert = false; // Hide the confirmation alert
  }

  cancel(): void {
    this.showAlert = false; // Hide the confirmation alert
  }

  goToHome() { this.router.navigateByUrl('/home'); }

  goToProfile() {
    console.log('id before' + this.id)
    this.router.navigate(['/employees', this.idEmployee]);
  }

  goToAssessment() { this.router.navigate(['/assessment']); }
  goToPeople() {
    console.log('id notre emplyee' + this.id)
    this.router.navigate(['/people']);
  }

  goToMyAssessmentHistory() {
    this.router.navigate(['/myassessmenthistory', this.idEmployee]);
  }
  goToMyRating() {
    console.log('id before ' + this.id)
    this.router.navigate(['/rating-changes', this.idEmployee]);
  }
  goToTarget() {
    console.log('id before ' + this.id)
    this.router.navigate(['/personal-target', this.idEmployee]);
  }
  goToSkillsOverview() {
    this.router.navigate(['/team-levels'])
  }

  
}
