import React from "react";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

const WatchProject = () => {
    const [pdetails, setPdetails] = useState(null);
    const location = useLocation();
    useEffect(() => {
        setPdetails(location.state);
      }, []);
    return(
        <div>
            Watch Project
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
        </div>
    )
}

export default WatchProject;