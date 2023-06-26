import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { Skill } from '../skill/skill.model';

@Injectable({
    providedIn: 'root'
})
export class SkillService {
    private apiUrl = 'http://10.66.12.54:8081/skill';
    skills: Skill[] = [];
    idSkill!: number;

    constructor(private http: HttpClient) { }

    getSkills(): Observable<Skill[]> {
        return this.http.get<Skill[]>('http://10.66.12.54:8081/skill/viewAll');
    }
    getSkillById(idSkill: number): Observable<Skill> {
        const url = `${this.apiUrl}/view/${idSkill}`;
        return this.http.get<Skill>(url).pipe(
            tap((skill: Skill) => this.skills.push(skill))
        );
    }
    getSkillName(idSkill: number): string {
        const skill = this.skills.find(skill => skill.idSkill === idSkill);
        return skill ? skill.skillName : 'Unknown skill';
    }
}