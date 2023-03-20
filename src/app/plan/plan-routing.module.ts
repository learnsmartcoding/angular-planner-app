import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CreateComponent } from './create/create.component';
import { EditComponent } from './edit/edit.component';
import { ViewComponent } from './view/view.component';


const routes: Routes = [  
  { path: 'view/:planDayId', component: ViewComponent },
  { path: 'create', component: CreateComponent },
  { path: 'edit/:planDayId', component: EditComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PlanRoutingModule {}

export const routedComponents = [
    ViewComponent,
    CreateComponent,
    EditComponent
];
