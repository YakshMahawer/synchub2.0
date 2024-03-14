import React, {useEffect, useState} from "react";
import { useNavigate } from "react-router-dom";

const TeacherDashboard = () => {
    const [td, setTd] = useState(null);
    const [once, setOnce] = useState(true);
    const navigate = useNavigate();

    const handleOld = () => {
        const d = {
            'email': 'ayushs@ajbd.com'
        }
        fetch('/oldProjects',{
            'method':'POST',
             headers : {
            'Content-Type':'application/json'
        },
        body:JSON.stringify(d)
        })
        .then(async (response) =>{
        const data = await response.json();
        setTd(data);
        })
        .catch(error => console.log(error))
    }

    const handleUnchecked = () => {
        const d = {
            'email': 'ayushs@ajbd.com'
        }
        fetch('/uncheckedProjects',{
            'method':'POST',
             headers : {
            'Content-Type':'application/json'
        },
        body:JSON.stringify(d)
        })
        .then(async (response) =>{
        const data = await response.json();
        setTd(data)
        })
        .catch(error => console.log(error))
    }

    const handleOpenProject = (id) => {
        const d = {
            'id': id
        }
        fetch('/projects',{
            'method':'POST',
             headers : {
            'Content-Type':'application/json'
        },
        body:JSON.stringify(d)
        })
        .then(async (response) =>{
        const data = await response.json();
        console.log(data);
        navigate("/project", {
            state:data});
        })
        .catch(error => console.log(error))
            
    }
    useEffect(() => {
        const fetchData = async () => {
        if(once){
            const d = {
                'email': "ayushs@ajbd.com"
            }
            fetch('/teacher',{
                'method':'POST',
                 headers : {
                'Content-Type':'application/json'
          },
          body:JSON.stringify(d)
        })
        .then(async (response) =>{
          const data = await response.json();
          setTd(data);
        })
        .catch(error => console.log(error))
        }
    }
    fetchData();
      }, []);
    
      useEffect(() => {
        console.log(td);
      }, [td]);
    return(
        <div>
            Teacher Dashboard
            <div className="filters">
                <button>All</button>
                <button onClick={()=> handleUnchecked()}>Unchecked Assignments</button>
                <button onClick={()=> handleOld()}>Old Projects</button>
                <button>LogOut</button>
            </div>
            {
                (td != null)?<div>
                    {td.map((item, index) => (
                                        <div className="project_data_teacher">
                                            <div>Project ID: {item._id.$oid}</div>
                                            <div>Project Name: {item.project_name}</div>
                                            <div><button onClick={()=> handleOpenProject(item._id.$oid)}>Open Project</button></div>
                                        </div>
                                    ))}
                </div>:<div></div>
            }
        </div>
    )
}

export default TeacherDashboard;