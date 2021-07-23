import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LandingComponent } from './landing/landing.component';
import { OrdersComponent } from './orders/orders.component';
import { AuthGuard } from './auth/auth.guard'



const routes: Routes = [
  { path: '', redirectTo:'landing', pathMatch: 'full'},
  { path:'landing', component:LandingComponent },
  { path: 'orders', component: OrdersComponent},
  { path:'', loadChildren: () => import('./products/products.module')
        .then(module => module.ProductsModule) },
  { path:'auth', loadChildren: () => import('./auth/auth.module')
        .then(module => module.AuthModule) }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
