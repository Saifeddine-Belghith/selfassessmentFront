import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Chart, ChartConfiguration, ChartData, BarElement, BarController, CategoryScale, Decimation, Filler, Legend, Title, Tooltip, registerables } from 'chart.js';
import { Employee } from '../employee-details/employee.model';
import { EmployeeService } from '../employee-details/employee.service';
import { TeamAverageService } from './team-average.service';

@Component({
  selector: 'app-team-average',
  templateUrl: './team-average.component.html',
  styleUrls: ['./team-average.component.css']
})
export class TeamAverageComponent implements OnInit {
  isManager!: boolean;
  manager!: Employee;
  teamAverageData: any;
  chart!: Chart;
  idEmployee!: number;
  private apiUrl = 'http://10.66.12.54:8081';

  constructor(private route: ActivatedRoute, private router: Router, private activatedRoute: ActivatedRoute, private employeeService: EmployeeService, private teamAverageService: TeamAverageService, private http: HttpClient) {

  }

  ngOnInit(): void {
    this.idEmployee = parseInt(localStorage.getItem('idEmployee') || '');
    this.employeeService.getEmployeeById(this.idEmployee).subscribe(manager => {
      this.manager = manager;
      this.isManager = this.manager.isManager;
      console.log("is manager", this.isManager);
      if (this.isManager) {
        this.getTeamAverageData(this.idEmployee);
      }
    });
    Chart.register(...registerables);
  }

  getTeamAverageData(idEmployee: number) {
    this.teamAverageService.getTeamAverage(idEmployee).subscribe(data => {
      this.teamAverageData = data;
      console.log(this.teamAverageData);
      // call the method to draw the chart and pass the data to it
      this.drawChart(this.teamAverageData);
    });
  }

  drawChart(data: { skillName: string, averageRating: number }[]) {
    const canvas = document.getElementById('ratingChart') as HTMLCanvasElement;
    const labels = data.map((d) => d.skillName);
    const chartData = data.map((d) => ({ y: d.skillName, x: d.averageRating }));

    const chartConfig: ChartConfiguration<'bar', { x: number; y: string; }[]> = {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Average Rating',
          data: chartData,
          backgroundColor: 'rgba(54, 162, 235, 0.2)',
          borderColor: 'rgb(54, 162, 235)',
          borderWidth: 1
        }]
      },
      options: {

        indexAxis: 'y',


      }
    };

    const chart = new Chart(canvas, chartConfig);
  }

  goToHome() {
    this.router.navigateByUrl('/home');
  }

  goToProfile() {
    console.log('id before' + this.idEmployee)
    this.router.navigate(['/employees', this.idEmployee]);
  }

  goToAssessment() {
    this.router.navigate(['/assessment']);
  }
  goToPeople() {
    console.log('id notre emplyee' + this.idEmployee)
    // console.log('notre url :' + `${this.apiUrl}/assessments/all/${this.idEmployee}`)
    this.router.navigate(['/people']);
    // this.http.get(`${this.apiUrl}/assessments/all/${this.id}`);
    // console.log('notre url :' + `${this.router}`)
  }
  goToMyAssessmentHistory() {
    this.router.navigate(['/myassessmenthistory', this.idEmployee]);
  }
  goToMyRating() {
    console.log('id before' + this.idEmployee)
    this.router.navigate(['/rating-changes', this.idEmployee]);
  }
  goToSkillsOverview() {
    this.router.navigate(['/team-levels'])
  }
  goToTarget() {
    console.log('id before' + this.idEmployee)
    this.router.navigate(['/personal-target', this.idEmployee]);
  }
  goToCompare() { this.router.navigate(['/qualification-comparison']) }
  goToSearch() { this.router.navigate(['/search']) }
  goToClientFeedback() { this.router.navigate(['/client-feedback', this.idEmployee]) }
  goToAssistance() { this.router.navigate(['/assistance']) }
  goToSearchByPersonalTarget() { this.router.navigate(['/searchbypersonaltarget']) }
}