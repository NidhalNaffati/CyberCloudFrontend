import {Component, OnInit} from '@angular/core';
import {AuthService} from "../../auth/auth.service";
import {HttpClient, HttpParams} from "@angular/common/http";
import {environment} from "../../../environments/environment";

@Component({
  selector: 'app-navbar-back',
  templateUrl: './navbar-back.component.html',
  styleUrls: ['./navbar-back.component.css']
})
export class NavbarBackComponent implements OnInit {
  adminFullName: string = 'Admin User';
  apiUrl = environment.apiUrl;

  constructor(
    private authService: AuthService,
    private http: HttpClient
  ) {
  }

  ngOnInit(): void {
    this.loadAdminFullName();
  }

  loadAdminFullName(): void {
    const userId = this.authService.getUserId() || 1;

    const params = new HttpParams().set('id', userId.toString());

    this.http.get(`${this.apiUrl}/api/v1/admin/fullname`, {
      params,
      responseType: 'text'
    })
      .subscribe({
        next: (response: string) => {
          this.adminFullName = response;
        },
        error: (error) => {
          console.error('Error fetching admin name:', error);
        }
      });

  }


}
