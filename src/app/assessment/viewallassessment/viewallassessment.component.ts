import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { CategoryService } from 'src/app/category/category.service';
import { Employee } from 'src/app/employee-details/employee.model';
import { EmployeeService } from 'src/app/employee-details/employee.service';
import { Skill } from 'src/app/skill/skill.model';
import { SkillService } from 'src/app/skill/skill.service';
import { Assessment } from '../assessment.model';
import { AssessmentService } from '../assessment.service';
import { AssessmentDTO } from '../assessmentdto/assessmentdto.model';

@Component({
  selector: 'app-viewallassessment',
  templateUrl: './viewallassessment.component.html',
  styleUrls: ['./viewallassessment.component.css']
})
export class ViewallassessmentComponent implements OnInit {
  private apiUrl = 'http://localhost:8081';
  employees: Employee[] = [];
  id!: number;
  assessments: Assessment[] = [];
  skills: Skill[] = [];
  idEmployee!: number;
  employee!: Employee | undefined;
  skill!: Skill;
  rating!: number;
  assessment!: Assessment;
  assess!: Assessment;
  ratings: number[] = [];
  data: AssessmentDTO[] = [];

  constructor(
    private http: HttpClient,
    private employeeService: EmployeeService,
    private assessmentService: AssessmentService,
    private skillService: SkillService,
    private categoryService: CategoryService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  async ngOnInit(){
    this.assessmentService.getAssessmentsByEmployeeId(this.idEmployee).subscribe((data: any[]) => {
      this.assessments = data.map((assessmentData) => {
        const skill: Skill = {
          idSkill: assessmentData.idSkill,
          skillName: assessmentData.skillName,
          rating: assessmentData.rating,
          description: assessmentData.description,
          assessments: []
        };

        const assessment: Assessment = {
          idSkill:assessmentData.idSkill,
          idEmployee: assessmentData.idEmployee,
          idAssessment: assessmentData.idAssessment,
          skill: skill,
          skillName: skill.skillName,
          rating: assessmentData.rating,
          assessmentDate: assessmentData.date
        };

        return assessment;
      });
    });

  

    if (this.idEmployee !== undefined) {
      localStorage.setItem('idEmployee', this.idEmployee.toString());
    }
    // this.id = parseInt(localStorage.getItem('idEmployee') || '');
    this.getEmployees();
    this.skills = await this.getAllSkills().toPromise() ?? [];
    this.skill = this.skills[0];
    //console.log('this rating =', this.skills);
    
      this.assessments = await this.assessmentService.getAssessments(this.idEmployee).toPromise() ?? [];
     // console.log('this rating =', this.assessments);
    console.log(this.skills);
    // this.ratings = this.skill.idSkill;
    console.log('Assessment', this.assessments);
  
    
    this.getData().subscribe((data: AssessmentDTO[]) => {
      this.data = data;
    });
   // console.log('this rating =', this.rating);

  }
  
  
  getEmployees(): void {
    this.employeeService.getEmployees()
      .subscribe(employees => this.employees = employees);
  }
  getAssessments(): Observable<Assessment[]>{
    
    
      this.assessmentService.getAssessments(this.idEmployee)
        .subscribe(assessments => this.assessments = this.assessments);
    
      return this.assessmentService.getAssessments(this.idEmployee);
    console.log('Assessment', this.assessment);
  }
  getAssessmentsRating1(skillId: number): number {
    const skill = this.skills.find(s => s.idSkill === skillId);
    const assess = this.assessments.find(a => skill && a.skill.idSkill === skillId);
    return assess ? assess.rating : 0;
  }
  getAssessmentsRating(employeeId: number, skillId: number): number {
    const assess = this.assessments.find(a => a.employee?.idEmployee === employeeId && a.skill?.idSkill === skillId);
    return assess ? assess.rating : 0;
  }

  getAllAssessmentsRating(skillId: number): Observable<Assessment[]> {
    const skill = this.skills.find(s => s.idSkill === skillId);
    const assess = this.assessments.find(a => skill && a.skill.idSkill === skillId);

    return this.assessmentService.getAssessments(this.idEmployee);
  }
  getData(): Observable<AssessmentDTO[]> {
    this.id = parseInt(localStorage.getItem('idEmployee') || '');
    return this.http.get<AssessmentDTO[]>(`${this.apiUrl}/assessments/all/${this.id}`);
  }
  getSkills(): void {
    this.skillService.getSkills()
    .subscribe(skills => this.skills = skills);
  }
  getAllSkills(): Observable<Skill[]> {
    return this.skillService.getSkills();
  }
  getAssessmentRating(assessmentId:number): number{
    const assessment = this.assessments.find(a => a.idAssessment === assessmentId);
    return assessment ? assessment.rating : 0;
  }
  getSkillName(skillId: number): string {

    const skill = this.skills.find(s => s.idSkill === skillId);
    return skill ? skill.skillName : '';
  }
  getIdSkill(skillId: number): number {
    const skill = this.skills.find(s => s.idSkill === skillId);
    return skill ? skill.idSkill : 0;

  }




  logSkill(rating: number , skills : Skill[], skill : Skill) {
    const AssessmentDTO : any = {
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
  goToViewAllAssessment() {
    console.log('id notre emplyee' + this.idEmployee)
    // console.log('notre url :' + `${this.apiUrl}/assessments/all/${this.idEmployee}`)
    this.router.navigate(['/viewallassessment']);
    this.http.get(`${this.apiUrl}/assessments/all/${this.idEmployee}`);
    console.log('notre url :' + `${this.router}`)
  }




}
