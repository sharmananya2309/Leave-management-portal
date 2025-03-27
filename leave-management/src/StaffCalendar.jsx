import React,{useState} from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./StaffCalendar.css"
function StaffCalendar(){
  const[date,setdate]=useState(new Date());
  return(
    <>
    <div className="calendar-container">
        <h3><i>Calendar</i></h3>
        <Calendar onChange={setdate} value={date}/>
        <p>selected date:{date.toDateString()}</p>
    </div>
    </>
  );
}
export default StaffCalendar