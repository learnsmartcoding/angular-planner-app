import { CommonModule } from '@angular/common';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { PlanRoutingModule, routedComponents } from './plan-routing.module';
import { ViewPlansComponent } from './view-plans/view-plans.component';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';


@NgModule({
    imports: [
      CommonModule,
      FormsModule,      
      ReactiveFormsModule,     
      SharedModule,
      PlanRoutingModule,
      BsDatepickerModule.forRoot()
    ],
    exports: [],
    declarations: [routedComponents, ViewPlansComponent],
    providers: [],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
  })
export class PlanModule { }
