import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { TimeSlot } from 'src/app/models/timeslot';
import { PlanSchdule, PlanSchdules } from 'src/app/models/user-plan-schedule';
import { modelStateFormMapper } from 'src/app/service/modelStateFormMapper';
import { PlanScheduleService } from 'src/app/service/plan-schedule.service';
import { validateAllFormFields } from 'src/app/service/validateAllFormFields';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css']
})
export class CreateComponent implements OnInit {
  planSchdules!: PlanSchdules;
  form!: FormGroup;
  selectedDate = new Date();
  timeSlots: TimeSlot[] = [];
  errors: string[] = [];

  constructor(private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router : Router,
    private planScheduleService: PlanScheduleService, private toastr: ToastrService) {
    const dateStr = this.route.snapshot.queryParamMap.get('selectedDate')?.toString() || new Date();
    this.selectedDate = new Date(dateStr) || this.selectedDate;
  }

  ngOnInit(): void {
    this.getTimeSlots();
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
    if (this.form.get(name)?.touched === true) {
      return this.form.get(name);
    }
    return null;
  }


  getTimeSlots() {
    this.planScheduleService.GetTimeSlots().subscribe(s => {
      this.timeSlots = s;
      this.initiateFormsWithDefualts();
    });
  }

  createItem(categoryId: number, timeSlotId: number): FormGroup {
    return new FormGroup({
      timeSlotId: new FormControl(timeSlotId),
      planName: new FormControl(''),
      planDescription: new FormControl(''),
      taskPriority: new FormControl(2),//1 high, 2 Medium and 3 Low
      isDone: new FormControl(false),
      planDateId: new FormControl(0),
      categoryId: new FormControl(categoryId)
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

  initiateFormsWithDefualts() {
    this.timeSlots.forEach(f => {
      switch (f.categoryId) {
        case 1:
          {
            this.priorities.push(this.createItem(f.categoryId, f.timeSlotId));
            this.priorities.push(this.createItem(f.categoryId, f.timeSlotId));
            this.priorities.push(this.createItem(f.categoryId, f.timeSlotId));
            break;
          }
        case 2:
          {
            this.todoList.push(this.createItem(f.categoryId, f.timeSlotId));
            this.todoList.push(this.createItem(f.categoryId, f.timeSlotId));
            this.todoList.push(this.createItem(f.categoryId, f.timeSlotId));
            break;
          }
        case 3:
          {
            this.thingsToGetDone.push(this.createItem(f.categoryId, f.timeSlotId));
            this.thingsToGetDone.push(this.createItem(f.categoryId, f.timeSlotId));
            this.thingsToGetDone.push(this.createItem(f.categoryId, f.timeSlotId));
            break;
          }
        case 4:
          {
            this.plansSchedules.push(this.createItem(f.categoryId, f.timeSlotId));
            break;
          }

        default:
          break;
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

    const prioritiesItems = <PlanSchdule[]>(this.form.value.priorities);
    const todoListItems = <PlanSchdule[]>(this.form.value.todoList);
    const thingsToGetDoneItems = <PlanSchdule[]>(this.form.value.thingsToGetDone);
    const plansSchedulesItems = <PlanSchdule[]>(this.form.value.plansSchedules);

    schedules.push(...prioritiesItems.filter(f => f.planName.length > 0), ...todoListItems.filter(f => f.planName.length > 0),
      ...thingsToGetDoneItems.filter(f => f.planName.length > 0), ...plansSchedulesItems.filter(f => f.planName.length > 0));
    const model: PlanSchdules = {
      planSchdules: schedules, notes: this.form.value.notes, planDate: new Date(this.form.value.planDate)
    }
    return model;
  }

  onSubmit() {
    this.savePlans();
  }

  savePlans() {
    this.errors = [];
    //will be tru only if all form property satisfies the validations
    const model = this.getModel();
    if(model.planSchdules.length===0){
      this.errors.push('There is not even one plan or schedule!');
      return;
    }

    validateAllFormFields(this.form);
    if (this.form.valid) {


      this.planSchdules = model;
      this.planScheduleService.SavePlansSchedule(model).subscribe({
        complete: () => {
          this.onComplete();
        }, // completeHandler
        error: (errorRes: HttpErrorResponse) => {
          this.onError(errorRes);
        }, // errorHandler
        next: (res:PlanSchdules) => {
          debugger;
          this.onSaveComplete(res);
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
  onSaveComplete(res:PlanSchdules) {
    this.toastr.success('Saved successfully', 'Success');
    this.toastr.info('You have been redirected to view page', 'Information');
    this.router.navigateByUrl(`plan/view/${res.planDateId}`);
  }
}
