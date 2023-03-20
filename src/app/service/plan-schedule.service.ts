import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { TimeSlot } from '../models/timeslot';
import { UserPlanDate } from '../models/user-plan-date';
import { PlanSchdules, UserPlanSchedule } from '../models/user-plan-schedule';


@Injectable({ providedIn: 'root' })
export class PlanScheduleService {
  private apiUrl: string;
  constructor(private http: HttpClient) {
    this.apiUrl = environment.apiUrl;
  }

GetTimeSlots(): Observable<TimeSlot[]>
{
const url = `${this.apiUrl}/${environment.apiEndpoints.planSchedule}/getTimeSlots`;
return this.getArrary<TimeSlot>(url);
}

GetUserPlanByDates(fromDate:string, toDate:string): Observable<UserPlanDate[]>
{
const url = `${this.apiUrl}/${environment.apiEndpoints.planSchedule}/getUserPlanByDates?fromDate=${fromDate}&toDate=${toDate}`;
return this.getArrary<UserPlanDate>(url);
}
                
GetUserPlanSchedules(day:string): Observable<UserPlanSchedule>
{
    const url = `${this.apiUrl}/${environment.apiEndpoints.planSchedule}/getUserPlanSchedules?day=${day}`;
    return this.get<UserPlanSchedule>(url);
}

GetUserPlanSchedulesByPlanId(planId:number): Observable<UserPlanSchedule>
{
    const url = `${this.apiUrl}/${environment.apiEndpoints.planSchedule}/${planId}`;
    return this.http.get<UserPlanSchedule>(url);
}
  SavePlansSchedule(model: PlanSchdules): Observable<any> {
    const url = `${this.apiUrl}/${environment.apiEndpoints.planSchedule}`;
    return this.http.post(url,model);
  }

  UpdatePlansSchedule(model: PlanSchdules): Observable<any> {
    const url = `${this.apiUrl}/${environment.apiEndpoints.planSchedule}`;
    return this.http.put(url,model);
  }

  // GetProducts(noOfProducts: number = 500): Observable<Product[]> {
  //   const url = `${this.apiUrl}/${environment.apiEndpoints.product}/all?noOfProducts=${noOfProducts}`;
  //   return this.getArrary<Product>(url);
  // }

  // GetProductsByOwner(): Observable<Product[]> {
  //   const url = `${this.apiUrl}/${environment.apiEndpoints.product}/productsByOwner/all`;
  //   return this.getArrary<Product>(url);
  // }


  // UpdateProduct(model: Product): Observable<any> {
  //   const url = `${this.apiUrl}/${environment.apiEndpoints.product}`;
  //   return this.http.put(url,model);
  // }
  
  // UploadProductImage(file: FormData, id: number): Observable<any> {
  //   const url = `${this.apiUrl}/${environment.apiEndpoints.product}/upload/${id}`;
  //   return this.http.post(url, file);
  // }

  // DeleteProduct(id: number): Observable<any> {
  //   const url = `${this.apiUrl}/${environment.apiEndpoints.product}/${id}`;
  //   return this.http.delete(url);
  // }
  

  private get<T>(url: string, options?: any): Observable<T> {
    return this.http
      .get(url, options)
      .pipe(map((res) => this.extractData<T>(res))) as Observable<T>;
  }
  private getArrary<T>(url: string, options?: any): Observable<T[]> {
    return this.http
      .get(url, options)
      .pipe(map((res) => this.extractData<T[]>(res))) as Observable<T[]>;
  }

  private extractData<T>(res: any) {
    if (res && (res.status < 200 || res.status >= 300)) {
      throw new Error('Bad response status: ' + res.status);
    }
    return (res || {}) as T;
  }
}
