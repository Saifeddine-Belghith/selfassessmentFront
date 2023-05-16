import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-personal-target',
  templateUrl: './personal-target.component.html',
  styleUrls: ['./personal-target.component.css']
})
export class PersonalTargetComponent implements OnInit {

  years: number[] = [];
  constructor() {
    for (let i = 2023; i <= 2040; i++) {
      this.years.push(i);
    }
   }

  ngOnInit(): void {
  }

}
