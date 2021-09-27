import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { PoocoinComponent } from './poocoin/poocoin.component';

const routes: Routes = [{
  path:'poocoin',component:PoocoinComponent
},
{
  path:'',component:HomeComponent
},
{
  path:'**',component:HomeComponent
}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
