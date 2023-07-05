import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Chart, ChartConfiguration, ChartType, Point, registerables, } from 'chart.js';
import { AssessmentService } from '../assessment/assessment.service';
import { Skill } from '../skill/skill.model';
import { SkillService } from '../skill/skill.service';
import { map } from 'rxjs/operators';
import 'chartjs-adapter-date-fns';
import { Assessment } from '../assessment/assessment.model';
import { Employee } from '../employee-details/employee.model';
import { EmployeeService } from '../employee-details/employee.service';



@Component({
  selector: 'app-rating-changes',
  templateUrl: './rating-changes.component.html',
  styleUrls: ['./rating-changes.component.css']
})
export class RatingChangesComponent implements OnInit {

  employeeId!: number;
  skillName!: string;
  startDate!: Date;
  endDate!: Date;
  ratingChanges!: Map<string, number[]>;
  chart!: Chart;
  ratingForm!: FormGroup;
  skills!: Skill[];
  selectedSkill!: Skill;
  coacheeId!: number;
  assessments!: Assessment[];
  private apiUrl = 'http://localhost:8081';
  id: number | null = null;
  employee!: Employee;
  errorMessage!: string;
  isCoach: boolean = false;
  isManager: boolean = false;
  idEmployee!: number;
  coacheeFirstName: string = '';
  coacheeLastName: string = '';


  constructor(private route: ActivatedRoute, private activatedRoute: ActivatedRoute, private assessmentService: AssessmentService, private router: Router, private skillService: SkillService, private employeeService: EmployeeService) { }

  ngOnInit(): void {
    this.id = parseInt(localStorage.getItem('idEmployee') || '');
    console.log('id of this employee' + this.id);

    this.coacheeId = this.activatedRoute.snapshot.params['id'];

    console.log('coachee ID:', this.coacheeId);
    this.getCoacheeDetails(this.coacheeId);
    Chart.register(...registerables);
    this.employeeService.getEmployeeById(this.id).subscribe(employee => {
      this.employee = employee;
    });
    this.isCoach = this.employee?.isCoach;
    this.isManager = this.employee?.isManager;
    console.log("is coach", this.isCoach)
    this.id = parseInt(localStorage.getItem('id') || '');
    console.log("id emp", this.id)

    this.ratingForm = new FormGroup({
      skill: new FormControl(''),
      startDate: new FormControl(''),
      endDate: new FormControl('')
    });
    this.getSkills();

    this.route.paramMap.subscribe(params => {
      this.employeeId = +params.get('employeeId')!;
      this.skillName = params.get('skillName')!;
      this.startDate = new Date(params.get('startDate')!);
      this.endDate = new Date(params.get('endDate')!);
      this.getRatingChanges();
    });
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
  getSkills(): void {
    this.skillService.getSkills()
      .subscribe(skills => {
        this.skills = skills;
      });
  }
  getRatingChanges(): void {
    this.assessmentService.getRatingChangesForEmployeeAndSkill(this.coacheeId, this.selectedSkill.skillName, this.startDate, this.endDate)
      .pipe(
        map(assessments => {
          if (!assessments || assessments.length === 0) {
            throw new Error('No assessments found.');
          }
          return assessments.filter((assessment: any) => {
            return new Date(assessment.assessmentDate) >= this.startDate &&
              new Date(assessment.assessmentDate) <= this.endDate;
          })
        })
      )
      .subscribe(
        assessments => {
          const ratingChanges = new Map<string, number[]>();
          assessments.forEach((assessment: any) => {
            const dateString: string = new Date(assessment.assessmentDate).toLocaleDateString();
            if (ratingChanges.has(dateString)) {
              ratingChanges.get(dateString)!.push(assessment.rating);
            } else {
              ratingChanges.set(dateString, [assessment.rating]);
            }
          });
          this.ratingChanges = ratingChanges;
          this.errorMessage = '';
          if (this.chart) {
            this.chart.destroy();
          }
          this.createChart();
        },
        error => {
          console.error(error);
          this.ratingChanges = new Map<string, number[]>();
          this.errorMessage = 'Nothing to display.';
        }
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

    // const assessments: Point[] = Array.from(this.ratingChanges.entries()).map(([key, value]) => {
    //   return {
    //     x: new Date(key).getTime(),
    //     y: value[0],
    //     r: 10
    //   };
    // });
    const data = {
      datasets: [{
        label: 'Rating Changes',
        data: [],
        fill: false,
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        pointRadius: 5,
        borderColor: 'rgba(255, 99, 132, 1)'
        // tension: 0.5
      }]
    };
    const ratingChangesArray = Array.from(this.ratingChanges.entries());
    ratingChangesArray.forEach(([dateString, ratings]) => {
      ratings.forEach(rating => {
        (data.datasets[0].data as { x: string, y: number }[]).push({
          x: dateString,
          y: rating
          // r: 0
        });

      });
    });

    const config: ChartConfiguration<'line', { x: string; y: number; }[]> = {
      type: 'line',
      data,
      options: {
        maintainAspectRatio: false,
        scales: {
          x: {
            // type: 'time',
            time: {
              unit: 'day',
              displayFormats: {
                day: 'MMM D'
              }

            },
            title: {
              display: true,
              text: 'Assessment Date',
              font: {
                size: 20
              }

            },
            ticks: {
              font: {
                size: 15
              }
            }
          },
          y: {
            min: 0,
            max: 3,
            title: {
              display: true,
              text: 'Rating',
              font: {
                size: 20
              }
            },
            ticks: {
              font: {
                size: 12
              }
            }
          }
        },
        // plugins: {
        //   legend: {
        //     labels: {
        //       font: {
        //         size: 14
        //       }
        //     }
        //   }
        // }
      }
    };


    if (this.chart) {
      this.chart.destroy();
      console.log("Destroyed");
    }

    const chart = new Chart(canvas, config);
    if (this.chart) {
      this.chart.destroy();
      console.log("Destroyed");
    }

    console.log("hello after chart block");
  }



  onSubmit(): void {
    const skillName = this.ratingForm.get('skill')!.value.skillName;
    const selectedSkill = this.skills.find(skill => skill.skillName === skillName);
    if (selectedSkill) {
      this.selectedSkill = selectedSkill;
    }
    this.startDate = new Date(this.ratingForm.get('startDate')!.value);
    this.endDate = new Date(this.ratingForm.get('endDate')!.value);
    console.log("coacheeId:", this.coacheeId);
    console.log("skillName:", skillName);
    console.log("startDate:", this.startDate);
    console.log("endDate:", this.endDate)
    this.getRatingChanges();
    console.log('hello from onSubmit ')

  }

  goToHome() {
    this.router.navigateByUrl('/home');
  }

  goToProfile() {
    console.log('id before' + this.id)
    this.router.navigate(['/employees', this.employee.idEmployee]);
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
    this.router.navigate(['/myassessmenthistory', this.employee.idEmployee]);
  }
  goToMyRating(idEmployee: number) {
    console.log('id before' + this.employee.idEmployee)
    this.router.navigate(['/rating-changes', this.employee.idEmployee]);
  }
  goToTarget() {
    console.log('id before' + this.employee.idEmployee)
    this.router.navigate(['/personal-target', this.employee.idEmployee]);
  }
  goToSkillsOverview() {
    this.router.navigate(['/team-levels'])
  }
  goToCompare() { this.router.navigate(['/qualification-comparison']) }
  goToSearch() { this.router.navigate(['/search']) }
  goToClientFeedback() { this.router.navigate(['/client-feedback', this.employee.idEmployee]) }
  goToAssistance() { this.router.navigate(['/assistance']) }

}
