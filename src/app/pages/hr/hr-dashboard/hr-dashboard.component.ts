import { UserInfoService } from './../../../services/user/user-info.service';
import { MorningAuthorisationService } from './../../../services/morningAuthorisation/morning-authorisation.service';
import { ExitAuthorisationService } from './../../../services/exitAuthorisation/exit-authorisation.service';
import { VacationService } from './../../../services/vacation/vacation.service';
import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { Chart, ChartConfiguration, registerables } from 'chart.js';

@Component({
  selector: 'app-hr-dashboard',
  standalone: true,
  imports: [],
  templateUrl: './hr-dashboard.component.html',
  styleUrl: './hr-dashboard.component.css'
})
export class HrDashboardComponent {

  @ViewChild('barCanvas') private barCanvas!: ElementRef;
  @ViewChild('pieCanvas') private pieCanvas!: ElementRef;
  @ViewChild('doughnutCanvas') private doughnutCanvas!: ElementRef;
  @ViewChild('exitDoughnutCanvas') private exitDoughnutCanvas!: ElementRef;
  @ViewChild('morningDoughnutCanvas') private morningDoughnutCanvas!: ElementRef;
  @ViewChild('ageEmployeeCanvas') private ageEmployeeCanvas!: ElementRef;
  @ViewChild('ageSpecialityCanvas') private ageSpecialityCanvas!: ElementRef;
  @ViewChild('ageJobCanvas') private ageJobCanvas!: ElementRef;
  @ViewChild('DiplomeCanvas') private DiplomeCanvas!: ElementRef;


  public acceptedExitCount: number = 0;
  public notAcceptedExitCount: number = 0;
  public acceptedMorningDelayCount: number = 0;
  public notAcceptedMorningDelayCount: number = 0;

  private barChart: Chart | undefined;
  private pieChart: Chart | undefined;
  private doughnutChart: Chart | undefined;
  private exitDoughnutChart: Chart | undefined;
  private morningDoughnutChart: Chart | undefined;
  private ageEmployeeChart: Chart | undefined;
  private ageSpecialityChart: Chart | undefined;
  private ageJobChart: Chart | undefined;
  private DiplomeChart: Chart | undefined;


  constructor(
    private vacationService: VacationService,
    private exitAuthorisationService: ExitAuthorisationService,
    private morningAuthorisationService: MorningAuthorisationService,
    private userInfoService: UserInfoService

  ) {
    Chart.register(...registerables);
  }

  ngAfterViewInit() {
    this.createBarChart();
    this.createPieChart();
    this.createDoughnutChart();
    this.fetchCounts();
    this.createAgeEmployeeState();
    this.createEmployeeSpeciality();
    this.createEmployeeJob();
    this.createEmployeeDiplome();

  }

  createBarChart() {
    if (!this.barCanvas) {
      console.error('Bar chart canvas is not available yet.');
      return;
    }

    // Define all 12 months in Arabic
    const allMonthsInArabic = [
      'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
      'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
    ];

    // Fetch data from UserInfoService to display account counts by month
    this.userInfoService.getAccountCountByMonth().subscribe((data) => {
      // Prepare a map for months and counts
      const monthCountsMap: { [key: string]: number } = {};

      // Initialize all months with 0 count
      allMonthsInArabic.forEach((month, index) => {
        monthCountsMap[`${index + 1}`] = 0; // Use month numbers (1-12) as keys
      });

      // Map the fetched data to months, ensuring each month has a count
      data.forEach((item: any) => {
        const monthIndex = item.month; // Assuming month is returned as a number (1-12)
        monthCountsMap[`${monthIndex}`] = item.count; // Update the count for the given month
      });

      // Extract counts in the order of the months (from January to December)
      const counts = allMonthsInArabic.map((_, index) => monthCountsMap[`${index + 1}`]);

      // Configuration for the bar chart
      const barChartConfig: ChartConfiguration = {
        type: 'bar',
        data: {
          labels: allMonthsInArabic, // Use the Arabic month names
          datasets: [
            {
              label: 'عدد الحسابات الجديدة', // "Number of new accounts" in Arabic
              data: counts, // Use the counts array with all 12 months
              borderColor: '#23689B',
              backgroundColor: 'rgba(35, 104, 155, 0.5)',
              tension: 0.4,
              fill: true,
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              display: false,
            },
          },
          scales: {
            x: {
              grid: {
                display: false,
              },
            },
            y: {
              beginAtZero: true,
              grid: {
                display: true,
              },
            },
          },
        },
      };

      // Create the bar chart
      new Chart(this.barCanvas.nativeElement, barChartConfig);
    }, error => {
      console.error('Error fetching account count data:', error);
    });
  }

  createPieChart() {
    if (!this.pieCanvas || this.pieChart) return;

    this.vacationService.getVacationCounts().subscribe((data) => {
      const labels = ['تحت الاجراء', 'مرفوض', 'مقبول'];
      const counts = [data.inProgress, data.refused, data.accepted];

      const pieChartConfig: ChartConfiguration = {
        type: 'pie',
        data: {
          labels: labels,
          datasets: [
            {
              data: counts,
              backgroundColor: ['#0799BC', 'coral', 'mediumseagreen'],
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: 'top',
            },
            tooltip: {
              callbacks: {
                label: (context: any) => `${context.label}: ${context.raw}`,
              },
            },
          },
        },
      };

      this.pieChart = new Chart(this.pieCanvas.nativeElement, pieChartConfig);
    });
  }

  createDoughnutChart() {
    if (!this.doughnutCanvas || this.doughnutChart) return;

    const doughnutChartConfig: ChartConfiguration = {
      type: 'doughnut',
      data: {
        labels: ['مكتمل', 'تحت الاجراء', 'معلق'],
        datasets: [
          {
            data: [120, 150, 90],
            backgroundColor: ['#23689B', '#487E95', '#D9DAB0'],
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: 'top' },
        },
      },
    };

    this.doughnutChart = new Chart(this.doughnutCanvas.nativeElement, doughnutChartConfig);
  }

  fetchCounts() {
    this.exitAuthorisationService.getExitCounts().subscribe((data) => {
      this.acceptedExitCount = data.accepted;
      this.notAcceptedExitCount = data.notAccepted;
      this.createExitDoughnutChart();
    });

    this.morningAuthorisationService.getMorningDelayCounts().subscribe((data) => {
      this.acceptedMorningDelayCount = data.accepted;
      this.notAcceptedMorningDelayCount = data.notAccepted;
      this.createMorningDoughnutChart();
    });
  }

  createExitDoughnutChart() {
    if (!this.exitDoughnutCanvas || this.exitDoughnutChart) return;

    const exitDoughnutConfig: ChartConfiguration = {
      type: 'doughnut',
      data: {
        labels: ['مقبول', 'غير مقبول'],
        datasets: [
          {
            data: [this.acceptedExitCount, this.notAcceptedExitCount],
            backgroundColor: ['#0799BC', 'darksalmon'],
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: 'top' },
        },
      },
    };

    this.exitDoughnutChart = new Chart(this.exitDoughnutCanvas.nativeElement, exitDoughnutConfig);
  }

  createMorningDoughnutChart() {
    if (!this.morningDoughnutCanvas || this.morningDoughnutChart) return;

    const morningDoughnutConfig: ChartConfiguration = {
      type: 'pie',
      data: {
        labels: ['مقبول', 'غير مقبول'],
        datasets: [
          {
            data: [this.acceptedMorningDelayCount, this.notAcceptedMorningDelayCount],
            backgroundColor: ['darkolivegreen', 'chocolate'],
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: 'top' },
        },
      },
    };

    this.morningDoughnutChart = new Chart(this.morningDoughnutCanvas.nativeElement, morningDoughnutConfig);
  }







  createAgeEmployeeState() {
    if (!this.ageEmployeeCanvas || this.ageEmployeeChart) return;
    this.userInfoService.getDistinctcount().subscribe((data) => {
      const ageEmployeeConfig: ChartConfiguration = {
        type: 'line',

        data: {
          labels: data,
          datasets: [
            {
              data: data,
              backgroundColor: ['darkolivegreen', 'chocolate'],
            },
          ],
        },
        options: {
          responsive: true,

          plugins: {

            legend: { display: false, position: 'top' },
          },
        },
      };
      this.ageEmployeeChart = new Chart(this.ageEmployeeCanvas.nativeElement, ageEmployeeConfig);
    });
  }

























  createEmployeeSpeciality() {
    if (!this.ageSpecialityCanvas || this.ageSpecialityChart) return;



    this.userInfoService.getStatSpeciality().subscribe((data) => {


      const datalbl = [''];
      const datavlu = [0];
      [...data].forEach(item => {

        datalbl.push(item.descrip)
        datavlu.push(item.count)

      });
      console.log([...datavlu])

      const ageSpecialityConfig: ChartConfiguration = {




        type: 'bar',

        data: {
          labels: datalbl,
          datasets: [
            {
              data: datavlu,
              backgroundColor: ['darkolivegreen', 'darkgrey'],
            },
          ],
        },
        options: {
          responsive: false,

          plugins: {

            legend: { display: false, position: 'top' },
          },
        },


      };

      this.ageSpecialityChart = new Chart(this.ageSpecialityCanvas.nativeElement, ageSpecialityConfig);
    });
  }






  createEmployeeJob() {
    if (!this.ageJobCanvas || this.ageJobChart) return;



    this.userInfoService.getStatJob().subscribe((data) => {


      const datalbl = [''];
      const datavlu = [0];
      [...data].forEach(item => {

        datalbl.push(item.descrip)
        datavlu.push(item.count)

      });
      console.log([...datavlu])

      const ageJobConfig: ChartConfiguration = {




        type: 'bar',

        data: {
          labels: datalbl,
          datasets: [
            {
              data: datavlu,
              backgroundColor: ['darkorchid', 'chocolate'],
            },
          ],
        },
        options: {
          responsive: false,

          plugins: {

            legend: { display: false, position: 'top' },
          },
        },


      };

      this.ageJobChart = new Chart(this.ageJobCanvas.nativeElement, ageJobConfig);
    });
  }






  createEmployeeDiplome() {
    if (!this.DiplomeCanvas || this.DiplomeChart) return;



    this.userInfoService.getStatDiplome().subscribe((data) => {


      const datalbl = [''];
      const datavlu = [0];
      [...data].forEach(item => {

        datalbl.push(item.descrip)
        datavlu.push(item.count)

      });
      console.log([...datavlu])

      const DiplomeConfig: ChartConfiguration = {




        type: 'bar',

        data: {
          labels: datalbl,
          datasets: [
            {
              data: datavlu,
              backgroundColor: ['darkolivegreen', 'chocolate'],
            },
          ],
        },
        options: {
          responsive: false,

          plugins: {

            legend: { display: false, position: 'top' },
          },
        },


      };

      this.DiplomeChart = new Chart(this.DiplomeCanvas.nativeElement, DiplomeConfig);
    });
  }

}









