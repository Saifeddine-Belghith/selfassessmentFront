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
  lastRating!: number;
  lastRatingForTest: number = 2;
  lastRatings: Record<number, number> = {};



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
    // Retrieve the ID of the employee from localStorage
    this.idEmployee = parseInt(localStorage.getItem('idEmployee') || '');
    // this.lastRatingForTest = 2;
    // Retrieve the skills and set the stored ratings as default values
    this.skillService.getSkills().subscribe((skills) => {
      this.skills = skills;

      // Retrieve the stored ratings for each skill
      this.skills.forEach((skill) => {
        const storedRating = localStorage.getItem(`lastRating_${skill.idSkill}`);
        if (storedRating) {
          skill.rating = parseInt(storedRating);
          this.lastRating = skill.rating;
        }
      });

      // Retrieve the assessments for the employee and update the skills with the last ratings
      this.assessmentService.getAssessmentsByEmployeeId(this.idEmployee).subscribe((assessments) => {
        // const lastRatings: Record<number, number> = {};

        assessments.forEach((assessment) => {
          this.lastRatings[assessment.idSkill] = assessment.rating;
        });

        // Update the skills with the last ratings
        this.skills.forEach((skill) => {
          const lastRating = this.lastRatings[skill.idSkill];
          if (lastRating !== undefined) {
            skill.rating = lastRating;
            this.lastRating = lastRating;
            localStorage.setItem(`lastRating_${skill.idSkill}`, lastRating.toString());
            console.log("last rating for", skill.skillName, " is :", skill.rating)
          }
        });
      });

      // Set default rating values for skills without stored ratings
      this.skills.forEach((skill) => {
        if (skill.rating === undefined) {
          skill.rating = 0; // Set the default rating value here
        }
      });
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
            skill.rating = this.getRatingForSkill(skill) // Set default rating value
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
    // Retrieve the last ratings for each skill and set them as the default values
    // Retrieve the last ratings for each skill and set them as the default values



  }

  getAssessmentRating(skillId: number): number {
    const skill = this.skills.find(s => s.idSkill === skillId);
    const assessment = this.assessments.find(a => skill && a.skill.idSkill === skillId);
    return assessment ? assessment.rating : this.lastRating;
  }


  getCategories(): void {
    this.categoryService.getCategories()
      .subscribe(categories => this.categories = categories);
  }

  getSkills(): Observable<Skill[]> { return this.skillService.getSkills(); }

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

  getRatingForSkill(skill: Skill): number {
    const assessment = this.assessments.find(a => a.skill.idSkill === skill.idSkill && a.idEmployee === this.employee!.idEmployee);
    return assessment ? assessment.rating : this.lastRatings[skill.idSkill];
  }

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
    const data = { idEmployee, assessments };
    console.log("Our data is", data)
    this.http.post("http://10.66.12.54:8081/assessments/saveAssessments", data)
      .subscribe(
        response => {
          console.log(response);
          alert('Assessment submitted successfully');
          this.router.navigate(['/myassessmenthistory', this.idEmployee]);
        },
        error => {
          console.log(error);
          this.errorMessage = 'Failed to submit the assessment. Please try again later.';
        });
    console.log("Our Finally data is", data)
  }
  onRatingChange(skill: Skill, score: number) {
    this.currentRating = score;
    skill.rating = score;
    console.log(`The New Rating for ${skill.skillName} updated to ${skill.rating}`);
  }

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
    return this.lastRating;
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
  goToSkillsOverview() {
    this.router.navigate(['/team-levels'])
  }
  goToCompare() { this.router.navigate(['/qualification-comparison']) }
  goToSearch() { this.router.navigate(['/search']) }
  goToClientFeedback() { this.router.navigate(['/client-feedback', this.idEmployee]) }
}


