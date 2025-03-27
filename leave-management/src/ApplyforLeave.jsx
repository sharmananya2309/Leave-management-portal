import React,{useEffect, useState} from "react";
import "./ApplyforLeave.css";
import { useNavigate } from "react-router-dom";

function ApplyforLeave(){
    const[leavetype,setleavetype]=useState("");
    const[startdate,setstartdate]=useState("");
    const[enddate,setenddate]=useState("");
    const[reason,setreason]=useState("");
    const [error, setError] = useState("");
    const [leaveBalance, setLeaveBalance] = useState({});
    const navigate = useNavigate();
    
    const userId = localStorage.getItem("user_id") || 1;

   useEffect(()=>{
    fetch(`http://localhost:5000/leave_balance/${userId}`)
    .then((res) => {
      if (!res.ok) {
          throw new Error("Failed to fetch leave balance");
      }
      return res.json();
  })
    .then(data=>setLeaveBalance(data))
    .catch(err=>console.error("Error fetching leave balance:",err));
   },[userId]);

    function handleleavetype(e){
        setleavetype(e.target.value);
        }
    function handlestartdate(e){
        setstartdate(e.target.value);
    }
    function handleenddate(e){
        setenddate(e.target.value);
    }
    function handlereason(e){
        setreason(e.target.value);
    }
    function handlesubmit(e){
        e.preventDefault();

        if(!leavetype || !startdate || !enddate || !reason){
            setError("please fill all fields!");
            return;
        }

        if (leaveBalance[`${leavetype}_leave`] <= 0) {
          alert(`No leaves left for ${leavetype}. Cannot apply.`);
          return;
      }

        fetch("http://localhost:5000/apply_leave",{
          method:"POST",
          headers:{
            "Content-Type":"application/json"
          },
          body:JSON.stringify({
            userId:userId,
            leavetype:leavetype,
            startdate,
            enddate,
            reason
          })
        })
       .then(response=>response.json())
       .then(data=>{
        if(data.message==="Leave Request Submitted"){
          alert(`Leave request submitted for ${leavetype}. Pending approval.`);
          navigate("/staff");
        }else{
          alert(data.message);
        }
       }).catch(error=>console.error("Error submitting leave request:",error))
};

    

    
 return(
    <>
    <div className="leave-container">
        <h2>Apply For Leave</h2>
        <form onSubmit={handlesubmit}>
            <div>
              <label>Select Type of leave</label>
               <select value={leavetype} onChange={handleleavetype} required>
                <option value="">--select--</option>
                <option value="casual">casual leave </option>
                <option value="sick">sick leave</option>
                <option value="earned">earned</option>
                <option value="unpaid">Unpaid</option>
              </select> 
            </div>

            <div>
               <label>Select start date</label>
               <input type="date" value={startdate} onChange={handlestartdate} required />
            </div>

            <div>
              <label>Select End date</label>
              <input type="date" value={enddate} onChange={handleenddate} required />
            </div> 

            <div>
                <label>Reason</label>
                <textarea type="text" value={reason} placeholder="Enter Your Reason" onChange={handlereason} required />
            </div> 
           
            <button type="submit">Apply</button>
        </form>
    </div>
    </>
 );
}
export default ApplyforLeave