import React,{useEffect, useState} from "react";
import './HodPage.css';
import { Navigate } from "react-router-dom";
import { useNavigate } from "react-router-dom";

function HodPage(){
    const navigate = useNavigate();

    const [leavereq,setleavereq]=useState([]);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [hodName, setHodName] = useState("");

    useEffect(() => {
        
        const storedHod = localStorage.getItem("name"); 
        if (storedHod) {
            setHodName(storedHod);
        }
    }, []);
    useEffect(() => {
       const FetchLeaveRequests =async () =>{
        try {
            const response= await fetch("http://localhost:5000/leave_requests");
            if(!response.ok) throw new Error("failed to fetch");

            const data= await response.json();
            setleavereq(data);
        }catch(error){
            console.error("error fetching data",error);
        }
       };
       FetchLeaveRequests();
    }, []);
    const handlelogout=()=>{
        localStorage.removeItem("hodtoken");
        localStorage.removeItem("hodName");
        navigate("/");
    }
    const handleReqClick = async (request) => {
       try{
        const response= await fetch(`http://localhost:5000/leave_requests/${request.id}`);
        if(!response.ok) throw new Error("failed to fetch");

        const data=await response.json();
        console.log("fetched data",data);
        setSelectedRequest({...request,...data});

       }catch(error){
        console.error("error fetching leave details:",error);
       }
    };
    useEffect(() => {
        console.log("Updated selectedRequest:", selectedRequest);
     }, [selectedRequest]);
    function closemodel(){
        setSelectedRequest(null);
    }
    const handleleaveaction = async (request,status) =>{
        if(!request) return;

        try{
            const response=await fetch(`http://localhost:5000/update_leaves_status/${request.id}`,
                {
                    method:"PUT",
                    headers: {"Content-Type" : "application/json"},
                    body: JSON.stringify({status,
                        userId:request.user_id,
                        leavetype:request.leave_type,
                    }),
                });
          if(!response.ok) throw new Error("failed to upadte status");
          
          setleavereq((prev)=>
            prev.map((req)=>(req.id===request.id ?{...req,status: status}:req))
        );
        closemodel();
    }catch(error){
        console.error("error updating leave requests",error);
    }};
  
    return( <>
<div className="hod-container">
<div className="logout"><button className="logout-btn" onClick={handlelogout}>Logout</button></div>
    <div className="navbar">
    <header className="staff-header">HOD Dashboard</header>
    <h2>Welcome, {hodName ? hodName : "HOD"}</h2>
   
        </div>
           <div className="main-content">
             <div className="pending-box">
             <h3>Pending Requests</h3>
            <div className="req-list">
                  {leavereq.length > 0 ? (
                  leavereq.map((request, index) => (
                    <div key={index} className="request-item">
                  <p>
                    <strong>{request.name}</strong> - {request.reason}
                  </p>
                  <p>
                    <strong>Status:</strong> {request.status}
                  </p>
                  <p>
                  <strong>Dates:</strong> {new Date(request.start_date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric"
                    })} {" "}
                 <strong>to</strong>{" "}
                {new Date(request.end_date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric"
                   })}
                  </p>
                  <div className="action-btns">
                    <button
                      className="accept"
                      onClick={() => handleleaveaction(request, "Approved")}
                    >
                      Accept
                    </button>

                    <button
                      className="reject"
                      onClick={() => handleleaveaction(request, "Rejected")}
                    >
                      Decline
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p>No pending requests</p>
            )}
          </div>
        </div>
      </div>
      <footer className="hod-footer">
        S+R <br/>
        &copy; 2024 Schopper Riegler - All Rights Reserved.
      </footer>
    </div>
  </>);
};
export default HodPage