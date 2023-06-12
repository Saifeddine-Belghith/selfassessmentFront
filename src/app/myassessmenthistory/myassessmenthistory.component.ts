import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, forkJoin } from 'rxjs';
import { Assessment } from '../assessment/assessment.model';
import { Employee } from '../employee-details/employee.model';
import { EmployeeService } from '../employee-details/employee.service';
import { Skill } from '../skill/skill.model';
import { SkillService } from '../skill/skill.service';
import { CategoryService } from '../category/category.service';
import { Category } from '../category/category.model';
import { AssessmentService } from '../assessment/assessment.service';


@Component({
  selector: 'app-myassessmenthistory',
  templateUrl: './myassessmenthistory.component.html',
  styleUrls: ['./myassessmenthistory.component.css']
})
export class MyassessmenthistoryComponent implements OnInit {
  assessments: Assessment[] = [];
  assessment!: Assessment;
  skills: Skill[] = [];
  categories: Category[] = [];
  category!: Category;
  skill!: Skill;
  idEmployee!: number;
  employee!: Employee;
  coachee!: Employee;
  idSkill!: number;
  name!: string;
  coach!: Employee;
  id!: number;
  coacheeId!: number;
  skillCategoryMap: { [key: number]: string } = {}; // Skill ID to Category Name mapping
  skillName: string[] | undefined;
  isCoach: boolean = false;
  isManager: boolean = false;
  categoriesId: (number | undefined)[] = []; // Declare categoriesId as a class property
  categoryIdSet: Set<number | undefined> = new Set(); // Declare categoryIdSet as a class property
  filteredAssessments: { category: string, assessments: Assessment[] }[] = [];
  groupedAssessments!: ({ category: string; assessments: Assessment[]; date: Date; } | { category: string; assessments: Assessment[]; date: string; newestAssessment: Assessment | null; })[];
  coacheeFirstName: string = '';
  coacheeLastName: string = '';
  categoryColors: { [categoryName: string]: string } = {};
  sortColumn: string = '';
  sortOrder: 'asc' | 'desc' = 'asc';
  sortBy: string = '';
  sortDirection: string = '';
  constructor(
    private http: HttpClient,
    private activatedRoute: ActivatedRoute,
    private employeeService: EmployeeService,
    private route: ActivatedRoute,
    public skillService: SkillService,
    private router: Router,
    private categoryService: CategoryService,
    private assessmentService: AssessmentService
  ) { }

  ngOnInit(): void {
    this.id = parseInt(localStorage.getItem('idEmployee') || '');
    console.log('id of this employee' + this.id);
    this.categories = [];
    this.coacheeId = this.activatedRoute.snapshot.params['id'];
    this.getCoacheeDetails(this.coacheeId);

    this.employeeService.getEmployeeById(this.id).subscribe(employee => {
      this.employee = employee;
    });
    this.isCoach = this.employee?.isCoach;
    this.isManager = this.employee?.isManager;
    console.log("is coach", this.isCoach)
    console.log("id emp", this.id)
    console.log('coachee ID:', this.coacheeId);
    this.getCoacheeDetails(this.coacheeId);
    this.employeeService.getEmployeeById(this.coacheeId).subscribe(coachee => {
      this.coachee = coachee;
    });

    const assessmentsUrl = `http://10.66.12.54:8081/assessments/employee/${this.coacheeId}`;
    const categoriesUrl = 'http://10.66.12.54:8081/categories';

    forkJoin({
      assessments: this.http.get<Assessment[]>(assessmentsUrl),
      categories: this.http.get<Category[]>(categoriesUrl)
    }).subscribe(({ assessments, categories }) => {
      this.assessments = assessments;
      this.categories = this.getSortedCategories(categories);
      this.groupAssessmentsByCategory();
      this.calculateCategoryColors();
    });
  }



  // Retrieve the categories with skills
  // this.categoryService.getCategoriesWithSkills().subscribe(categories => {
  //   this.categories = this.getSortedCategories(categories);

  getCategoryName(skillId: number): string {
    let categoryName = '';

    for (const category of this.categories) {
      if (Array.isArray(category.skills)) {
        const skill = category.skills.find(skill => skill.idSkill === skillId);
        if (skill) {
          categoryName = category.categoryName;
          break; // Exit the loop if a matching skill is found

        }
      }
    }


    return categoryName;
  }

  // groupAssessmentsByCategory(): void {
  //   this.groupedAssessments = [];

  //   this.assessments.forEach(assessment => {
  //     const category = this.getCategoryName(assessment.idSkill);
  //     const skill = this.getSkill(assessment.idSkill);
  //     const existingGroup = this.groupedAssessments.find(group => group.category === category);

  //     if (existingGroup) {
  //       existingGroup.assessments.push({
  //         ...assessment,
  //         skill: skill || { idSkill: 0, skillName: '', description: '', rating: 0 } // Include the 'rating' property
  //       });
  //     } else {
  //       this.groupedAssessments.push({
  //         category,
  //         assessments: [{
  //           ...assessment,
  //           skill: skill || { idSkill: 0, skillName: '', description: '', rating: 0 } // Include the 'rating' property
  //         }]
  //       });
  //     }
  //   });
  // }



  getSortedCategories(categories: Category[]): Category[] {
    // Sort the categories based on a specific criterion (e.g., category name)
    return categories.sort((a, b) => a.categoryName.localeCompare(b.categoryName));
  }

  getAssessmentRating(assessment: Assessment, skill: Skill): number {
    const matchingAssessment = this.assessments.find(a => a.idSkill === skill.idSkill);
    return matchingAssessment ? matchingAssessment.rating : 0;
  }

  getSkillName(idSkill: number): string {
    const skill = this.skills.find(skill => skill.idSkill === idSkill);
    return skill ? skill.skillName : 'Unknown skill';
  }


  getSkill(skillId: number): Skill | undefined {
    let foundSkill: Skill | undefined = undefined;

    for (const category of this.categories) {
      if (Array.isArray(category.skills)) {
        const skill = category.skills.find(skill => skill.idSkill === skillId);
        if (skill) {
          foundSkill = skill;
          break; // Exit the loop if a matching skill is found
        }
      }
    }

    return foundSkill;
  }


  getRating(skill: Skill): number {
    const assessment = this.assessments.find(a => a.idSkill === skill.idSkill);
    return assessment ? assessment.rating : 0;
  }

  getDate(skill: Skill): string {
    const assessment = this.assessments.find(a => a.idSkill === skill.idSkill);

    return assessment ? (assessment.assessmentDate instanceof Date ? assessment.assessmentDate.toLocaleDateString('en-GB') : '') : '';


  }

  getAssessmentsBySkill(skill: Skill): Assessment[] {
    return this.assessments.filter(assessment => assessment.idSkill === skill.idSkill);
  }



  getUniqueSkills(category: any): any[] {
    const uniqueSkills: any[] = [];
    category.assessments.forEach((assessment: any) => {
      const existingSkill = uniqueSkills.find(skill => skill.idSkill === assessment.skill.idSkill);
      if (!existingSkill) {
        uniqueSkills.push(assessment.skill);
      }
    });
    return uniqueSkills;
  }



  getSkillAssessmentCount(category: any, skill: any): number {
    return category.assessments.filter((assessment: any) => assessment.skill.idSkill === skill.idSkill).length;
    console.log('Category:', category.assessments);
    console.log('Skill:', skill);
    console.log('Assessment:', category.assessments.length);
  }


  getSkillRating(category: any, skill: any): number {
    const assessment = category.assessments.find((assessment: any) => assessment.skill.idSkill === skill.idSkill);
    console.log('Category:', category);
    console.log('Skill:', skill);
    return assessment ? assessment.rating : 0;
  }

  getSkillAssessmentDate(category: any, skill: any): string {
    if (category && category.assessments) {
      const assessment = category.assessments.find((assessment: any) => assessment.skill.idSkill === skill.idSkill);
      console.log('Category:', category);
      console.log('Skill:', skill);
      console.log('Assessment:', assessment);
      console.log('Original assessmentDate:', this.getDate(skill));
      return assessment ? assessment.assessmentDate : '';

    }
    return '';
  }

  // getCategoryColor(category: string): string {
  //   const colors = ['category-color1', 'category-color2', 'category-color3']; // Define different CSS classes for colors
  //   const categoryColorMap = new Map<string, string>();

  //   // Assign colors to each category
  //   for (let i = 0; i < this.groupedAssessments.length; i++) {
  //     const currentCategory = this.groupedAssessments[i].category;
  //     if (!categoryColorMap.has(currentCategory)) {
  //       const colorIndex = categoryColorMap.size % colors.length;
  //       categoryColorMap.set(currentCategory, colors[colorIndex]);
  //     }
  //   }

  //   // Retrieve the color for the current category
  //   return categoryColorMap.get(category) || '';
  // }


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





  sortAssessmentsByDateDescending(assessments: Assessment[]): Assessment[] {
    return assessments.slice(1).sort((a, b) => new Date(b.assessmentDate).getTime() - new Date(a.assessmentDate).getTime());
  }


  getSkillRowCount(category: any, skill: any): number {
    return category.assessments.filter((assessment: any) => assessment.skill.idSkill === skill.idSkill).length;
  }



  // Function to handle sorting
  sort(column: string): void {
    if (column === this.sortBy) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortBy = column;
      this.sortDirection = 'asc';
    }

    // Perform the sorting based on the selected column
    switch (column) {
      case 'category':
        this.groupedAssessments.sort((a, b) => {
          const categoryA = a.category.toLowerCase();
          const categoryB = b.category.toLowerCase();
          return this.sortDirection === 'asc' ? categoryA.localeCompare(categoryB) : categoryB.localeCompare(categoryA);
        });
        break;
      case 'skill':
        this.groupedAssessments.sort((a, b) => {
          const skillA = a.assessments[0].skill.skillName.toLowerCase();
          const skillB = b.assessments[0].skill.skillName.toLowerCase();
          return this.sortDirection === 'asc' ? skillA.localeCompare(skillB) : skillB.localeCompare(skillA);
        });
        break;
      case 'rating':
        // Implement sorting logic for the rating column if needed
        break;
      case 'date':
        this.groupedAssessments.sort((a, b) => {
          const dateA = new Date(a.assessments[0].assessmentDate).getTime();
          const dateB = new Date(b.assessments[0].assessmentDate).getTime();
          return this.sortDirection === 'asc' ? dateA - dateB : dateB - dateA;
        });
        break;
      default:
        break;
    }
  }


  // const skillObservables = this.assessments.map(assessment => {
  //   return this.skillService.getSkillById(assessment.idSkill);


  // forkJoin(skillObservables).subscribe(skills => {
  //   this.skillName = skills.map(skill => skill.skillName);
  //   console.log('Skill names:', this.skillName);
  //   this.groupAssessmentsByCategory(); // Group the assessments by category
  // });





  // this.http.get('http://10.66.12.54:8081/categories').subscribe(data => {
  //   this.categories = (data as Category[]);
  //   this.categories.forEach(category => {

  //     this.http.get<Skill[]>(`http://10.66.12.54:8081/skill/category/${category.idCategory}`).subscribe(skills => {
  //       category.skills = skills;
  //       // skills.forEach(skill => {
  //       //   // skill.rating = this.getRatingForSkill(this.assessment, this.assessment.idSkill) // Set default rating value
  //       // });
  //     });
  //   });
  // });


  // this.name = this.getSkillName(this.assessment.idSkill);
  // console.log('skilllll name', this.name);
  // const categorynametest = this.getCategoryName(this.assessment.skill.category?.idCategory as number)
  // console.log("cat is ", categorynametest)

  // groupAssessmentsByCategory(): void {
  //   const groupedAssessments = this.assessments.reduce((groups: { [key: string]: { category: string, assessments: Assessment[] } }, assessment) => {
  //     const category = assessment.skill?.category?.categoryName || '';
  //     if (!groups[category]) {
  //       groups[category] = { category, assessments: [] };
  //     }
  //     groups[category].assessments.push(assessment);
  //     return groups;
  //   }, {} as { [key: string]: { category: string, assessments: Assessment[] } });
  //   this.filteredAssessments = Object.values(groupedAssessments);
  // }


  // Populate the groupedAssessments array with data
  groupAssessmentsByCategory(): void {
    this.groupedAssessments = [];
    const latestAssessments: { [key: number]: Assessment } = {};

    this.assessments.forEach(assessment => {
      const category = this.getCategoryName(assessment.idSkill);
      const skill = this.getSkill(assessment.idSkill);
      console.log('Original assessmentDate:', this.getSkillAssessmentDate(category, skill));

      const assessmentDate = new Date(this.getSkillAssessmentDate(category, skill));
      const existingGroup = this.groupedAssessments.find(group => group.category === category && group.date === assessmentDate);

      if (!latestAssessments[assessment.idSkill] || assessmentDate > new Date(latestAssessments[assessment.idSkill].assessmentDate)) {
        latestAssessments[assessment.idSkill] = {
          ...assessment,
          skill: skill || { idSkill: 0, skillName: '', description: '', rating: 0 }
        };
      }

      if (existingGroup) {
        existingGroup.assessments.push({
          ...assessment,
          skill: skill || { idSkill: 0, skillName: '', description: '', rating: 0 },
          rating: assessment.rating // Include the 'rating' property
        });
      } else {
        this.groupedAssessments.push({
          category,
          assessments: [{
            ...assessment,
            skill: skill || { idSkill: 0, skillName: '', description: '', rating: 0 },
            rating: assessment.rating // Include the 'rating' property
          }],
          date: assessmentDate
        });
      }
    });

    this.groupedAssessments.forEach(group => {
      const newestAssessment = group.assessments.reduce((latest: Assessment | null, current: Assessment) => {
        if (!latest || new Date(current.assessmentDate) > new Date(latest.assessmentDate)) {
          return current;
        }
        return latest;
      }, null);

      (group as { newestAssessment: Assessment | null }).newestAssessment = newestAssessment;
    });
  }

  isLatestAssessment(group: any, assessment: any): boolean {
    if (!group || !group.assessments) {
      return false;
    }

    const latestAssessment = group.assessments.reduce((latest: any, current: any) => {
      return new Date(current.assessmentDate) > new Date(latest.assessmentDate) ? current : latest;
    });

    return assessment === latestAssessment;
  }


  calculateCategoryColors() {
    const categories = this.groupedAssessments.map(group => group.category);
    const uniqueCategories = [...new Set(categories)]; // Get unique categories

    this.categoryColors = {};

    let colorIndex = 0;
    for (const category of uniqueCategories) {
      if (!this.categoryColors[category]) {
        this.categoryColors[category] = `category-color${colorIndex + 1}`;
        colorIndex = (colorIndex + 1) % 3; // Ensure cycling through available colors
      }
    }
  }


  getCategoryColor(category: string): string {
    return this.categoryColors[category];
  }
  // Call the groupAssessmentsByCategory function to populate and display the table


  generateTableHTML(): string {
    let tableHTML = '';

    this.groupedAssessments.forEach(group => {
      // Create the group row with category information
      tableHTML += `<tr><td class="category-name" rowspan="${group.assessments.length}">${group.category}</td></tr>`;

      // Create the assessment rows within the group
      group.assessments.forEach((assessment, index) => {
        if (index > 0) {
          tableHTML += `
          <tr>
            <td class="skill-name">${assessment.skill.skillName}</td>
            <td class="rating">${assessment.rating}</td>
            <td class="date">${assessment.assessmentDate}</td>
          </tr>
        `;
        }
      });

      // Add a separator row
      tableHTML += '<tr><td colspan="3">****************************************************************************************************</td></tr>';
    });

    return tableHTML;
  }
  // Populate the groupedAssessments array with data
  // groupAssessmentsByCategory(): void {
  //   this.groupedAssessments = [];

  //   this.assessments.forEach(assessment => {
  //     const category = this.getCategoryName(assessment.idSkill);
  //     const skill = this.getSkill(assessment.idSkill);
  //     const existingGroup = this.groupedAssessments.find(group => group.category === category);

  //     if (existingGroup) {
  //       existingGroup.assessments.push({
  //         ...assessment,
  //         skill: skill || { idSkill: 0, skillName: '', description: '', rating: 0 } // Include the 'rating' property
  //       });
  //     } else {
  //       this.groupedAssessments.push({
  //         category,
  //         assessments: [{
  //           ...assessment,
  //           skill: skill || { idSkill: 0, skillName: '', description: '', rating: 0 } // Include the 'rating' property
  //         }]
  //       });
  //     }
  //   });

  //   this.renderTable(); // Call the renderTable function to display the table
  // }

  // groupAssessmentsByCategory();


  // getAssessmentRating(skillId: number): number {
  //   const skill = this.skills.find(s => s.idSkill === skillId);
  //   const assessment = this.assessments.find(a => skill && a.skill.idSkill === skillId);
  //   return assessment ? assessment.rating : skill?.rating || 0;
  // }





  // getRatingForSkill(skill: Skill): number {
  //   const assessment = this.assessments.find(a => a.skill.idSkill === skill.idSkill && a.idEmployee === this.employee!.idEmployee);
  //   return assessment ? assessment.rating : this.skill.rating;
  // }
  getRatingForSkill(assessment: any, skillId: number): number {
    const skillRating = assessment[skillId]?.rating;
    return skillRating !== undefined ? skillRating : 0; // Replace 0 with the default rating value if desired
  }

  // getCategories(): Observable<Category[]> {
  //   return this.categoryService.getCategories();
  // }
  // getCategoryName(categoryId: number): string {
  //   const category = this.categories.find(category => category.idCategory === categoryId);
  //   return category ? category.categoryName : 'Unknown category';
  // }


  // getCategoryName(categoryId: number | undefined): string {
  //   if (categoryId !== undefined) {
  //     const category = this.categories.find(category => category.idCategory === categoryId);
  //     return category?.categoryName || '';
  //   }
  //   return '';
  // }
  // getCategoryNameBySkillId(skillId: number): string {
  //   return this.skillCategoryMap[skillId] || '';
  // }

  getAssessmentsByCategory(categoryId: number): Assessment[] {
    return this.assessments.filter(assessment => assessment.skill?.category?.idCategory === categoryId);
  }


  goToHome() { this.router.navigateByUrl('/home'); }

  goToProfile() {
    console.log('id before' + this.id)
    this.router.navigate(['/employees', this.id]);
  }

  goToAssessment() { this.router.navigate(['/assessment']); }
  goToPeople() {
    console.log('id notre emplyee' + this.idEmployee)
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
}

