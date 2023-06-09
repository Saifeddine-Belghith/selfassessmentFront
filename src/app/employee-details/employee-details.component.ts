import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Employee } from '../employee-details/employee.model';
import { EmployeeService } from '../employee-details/employee.service';

@Component({
  selector: 'app-employee-details',
  templateUrl: './employee-details.component.html',
  styleUrls: ['./employee-details.component.css']
})
export class EmployeeDetailsComponent implements OnInit {

  id!: number;
  employee!: Employee;
  employeeForm!: FormGroup;
  isEditMode: boolean = false;
  errorMessage!: string;
  isCoach: boolean = false;
  isManager: boolean = false;
  private apiUrl = 'http://localhost:8081';

  constructor(private route: ActivatedRoute, private employeeService: EmployeeService, private fb: FormBuilder, private router: Router, private http: HttpClient) { }

  ngOnInit(): void {
    this.id = parseInt(localStorage.getItem('idEmployee') || '');
    // this.id = +this.route.snapshot.paramMap.get('id')!;
    console.log('id:', this.id);
    this.loadEmployee();
    this.employeeService.getEmployeeById(this.id).subscribe(employee => {
      this.employee = employee;
    });
    this.loadEmployee();

    this.isCoach = this.employee?.isCoach;
    this.isManager = this.employee?.isManager;

    this.employeeForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      phone: ['', Validators.required],
      experienceLevel: ['', Validators.required],
      role: ['', Validators.required],
      isCoach: [],
      isManager: [],
      isCoachee: []
    });

  }
  loadEmployee(): void {
    this.employeeService.getEmployeeById(this.id).subscribe(employee => {
      this.employee = employee;
      this.employeeForm.patchValue({
        firstName: employee.firstName,
        lastName: employee.lastName,
        email: employee.email,
        phone: employee.phone,
        experienceLevel: employee.experienceLevel,
        role: employee.role,
        isCoach: employee.isCoach,
        isManager: employee.isManager,
        isCoachee: employee.isCoachee,

      });
    });




  }


  onSubmit(): void {
    if (this.employeeForm.valid) {
      const employeeData = this.employeeForm.value;
      this.employeeService.updateEmployee(this.id, employeeData).subscribe({
        next: employee => {
          this.employee = employee;
          this.isEditMode = false;
          alert('Your profile updated successfully');
        },
        error: err => this.errorMessage = err
      });
    }
  }

  cancel(): void {
    this.employeeForm.reset();
    this.loadEmployee();
    this.isEditMode = false;
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
    // console.log('notre url :' + `${this.apiUrl}/assessments/all/${this.idEmployee}`)
    this.router.navigate(['/people']);
    // this.http.get(`${this.apiUrl}/assessments/all/${this.id}`);
    // console.log('notre url :' + `${this.router}`)
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

}
