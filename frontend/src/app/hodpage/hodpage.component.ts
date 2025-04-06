import { Component,OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-hodpage',
  standalone:true,
  imports: [CommonModule],
  templateUrl: './hodpage.component.html',
  styleUrl: './hodpage.component.css'
})
export class HodpageComponent implements OnInit {
  leaveRequests: any[] = [];
  selectedRequest: any = null;
  hodName: string = '';
  activeTab: string = 'pending';

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    const storedHod = localStorage.getItem('name');
    if (storedHod) {
      this.hodName = storedHod;
    }

    this.fetchLeaveRequests(this.activeTab);
  }
  
  

//   get filteredRequests() {
//   if (this.activeTab === 'pending') {
//     return this.leaveRequests.filter(req => req.status === 'Pending');
//   } else if (this.activeTab === 'Approved/Rejected') {
//     return this.leaveRequests.filter(req => req.status === 'Approved' || req.status === 'Rejected');
//   } else {
//     return this.leaveRequests; // history = all
//   }
// }

changeTab(tab: string) {
  this.activeTab = tab;
  this.fetchLeaveRequests(tab);
} 

get activeTabTitle() {
  switch (this.activeTab) {
    case 'pending': return 'Pending Requests';
    case 'Approved/Rejected': return 'Approved/Rejected';
    case 'history': return 'Request History';
    default: return '';
  }
} 

  fetchLeaveRequests(tab: string) {
    let url = 'http://localhost:5000/leave_requests';

    if (tab === 'Approved/Rejected') {
      url = 'http://localhost:5000/approved-rejected';
    } else if (tab === 'history') {
      url = 'http://localhost:5000/leave-history';
    }

    this.http.get<any[]>(url).subscribe({
      next: (data) => this.leaveRequests = data,
      error: (err) => console.error('Error fetching leave requests:', err)
    });
  }

  handleLogout() {
    localStorage.removeItem('hodtoken');
    localStorage.removeItem('name');
    this.router.navigate(['/']);
  }

  async handleReqClick(request: any) {
    try {
      const response: any = await this.http.get(`http://localhost:5000/leave_requests/${request.id}`).toPromise();
      this.selectedRequest = { ...request, ...response };
    } catch (error) {
      console.error('Error fetching leave details:', error);
    }
  }

  closeModel() {
    this.selectedRequest = null;
  }

  handleLeaveAction(request: any, status: string) {
    if (!request) return;

    this.http.put(`http://localhost:5000/update_leaves_status/${request.id}`, {
      status: status,
      userId: request.user_id,
      leavetype: request.leave_type
    }).subscribe({
      next: () => {
        this.leaveRequests = this.leaveRequests.map(req =>
          req.id === request.id ? { ...req, status: status } : req
        );
        this.closeModel();
      },
      error: (err) => console.error('Error updating leave request:', err)
    });
  }
}

