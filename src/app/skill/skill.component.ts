import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Assessment } from '../assessment/assessment.model';
import { Category } from '../category/category.model';
import { CategoryService } from '../category/category.service';
import { Skill } from './skill.model';
import { SkillService } from './skill.service';

@Component({
  selector: 'app-skill',
  templateUrl: './skill.component.html',
  styleUrls: ['./skill.component.css']
})
export class SkillComponent implements OnInit {
  id: number | undefined;
  skills: Skill[] = [];
  
  skillName: string | undefined;
  description: string | undefined;
  assessments!: Assessment[];
  category!: Category;


  constructor(private skillService: SkillService, private route: ActivatedRoute, private categoryService: CategoryService) {
   }

  ngOnInit(): void {
    this.categoryService.getCategories();
    this.skillService.getSkills().subscribe(skills => {
      this.skills = skills ?? [];
      console.log('Skill IDs:', this.skills.map(skill => skill.idSkill));

      this.id = +this.route.snapshot.paramMap.get('id')!;
      console.log('id:', this.id);

      if (this.skills.length > 0) {
        console.log('Skill IDs:', this.skills.map(skill => skill.idSkill));
      }
    });
  }

}
