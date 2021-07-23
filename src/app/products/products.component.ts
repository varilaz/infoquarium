import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';


import { ProductsService } from '../shared/services/products.service'

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnDestroy {
  title = 'innoShop1';
  shop;
  count: number;
  productsAll;
  image;
  imageUrl;
  filteredProducts;
  category;

  subscription: Subscription;

  constructor(private productsService: ProductsService){}


  ngOnInit(){
      this.subscription = this.productsService.getCategory().subscribe(category => {
        this.category = category;
      })
      this.productsService.getAllProduct().subscribe(products => {
        this.count = products.count;
        this.productsAll = products.products;
        this.filteredProducts =  this.productsAll.filter(product => {
          if(product.productImage === undefined){
            product.productImage = 'uploads/missing.png';
          }
          if(this.category === null || this.category === 'All'){
            return product.categories;
          } else {
            return product.categories.includes(this.category);
          }
        });
        this.productsService.setProductCount(this.filteredProducts.length)
      })
  }




  ngOnDestroy(){
   this.subscription.unsubscribe();
  }

}
