import { Component, OnInit } from '@angular/core';
import { TargetRoleService } from './target-role.service';
import { EmployeeService } from '../employee-details/employee.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Employee } from '../employee-details/employee.model';
import { TargetRole } from './target-role.model';

import { ProfileRole } from "../profile-role/profile-role.model";
import { ProfileRoleService } from '../profile-role/profile-role.service';
import { AuthService } from '../login/auth.service';

@Component({
  selector: 'app-target-role',
  templateUrl: './target-role.component.html',
  styleUrls: ['./target-role.component.css']
})
export class TargetRoleComponent implements OnInit {
  idEmployee!: number;
  employee!: Employee;
  isCoach: boolean = false;
  isManager: boolean = false;
  id!: number;
  coacheeId!: number;
  coacheeFirstName!: string;
  coacheeLastName!: string;
  targetRole!: TargetRole;
  targetRoles!: TargetRole[];
  profileRoleList!: ProfileRole[];
  showAlert: boolean = false;
  targetToDelete!: TargetRole | null; // Declare targetToDelete property as TargetRole or null
  constructor(private targetRoleService: TargetRoleService, private employeeService: EmployeeService,
    private router: Router, private route: ActivatedRoute, private profileRoleService: ProfileRoleService,
    private authService:AuthService) { }

  ngOnInit(): void {
    this.coacheeId = parseInt(this.route.snapshot.params['id']);
    this.idEmployee = parseInt(localStorage.getItem('idEmployee') || '');
    console.log('coachee ID:', this.coacheeId);
    this.getCoacheeDetails(this.coacheeId);
    this.resetTargetRoleForm();
    this.getTargetRoles();
    this.getProfileRoles();
    this.employeeService.getEmployeeById(this.idEmployee).subscribe(employee => {
      this.employee = employee;
      this.isCoach = this.employee.isCoach;
      this.isManager = this.employee.isManager;
      console.log("is coach", this.isCoach)
    });
    this.isCoach = this.employee?.isCoach;
    this.isManager = this.employee?.isManager;
    this.id = parseInt(localStorage.getItem('idEmployee') || '');
    console.log("id emp", this.id)
    this.idEmployee = parseInt(localStorage.getItem('idEmployee') || '');
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
  getProfileRoles(): void {
    this.profileRoleService.getProfileRoles().subscribe(
      profileRoles => {
        this.profileRoleList = profileRoles;
        console.log('people:', this.profileRoleList);
      }
    )
  }

  resetTargetRoleForm(): void {
    this.targetRole = {
      idTargetRole: 0,
      role: '',
      originEmployee: {} as Employee,
      definedBy: '',
      employee: {} as Employee,
    };
  }

  getTargetRoles(): void {
    this.targetRoleService.getTargetRoleByEmployee(this.coacheeId).subscribe(
      (targetRoles: TargetRole[]) => {
        this.targetRoles = targetRoles;
        console.log("alooo ", this.targetRoles)
      },
      (error) => {
        console.log('Error retrieving target role:', error);
      }
    );
  }

  assignTargetRole(targetRole: TargetRole): void {
    const originId = this.idEmployee // Assign the ID of the coach or manager here
    this.targetRoleService.assignTargetRole(targetRole, this.coacheeId, originId).subscribe(
      (createdTargetRole: TargetRole) => {
        console.log('Target Role assigned:', createdTargetRole);
        this.getTargetRoles();
      },
      (error) => {
        console.log('Error assigning target role:', error);
      }
    );
  }
  confirmDelete(target: TargetRole): void {
    this.showAlert = true; // Show the confirmation alert
    this.targetToDelete = target; // Store the target to be deleted for later use in the continue method
  }

  continue(): void {
    if (this.targetToDelete) {
      this.targetRoleService.deleteTargetRole(this.targetToDelete.idTargetRole).subscribe(
        () => {
          console.log('Personal target deleted');
          this.getTargetRoles();
        },
        (error) => {
          console.log('Error deleting personal target:', error);
        }
      );
    }
    this.targetToDelete = null; // Reset the target to be deleted
    this.showAlert = false; // Hide the confirmation alert
  }
  cancel(): void {
    this.showAlert = false; // Hide the confirmation alert
  }




  goToHome() { this.router.navigateByUrl('/home'); }
  onLogout() {
    this.authService.logout();
  }

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
  goToTargetRole() {
    console.log('id before ' + this.id)
    this.router.navigate(['/target-role', this.idEmployee]);
  }
  goToSkillsOverview() {
    this.router.navigate(['/team-levels'])
  }
  goToCompare() { this.router.navigate(['/qualification-comparison']) }
  goToSearch() { this.router.navigate(['/search']) }
  goToClientFeedback() { this.router.navigate(['/client-feedback', this.idEmployee]) }
  goToAssistance() { this.router.navigate(['/assistance']) }
  goToSearchByPersonalTarget() { this.router.navigate(['/searchbypersonaltarget']) }
}
