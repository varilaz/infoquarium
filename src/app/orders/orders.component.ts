import { TOUCH_BUFFER_MS } from '@angular/cdk/a11y';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validator, Validators } from '@angular/forms';
import { Router } from '@angular/router'
import { Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';

import { OrdersService } from '../shared/services/orders.service';


@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit {

quantityForm: FormGroup;
form:FormGroup;
formTemplate;
orders;
orderInfo;
orderId;
amount;
price;
formControlId;
amounts = [];
total;
quantity;
newQuantity;
addedQuantity;
isDisabledRemoveBtn:boolean = false;
userId: string;
//creator: string
filteredOrderInfo;


  constructor(private orderService:OrdersService, private authService:AuthService, private router: Router) {}

  ngOnInit() {
    this.userId = this.authService.getUserId();
    this.orderService.getAllOrders()
    .subscribe(orders => {
      this.orders = orders.orders;
      this.orderInfo = this.orders.map(info => {
        //this.amount = (info.quantity * info.product.price);
        //this.amounts.push(this.amount);
        //console.log(info)
          return {
            orderId: info._id,
            //amount: info.quantity * info.product.price,
            //total: this.total,
            name: info.product.name,
            quantity: info.quantity,
            price:info.product.price,
            image: info.product.productImage,
            creator: info.creator
          }
      })
      this.filteredOrderInfo = this.orderInfo.filter(filtered => {
        if(this.userId === filtered.creator){
          this.amount = filtered.quantity * filtered.price;
          this.amounts.push(this.amount);
          console.log(this.amounts)
          return filtered
        }
      })
      this.total = this.amounts.reduce((total, amount) => {
        const updatedTotal = total + amount;
        return updatedTotal
      }, 0);
      this.total = this.total.toFixed(2)
      this.orderService.setOrderCount(this.filteredOrderInfo.length);

    });

  }

  delete(orderId){
    this.orderService.deleteOrder(orderId)
    .subscribe(result => {
      this.orderService. setOrderCount(this.orders.length);
      window.location.reload();
    });
  }

}
