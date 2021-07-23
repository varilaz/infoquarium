
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validator, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';

import { ProductsService } from '../../shared/services/products.service';
import { AuthService } from '../../auth/auth.service';
import { IProduct } from '../models/product.model';
//import {  mimeType } from './mime-type.validator'
import { Subscription } from 'rxjs';



@Component({
  selector: 'app-create-product',
  templateUrl: './create-product.component.html',
  styleUrls: ['./create-product.component.scss']
})

export class CreateProductComponent implements OnInit, OnDestroy{

    private mode ='create';
    private productId : string;
    private authStatusSub: Subscription;
    product;
    isLoading = false;
    productForm: FormGroup;
    imgPreview: string;
    productTopic: string[] = ['All', 'Political', 'Economical', 'Philosophical', 'Cultural', 'Legal', 'Social', 'Medical', 'Biological', 'Chemical', 'Psichological', 'Physical'];
    imgPath;
    userId;


    constructor(private productsService:ProductsService,
      public route: ActivatedRoute,
      private authService: AuthService){};

    ngOnInit() {
      // this.authStatusSub = this.authService.getAuthStatusListener().subscribe(
      //   authStatus => {
      //     this.isLoading = false;
      //   }
      // );
      this.productForm = new FormGroup({
        'name': new FormControl(null, {
          validators: [Validators.required, Validators.minLength(6)]
        }),
        'price': new FormControl(null, {
          validators:[Validators.required]
        }),
        'image': new FormControl(null, {
          //validators: [Validators.required], asyncValidators: [mimeType]
        }),
        'description': new FormControl('value', {

        }),
        'categories': new FormControl(null, {

        })
      })

      this.userId = this.authService.getUserId();
        this.route.paramMap.subscribe((paramMap: ParamMap) => {

          if (paramMap.has('productId')) {
            this.mode = 'edit';
            this.productId = paramMap.get('productId');
           this.isLoading = true;
            this.productsService.getOneProduct(this.productId).subscribe(productData =>{
              this.isLoading = false;
              this.product = productData;
              this.imgPath = "../assets/" + this.product.product.productImage
              this.productForm.setValue({
                'name':this.product.product.name,
                'price': this.product.product.price,
                'image': this.imgPath,
                'description': this.product.product.description,
                'categories': this.product.product.categories,
              }
                );
            });
          } else {
            this.mode = 'create';
            this.productId = null;
          }
        });
      }

     onSaveProduct(){
      if (this.productForm.invalid){
          return;
      } else {
        this.isLoading = true;
        if(this.mode === 'create') {
            this.productsService.addProduct(
              this.productForm.value.name,
              this.productForm.value.price,
              this.productForm.value.image,
              this.productForm.value.description,
              this.productForm.value.categories,
              this.userId
              );
        } else {
            this.productsService.updateProduct(
              this.productId,
              this.productForm.value.name,
              this.productForm.value.price,
              this.productForm.value.image,
              this.productForm.value.description,
              this.productForm.value.categories
              );
        }
     }
     this.productForm.reset();
    }


    onImgPicker(event: Event){
      const file = (event.target as HTMLInputElement).files[0];
      console.log(file + ' 121')
      this.productForm.patchValue({
        image:file
      });
      this.productForm.get('image').updateValueAndValidity();
      const reader = new FileReader();
      reader.onload = () => {
        this.imgPreview = reader.result as string;
      }
      console.log(reader + ' 130');
      reader.readAsDataURL(file);
    }

  ngOnDestroy(){
   // this.authStatusSub.unsubscribe();
  }

}
