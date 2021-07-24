import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Subject, Observable, } from 'rxjs';

import { OrdersService } from '../shared/services/orders.service';
import { AuthData } from './auth-data.model'

@Injectable({
  providedIn: 'root'
})

export class AuthService{

  private token: string;
  private authStatusListener = new Subject<boolean>();
  private usernameListener = new Subject<string>();
  private usernameListener$ = this.usernameListener.asObservable();
  private isAuthenticated = false;
  private tokenTimer: any;
  private userId: string;
  private username: string;
  ordercount;

  constructor(private http: HttpClient, private router: Router, private ordersService: OrdersService){};


getToken(){
    //console.log(this.token);
    return this.token;
}

getIsAuth(){
    return this.isAuthenticated;
}

getAuthStatusListener(){
    return this.authStatusListener.asObservable();
}

setUsername(username: string){
  this.usernameListener.next(username)
}

getUsernameListener():  Observable<any>{
  return this.usernameListener$
}

getUserId(){
    return this.userId;
}


signup(email: string, password: string){
    const authData: AuthData = {
        email: email,
        password: password
    };

    this.http.post('http://localhost:3000/users/signup', authData)
    .subscribe(() => {
        this.router.navigate(["/"]);
    }, error => {
        this.authStatusListener.next(false);
    })
}


login(email:string, password: string){
    const authData: AuthData = {
        email: email,
        password: password
    };
    this.http.post<{token: string, expiresIn: number, userId: string, email: string}>('http://localhost:3000/users/login', authData)
    .subscribe(response => {
        const token = response.token;
        this.token = token;
        if(token){
         const expiresInDuration = response.expiresIn;
         this.setAuthTimer(expiresInDuration);
         this.isAuthenticated = true;
         this.userId = response.userId;
         this.username = response.email.substring(0, email.lastIndexOf("@"));
         this.setUsername(this.username)
         this.authStatusListener.next(true);
         const now = new Date();
         const expirationDate = new Date(now.getTime() + expiresInDuration * 1000);
         this.saveAuthData(token, expirationDate, this.userId, this.username);
         this.ordersService.getAllOrders().subscribe((order:any) => {
           this.ordercount = order.orders.filter(count => {
             if(this.userId === count.creator){
                return count.creator
             }
           })
           console.log(this.ordercount.length)
           this.ordersService.setOrderCount(this.ordercount.length)
         })
         this.router.navigate(['/']);
        }

    }, error => {
        this.authStatusListener.next(false);
    })
}


autoAuthUser(){
    const authInformation =  this.getAuthData();
    if(!authInformation){
        return;
    }
    const now = new Date();
    const expiresIn = authInformation.expirationDate.getTime() - now.getTime();
    if (expiresIn > 0){
        this.token = authInformation.token;
        this.isAuthenticated = true;
        this.userId = authInformation.userId;
        this.username = authInformation.username
        this.setAuthTimer(expiresIn / 1000);
        this.authStatusListener.next(true)
    }
}

logout(){
  //console.log(this.token, this.userId, this.isAuthenticated, this.tokenTimer);
    this.token = null;
    this.userId = null;
    this.username = null;
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
    this.router.navigate(['/']);

}

private setAuthTimer(duration: number){
    console.log("Setting timer: " + duration);
    this. tokenTimer = setTimeout(() =>{
        this.logout();
     }, duration * 1000)
}

private saveAuthData(token: string, expirationDate: Date, userId: string, username:string){
    localStorage.setItem("token", token);
    localStorage.setItem("expiration", expirationDate.toISOString());
    localStorage.setItem("userId", userId );
    localStorage.setItem('username', username )
}

private clearAuthData(){
    localStorage.removeItem("token");
    localStorage.removeItem("expiration");
    localStorage.removeItem("userId");
    localStorage.removeItem("username");
}

public getAuthData(){
    const token = localStorage.getItem("token");
    const expirationDate = localStorage.getItem("expiration");
    const userId = localStorage.getItem("userId");
    const username = localStorage.getItem("username");
    if(!token && !expirationDate){
        return;
    }
    return {
        token:token,
        expirationDate: new Date(expirationDate),
        userId: userId,
        username:username
    }
}


}
