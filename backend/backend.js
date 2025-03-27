require("dotenv").config();
const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const app = express();
const bcrypt=require("bcrypt");
app.use(express.json());
app.use(cors());




// MySQL Database Connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",  //password for mysql db
  database: ""  //name of database
});
// Connect to MySQL
db.connect((err) => {
  if (err) {
    console.error("Database connection failed:", err);
  } else {
    console.log("Connected to MySQL database");
  }
});
//API For Login Requests
app.post("/login",(req,res)=>
{
  const{email, password}=req.body;

  if(!email || !password){
    return res.status(400).json({message:"please provide correct credentials" });
  }

    const query="SELECT* FROM users WHERE email=? AND password=?";
    db.query(query, [email,password], (err, results) => {
      if (err) return res.status(500).json({ message: "Database error", error: err });
     
      console.log("SQL Query Results:", results);

      if (results.length === 0) {
          return res.status(401).json({ message: "User not found" });
      }
    const user=results[0];

    console.log("User Role:", user.role);
    
  
    if(password===user.password){
         const token=jwt.sign({id:user.id,email:user.email,role:user.role},"secret_key",{expiresIn:"1h"});
         return res.status(200).json({message:"Login successful",token,user});
        }
        else{
          return res.status(401).json({message:"invalid password"});
        }
        
      });
    });

//API to get Leave Balance in Staff Dashboard
app.get("/leave_balance/:userId",(req,res) =>{
  const userId=req.params.userId;
  const query="SELECT sick_leave,casual_leave,earned_leave,unpaid_leave FROM leave_balance WHERE user_id=?";

  db.query(query,[userId],(err,results)=>{
    if(err) return res.status(500).json({message:"Database Error",error:err});

    if(results.length===0){
      return res.status(404).json({message:"NO LEAVE BALANCE FOUND"});
    }
    res.status(200).json(results[0]);
  });
});

//API to fetch leave history on staff dashboard
app.get("/leave_history/:userId",(req,res)=>
{
  const userId=req.params.userId;
  const query="SELECT * FROM leaves WHERE user_id = ?";

  db.query(query,[userId],(err,results)=>
  {
    if(err) return res.status(500).json({message:"database error",error:err});

    if(results.length===0){
      return res.status(404).json({message:"NO Leave balanace found"});
    }
    res.status(200).json(results);
  });
});

//API to apply for leave on staff dashboard
app.post("/apply_leave",(req,res)=>{
  const { userId, startdate, enddate, reason, leavetype } = req.body;
  console.log("Leave Application Request:", req.body); // Debugging

  if (!userId || !startdate || !enddate || !reason || !leavetype) {
    return res.status(400).json({ message: "All fields are required" });
  }

  
  const checkBalanceQuery = `SELECT ?? AS balance FROM leave_balance WHERE user_id = ?`;

  db.query(checkBalanceQuery, [`${leavetype}_leave`, userId], (err, results) => {
    if (err) {
      console.error("Database error while fetching leave balance:", err);
      return res.status(500).json({ message: "Database error", error: err });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "No leave balance found" });
    }

    const leaveBalance = results[0].balance;
    console.log(`Current ${leavetype} balance:`, leaveBalance);

    //Check if user has enough leaves
    if (leaveBalance <= 0) {
      return res.status(400).json({ message: `No leaves left for ${leavetype}. Cannot apply.` });
    }

   
    const insertLeaveQuery = `
      INSERT INTO leaves (user_id, leave_type, start_date, end_date, reason, status) 
      VALUES (?, ?, ?, ?, ?, 'Pending')
    `;

    db.query(insertLeaveQuery, [userId, leavetype, startdate, enddate, reason], (err, results) => {
      if (err) {
        console.error("Database error while inserting leave request:", err);
        return res.status(500).json({ message: "Database error", error: err });
      }

      res.status(200).json({ message: "Leave Request Submitted" });
    });
  });
});
//API to get status of last leave applied on staff dashboard
app.get("/last_leave_status/:userId",(req,res)=>
{
  const userId=req.params.userId;
  const query="SELECT status FROM leaves WHERE user_id=?ORDER BY id DESC LIMIT 1";

  db.query(query,[userId],(err,results)=>{
    if(err) return res.status(500).json({message:"Database error ",error:err});

    if(results.length===0){
      return res.status(404)({message:"no leave requests found"});
    }

    res.status(200).json({status:results[0].status});
  });
});

//API for HOD page to check all leave requests
app.get("/leave_requests",(req,res)=>{
  const query=`SELECT l.id,l.user_id,u.name,l.leave_type,l.start_date,
  l.end_date,l.reason,l.status 
  FROM leaves l
  JOIN users u ON l.user_id=u.id
  WHERE l.status='Pending'
  ORDER BY l.start_date ASC`;

  db.query(query,(err,results)=>
  {
    if(err) return res.status(500).json({message:"Database Error",error:err});
    res.status(200).json(results);
  });
});
//API for leave requests for pop-up option(when a leave req is clicked by hod)
app.get("/leave_requests/:id",(req,res)=>{
  const leaveId=req.params.id;
  const query=`SELECT l.id,l.user_id,l.leave_type,l.start_date,l.end_date,l.reason
  FROM leaves l
  JOIN users u ON l.user_id=u.id
  WHERE l.id=?`;

  db.query(query,[leaveId],(err,results)=>{
    if(err) return res.status(500).json({message:"Database Error",error:err});
   
    console.log("Fetching leave request for ID:", leaveId);

    if(results.length===0){
      return res.status(404).json({message:"Leave request not found"});
    }
    res.status(200).json(results[0]);
  });
});
//API to approve or reject leaves
app.put("/update_leaves_status/:id",(req,res)=>{
  const leaveId=req.params.id;
  const {status,userId,leavetype}=req.body;
  if(!status){
    return res.status(400).json({message:"status is required"});

  }
  const updateQuery ="UPDATE leaves SET status =? WHERE id=?";
  db.query(updateQuery,[status,leaveId],(err,results)=>
  {
    if(err) return res.status(500).json({message:"database error",error:err});

    if (status==="Approved"){
      const deductLeaveQuery=`UPDATE leave_balance
      SET ${leavetype}_leave = ${leavetype}_leave - 1 
        WHERE user_id = ? AND ${leavetype}_leave > 0`;

      db.query(deductLeaveQuery,[`${leavetype}_leave`, `${leavetype}_leave`, userId, `${leavetype}_leave`],(err,results)=>
      {
        if(err) return res.status(500).json( {message : "Error updating leave balance", error: err });

       return res.status(200).json({ message: "Leave approved and balance updated" });
      });
    }
    else {
      res.status(200).json({message:`leave ${status}`});
    }
  });
});
// Start Server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
module.exports = db;
