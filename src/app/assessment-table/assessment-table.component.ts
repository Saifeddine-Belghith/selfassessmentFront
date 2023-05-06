import { Component, OnInit } from '@angular/core';
import { Assessment } from '../assessment/assessment.model';
import { Category } from '../category/category.model';
import { Skill } from '../skill/skill.model';
import { AssessmentService } from '../assessment/assessment.service';
import { CategoryService } from '../category/category.service';
import { SkillService } from '../skill/skill.service';
import { EmployeeService } from '../employee-details/employee.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Employee } from '../employee-details/employee.model';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';


interface AssessmentDTO {
  idSkill: number;
  rating: number;
}

@Component({
  selector: 'app-assessment-table',
  templateUrl: './assessment-table.component.html',
  styleUrls: ['./assessment-table.component.css']
})


export class AssessmentTableComponent implements OnInit {
  assessments: Assessment[] = [];
  categories: Category[] = [];
  skills: Skill[] = [];
  assessmentsdto: AssessmentDTO[] = [];
  id!: number;
  idEmployee!: number;
  employee!: Employee;
  skill!: Skill;
  rating: number = 0
  currentRating: number = 0;
  private apiUrl = 'http://10.66.12.54:8081';
  isCoach: boolean = false;
  isManager: boolean = false;
  response: any;
  categories$: Observable<Category[]> = of([]);
  errorMessage!: string;


  constructor(
    private http: HttpClient,
    private assessmentService: AssessmentService,
    private categoryService: CategoryService,
    private skillService: SkillService,
    private employeeService: EmployeeService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  async ngOnInit() {
    this.idEmployee = parseInt(localStorage.getItem('idEmployee') || '');
    this.rating = 0;
    this.skills.forEach(skill => {
      skill.rating = 0;
    });
    this.getCategories();
    this.id = parseInt(localStorage.getItem('idEmployee') || '');
    console.log('id of this employee' + this.id);
    this.id = +this.route.snapshot.paramMap.get('id')!;
    const idEmployee = localStorage.getItem('idEmployee') || '';
    this.idEmployee = parseInt(idEmployee);
    this.http.get('http://10.66.12.54:8081/categories').subscribe(data => {
      this.categories = (data as Category[]);
      this.categories.forEach(category => {

        this.http.get<Skill[]>(`http://10.66.12.54:8081/skill/category/${category.idCategory}`).subscribe(skills => {
          category.skills = skills;
          skills.forEach(skill => {
            skill.rating = 0; // Set default rating value
          });
        });
      });
    });

    this.employeeService.getEmployeeById(this.idEmployee).subscribe(employee => {
      this.employee = employee;
      this.isCoach = this.employee?.isCoach;
      this.isManager = this.employee?.isManager;
    });
    this.categories$ = this.categoryService.getCategoriesWithSkills();
  }
  // async ngOnInit() {
  //   this.getCategories();
  //   this.skills = await this.getSkills().toPromise() ?? [];
  //   console.log('Skill IDs:', this.skills.map(skill => skill.idSkill));
  //   this.id = parseInt(localStorage.getItem('idEmployee') || '');
  //   console.log('id of this employee' + this.id);
  //   this.id = +this.route.snapshot.paramMap.get('id')!;
  //   const idEmployee = localStorage.getItem('idEmployee') || '';
  //   this.idEmployee = parseInt(idEmployee);
  //   this.http.get('http://10.66.12.54:8081/categories').subscribe(data => {
  //     this.response = data;
  //   });

  //   if (this.employee !== undefined) {
  //     console.log('Employee ID:', this.employee.idEmployee);
  //   }

  //   if (this.skills.length > 0) {
  //     console.log('Skill IDs:', this.skills.map(skill => skill.idSkill));
  //   }
  //   this.employeeService.getEmployeeById(this.idEmployee).subscribe(employee => {
  //     this.employee = employee;
  //   });
  //   this.isCoach = this.employee?.isCoach;
  //   this.isManager = this.employee?.isManager;
  // }


  // async ngOnInit(){

  //   // this.getAssessments();
  //   this.getCategories();
  //   await this.getSkills();
  //   console.log('Skill IDs:', this.skills.map(skill => skill.idSkill));

  //   this.id = +this.route.snapshot.paramMap.get('id')!;
  //   console.log('id:', this.id);

  //   if (this.skills.length > 0) {
  //     console.log('Skill IDs:', this.skills.map(skill => skill.idSkill));
  //   }
  // }

  // getAssessments(): void {
  //   this.assessmentService.getAssessments()
  //     .subscribe(assessments => this.assessments = assessments);
  // }
  getAssessmentRating(skillId: number): number {
    const skill = this.skills.find(s => s.idSkill === skillId);
    const assessment = this.assessments.find(a => skill && a.skill.idSkill === skillId);
    return assessment ? assessment.rating : 0;
  }


  getCategories(): void {
    this.categoryService.getCategories()
      .subscribe(categories => this.categories = categories);
  }

  getSkills(): Observable<Skill[]> {
    return this.skillService.getSkills();
  }
  // getSkills(): void {
  //   this.skillService.getSkills()
  //     .subscribe(skills => this.skills = skills);
  // }

  getCategoryName(categoryId: number): string {
    const category = this.categories.find(c => c.idCategory === categoryId);
    return category ? category.categoryName : '';
  }

  getSkillName(skillId: number): string {

    const skill = this.skills.find(s => s.idSkill === skillId);
    return skill ? skill.skillName : '';
  }
  getIdSkill(skillId: number): number {
    const skill = this.skills.find(s => s.idSkill === skillId);
    return skill ? skill.idSkill : 0;

  }

  getSkillDescription(skillId: number): string {
    const skill = this.skills.find(s => s.idSkill === skillId);
    return skill ? skill.description : '';
  }

  // saveAssessmentValue(skillId: number, rating: number) {
  //   const skill = this.skills.find(s => s.idSkill === skillId);
  //   const assessment = this.assessments.find(a =>  a.skill.idSkill === skillId);
  //   if (assessment) {
  //     assessment.rating = rating;
  //   } else {
  //     const newAssessment: Assessment = {
  //       idAssessment: 0,  
  //       employee: undefined,
  //       skill: skill!,
  //       rating: rating,
  //       comment: '',
  //       assessmentDate: new Date()
  //     };
  //     this.assessments.push(newAssessment);
  //   }
  // }
  getRatingForSkill(skill: Skill): number {
    const assessment = this.assessments.find(a => a.skill.idSkill === skill.idSkill && a.idEmployee === this.employee!.idEmployee);
    return assessment ? assessment.rating : 0;
  }

  // saveAssessments(employeeId: number, assessmentsdto: AssessmentDTO[], skill: Skill): any {

  //     const assessments = this.skills.map(s => ({
  //       idSkill: s.idSkill,
  //       rating: this.rating,
  //       comment: "",
  //     }));

  //   const employeeAssessmentDTO: any = {
  //     idEmployee: employeeId,
  //     assessments: this.assessments,
  //   };

  //   console.log(employeeAssessmentDTO);
  //   return this.http.post<Assessment[]>(`http://10.66.12.54:8081/assessments/saveAssessments`, employeeAssessmentDTO);
  // }

  createAssessment(idEmployee: number): void {

    const assessments = [];

    for (const category of this.categories) {
      for (const skill of category.skills) {
        const rating = skill.rating || 0; // default to 0 if rating is undefined

        const assessment = {
          idSkill: skill.idSkill,
          rating: rating
        };
        console.log(assessment)
        console.log('current rating = ', this.currentRating);
        assessments.push(assessment);
      }
    }
    const data = {
      idEmployee,
      assessments
    };
    console.log("Our data is", data)
    this.http.post("http://10.66.12.54:8081/assessments/saveAssessments", data)
      .subscribe(
        response => {
          console.log(response);
          alert('Assessment submitted successfully');
          this.router.navigate(['/myassessmenthistory']);
        },
        error => {
          console.log(error);
          this.errorMessage = 'Failed to submit the assessment. Please try again later.';
        }
      );
    console.log("Our Finally data is", data)

  }
  onRatingChange(skill: Skill, score: number) {

    this.currentRating = score;
    skill.rating = score;
    console.log(`The New Rating for ${skill.skillName} updated to ${skill.rating}`);
  }
  goToHome() {
    this.router.navigateByUrl('/home');
  }





  // saveAssessment(idEmployee: number, skillId: number, rating: number) {
  //   console.log('idEmployee:', idEmployee);
  //   console.log('skill:', skillId);
  //   console.log('rating:', rating);

  //   const skill = this.skills.find(s => s.idSkill === skillId);
  //   if (skill) {
  //     const assessmentDTO: any = {
  //       idSkill: skill.idSkill,
  //       rating: rating,
  //       comment: '',
  //     };
  //     console.log('skill:', assessmentDTO.skillId);
  //     const employeeAssessmentDTO: any = {
  //       idEmployee: idEmployee,
  //       assessments: [assessmentDTO],
  //     };
  //     this.assessmentService.saveAssessments(idEmployee, [assessmentDTO])
  //       .subscribe(
  //         (response) => {
  //           console.log('Assessment saved successfully');
  //           console.log('idEmployee:', idEmployee);
  //           console.log('skill:', assessmentDTO.skillId);
  //           console.log('rating:', rating);
  //         },
  //         (error) => {
  //           console.error('Error while saving assessment', error);
  //         }
  //       );
  //   } else {
  //     console.error(`Skill not found`);
  //   }
  //   console.log('idEmployee:', idEmployee);
  //   console.log('skill:', skillId);
  //   console.log('rating:', rating);
  // }
  logSkill(rating: number, skills: Skill[], skill: Skill) {
    const AssessmentDTO: any = {
      idSkill: this.getIdSkill,
      rating: this.skill.rating
    }

    if (skill) {
      const id = this.getIdSkill(skill.idSkill);
      console.log(id);
      return id;
    }
    return 0;
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
    this.router.navigate(['/myassessmenthistory']);
  }
  goToMyRating() {
    console.log('id before ' + this.id)
    this.router.navigate(['/rating-changes', this.idEmployee]);
  }
  goToSkillsOverview() {
    this.router.navigate(['/team-levels'])
  }

}




/* saveAssessment(assessment: Assessment) {
  // Save the assessment to the database using an HTTP POST request
  this.assessmentService.saveAssessment(assessment)
    .subscribe(
      (response) => {
        console.log('Assessment saved successfully');
      },
      (error) => {
        console.error('Error while saving assessment', error);
      }
    );
} */


