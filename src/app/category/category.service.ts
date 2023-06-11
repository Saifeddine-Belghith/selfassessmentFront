import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { forkJoin, map, Observable, switchMap } from 'rxjs';
import { Category } from '../category/category.model';
import { Skill } from '../skill/skill.model';

@Injectable({
    providedIn: 'root'
})
export class CategoryService {
    private apiUrl = 'http://localhost:8081/categories';

    constructor(private http: HttpClient) { }

    getCategories(): Observable<Category[]> {
        return this.http.get<Category[]>(this.apiUrl);
    }
    getCategoriesWithSkills(): Observable<Category[]> {
        return this.http.get<Category[]>(`${this.apiUrl}`).pipe(
            switchMap(categories => {
                const observables = categories.map(category =>
                    this.http.get<Skill[]>(`${this.apiUrl}/${category.idCategory}`).pipe(
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

    getCategoryByIdCategory(idCategory: number): Observable<string> {
        const url = `${this.apiUrl}/${idCategory}`;

        return this.http.get<Category>(url).pipe(
            map((category: Category) => category.categoryName)
        );
    }



}
