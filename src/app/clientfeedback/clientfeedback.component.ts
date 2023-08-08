import { Component, OnInit } from '@angular/core';
import { Employee } from '../employee-details/employee.model';
import { ClientfeedbackService } from './clientfeedback.service';
import { EmployeeService } from '../employee-details/employee.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ClientFeedback, ClientFeedbackPlayload, Evaluation } from './clientfeedback.model';
import { AuthService } from '../login/auth.service';

@Component({
  selector: 'app-clientfeedback',
  templateUrl: './clientfeedback.component.html',
  styleUrls: ['./clientfeedback.component.css']
})
export class ClientfeedbackComponent implements OnInit {
  idEmployee!: number;
  employee!: Employee;
  coacheeId!: number;
  id!: number;
  isManager: boolean = false;
  isCoach: boolean = false;
  coacheeFirstName!: string;
  coacheeLastName!: string;
  clientFeedback!: ClientFeedbackPlayload;
  evaluations: Evaluation[] = [];
  clientFeedbacks!: ClientFeedback[];
  

  constructor(private clientFeedbackService: ClientfeedbackService, private employeeService: EmployeeService,
    private route: ActivatedRoute, private authService: AuthService, private router:Router,) { }

  ngOnInit(): void {
    this.coacheeId = parseInt(this.route.snapshot.params['id']);
    this.idEmployee = parseInt(localStorage.getItem('idEmployee') || '');
    this.idEmployee = parseInt(localStorage.getItem('idEmployee') || '');
    console.log('coachee ID:', this.coacheeId);
    this.getCoacheeDetails(this.coacheeId);
    
    this.id = +this.route.snapshot.paramMap.get('id')!;
    this.employeeService.getEmployeeById(this.idEmployee).subscribe(employee => {
      this.employee = employee;
      this.isCoach = this.employee?.isCoach;
      this.isManager = this.employee?.isManager;
      console.log("is coach", this.isCoach);
      console.log("is Manager", this.isManager)
      this.idEmployee = parseInt(localStorage.getItem('idEmployee') || '');
      this.id = parseInt(localStorage.getItem('idEmployee') || '');
      console.log("id emp", this.id)
    });
      
      
      this.evaluations = Object.values(Evaluation);
      this.resetClientFeedbackForm();
      this.getClientFeedbacks();
    
    
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

  resetClientFeedbackForm(): void {
    this.clientFeedback = {
      idClientFeedback: 0,
      clientName: '',
      evaluation: Evaluation.NOT_APPLICABLE,
      // rating: 0,
      trend: '',
      employee: {} as Employee,
      comment:'',
    };
  }

  getClientFeedbacks(): void {
    this.clientFeedbackService.getClientFeedbackByEmployee(this.coacheeId).subscribe(
      (clientFeedbacks: ClientFeedback[]) => {
        this.clientFeedbacks = clientFeedbacks;
      },
      (error) => {
        console.log('Error retrieving personal targets:', error);
      }
    );
  }

  createClientFeedback(clientFeedback: ClientFeedbackPlayload): void{
    this.clientFeedbackService.createClientFeedback(this.coacheeId, clientFeedback)
      .subscribe(
        (createdClientFeedback: ClientFeedback) => {
          console.log('Client Feedback created', createdClientFeedback);
          this.getClientFeedbacks();
      }
    )
  }
  onLogout() {
    this.authService.logout();
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
  
