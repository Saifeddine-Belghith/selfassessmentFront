import { Component, OnInit } from '@angular/core';
import { Employee } from '../employee-details/employee.model';
import { EmployeeService } from '../employee-details/employee.service';
import { AssessmentService } from '../assessment/assessment.service';
import { Router } from '@angular/router';
import { CategoryService } from '../category/category.service';
import { Category } from '../category/category.model';
import { Observable, catchError, defaultIfEmpty, forkJoin, map, switchMap, throwError } from 'rxjs';
import { Skill } from '../skill/skill.model';
import { SkillService } from '../skill/skill.service';

@Component({
  selector: 'app-assistance',
  templateUrl: './assistance.component.html',
  styleUrls: ['./assistance.component.css']
})
export class AssistanceComponent implements OnInit {
  employee!: Employee;
  id!: number;
  isCoach: boolean = false;
  isManager: boolean = false;
  experience!: string;
  consultants: Employee[] = [];
  categories!: Category[];
  skills!: Skill[];
  skillName!: string;
  skillsIds!: string[];
  categoryName!: string;
  categoriesIds!: string[];
  ratings!: number[];
  consultant!: Employee;
  averageRatingsByCategoryAndEmployee!: { [idEmployee: string]: any };
  categoryNames: string[] = [];
  skillNames: string[] = [];
  selectedSkill!: number;
  employees: Employee[] = [];

  constructor(private employeeService: EmployeeService, private assessmentService: AssessmentService,
  private router:Router, private categoryService:CategoryService, private skillService: SkillService) { }

  ngOnInit(): void {
    this.id = parseInt(localStorage.getItem('idEmployee') || '');
    console.log('our idEmployee : ' + this.id);
    this.employeeService.getEmployeeById(this.id).subscribe(employee=> {
      this.employee = employee;
      this.isCoach = this.employee?.isCoach;
      this.isManager = this.employee?.isManager;
      this.experience = this.employee?.experienceLevel;
    })
    this.getskills();
    // this.getAssistanceByEmployeeAndCategory(4,1)
    // this.getAssistance();
    // this.getEmployeesByCategory();
    
  }
  getskills(): void {
    this.skillService.getSkills()
      .subscribe(skills => {
        this.skills = skills;
        console.log("skills :", this.skills)
        // Extract skills names
        this.skillNames = this.skills.map(skill => skill.skillName);
        console.log('skillNames:', this.skillNames);
      }); 
  }

  // getAssistance(idEmployee: number): Observable<number[]> {
  //   console.log("Hello From Assistance")
  //   return this.assessmentService.getAssistance(idEmployee, 4).pipe(
  //     map((employeeRatings: { [idEmployee: number]: number } | Map<number, number>)=> {
  //       const scores: number[] = Object.values(employeeRatings);
  //       console.log('Ratings:', scores);
  //       return scores;
  //       console.log("Hello From Result of Assistance ", scores)
  //     }),
  //     catchError((error: any) => {
  //       console.error('Error retrieving average ratings by category and employee:', error);
  //       return throwError(error);
  //     })
  //   )
  // }
  getAssistanceByEmployeeAndCategory(idSkill: number, idEmployee: number): void {
    this.assessmentService.getAssistanceByEmployeeAndCategory(idSkill, idEmployee)
      .subscribe(
        (response: Record<number, number>) => {
          // Sort the ratings in descending order
          const sortedRatings = Object.entries(response).sort((a, b) => b[1] - a[1]);
          // Handle the response and update the component data as needed
          console.log("our response is ", sortedRatings);
          // Extract the employee ids objects
          const employeeIds = sortedRatings.map((entry) => parseInt(entry[0]));
          console.log("Employee IDs:", employeeIds);
          // Fetch employee details for each id
          const employeeObservables = employeeIds.map((employeeId) => this.employeeService.getEmployeeById(employeeId));

          // Wait for all observables to complete
          forkJoin(employeeObservables)
            .subscribe(
              (employees: Employee[]) => {
                // Extract the ratings
                this.ratings = sortedRatings.map((entry) => entry[1]);
                console.log("Ratings:", this.ratings);
                // Handle the response and update the component data as needed
                this.employees = employees.map((employee, index) => ({
                  ...employee,
                  ratings: { [this.selectedSkill]: sortedRatings[index][1] },
                }));
                console.log("Employee list:", this.employees);
              },
              (error: any) => {
                console.error('Error retrieving employee details:', error);
              }
            );
        },
        (error: any) => {
          console.error('Error retrieving average ratings:', error);
        }
      );
  }

  // getAssistance(): void {
  //   this.assessmentService.getAssistanceByEmployeeAndCategory(2,4).subscribe(
  //     (similarExperienceRatings: Map<number, number>) => {
  //       // Process the similarExperienceRatings data as needed
  //       console.log(similarExperienceRatings);
  //     },
  //     (error: any) => {
  //       console.error('Error retrieving average ratings by category and experience:', error);
  //     }
  //   );
  // }
  // Function to retrieve employees by selected category
  getEmployeesByCategory(): void {
    this.assessmentService.getAssistanceByEmployeeAndCategory(this.id, this.selectedSkill).subscribe(
      (response: any) => {
        const employeeRatings = response as { [id: number]: number };
        // Retrieve employees based on ratings
        this.employees = Object.keys(employeeRatings).map((id: string) => {
          console.log("employees : " , this.employees)
          const employeeId = parseInt(id);
          const rating = employeeRatings[employeeId];
          const employee = this.consultants.find((emp: Employee) => emp.idEmployee === employeeId);

          console.log("employees 111 : ", this.employees);
          return {
            
            ...employee,
            ratings: { [this.selectedSkill]: rating }
          } as Employee;
          
        });
      },
      (error: any) => {
        console.error('Error retrieving employee ratings:', error);
      }
    );
  }
  sendEmail(email: string) {
    const subject = encodeURIComponent("Subject of the email");
    const body = encodeURIComponent("Body of the email");
    const mailtoLink = `mailto:${email}?subject=${subject}&body=${body}`;
    window.open(mailtoLink);
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
  goToCompare() { this.router.navigate(['/qualification-comparison']) }
  goToSearch() { this.router.navigate(['/search']) }
  goToClientFeedback() { this.router.navigate(['/client-feedback', this.id]) }
  goToAssistance() { this.router.navigate(['/assistance']) }
  goToSearchByPersonalTarget() { this.router.navigate(['/searchbypersonaltarget']) }
}
