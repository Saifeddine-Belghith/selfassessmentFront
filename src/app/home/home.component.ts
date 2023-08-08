import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Employee } from '../employee-details/employee.model';
import { EmployeeService } from '../employee-details/employee.service';
import { AuthService } from '../login/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  idEmployee!: number;
  employee!: Employee;
  isCoach: boolean = false;
  isManager: boolean = false;
  id!: number;
  private apiUrl = 'http://:8081';
  constructor(private router: Router, private authService: AuthService, private http: HttpClient, private employeeService: EmployeeService) { }

  ngOnInit(): void {
    console.log("is coach", this.isCoach)
    // Retrieve the idEmployee from local storage
    this.idEmployee = parseInt(localStorage.getItem('idEmployee') || '');
    // this.id = parseInt(localStorage.getItem('id') || '');
    // console.log("is coach", this.isCoach)
    this.employeeService.getEmployeeById(this.idEmployee).subscribe(employee => {
      this.employee = employee;
    });
    this.isCoach = this.employee?.isCoach;
    this.isManager = this.employee?.isManager;
    console.log("is coach", this.isCoach)
    this.id = parseInt(localStorage.getItem('id') || '');
    console.log("id emp", this.id)
  }
  onLogout() {
    this.authService.logout();
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
    this.router.navigate(['/people']);
  }
  goToHome() {
    this.router.navigateByUrl('/home');
  }
  goToMyAssessmentHistory() {
    this.router.navigate(['/myassessmenthistory', this.idEmployee]);
  }
  goToMyRating() {
    console.log('id before' + this.id)
    this.router.navigate(['/rating-changes', this.idEmployee]);
  }
  goToTarget() {
    console.log('id before' + this.id)
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
