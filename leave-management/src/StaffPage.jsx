import React,{useState,useEffect} from "react";
import './staffpage.css';
import StaffCalendar from "./StaffCalendar";
import { useNavigate } from "react-router-dom";
function StaffPage(){
  const navigate = useNavigate(); //to navigate to apply leave page and to logout
  const userId=localStorage.getItem("user_id");
  console.log("User ID from localStorage:", userId); //to check
  const userName=localStorage.getItem("name") || "User";
  const role=localStorage.getItem("role");
  
  const [leaves, setleaves] = useState({}); //Intial state 
  const[leavehistory,setleavehistory]=useState([]);
  const [leaveStatus, setLeaveStatus] = useState("No pending requests");
  
  //to fetch the balance when page opens
  useEffect(()=>{
    if(!userId) return;
    console.log("Fetching leave balance for user:", userId); //to check
    fetch(`http://localhost:5000/leave_balance/${userId}`)
    .then(response=>response.json())
    .then(data=>{
      console.log("API Response:", data);  //to check
      setleaves({
        casual:data.casual_leave,
        sick: data.sick_leave,
        earned: data.earned_leave,
        unpaid: data.unpaid_leave});
        })
        .catch(error=>console.error("error fetching leave balance:",error));
  },[userId]);

  //Function to logout
  const handlelogout=()=>{
    localStorage.removeItem("user_id");
    localStorage.removeItem("name");
    localStorage.removeItem("role");
    navigate("/");
};
  //to fetch leave history
  function fetchleavehistory(){
    fetch(`http://localhost:5000/leave_history/${userId}`)
    .then(response =>response.json())
    .then(data=>{
      if(Array.isArray(data)){
        setleavehistory([...data]);
      } else{
        console.error("unexpected API response",data);
        setleavehistory([data]);
      }
     alert("fetched leave history!");
    })
    .catch((error) => {
      console.error("Error fetching leave history:", error);
      setleavehistory([]);  
    });
}

  //to fetch leave status
  function fetchleavestatus(){
    fetch(`http://localhost:5000/last_leave_status/${userId}`)
    .then(response=>response.json())
    .then(data=>{
      setLeaveStatus(`your last leave request is:${data.status}`);
    })
    .catch(error=>console.error("error fetching leave status:",error));
  }
  // function ApplyforLeave(){
  //   const leaveRequest={
  //     user_id: 1, 
  //     leave_type: "casual", 
  //     start_date: "2024-04-01",
  //     end_date: "2024-04-03",
  //     reason: "Personal" };
  //    fetch("http://localhost:5000/apply_leave",{
  //     method:"POST",
  //     headers:{
  //       "Content-Type":"application/json"
  //     },
  //     body:JSON.stringify(leaveRequest)
  //   })
  //   .then(response=>response.json())
  //   .then(data=>{
  //     alert(data.message);
  //     fetch("http://localhost:5000/leave_balance/1")
  //     .then(response=>response.json())
  //     .then(data=>{
  //       setleaves({
  //         casual: data.casual_leave,
  //           sick: data.sick_leave,
  //           earned: data.earned_leave,
  //           unpaid: data.unpaid_leave
  //       });
  //     });
  //   })
  //   .catch(error=>console.erroe("Error applying for leave",error));
  // };

  // function checkLeavehistory()
  // {
  //   setleavehistory(["leave on 12th jan-approved","leave on 5th feb-approved","leave on26th march-pending"]);   
  //   alert("fetched leave history");
  // };
  // function checkLeavestatus(){
  //   const status=["Approved","Pending","Rejected"];
  //   const randomStatus=status[Math.floor(Math.random() * status.length)];   
  //   setLeaveStatus(`Your last leave request is: ${randomStatus}`);
  // }
  return(
    <>
     <div className="staff-container">
     <div className="logout">
          <button className="logout-btn" onClick={handlelogout}>Logout</button>
        </div>
      <header className="staff-header"><strong>Welcome {userName}</strong></header>
      <div className="staff-background"></div>
      <div className="staff-grid">
        <div>
          <div className="card check-status">
          <h3>Leaves left</h3>
          {leaves ? (
            <>
          <p>Casual Leaves: {leaves.casual || 0}</p>
          <p>Sick Leaves: {leaves.sick || 0}</p>
          <p>Earned Leaves: {leaves.earned || 0}</p>
          <p>Unpaid Leaves: {leaves.unpaid || 0}</p>
          </>
          ) : (
           <p>Loading leave balance...</p>
          )}
        </div>
        <div className="card check-status">
          <h3>check leave status</h3>
          <button onClick={fetchleavestatus}>view status</button>
          <p>{leaveStatus}</p>
        </div>
        <div className="card leave-history">
          <h3>Leave History</h3>
          <button onClick={fetchleavehistory}>View History</button>
          <ul>
            {Array.isArray(leavehistory) && leavehistory.length >0 ?(leavehistory.map((leaves,index) => (
              <div key={index} className="leave-history-list">
                 <p><strong>Start:</strong> {new Date(leaves.start_date).toLocaleDateString()}<br /></p>
                 <p><strong>End:</strong> {new Date(leaves.end_date).toLocaleDateString()}<br /></p>
                 <p><strong>Status:</strong> {leaves.status}</p>
              </div>
    ))
  ) : (
    <li>No History Available</li>
  )}
          </ul>
        </div>
        </div>
        <div className="card-calender">
           <StaffCalendar/>
           
            <button onClick={() => navigate("/apply-leave")}>Apply Leave</button>
        </div>
        
      </div>
      <footer className="staff-footer">
        S+R <br/>
        &copy; 2024 Schopper Riegler - All Rights Reserved.
      </footer>
     </div>
    </>
  );
};
export default StaffPage