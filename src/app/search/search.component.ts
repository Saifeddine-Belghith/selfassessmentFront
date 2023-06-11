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
  consultantList: Employee[] = [];
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



  constructor(private employeeService: EmployeeService, private router: Router,
    private skillService: SkillService, private personalTargetService: PersonalTargetService,
    private categoryService: CategoryService, private assessmentService: AssessmentService) { }

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
     this.getAverageRatingsByCategoryAndExperience();
      this.getCategoryNameFromAverageMethods();
      
      this.getAverageRating(this.id).subscribe(ratings => {
        console.log('Ratings:', ratings);
      });
      Chart.register(...registerables);
      this.createChart();
      
    });
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
  getCategoryName(categoryId: number): Observable<string> {
    return this.categoryService.getCategoryByIdCategory(categoryId).pipe(
      defaultIfEmpty('Unknown Category') // Provide a default value when category is not found
    );
  }


  getAverageRatingsByCategoryAndEmployee(idEmployee:number): void {
    this.assessmentService.calculateAverageRatingsByCategoryAndEmployee(idEmployee).subscribe(
      (employeeRatings: Map<number, number>) => {
        // Process the employeeRatings data as needed
        console.log("hello",employeeRatings);
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
        // console.log(similarExperienceRatings);
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

  getConsultantWithSimilarExperience(): void{
    this.employeeService.getEmployeesByExperience(this.experience).subscribe(
      consultants => {
        this.consultantList = consultants;
        console.log('people:', this.consultantList);
      }
  )
  }
  getAverageRating(idEmployee: number): Observable<number[]> {
    return this.assessmentService.calculateAverageRatingsByCategoryAndEmployee(idEmployee).pipe(
      map((employeeRatings: { [idCategory: number]: number } | Map<number, number>) => {
        const ratings: number[] = Object.values(employeeRatings);
        console.log('Ratings:', ratings); // Log the extracted ratings
        this.ratings = ratings;
        return this.ratings;
      }),
      catchError((error: any) => {
        console.error('Error retrieving average ratings by category and employee:', error);
        return throwError(error);
      })
    );
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
          label: 'My Average',
              data: this.ratings,
          fill: true,
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
          borderColor: 'rgb(255, 99, 132)',
          pointBackgroundColor: 'rgb(255, 99, 132)',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: 'rgb(255, 99, 132)',
        },
        {
          label: 'The similar experience average',
          data: [28, 48, 40],
          fill: true,
          backgroundColor: 'rgba(54, 162, 235, 0.2)',
          borderColor: 'rgb(54, 162, 235)',
          pointBackgroundColor: 'rgb(54, 162, 235)',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: 'rgb(54, 162, 235)',
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
  goToSearch(){this.router.navigate(['/search'])}
}

