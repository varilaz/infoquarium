import { Component, OnInit, OnDestroy } from "@angular/core";
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-signup',
    templateUrl: './signup.component.html',
    styleUrls: ['./signup.component.scss']
})

export class SignupComponent implements OnInit, OnDestroy {

    private authStatusSub: Subscription;
    isLoading = false;

    constructor(public authService:AuthService){}


    ngOnInit(){
        this.authStatusSub = this.authService.getAuthStatusListener().subscribe(
            authStatus =>{
                this.isLoading = false;
            }
        );
        console.log(this.authStatusSub);
    }

    onSignup(form: NgForm){
        console.log(form.value);
        if(form.invalid){
            return
        }else{
            this.isLoading = true;
            this.authService.signup(form.value.email, form.value.password)
        }
    }

    ngOnDestroy(){
        console.log(this.authStatusSub);
        this.authStatusSub.unsubscribe();
    }

}
