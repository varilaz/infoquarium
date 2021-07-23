import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { IProduct } from "src/app/products/models/product.model";
import { IOrder } from "src/app/orders/models/order.model";
import { map } from "rxjs/operators";
import { BehaviorSubject, Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})

export class OrdersService {

  orderData: IOrder;
  private orderBadge = new BehaviorSubject<number>(0);
  readonly orderBadge$ = this.orderBadge.asObservable();
  count: number;
  orderId;
  quantity;
  order;


  constructor(public http: HttpClient){}

  //SET ORDER COUNT
  setOrderCount(value){
    //console.log(value)
    this.StoreOrderCount(value)
    this.orderBadge.next(value);
  }

  private StoreOrderCount(count){
    localStorage.setItem("count", count);
  }

  getOrderCountData(){
    const count = localStorage.getItem("count");
    return {
        count:count
    }
  }

  private removeOrderCountData(){
    localStorage.removeItem("count");
}

  //GET ORDER COUNT in BADGE OBSERVABLE
  getOrderBadgeNumber():Observable<any>{
    return this.orderBadge$;
  }


  //GET ALL ORDERS
  getAllOrders(){
    return this.http.get<{
        count: number,
        orders:{
        id: string,
        product: string,
        quantity: number
        creator: string}}>('http://localhost:3000/orders')
       .pipe(map(orders => {
        return {
          count: orders.count,
          orders: orders.orders
        }
       }))
  }


 //ADD A PRODUCT TO THE CART
  postProductToCart(productId: string, quantity: number, userId: string){
    this.orderData = {
      productId: productId,
      quantity: quantity,
      creator: userId
    }

    this.http.post<{productId: string, quantity: number, creator: string}>('http://localhost:3000/orders', this.orderData)
    .subscribe(response => {
      console.log(response);
    })
  }



  //GET ONE ORDER
  getOneOrder(orderId){
    return this.http.get('http://localhost:3000/orders/' + orderId)
  }




  //UPDATE ORDER
  updateOrder(orderId, quantity){

      this.order = {
        orderId: orderId,
        quantity: quantity
      }

      return this.http.patch('http://localhost:3000/orders/' + this.order.orderId, this.order)

  }


  //DELETE ORDER
  deleteOrder(orderId){
    return this.http.delete(`http://localhost:3000/orders/${orderId}`);
  }

}
