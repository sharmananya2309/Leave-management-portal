import LoginPage from './LoginPage';
import StaffPage from './StaffPage';
import HodPage from './HodPage';
import ApplyforLeave from './ApplyforLeave';
import './index.css';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
 return(
   <Router>
    <Routes>
      <Route path="/" element={<LoginPage/>}/>
      <Route path="/staff" element={<StaffPage/>}/>
      <Route path="/hod" element={<HodPage/>}/>
      <Route path="/apply-leave" element={<ApplyforLeave/>}/>
    </Routes>
   </Router>
 );

 
};

export default App
