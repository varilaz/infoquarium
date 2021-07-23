import { Component, OnInit } from '@angular/core';
import { ChildActivationStart } from '@angular/router';
import { Subscription } from 'rxjs';



import { AuthService } from '../auth/auth.service';
import { OrdersService } from '../shared/services/orders.service';
import { ProductsService } from '../shared/services/products.service'

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent implements OnInit {


  //productNature: string[] = ['Scientific', 'Educational', 'Tabloid'];
  productTopic: string[] = ['All', 'Political', 'Economical', 'Philosophical', 'Cultural', 'Legal', 'Social', 'Medical', 'Biological', 'Chemical', 'Psichological', 'Physical'];

  constructor(private productsService: ProductsService, private orderService: OrdersService, private authService: AuthService) { }

  ngOnInit(): void {

  }

  chosenCategory(category){
    this.productsService.setCategory(category);
  }

}
