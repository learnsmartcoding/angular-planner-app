export interface UserPlanSchedule {
  notes: string;
  planDateNoteId: number;
  userDayPlanSchedules: UserDayPlanSchedule[];
}

export interface UserDayPlanSchedule {
  timeSlotId: number;
  categoryId: number;
  slotName: string;
  planScheduleId: number;
  taskPriority: number;
  isDone: boolean | string;
  planDateId: number;
  planDate: Date;
  userProfileId: number;
  planName: string;
  planDescription: string;
  OrderId:number;
}


export interface PlanSchdule {
  timeSlotId: number;
  planName: string;
  planDescription: string;
  taskPriority: number;
  isDone: boolean | string ;
  planDateId: number;
  categoryId: number;
}


export interface PlanSchdules {
  planSchdules: PlanSchdule[];
  notes: string;
  planDate: Date;
  planDateId?: number;
}