import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { AuthService } from '../auth/auth.service';
import { ProductsService } from '../shared/services/products.service';
import { OrdersService } from '../shared/services/orders.service';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  productNature: string[] = ['Scientific', 'Educational', 'tabloid'];
  productTopic: string[] = ['political', 'economical', 'philosophical', 'cultural', 'legal', 'social', 'medical', 'biological', 'chemical', 'psichological', 'physical'];
  productCategory: string;
  productCount: number;
  badgeCount: string;
  username: string;
  isUsername: boolean = false;

  userIsAuthenticated = false;
  private authListenerSubs: Subscription;
  private subscriptionCategory: Subscription;
  private subscriptionCount: Subscription;
  private subscriptBadge: Subscription;
  private subscriptionUsername: Subscription;




  constructor(private authService: AuthService, private productsService:ProductsService, private ordersService:OrdersService) { }

  ngOnInit(): void {

    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authListenerSubs = this.authService.getAuthStatusListener().subscribe(isAuntheticated =>{
     this.userIsAuthenticated = isAuntheticated;
     this.badgeCount = this.ordersService.getOrderCountData().count;
    });
    if(this.userIsAuthenticated){
     this.subscriptBadge = this.ordersService.getOrderBadgeNumber().subscribe(count => {
        this.badgeCount = count;
      })

      this.badgeCount = this.ordersService.getOrderCountData().count;
      this.username = this.authService.getAuthData().username;
      this.isUsername = true;

    }

    this.subscriptionUsername = this.authService.getUsernameListener().subscribe(username => {
      this.username = username;
      this.isUsername = true;
    })

    this.subscriptionCategory = this.productsService.getCategory().subscribe(category => {
      this.productCategory = category;
    });
    this.subscriptionCount = this.productsService. getProductCount().subscribe(category => {
      this.productCount = category;
    })

  }

  onLogout(){
    this.authService.logout();
    this.badgeCount = null;
    this.username = null;
    this.isUsername = false;
  }

  ngOnDestroy(){
    this.authListenerSubs.unsubscribe();
    this.subscriptionCategory.unsubscribe();
    this.subscriptionCount.unsubscribe();
    this.subscriptBadge.unsubscribe();
    this.subscriptionUsername.unsubscribe()
  }


}
