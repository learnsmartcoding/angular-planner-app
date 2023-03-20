import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { HomeComponent } from './home/home.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'home' },
  { path: 'home', component: HomeComponent },
  {
    path: 'plan',
    loadChildren: () =>
      import('./plan/plan.module').then((m) => m.PlanModule),
  }
  // {
  //   path: 'admin',
  //   loadChildren: () =>
  //     import('./admin/admin.module').then((m) => m.AdminModule),
  // }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

export const routedComponents = [
  HeaderComponent,
  HomeComponent  
]