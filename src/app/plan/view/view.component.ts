import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Toast, ToastrService } from 'ngx-toastr';
import { TimeSlot } from 'src/app/models/timeslot';
import { UserDayPlanSchedule, UserPlanSchedule } from 'src/app/models/user-plan-schedule';
import { PlanScheduleService } from 'src/app/service/plan-schedule.service';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.css']
})
export class ViewComponent implements OnInit {
  planDateId: number = 1;
  timeSlots: TimeSlot[] = [];
  userPlanSchedule!: UserPlanSchedule;
  toDoListCategoryItems: UserDayPlanSchedule[] = [];
  priorityCategoryItems: UserDayPlanSchedule[] = [];
  thingsToDoCategoryItems: UserDayPlanSchedule[] = [];
  planAndScheduleCategoryItems: UserDayPlanSchedule[] = [];
  selectedDate = new Date();


  constructor(private planScheduleService: PlanScheduleService,
    private router: Router, private route: ActivatedRoute, private toastr: ToastrService) { 

    }

  ngOnInit(): void {
    const routedParams = this.route.snapshot.paramMap;
    this.planDateId = Number(routedParams.get('planDayId'));
    this.getTimeSlots();
    this.getUserDayPlans();
  }

  getPlansByCategory() {
    this.priorityCategoryItems = this.userPlanSchedule.userDayPlanSchedules.filter(f => f.categoryId === 1);
    this.toDoListCategoryItems = this.userPlanSchedule.userDayPlanSchedules.filter(f => f.categoryId === 2);
    this.thingsToDoCategoryItems = this.userPlanSchedule.userDayPlanSchedules.filter(f => f.categoryId === 3);
    this.planAndScheduleCategoryItems = this.userPlanSchedule.userDayPlanSchedules.filter(f => f.categoryId === 4);
  }

  getTimeSlots() {
    this.planScheduleService.GetTimeSlots().subscribe(s => this.timeSlots = s);
  }
  getUserDayPlans() {
    this.planScheduleService.GetUserPlanSchedulesByPlanId(this.planDateId).subscribe({
      complete: () => {
      },
      error: (errorRes: HttpErrorResponse) => {
        if (errorRes.status === 404) {
          this.toastr.warning('No records found, please select from calendar', 'Incorrect selection');
        } else {
          this.toastr.error('It is from us!, please select from calendar', 'Something went wrong');
        }
      },
      next: (data) => {
        this.userPlanSchedule = data;        
        this.selectedDate = new Date(data.userDayPlanSchedules[0].planDate);
        this.getPlansByCategory();
      },
    });
  }

  getSlotName(timeSlotId: number) {
    const timeSlot = this.timeSlots.find(f => f.timeSlotId === timeSlotId);
    return timeSlot;
  }

  getPlanDate() {
    return this.userPlanSchedule ? new Date(this.userPlanSchedule.userDayPlanSchedules[0].planDate).toDateString() : '';
  }

  getDayName() {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    var d = new Date(this.getPlanDate());
    return days[d.getDay()];
  }

  selectedDateChanged(dateChanged: string){
    this.planScheduleService.GetUserPlanSchedules(new Date(dateChanged).toDateString()).subscribe({
      complete: () => {
      },
      error: (errorRes: HttpErrorResponse) => {
        if (errorRes.status === 404) {
          this.toastr.warning('No records found, please select from calendar', 'Incorrect selection');
          this.toastr.info('Loading previous date');
          this.getUserDayPlans();
        } 
      },
      next: (data) => {
        this.userPlanSchedule = data;
        this.selectedDate = new Date(data.userDayPlanSchedules[0].planDate);
        this.planDateId = data.userDayPlanSchedules[0].planDateId;
        this.getPlansByCategory();
      },
    });
  }

 
}
