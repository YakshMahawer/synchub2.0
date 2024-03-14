import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import "./LoginPage.css";
import  image from "./vec3.jpg";
import image2 from "./vec2.jpg";

function LoginPage() {
  const [userType, setUserType] = useState('');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const navigate = useNavigate();
  const userEmail = email;
  localStorage.setItem('userEmail', userEmail);

  const handleLogin = (e) => {
    fetch("/create", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userType,
        email,
        name,
        password,
        phoneNumber
      }),
    })
    .then(response => {
      console.log(response)
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      sessionStorage.setItem('isLoggedIn', 'true');
      navigate("/", {
        replace:true});
    })
    .then(data => {
      console.log(data);
      setUserType('');
      setEmail('');
      setName('');
      setPassword('');
      setPhoneNumber('');
    })
    .catch(error => {
      console.error('Error:', error);
    });
  };

  return (
    <div className="login">
      <div className="left">
        <div className="left_main">
          {userType ? (
            <>
              <h2 className="login_name">{userType.charAt(0).toUpperCase()+userType.slice(1)} Login</h2>
              {userType === "student" && (
                <>
                  <div className="stud">
                    <input
                      type="email"
                      placeholder="Enter Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="stud">
                    <input
                      type="text"
                      placeholder="Enter Name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="stud">
                    <input
                      type="password"
                      placeholder="Enter Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  <div className="stud">
                    <input
                      type="tel"
                      placeholder="Enter Mobile No."
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      required
                    />
                  </div>
                </>
              )}
              {userType === "teacher" && (
                <>
                  <div className="teach">
                    <input
                      type="email"
                      placeholder="Enter Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="teach">
                    <input
                      type="text"
                      placeholder="Enter Name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="teach">
                    <input id='pass'
                      type="password"
                      placeholder="Enter Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                </>
              )}
              {userType && (
                <div className="login_button">
                  <button onClick={handleLogin}>Login</button>
                </div>
              )}
            </>
          ) : (
            <div className="vt">
              <div className="login_main">
                <select
                  id="opt"
                  value={userType}
                  onChange={(e) => setUserType(e.target.value)}
                >
                  <option value="">Select UserType</option>
                  <option value="student">Student</option>
                  <option value="teacher">Teacher</option>
                </select>
              </div>
              <img src={image} alt="vec3" />
            </div>
          )}
        </div>
      </div>
      <div className='right'>
        {userType ? (
          <img src={image2} alt="" />
        ):(
          <p>content</p>
        )}
        
      </div>
    </div>
  );
};

export default LoginPage;