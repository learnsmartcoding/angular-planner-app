import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { TimeSlot } from 'src/app/models/timeslot';
import { PlanSchdule, PlanSchdules, UserDayPlanSchedule, UserPlanSchedule } from 'src/app/models/user-plan-schedule';
import { modelStateFormMapper } from 'src/app/service/modelStateFormMapper';
import { PlanScheduleService } from 'src/app/service/plan-schedule.service';
import { validateAllFormFields } from 'src/app/service/validateAllFormFields';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit {
  planDateId!: number;
  planSchdules!: PlanSchdules;
  form!: FormGroup;
  selectedDate = new Date();
  timeSlots: TimeSlot[] = [];
  errors: string[] = [];

  userPlanSchedule!: UserPlanSchedule;
  toDoListCategoryItems: UserDayPlanSchedule[] = [];
  priorityCategoryItems: UserDayPlanSchedule[] = [];
  thingsToDoCategoryItems: UserDayPlanSchedule[] = [];
  planAndScheduleCategoryItems: UserDayPlanSchedule[] = [];


  constructor(private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private planScheduleService: PlanScheduleService, private toastr: ToastrService) {
    
  }

  ngOnInit(): void {
    const routedParams = this.route.snapshot.paramMap;
    this.planDateId = Number(routedParams.get('planDayId'));
    this.getTimeSlots();
    this.getUserDayPlans();

    //initialize form
    this.form = this.formBuilder.group({
      priorities: this.formBuilder.array([]),
      todoList: this.formBuilder.array([]),
      thingsToGetDone: this.formBuilder.array([]),
      plansSchedules: this.formBuilder.array([]),
      notes: new FormControl('', Validators.required),
      planDate: new FormControl(new Date())
    });
  }

  public control(name: string): AbstractControl | null {
    return this.form.get(name);
  }

  getTimeSlots() {
    this.planScheduleService.GetTimeSlots().subscribe(s => {
      this.timeSlots = s;
    });
  }

  createItem(data: UserDayPlanSchedule): FormGroup {
    return new FormGroup({
      timeSlotId: new FormControl(data.timeSlotId),
      planName: new FormControl(data.planName),
      planDescription: new FormControl(data.planDescription),
      taskPriority: new FormControl(data.taskPriority),//1 high, 2 Medium and 3 Low
      isDone: new FormControl(data.isDone || data.isDone === "true"?'true':'false'),
      planDateId: new FormControl(data.planDateId),
      categoryId: new FormControl(data.categoryId),
      planScheduleId:new FormControl(data.planScheduleId)
    });
  }

  getSlotName(slotid: number) {
    return this.timeSlots.find(f => f.timeSlotId === slotid)?.slotName
  }

  getCategoryName(categoryId: number) {
    return this.timeSlots.find(f => f.categoryId === categoryId)?.categoryName
  }
  //proerty to get form array instance from our form
  get priorities(): FormArray {
    return <FormArray>this.form?.get('priorities');
  }

  get todoList(): FormArray {
    return <FormArray>this.form?.get('todoList');
  }

  get thingsToGetDone(): FormArray {
    return <FormArray>this.form?.get('thingsToGetDone');
  }

  get plansSchedules(): FormArray {
    return <FormArray>this.form?.get('plansSchedules');
  }
  getPlanDate() {
    return this.selectedDate?.toDateString();
  }

  isformValid(): boolean {
    return this.form.valid && this.form.dirty;
  }

  validateField(item: any): boolean {
    return !item.valid && (item.dirty || item.touched);
  }

  getUserDayPlanScheduleDataToAdd(categorySlot: TimeSlot | undefined) {
    const planDateId = this.userPlanSchedule.userDayPlanSchedules[0].planDateId;
    const data: UserDayPlanSchedule = {
      timeSlotId: categorySlot?.timeSlotId || 0,
      categoryId: categorySlot?.categoryId || 0,
      slotName: categorySlot?.slotName || '',
      planScheduleId: 0,
      taskPriority: 2,
      isDone: false,
      planDateId: planDateId,
      planDate: this.control('planDate')?.value,
      userProfileId: 0,
      planName: '',
      planDescription: '',
      OrderId: categorySlot?.slotOrderId || 0
    };
    return data;
  }
  populateMissingPriorities() {
    const categorySlot = this.timeSlots.find(f => f.categoryId === 1);
    const data = this.getUserDayPlanScheduleDataToAdd(categorySlot);

    this.priorityCategoryItems.forEach(f => {
      this.priorities.push(this.createItem(f));
    });

    for (let index = this.priorityCategoryItems.length; index < 4; index++) {
      this.priorities.push(this.createItem(data));
    }
  }

  populateMissingTodolist() {
    const categorySlot = this.timeSlots.find(f => f.categoryId === 2);
    const data = this.getUserDayPlanScheduleDataToAdd(categorySlot);

    this.toDoListCategoryItems.forEach(f => {
      this.todoList.push(this.createItem(f));
    });

    for (let index = this.toDoListCategoryItems.length; index < 4; index++) {
      this.todoList.push(this.createItem(data));
    }
  }

  populateMissingThingsToDoCategoryItems() {
    const categorySlot = this.timeSlots.find(f => f.categoryId === 3);
    const data = this.getUserDayPlanScheduleDataToAdd(categorySlot);

    this.thingsToDoCategoryItems.forEach(f => {
      this.thingsToGetDone.push(this.createItem(f));
    });

    for (let index = this.thingsToDoCategoryItems.length; index < 4; index++) {
      this.thingsToGetDone.push(this.createItem(data));
    }
  }

  populateMissingPlansSchedules() {
    this.timeSlots.filter(f => f.categoryId === 4).forEach(t => {
      let data: UserDayPlanSchedule = {
        timeSlotId: t?.timeSlotId || 0,
        categoryId: t?.categoryId || 0,
        slotName: t?.slotName || '',
        planScheduleId: 0,
        taskPriority: 2,
        isDone: false,
        planDateId: 0,
        planDate: new Date(),
        userProfileId: 0,
        planName: '',
        planDescription: '',
        OrderId: t.slotOrderId
      };

      const itemIndex = this.planAndScheduleCategoryItems.findIndex(f => f.timeSlotId === t.timeSlotId);
      if (itemIndex === -1) {
        this.plansSchedules.push(this.createItem(data));
      } else {
        this.plansSchedules.push(this.createItem(this.planAndScheduleCategoryItems[itemIndex]));
      }
    });
  }

  getDayName() {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    var d = new Date(this.selectedDate);
    return days[d.getDay()];
  }

  getModel() {
    let schedules: PlanSchdule[] = [];
debugger;
    const prioritiesItems = <PlanSchdule[]>(this.form.value.priorities);
    prioritiesItems.forEach(f => f.isDone = (f.isDone === 'true') ? true : false);

    const todoListItems = <PlanSchdule[]>(this.form.value.todoList);
    todoListItems.forEach(f => f.isDone = (f.isDone === 'true') ? true : false);

    const thingsToGetDoneItems = <PlanSchdule[]>(this.form.value.thingsToGetDone);
    thingsToGetDoneItems.forEach(f => f.isDone = (f.isDone === 'true') ? true : false);


    const plansSchedulesItems = <PlanSchdule[]>(this.form.value.plansSchedules);
    plansSchedulesItems.forEach(f => f.isDone = (f.isDone === 'true') ? true : false);

    schedules.push(...prioritiesItems.filter(f => f.planName.length > 0), ...todoListItems.filter(f => f.planName.length > 0),
      ...thingsToGetDoneItems.filter(f => f.planName.length > 0), ...plansSchedulesItems.filter(f => f.planName.length > 0));
    const model: PlanSchdules = {
      planSchdules: schedules, notes: this.form.value.notes, planDate: new Date(this.form.value.planDate)
    }
    return model;
  }

  onSubmit() {
    this.savePlanSchedules();
  }

  savePlanSchedules() {
    this.errors = [];
    //will be tru only if all form property satisfies the validations
    const model = this.getModel();
    if (model.planSchdules.length === 0) {
      this.errors.push('There is not even one plan or schedule!');
      return;
    }

    validateAllFormFields(this.form);
    if (this.form.valid) {
      this.planSchdules = model;
      this.planScheduleService.UpdatePlansSchedule(model).subscribe({
        complete: () => {
          this.onComplete();
        }, // completeHandler
        error: (errorRes: HttpErrorResponse) => {
          this.onError(errorRes);
        }, // errorHandler
        next: () => {
          this.onSaveComplete();
        }, // nextHandler
      });
    }
  }

  onError(errorRes: HttpErrorResponse) {
    //we need to bind the error from API to UI.
    this.errors = modelStateFormMapper(this.form, errorRes, {});
    if (errorRes.status === 400) {
      this.toastr.warning('Something went wrong', 'Data Validation');
      this.errors.push(errorRes.error[0]);
    } else {
      this.toastr.error('Something went wrong', 'Error');
    }

  }
  onComplete() {
    this.toastr.info('Completed', 'Process Completed');
  }
  onSaveComplete() {
    this.toastr.success('Saved successfully', 'Success');
  }

  getPlansByCategory() {    
    this.priorityCategoryItems = this.userPlanSchedule.userDayPlanSchedules.filter(f => f.categoryId === 1);
    this.toDoListCategoryItems = this.userPlanSchedule.userDayPlanSchedules.filter(f => f.categoryId === 2);
    this.thingsToDoCategoryItems = this.userPlanSchedule.userDayPlanSchedules.filter(f => f.categoryId === 3);
    this.planAndScheduleCategoryItems = this.userPlanSchedule.userDayPlanSchedules.filter(f => f.categoryId === 4);  

    this.populateMissingPriorities();
    this.populateMissingTodolist();
    this.populateMissingThingsToDoCategoryItems();
    this.populateMissingPlansSchedules();
    this.patchNotesPlanDate();
  }

  patchNotesPlanDate() {
    this.control('notes')?.patchValue(this.userPlanSchedule.notes);
    this.control('planDate')?.patchValue(new Date(this.userPlanSchedule.userDayPlanSchedules[0].planDate));
  }

  getUserDayPlans() {
    this.planScheduleService.GetUserPlanSchedulesByPlanId(this.planDateId).subscribe({
      complete: () => {
      },
      error: (errorRes: HttpErrorResponse) => {
        if (errorRes.status === 404) {
          this.toastr.warning('No records found, please select from calendar', 'Incorrect selection');
          this.router.navigateByUrl('/home');
        } 
      },
      next: (data) => {
        this.userPlanSchedule = data;        
        this.selectedDate = new Date(data.userDayPlanSchedules[0].planDate);
        this.getPlansByCategory();
      },
    });
  }
}
