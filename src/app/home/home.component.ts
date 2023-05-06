import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Employee } from '../employee-details/employee.model';
import { EmployeeService } from '../employee-details/employee.service';

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
  private apiUrl = 'http://10.66.12.54:8081';
  constructor(private router: Router, private http: HttpClient, private employeeService: EmployeeService) { }

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
    // this.http.get(`${this.apiUrl}/assessments/all/${this.idEmployee}`);
    // console.log('notre url :' + `${this.router}`)
  }
  goToHome() {
    this.router.navigateByUrl('/home');
  }
  goToMyAssessmentHistory() {
    this.router.navigate(['/myassessmenthistory']);
  }
  goToMyRating() {
    console.log('id before' + this.id)
    this.router.navigate(['/rating-changes', this.idEmployee]);
  }

  goToSkillsOverview() {
    this.router.navigate(['/team-levels'])
  }

}
