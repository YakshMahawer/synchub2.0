import React, { useState } from "react";
import "./DashboardPage.css";
import { useNavigate } from "react-router-dom";
import image from "./vec.jpg";

function DashboardPage() {
  const [projectName, setProjectName] = useState("");
  const navigate = useNavigate();
  const [data, setdata] = useState(null);
  const isLoggedIn = sessionStorage.getItem('isLoggedIn') === 'true';

  const handleVisit = (id) => {
    alert("j")
      const d = {
        'id': id
    }
    fetch('/projectDetails',{
        'method':'POST',
        headers : {
        'Content-Type':'application/json'
    },
    body:JSON.stringify(d)
    })
    .then(async (response) =>{
    const data = await response.json();
    navigate("/watchProject", {
      state: data
    })
    })
    .catch(error => console.log(error))
  }
  const handlehome = () => {
    navigate("/", {
      replace: true,
    });
  };
  const handleMinor = () => {
    navigate("/minorProject", {
      replace:true});
  }
  const handlelogin = () => {
    navigate("/login", {
      replace: true,
    });
  };
  const handleSearch = () => {
    fetch("/search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        projectName,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          return response.json();
        } else {
          throw new TypeError("Response is not in JSON format");
        }
      })
      .then((data) => {
        console.log(data.matchingProjects);
        setdata(data.matchingProjects);
      })
      .catch((error) => {
        console.error("Error: ", error.message);
      });
  };
  return (
    <>
      <div className="head">
        <div className="left-h">
          {/* <p className="p1">LOGO</p> */}
          <p className="p2">Pu Synchub</p>
        </div>
        <div className="right-h">
          <button className="b1" onClick={handlehome}>
            Home
          </button>
          {isLoggedIn ? null : <button class="b2" onClick={handlelogin}>Login</button>}
          <button className="b3" onClick={handleMinor}>Registration</button>
        </div>
      </div>

      <div className="Content">
        <div className="middle">
          <div className="middle-left">
            <div className="tagline">
              <p>
                Igniting Student Ingenuity, Building Tomorrow's{" "}
                <span className="innovators">Innovators</span>
              </p>
            </div>
            <div className="about">
              <p>
                Unleash your creativity, share your projects, inspire the world.
                Welcome to the future of student innovation!!!
              </p>
            </div>
          </div>
          <div className="vector">
            <img src={image} alt="" />
          </div>
        </div>
        <div className="project_info">
          <div className="searching">
            <input
              type="text"
              value={projectName}
              placeholder="Search projects..."
              onChange={(e) => setProjectName(e.target.value)}
            />
          </div>
          <div className="search">
            <button onClick={handleSearch}>Search</button>
          </div>
        </div>
        <div>
          {data != null ? (
            <div className="response">
              {data.map((item, index) => (
                <div className="reb">
                  <div className="re">
                    <div className="hp">
                      <h1>{item.name}</h1>

                      <p className="de">{item.description}</p>
                    </div>
                    <div className="visit">
                      <p className="le">{item.leaderEmail}</p>
                      <button className="btn_visit" onClick={() => {handleVisit(item.name)}}>Visit</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div></div>
          )}
        </div>
      </div>
    </>
  );
}

export default DashboardPage;
