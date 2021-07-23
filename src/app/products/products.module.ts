import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms';
import { AngularMaterialModule } from '../angular-material.module';
import { ProductsRoutingModule } from './products-routing.module';



@NgModule({
    declarations: [],
    imports: [
       CommonModule,
       FormsModule,
       AngularMaterialModule,
       ProductsRoutingModule
    ]
})


export class ProductsModule {}
