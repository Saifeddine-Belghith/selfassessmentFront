import { Component, OnInit } from '@angular/core';
import { Employee } from '../employee-details/employee.model';
import { EmployeeService } from '../employee-details/employee.service';
import { Router } from '@angular/router';
import { SkillService } from '../skill/skill.service';
import { Skill } from '../skill/skill.model';
import { SupportedValue, TargetArea, TargetStatus } from '../personal-target/personal-target.model';
import { PersonalTargetService } from '../personal-target/personal-target.service';
import { Chart, ChartConfiguration, registerables } from 'chart.js';
import { CategoryService } from '../category/category.service';
import { Observable, catchError, defaultIfEmpty, forkJoin, map, switchMap, throwError } from 'rxjs';
import { AssessmentService } from '../assessment/assessment.service';
import { ProfileRoleService } from '../profile-role/profile-role.service';
import { ProfileRole } from '../profile-role/profile-role.model';

@Component({
  selector: 'app-search',
  templateUrl: './comparison.component.html',
  styleUrls: ['./comparison.component.css']
})
export class ComparisonComponent implements OnInit {


  employee!: Employee;
  id!: number;
  isCoach!: boolean;
  isManager!: boolean;
  skills!: Skill[];
  selectedSkill!: Skill;
  selectedSkills: Skill[] = [];
  selectedRatings: number[] = [];
  profileRoles: ProfileRole[] = [];
  profileRoleList: ProfileRole[] = [];
  selectedTargetAreas: TargetArea[] = [];
  selectedSupportedValues: SupportedValue[] = [];
  selectedStatuses: TargetStatus[] = [];
  selectedTargetArea!: TargetArea;
  selectedSupportedValue!: SupportedValue;
  selectedStatus!: TargetStatus;
  chart!: Chart;
  experience!: string;
  averageRatingsByCategoryAndEmployee!: { [idCategory: string]: any };
  categoryNames: string[] = [];
  categoryIds: string[] = [];
  ratings: number[] = [];
  ratingsConsultant: number[] = [];
  selectedConsultantId!: number;
  consultant!: Employee;
  profileRole!: ProfileRole;
  ratingsPerExperience: number[] = [];


  constructor(private employeeService: EmployeeService, private router: Router,
    private skillService: SkillService, private personalTargetService: PersonalTargetService,
    private categoryService: CategoryService, private assessmentService: AssessmentService,
    private profileRoleService: ProfileRoleService) { }

  ngOnInit(): void {
    this.id = parseInt(localStorage.getItem('idEmployee') || '');
    console.log('id of this employee' + this.id);



    this.employeeService.getEmployeeById(this.id).subscribe(employee => {
      this.employee = employee;
      this.isCoach = this.employee?.isCoach;
      this.isManager = this.employee?.isManager;
      this.experience = this.employee?.experienceLevel;
      console.log("the experience is :", this.experience)

      this.experience = this.employee.experienceLevel;
      this.getConsultantWithSimilarExperience();
      console.log("is exp", this.experience)
      console.log("id emp", this.id)
      this.getSkills();


      this.getAverageRatingsByCategoryAndEmployee(this.id);
      //  this.getAverageRatingsByCategoryAndExperience();
      this.getCategoryNameFromAverageMethods();

      this.getAverageRating(this.id).subscribe(ratings => {
        // console.log('Ratings:', ratings);
      });
      this.getAverageRatingSimilarExperience(this.experience);
      Chart.register(...registerables);

    });
  }

  getSkills(): void {
    this.skillService.getSkills()
      .subscribe(skills => {
        this.skills = skills;
      });
  }

  getCategoryName(categoryId: number): Observable<string> {
    return this.categoryService.getCategoryByIdCategory(categoryId).pipe(
      defaultIfEmpty('Unknown Category') // Provide a default value when category is not found
    );
  }


  getAverageRatingsByCategoryAndEmployee(idEmployee: number): void {
    this.assessmentService.calculateAverageRatingsByCategoryAndEmployee(idEmployee).subscribe(
      (employeeRatings: Map<number, number>) => {
        // Process the employeeRatings data as needed

      },
      (error: any) => {
        console.error('Error retrieving average ratings by category and employee:', error);
      }
    );
  }


  getAverageRatingsByCategoryAndExperience(): void {
    this.assessmentService.calculateAverageRatingsByCategoryAndExperience(this.experience).subscribe(
      (similarExperienceRatings: Map<number, number>) => {
        // Process the similarExperienceRatings data as needed
        console.log(similarExperienceRatings);
      },
      (error: any) => {
        console.error('Error retrieving average ratings by category and experience:', error);
      }
    );
  }


  getCategoryNameFromAverageMethods(): Observable<string[]> {
    return this.assessmentService.calculateAverageRatingsByCategoryAndEmployee(this.id).pipe(
      switchMap((employeeRatings: { [idCategory: string]: any }) => {
        const categoryIds = Object.keys(employeeRatings);
        // console.log('categoryIds:', categoryIds); // Log category IDs

        const categoryNames$ = categoryIds.map(categoryId => {
          // console.log('categoryId:', categoryId); // Log category ID before calling getCategoryName()
          return this.getCategoryName(parseInt(categoryId));
        });

        // Wait for all category names to be fetched
        return forkJoin(categoryNames$);
      }),
      catchError((error: any) => {
        console.error('Error retrieving category names:', error);
        return throwError(error);
      })
    );
  }

  getConsultantWithSimilarExperience(): void {
    this.profileRoleService.getProfileRoles().subscribe(
      profileRoles => {
        this.profileRoleList = profileRoles;
        console.log('people:', this.profileRoleList);
      }
    )
  }

  getAverageRating(idEmployee: number): Observable<number[]> {
    return this.assessmentService.calculateAverageRatingsByCategoryAndEmployee(idEmployee).pipe(
      map((employeeRatings: { [idCategory: number]: number } | Map<number, number>) => {
        const ratings: number[] = Object.values(employeeRatings);
        // console.log('Ratings:', ratings); // Log the extracted ratings
        this.ratings = ratings;
        return this.ratings;
      }),
      catchError((error: any) => {
        console.error('Error retrieving average ratings by category and employee:', error);
        return throwError(error);
      })
    );
  }
  getProfileRoleMinScore(idProfileRole: number): Observable<number[]> {
    this.selectedConsultantId = idProfileRole;
    return this.profileRoleService.getMinScore(idProfileRole).pipe(
      map((employeeRatings: { [idCategory: number]: number } | Map<number, number>) => {
        const ratings: number[] = Object.values(employeeRatings);
        console.log('Ratings:', ratings); // Log the extracted ratings
        this.ratingsConsultant = ratings;
        return this.ratingsConsultant;
      }),
      catchError((error: any) => {
        console.error('Error retrieving average ratings by category and employee:', error);
        return throwError(error);
      })
    );
  }

  getAverageRatingSimilarExperience(experience: string): Observable<number[]> {
    this.experience = experience;
    console.log('Hello from ExperiencegetAverageRatingSimilarExperience Method:');
    return this.assessmentService.calculateAverageRatingsByCategoryAndExperience(experience).pipe(
      map((similarExperienceRatings: { [idCategory: number]: number } | Map<number, number>) => {
        console.log('Ratings from Experience:');
        const ratings: number[] = Array.from(Object.values(similarExperienceRatings));
        console.log('Ratings from Experience:', ratings);
        this.ratingsPerExperience = ratings;
        return this.ratingsPerExperience;
      }),
      catchError((error: any) => {
        console.error('Error retrieving average ratings by category and experience:', error);
        return throwError(error);
      })
    );
  }

  // getAverageRatingSimilarExperience(experience: string): Observable<number[]> {
  //   console.log('Hello from ExperiencegetAverageRatingSimilarExperience Method:');
  //   return new Observable<number[]>((observer) => {
  //     this.getAverageRatingsByCategoryAndExperience().subscribe(
  //       (similarExperienceRatings: Map<number, number>) => {
  //         const ratings: number[] = Array.from(similarExperienceRatings.values());
  //         observer.next(ratings);
  //         observer.complete();
  //         this.ratingsPerExperience = ratings;
  //         console.log("ratinggggggs : ", ratings )
  //       },
  //       (error: any) => {
  //         console.error('Error retrieving average ratings by category and experience:', error);
  //         observer.error(error);
  //       }
  //     );
  //   });
  // }





  compareWith(idProfileRole: number): void {
    this.getAverageRating(this.id).subscribe((ratings: number[]) => {
      // Ratings for your average
      console.log('Your Ratings:', ratings);

      this.getProfileRoleMinScore(idProfileRole).subscribe((consultantRatings: number[]) => {
        this.profileRoleService.getProfileRoleById(idProfileRole).subscribe(profileRole => {
          this.profileRole = profileRole;
        });

        // Ratings for the selected consultant
        console.log('Consultant Ratings:', consultantRatings);

        // Create the chart with the ratings data
        this.ratings = ratings;
        this.ratingsConsultant = consultantRatings;
        this.createChart();
      });
    });
  }








  createChart(): void {
    const canvas = document.getElementById('ratingChart') as HTMLCanvasElement;
    if (!canvas) return;

    for (const chart of Object.values(Chart.instances)) {
      chart.destroy();
    }

    // Check if chart already exists and destroy it before rendering a new chart
    console.log("creating chart ...");
    if (this.chart) {
      this.chart.destroy();
      console.log("Destroyed");
    }

    // Check if category names are available
    if (!this.categoryNames) {
      console.error('Category names are not available.');
      return;
    }

    this.getCategoryNameFromAverageMethods().subscribe(
      (categoryNames: string[]) => {
        this.categoryNames = categoryNames;
        console.log(categoryNames);

        const data = {
          labels: this.categoryNames,
          datasets: [
            {
              label: this.employee.firstName,
              data: this.ratings,
              fill: true,
              backgroundColor: 'rgba(255, 99, 132, 0.2)',
              borderColor: 'rgb(255, 99, 132)',
              pointBackgroundColor: 'rgb(255, 99, 132)',
              pointBorderColor: '#fff',
              pointHoverBackgroundColor: '#fff',
              pointHoverBorderColor: 'rgb(255, 99, 132)',
              pointRadius: 7,
            },
            {
              label: this.profileRole.roleName,
              data: this.ratingsConsultant,
              fill: true,
              backgroundColor: 'rgba(54, 162, 235, 0.2)',
              borderColor: 'rgb(54, 162, 235)',
              pointBackgroundColor: 'rgb(54, 162, 235)',
              pointBorderColor: '#fff',
              pointHoverBackgroundColor: '#fff',
              pointHoverBorderColor: 'rgb(54, 162, 235)',
              pointRadius: 7,
            },
          ],
        };
        const config: ChartConfiguration<'radar'> = {
          type: 'radar',
          data: data,
          options: {
            elements: {
              line: {
                borderWidth: 3,
              },
            },
            responsive: true,
            maintainAspectRatio: false,
          },
        };

        if (this.chart) {
          this.chart.destroy();
          console.log("Destroyed");
        }

        this.chart = new Chart<'radar'>(canvas, config);
        console.log("Chart created");
      },
      (error: any) => {
        console.error('Error retrieving category names:', error);
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
  goToCompare() { this.router.navigate(['/qualification-comparison']) }
  goToSearch() { this.router.navigate(['/search']) }
  goToClientFeedback() { this.router.navigate(['/client-feedback', this.id]) }
  goToAssistance() { this.router.navigate(['/assistance']) }
  goToSearchByPersonalTarget() { this.router.navigate(['/searchbypersonaltarget']) }
}

