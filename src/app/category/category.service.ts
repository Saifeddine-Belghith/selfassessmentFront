import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { forkJoin, map, Observable, switchMap } from 'rxjs';
import { Category } from '../category/category.model';
import { Skill } from '../skill/skill.model';

@Injectable({
    providedIn: 'root'
})
export class CategoryService {
    private apiUrl = 'http://10.66.12.54:8081/categories';

    constructor(private http: HttpClient) { }

    getCategories(): Observable<Category[]> {
        return this.http.get<Category[]>(this.apiUrl);
    }
    getCategoriesWithSkills(): Observable<Category[]> {
        return this.http.get<Category[]>(`${this.apiUrl}`).pipe(
            switchMap(categories => {
                const observables = categories.map(category =>
                    this.http.get<Skill[]>(`${this.apiUrl}/categories/${category.idCategory}/skills`).pipe(
                        map(skills => {
                            category.skills = skills;
                            return category;
                        })
                    )
                );
                return forkJoin(observables);
            })
        );
    }
}
