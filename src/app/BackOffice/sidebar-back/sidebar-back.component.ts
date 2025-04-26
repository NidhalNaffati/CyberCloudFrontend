import { Component } from '@angular/core';
import {environment} from "../../../environments/environment";
import {AuthService} from "../../auth/auth.service";
import {HttpClient, HttpParams} from "@angular/common/http";

@Component({
  selector: 'app-sidebar-back',
  templateUrl: './sidebar-back.component.html',
  styleUrls: ['./sidebar-back.component.css']
})
export class SidebarBackComponent {
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
