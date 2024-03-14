import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const Project = () => {
    const [marks, setMarks] = useState('');
    const [remarks, setRemarks] = useState('');
    const [fool, setFool] = useState(false);
    const [td, setTd] = useState(null);
    const [pdetails, setPdetails] = useState(null);
    const [once, setOnce] = useState(true);
    const location = useLocation();
    useEffect(() => {
        setPdetails(location.state[0].pdata);
        setTd(location.state[1].adata);
      }, []);

    const handleSetMarks = (id) => {
        const d = {
            'id': id,
            'marks': marks,
            'remark': remarks
        }
        fetch('/updateMarks',{
            'method':'POST',
             headers : {
            'Content-Type':'application/json'
        },
        body:JSON.stringify(d)
        })
        .then(async (response) =>{
        const data = await response.json();
        console.log(data);
        setFool(true);
        })
        .catch(error => console.log(error))
    }
    return(
        <div>
            Project Info
            {
                (pdetails != null)?
                <div>
                {pdetails.map((item, index) => (
                                        <div className="project_data_teacher">
                                            <div>Project ID: {item._id.$oid}</div>
                                            <div>Project Name: {item.project_name}</div>
                                        </div>
                                    ))}
                </div>:
                <div></div>
            }
            {
                (td != null)?
                <div>
                {td.map((item, index) => (
                                        <div className="project_data_teacher">
                                            <div>Assignment ID: {item._id.$oid}</div>
                                            <div>Assignment Name: {item.name}</div>
                                            {
                                                (item.status == "Unchecked")?
                                                <div>
                                                    {
                                                        (fool)?
                                                        <div>
                                                            <div>Marks: {marks}</div>

                                                            {
                                                                (remarks != '')?<div>Remarks: {remarks}</div>:''
                                                            }
                                                        </div>:
                                                        <div>
                                                            <div>Enter Marks: </div>
                                                            <input type="text" onChange={(e) => setMarks(e.target.value)}/>
                                                            <div>Enter Remark: </div>
                                                            <input type="text" onChange={(e) => setRemarks(e.target.value)}/>
                                                            <button onClick={()=> handleSetMarks(item._id.$oid)}>Submit</button>
                                                        </div>
                                                    }
                                                </div>:
                                                <div>
                                                    <div>Marks: {item.marks}</div>
                                                    {(item.remarks != '' ||  item.remarks != undefined)? <div>Remarks: {item.remarks}</div>:''}
                                                </div>
                                            }
                                        </div>
                                    ))}
                </div>:
                <div></div>
            }
        </div>
    )
}

export default Project;