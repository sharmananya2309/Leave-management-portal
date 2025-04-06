import { Component,OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient} from '@angular/common/http';
import { CalenderComponent } from '../calender/calender.component';
import { CommonModule } from '@angular/common'; 
import { FormsModule } from '@angular/forms'; 


@Component({
  selector: 'app-staffpage',
  standalone: true,
  imports: [CommonModule, FormsModule,CalenderComponent],
  templateUrl: './staffpage.component.html',
  styleUrl: './staffpage.component.css'
})
export class StaffpageComponent implements OnInit {
  userId = localStorage.getItem('user_id');
  userName = localStorage.getItem('name') || 'User';
  leaves: any = {};
  leaveHistory: any[] = [];
  leaveStatus = 'No pending requests';

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    if (this.userId) {
      this.fetchLeaveBalance();
    }
  }

  fetchLeaveBalance() {
    this.http.get<any>(`http://localhost:5000/leave_balance/${this.userId}`).subscribe({
      next: (data) => {
        this.leaves = {
          casual: data.casual_leave,
          sick: data.sick_leave,
          earned: data.earned_leave,
          unpaid: data.unpaid_leave
        };
      },
      error: (error) => {
        console.error('Error fetching leave balance:', error);
      },
      complete: () => {
        console.log('Leave balance fetch complete');
      }
    });
  }
  
  fetchLeaveHistory() {
    this.http.get<any>(`http://localhost:5000/leave_history/${this.userId}`).subscribe({
      next: (data) => {
        this.leaveHistory = Array.isArray(data) ? data : [data];
        alert('Fetched leave history!');
      },
      error: (error) => {
        console.error('Error fetching leave history:', error);
        this.leaveHistory = [];
      },
      complete: () => {
        console.log('Leave history fetch complete');
      }
    });
  }
  

  fetchLeaveStatus() {
    this.http.get<any>(`http://localhost:5000/last_leave_status/${this.userId}`).subscribe({
      next: (data) => {
        this.leaveStatus = `Your last leave request is: ${data.status}`;
      },
      error: (error) => {
        console.error('Error fetching leave status:', error);
      },
      complete: () => {
        console.log('Leave status fetch complete');
      }
    });
  }
  

  logout() {
    localStorage.removeItem('user_id');
    localStorage.removeItem('name');
    localStorage.removeItem('role');
    this.router.navigate(['/']);
  }

  navigateToApplyLeave() {
    this.router.navigate(['/apply-leave']);
  }
  
}



  