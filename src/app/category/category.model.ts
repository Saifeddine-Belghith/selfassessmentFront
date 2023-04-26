import { Skill } from "../skill/skill.model";

export interface Category {
    idCategory: number;
    categoryName: string;
    skills: Skill[];
}