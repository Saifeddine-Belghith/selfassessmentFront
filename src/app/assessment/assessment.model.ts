import { Employee } from "../employee-details/employee.model";
import { Skill } from "../skill/skill.model";

export interface Assessment {
    idEmployee: number;
    idAssessment: number;
    employee?: Employee;
    skill: Skill;
    rating: number;
    assessmentDate: Date;
    idSkill: number;
    skillName: string;
   
}