import { Assessment } from "../assessment/assessment.model";
import { Category } from "../category/category.model";

export interface Skill {
    
    idSkill: number;
    rating: number;
    skillName: string;
    description: string;
    assessments?: Assessment[];
    category?: Category;
}
