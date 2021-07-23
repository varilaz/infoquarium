import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { Observable, Subject, throwError, BehaviorSubject } from "rxjs";
import { map } from "rxjs/operators";
import {  Router } from '@angular/router';

import { IProduct } from '../../products/models/product.model'


@Injectable({
  providedIn: 'root'
})

export class ProductsService {

  products: IProduct[] = [];
  productData;
  name: string;
  price: number;
  image: string;
  description: string;
  productCategories: [];
  count: number;
  category: string;


  private categories = new BehaviorSubject<any>('');
  readonly categories$ = this.categories.asObservable()

  private productCount = new Subject<number>();
  readonly productCount$ = this.productCount.asObservable()


  constructor(private http:HttpClient, private router: Router){}



  //SET CATEGORY
  setCategory(category: string){
    this.categories.next(category);
  }
  //GET CATEGORY
  getCategory(): Observable<any>{
    return this.categories$;
  }



  //SET PRODUCT COUNT
  setProductCount(count: number){
    this.productCount.next(count)
  }
  //GET PRODUCT COUNT
  getProductCount(){
    return this.productCount$;
  }




  //GET ALL PRODUCT
  getAllProduct(){
   return this.http.get<{
     count: number,
     products:{
      id: string,
      name: string,
      price: number,
      productImage: string,
      description?: string,
      categories: Array<string>
    }}>('http://localhost:3000/products')
    .pipe(map(productsData => {
      return {
        count: productsData.count,
        products: productsData.products
      }
    }));
  }




  //GET ONE PRODUCT
  getOneProduct(id:string){
    return this.http.get('http://localhost:3000/products/' + id)
  }




  //ADD PRODUCT
  addProduct(name, price, image, description, categories, userId){

    console.log(userId)
    this.productData = new FormData();
      this.productData.append('name', name);
      this.productData.append('price', price);
      this.productData.append('productImage', image, name);
      this.productData.append('description', description);
      this.productData.append('categories', categories);
      this.productData.append('userId', userId)


    this.http.post('http://localhost:3000/products', this.productData)
    .subscribe(result => {
      console.log(result);
    })
  }




  //UPDATE PRODUCT
  updateProduct(productId,name, price, image, description, categories ){

    if (typeof(image) === 'object') {
      this.productData = new FormData();
      this.productData.append("name", name);
      this.productData.append("price", price);
      this.productData.append("productImage", image, name);
      this.productData.append("description", description);
      this.productData.append("categories", categories);
    }else {
      this.productData = {
        name: name,
        price: price,
        image: image,
        description: description,
        categories: categories
      }
    }


    this.http.patch('http://localhost:3000/products/' + productId, this.productData)
    .subscribe(result => {
      console.log(result)
    })
  }




  //DELETE ONE PRODUCT
  deleteOneProduct(productId){
    return this.http.delete('http://localhost:3000/products/' + productId)
  }

}





