import { Routes } from '@angular/router';
import { LoginpageComponent } from './loginpage/loginpage.component';
import { StaffpageComponent } from './staffpage/staffpage.component';
import { ApplyforleaveComponent } from './applyforleave/applyforleave.component';
import { HodpageComponent } from './hodpage/hodpage.component';
export const routes: Routes = [
    { path: '', component: LoginpageComponent },
    { path: 'login', component: LoginpageComponent },
    { path: 'staff', component: StaffpageComponent },
    { path: 'apply-leave', component: ApplyforleaveComponent },
    {path:'hod',component:HodpageComponent}
   
];
