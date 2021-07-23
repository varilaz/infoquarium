import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { FormGroup, FormControl, Validator, Validators } from '@angular/forms';

import { ProductsService } from '../../shared/services/products.service';
import { IProduct } from '../models/product.model'
import { OrdersService } from 'src/app/shared/services/orders.service';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-one-product',
  templateUrl: './one-product.component.html',
  styleUrls: ['./one-product.component.scss']
})
export class OneProductComponent implements OnInit {

  products: IProduct[] = [];
  orderForm: FormGroup;
  oneProduct: any;
  productId: string;
  name: string;
  price: number;
  description: string;
  image: string;
  isLoggedin:boolean = false;
  isLoading: boolean = false;
  userId;
  creator;
  isUserAndCreator: boolean = false;


  constructor(private productsService: ProductsService, private orderService:OrdersService, private authService:AuthService,  public route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.orderForm = new FormGroup({
      'quantity': new FormControl(null, {
        validators:[Validators.required, Validators.min(1), Validators.pattern('^(0|[1-9][0-9]*)$')]
      })
    })

    this.userId = this.authService.getUserId();

    this.route.paramMap.subscribe({
      next: (paramMap: ParamMap) => {
              this.productId = paramMap.get('productId');;
              this.productsService.getOneProduct(this.productId)
              .subscribe( (oneProductData) => {
                  this.oneProduct = oneProductData;
                  console.log(this.oneProduct.product.creator)
                  this.isLoggedin = true;
                  this.name = this.oneProduct.product.name;
                  this.price = this.oneProduct.product.price;
                  this.description = this.oneProduct.product.description;
                  this.image = "../assets/" + this.oneProduct.product.productImage;
                  this.creator = this.oneProduct.product.creator;
                  if(this.userId === this.creator){
                    this.isUserAndCreator = true;
                  }
                }
              )
            }
    })
  }


addToCart(){
  if(this.orderForm.invalid){
    return;
  }
  const quantity = this.orderForm.value;
  const orderCount = parseInt(quantity.quantity)
  console.log(orderCount)
  this.orderService.postProductToCart(this.productId, orderCount, this.userId);
  this.router.navigate(['/orders']);
}

deleteProduct(){
  console.log(this.productId);
  this.productsService.deleteOneProduct(this.productId)
  .subscribe(result => {
    console.log(result)
  });
  this.router.navigate(['./products'])
}

}
