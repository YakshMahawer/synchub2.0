import React, {useEffect, useState} from "react";

const StudentDashboard = () => {
    const [td, setTd] = useState(null);
    const[ad, setAd] = useState(null);
    const [once, setOnce] = useState(true);
    const [whatweek, setWhatweek] = useState(0);
    const [file, setFile] = useState('');
    const handleWeeks = (id) => {
        setWhatweek(id)
    }
    useEffect(() => {
        const fetchData = async () => {
        if(once){
            const d = {
                'email': "asjsn@admn.com"
            }
            fetch('/student',{
                'method':'POST',
                 headers : {
                'Content-Type':'application/json'
          },
          body:JSON.stringify(d)
        })
        .then(async (response) =>{
          const data = await response.json();
          console.log(data);
          setTd(data[0].pdata);
          setAd(data[1].adata);
        })
        .catch(error => console.log(error))
        }
    }
    fetchData();
      }, []);
    
      useEffect(() => {
        console.log(td);
        console.log(ad);
      }, [td]);

    const handleFileSubmit = (id) => {
        const d ={
            'id': id,
            'file': file
        }
        fetch('/updateAssignment',{
            'method':'POST',
             headers : {
            'Content-Type':'application/json'
        },
        body:JSON.stringify(d)
        })
        .then(async (response) =>{
        const data = await response.json();
        window.location.reload();
        console.log(data);
        })
        .catch(error => console.log(error))
    }

      const readURL = () => {
        var Element = document.getElementById("file_upload");
        const url = URL.createObjectURL(Element.files[0]);
        const selectedfile = Element.files;
    
        if (selectedfile.length > 0) {
            const [imageFile] = selectedfile;
            const fileReader = new FileReader();
            fileReader.onload = () => {
                const srcData = fileReader.result;
                  const fileinfo = selectedfile[0].name.split('.');
                  setFile(srcData);
                  console.log(srcData);
            };
            fileReader.readAsDataURL(imageFile);
        }
    
    }
    return(
        <div>
            Student Dashboard
            {
                (td != null)?<div>
                    {td.map((item, index) => (
                                        <div>
                                        {item.project_description}
                                        </div>
                                    ))}
                </div>:<div></div>
            }
            {
                (ad != null)?<div>
                    {ad.map((item, index) => (
                                        <div>
                                        <button onClick={() => {handleWeeks(index)}}>{item.name}</button>
                                        </div>
                                    ))}
                </div>:<div></div>
            }

            {
                (ad != null)?
                <div>
                    <div>Showing {ad[whatweek].name}</div>
                    {
                        (ad[whatweek]. status == "Pending")?
                        <div>
                            <div>Add File: </div>
                            <input onChange={()=> readURL()} id="file_upload" type="file" />
                            <button onClick={() => {handleFileSubmit(ad[whatweek]._id.$oid)}}>Submit</button>
                        </div>:''
                    }
                </div>:''
            }
        </div>
    )
}

export default StudentDashboard;