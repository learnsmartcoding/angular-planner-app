import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { TimeSlot } from 'src/app/models/timeslot';
import { UserDayPlanSchedule } from 'src/app/models/user-plan-schedule';

@Component({
  selector: 'app-view-plans',
  templateUrl: './view-plans.component.html',
  styleUrls: ['./view-plans.component.css']
})
export class ViewPlansComponent implements OnInit {
  name!: string;
  @Input()
  plansSchedules: UserDayPlanSchedule[] = [];

  @Input() categoryId!: number;
  @Input()
  timeSlots: TimeSlot[] = [];

  @Input()
  useSlotName: boolean = false;

  constructor() { }

  ngOnInit(): void {

  }

  ngOnChanges(changes: SimpleChanges) {
    this.getSlotName();
    this.populateMissingPlans();
    this.populateMissingPlansAndSchedules();
  }

  getCategoryName(caetegoryId: number) {
    return this.timeSlots.find(f => f.categoryId === caetegoryId)?.categoryName || '';
  }
  getSlotName() {
    this.name = this.getCategoryName(this.categoryId);
  }

  populateMissingPlans() {
    if (this.categoryId == 1 || this.categoryId == 2 || this.categoryId == 3) {
      let toAdd: UserDayPlanSchedule = {
        timeSlotId: 0,
        categoryId: this.categoryId,
        slotName: this.name,
        planScheduleId: 0,
        taskPriority: 1,
        isDone: false,
        planDateId: 0,
        planDate: new Date(),
        userProfileId: 0,
        planName: '',
        planDescription: '',
        OrderId:0
      };

      for (let index = this.plansSchedules.length; index < 4; index++) {        
        this.plansSchedules.push(toAdd);
      }
    }
  }

  populateMissingPlansAndSchedules() {
    
    if (this.categoryId !== 4)
      return;
    const timeSlots = this.timeSlots.filter(f => f.categoryId === 4).sort((a, b) => a.slotOrderId - b.slotOrderId)
    let temp : UserDayPlanSchedule[] = [];

    timeSlots.forEach(t => {

      const planIndex = (this.plansSchedules.findIndex(f => f.timeSlotId === t.timeSlotId));
  
      const toAdd: UserDayPlanSchedule = {
        timeSlotId: t.timeSlotId,
        categoryId: this.categoryId,
        slotName: t.slotName,
        planScheduleId: planIndex > -1 ? this.plansSchedules[planIndex].planScheduleId : 0,
        taskPriority: planIndex > -1 ? this.plansSchedules[planIndex].taskPriority : 1,
        isDone: planIndex > -1 ? this.plansSchedules[planIndex].isDone : false,
        planDateId: planIndex > -1 ? this.plansSchedules[planIndex].planDateId : 0,
        planDate: planIndex > -1 ? this.plansSchedules[planIndex].planDate : new Date(), //TODO
        userProfileId: 0,
        planName: planIndex > -1 ? this.plansSchedules[planIndex].planName : '',
        planDescription: planIndex > -1 ? this.plansSchedules[planIndex].planDescription : '',
        OrderId: t.slotOrderId
      };
      temp.push(toAdd);      
    });

    this.plansSchedules = temp;
  }

}
