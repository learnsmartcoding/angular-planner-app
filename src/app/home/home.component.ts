import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { UserPlanDate } from '../models/user-plan-date';
import { PlanScheduleService } from '../service/plan-schedule.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  monthDays: number[] = [];
  today = new Date();
  userPlanDates: UserPlanDate[] = [];

  constructor(
    private titleService: Title,
    private planScheduleService: PlanScheduleService,
    private router: Router
  ) {
    titleService.setTitle('Welcome to Planner! | Learn Smart Coding');
  }

  ngOnInit(): void {
    const daysCount = this.daysInMonth(this.today.getMonth() + 1, this.today.getFullYear());

    for (let index = 1; index <= daysCount; index++) {
      this.monthDays.push(index);
    }
    this.getPlansByDate();
  }

  daysInMonth(month: number, year: number) {
    return new Date(year, month, 0).getDate();
  }

  getDayDetails(day: number) {
    return new Date(this.today.getFullYear(), this.today.getMonth(), day).toDateString();
  }

  getDateByDay(day: number) {
    return new Date(this.today.getFullYear(), this.today.getMonth(), day);
  }

  getHighlightCss(day: number) {
    return +day === this.today.getDate() ? 'highlightToday' : 'front-card-default-color';
  }

  getPlansByDate() {
    const daysCount = this.daysInMonth(this.today.getMonth(), this.today.getFullYear());
    const toDate = this.convertToDateFormat(this.getDateByDay(daysCount));
    const fromDate = this.convertToDateFormat(new Date(this.getDayDetails(1)));

    this.planScheduleService.GetUserPlanByDates(fromDate, toDate).subscribe(s => {
      this.userPlanDates = s;
      this.isPlanPresentForDay(2);
    });
  }

  convertToDateFormat(d: Date) {
    const dateToConvert = new Date(d);
    const dateToReturn = [
      dateToConvert.getFullYear(),
      ('0' + (dateToConvert.getMonth() + 1)).slice(-2),
      ('0' + dateToConvert.getDate()).slice(-2)
    ].join('-');

    return dateToReturn;
  }

  isPlanPresentForDay(day: number) {
    const dateToLook = this.convertToDateFormat(this.getDateByDay(day));
    return this.userPlanDates.filter(s => this.convertToDateFormat(s.planDate) === dateToLook);
  }

  viewPlanDetails(day: number, path: string) {
    const plan = this.isPlanPresentForDay(day);
    const urlPath = `plan/${path}/${plan ? plan[0].planDateId : 0}`;
    this.router.navigateByUrl(urlPath);
  }

}
