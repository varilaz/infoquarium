import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProductsComponent } from './products.component';
import { OneProductComponent } from './one-product/one-product.component';
import { CreateProductComponent } from './create-product/create-product.component';


const productsRoutes: Routes = [
  { path: 'products', component: ProductsComponent },
  { path: 'products/create', component:  CreateProductComponent},
  { path: 'products/edit/:productId', component:  CreateProductComponent},
  { path: 'products/:productId', component:OneProductComponent}
];


@NgModule({
  imports: [RouterModule.forChild(productsRoutes)],
  exports: [RouterModule]
})
export class ProductsRoutingModule {}
