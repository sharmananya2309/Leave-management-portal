import React,{useState} from "react";
import './LoginPage.css';
function LoginPage(){
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    
  function handleemail(event)
  {
     setEmail(event.target.value);
  }
  function handlepassword(e)
  {
    setPassword(e.target.value);
  }

  //Using FetchApi to make network requests to the backend.
 async function handlelogin(e)
  {
    e.preventDefault();
    try{
        const response=await fetch('http://localhost:5000/login',{
            method:'POST',
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify({email,password})}
        );
        if(!response.ok){
            throw new Error('Invalid credentials');
        }

    const data=await response.json();
    console.log("logged in user",data);
    localStorage.setItem("user_id",data.user.id);
    localStorage.setItem("name",data.user.name);
    localStorage.setItem("role",data.user.role);
    localStorage.setItem('token',data.token);
    
    if(data.user.role==="hod")
          { window.location.href='/hod';}
    else
          { window.location.href="/staff";}
   }
    catch(error)
    {
        alert(error.message);
    }
  }
  return(<>
  
    <div className="top-section"></div>
    <div className="login-page">
    <form onSubmit={handlelogin} className="login-form">
     <div className="input-grp">
     <label htmlFor="">Email </label>
        <input type="text" placeholder="johndoe123@gmail.com" value={email} onChange={handleemail} required/>

      </div> 
      <div className="input-grp">
        <label >Password </label>
        <div style={{ position: "relative", display: "inline-block" }}>
          <input type={showPassword ? "text" : "password"} placeholder="password" value={password} onChange={(e) => setPassword(e.target.value)} required 
          style={{display:"flex",alignItems:"center",width:"100%",padding:"10px"}}
           />

          <button type="button" onClick={() => setShowPassword(!showPassword)}
          style={{
            
            position: "absolute",
            right: "10px",
            background: "none",
            border: "none",
            cursor: "pointer",
            fontSize: "18px",
            height: "100%",
          }}
            >
              {showPassword?"👁️":"🙈"}
            </button>
        </div>
       </div>
      <button type="submit" className="login-btn">Login</button>
         </form>

    </div>
    <div>
    <footer className="footer">
       <p>S + R</p>
     <p>Copyright © 2024 Schopper Riegler - All Rights Reserved.</p>
</footer>
    </div>
    
</>  );
};
export default LoginPage