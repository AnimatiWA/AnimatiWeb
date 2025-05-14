import { Component, OnDestroy, OnInit } from '@angular/core';
import { LoginService } from '../../services/auth/login.service';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.css'
})
export class NavComponent implements OnInit, OnDestroy {

  btnSecion:boolean = true;
  userLoginOn:boolean=false;
  userLoginOut:boolean=false;
  currentUserLoginOn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  constructor(private loginService:LoginService, private router:Router) {
    this.currentUserLoginOn=new BehaviorSubject<boolean>(sessionStorage.getItem("token")!=null); 
  }
  ngOnDestroy(): void {
    this.userLoginOut
  }

  

  ngOnInit(): void {
    this.loginService.userLoginOn.subscribe(
      {
        next:(userLoginOn) => {
          this.userLoginOn=userLoginOn;
        }
        
      }
      
    )
    
  
  }



  logout():void {
    this.loginService.logout();
    this.router.navigate(['/']);
  
  }
}
