import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "./RegistrationPage.css";

const userEmail = localStorage.getItem('userEmail');
function RegistrationPage() {
  const [step, setStep] = useState(1);
  const [leaderEmail, setLeaderEmail] = useState('');
  const [mem2Email, setMem2Email] = useState('');
  const [mem3Email, setMem3Email] = useState('');
  const [mem4Email, setMem4Email] = useState('');
  const [mentorEmail, setMentorEmail] = useState('');
  const [projectName, setProjectName] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const navigate = useNavigate();
  
  const handleStep1Submit = () => {

    fetch("/register_team", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        leaderEmail,
        mem2Email,
        mem3Email,
        mem4Email,
        mentorEmail
      }),
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      if (data.message==1){
        setStep(2);
      }
      else if (data.message==2){
        //navigate to student dashboard
      }
    })
    .catch(error => {
      console.error('Error:', error);
    });
  };

  const handleStep2Submit = () => {
    fetch("/register_project", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        projectName,
        projectDescription,
        leaderEmail
      }),
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      navigate("/", { replace: true });
    })
    .catch(error => {
      console.error('Error:', error);
    });
  };

  return (
      <div className='reg'>
        <div className="reg_main">
            <h2 className='reg_h2'>Registration</h2>
            <div>
              <p className='step'>Step {step} of 2</p>
              <progress className='progress' max="2" value={step}></progress>
            </div>
            {step === 1 && (
              <>
                <h3 className='reg_h3'>Step 1: Team Information</h3>
                <div className='reg_email'>
                  <input type="email" placeholder='Leader Email' value={leaderEmail} onChange={(e) => setLeaderEmail(e.target.value)} required />
                </div>
                <div className='reg_email'>
                  <input type="email" placeholder='Member 2 Email' value={mem2Email} onChange={(e) => setMem2Email(e.target.value)} required />
                </div>
                <div className='reg_email'>         
                  <input type="email" placeholder='Member 3 Email' value={mem3Email} onChange={(e) => setMem3Email(e.target.value)} required />
                </div>
                <div className='reg_email'>
                  <input type="email" placeholder='Member 4 Email' value={mem4Email} onChange={(e) => setMem4Email(e.target.value)} required />
                </div>
                <div className='reg_email'>
                  <input type="email" placeholder='Mentor Email' value={mentorEmail} onChange={(e) => setMentorEmail(e.target.value)} required />
                </div>
                <button className="reg_nbtn" onClick={handleStep1Submit}>Next</button>
              </>
            )}
            {step === 2 && (
              <>
                <h3 className='reg_h3'>Step 2: Project Information</h3>
                <div className='reg_pn'>
                  <label>Project Name:</label>
                  <input type="text" value={projectName} onChange={(e) => setProjectName(e.target.value)} required />
                </div>
                <div className='reg_pd'>
                  <label>Project Description:</label>
                  <textarea value={projectDescription} onChange={(e) => setProjectDescription(e.target.value)} required />
                </div>
                <button className="reg_btn" onClick={handleStep2Submit}>Register</button>
              </>
            )}
          </div>
      </div>
  );
}

export default RegistrationPage;
