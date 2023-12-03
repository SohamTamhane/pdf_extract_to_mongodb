import axios from 'axios';
import './Admin.css';
import { useEffect, useState } from 'react';

function Admin(){

    const backendUrl = 'http://127.0.0.1:5000';
    const [prescription, setPrescription] = useState([]);
    const [patients, setPatients] = useState([]);

    async function fetchAllData(){
        await axios.get(`${backendUrl}/admin_fetch`).then((res)=>{
            setPrescription(res.data.prescription);
            setPatients(res.data.patients);
        }).catch((error)=>{
            console.log(error);
        });
    }

    async function deleteRecordPrescription(id){
        await axios.post(`${backendUrl}/admin_delete_prescription`, {id: id}).then((res)=>{
            window.location.reload()
        }).catch((error)=>{
            console.log(error);
        });
    }

    async function deleteRecordPatients(id){
        await axios.post(`${backendUrl}/admin_delete_patients`, {id: id}).then((res)=>{
            window.location.reload()
        }).catch((error)=>{
            console.log(error);
        });
    }

    useEffect(()=>{
        fetchAllData();
    }, [])

    return(
        <div>
            <div className="header-div">Admin Panel</div>
            <div className='admin-section'>
                <div className="admin-heading-div">Prescription</div>
                {
                    prescription?.map((elm)=>(
                        <div key={elm._id.$oid} className="admin-main-section">
                            <div className="admin-text"><b>Patient Name: </b>{elm.patientName}</div>
                            <div className="admin-text"><b>Patient Address: </b>{elm.address}</div>
                            <div className="admin-text"><b>Medicines: </b>{elm.medicines}</div>
                            <div className="admin-text"><b>Directions: </b>{elm.directions}</div>
                            <div className="admin-text"><b>Refills: </b>{elm.refills}</div>
                            <div className="admin-text-delete" onClick={()=>deleteRecordPrescription(elm._id.$oid)}>Delete</div>
                        </div>
                    ))
                }
            </div>
            <div className='admin-section'>
                <div className="admin-heading-div">Patients Details</div>
                {
                    patients?.map((elm)=>(
                        <div key={elm._id.$oid} className="admin-main-section">
                            <div className="admin-text"><b>Patient Name: </b>{elm.patientName}</div>
                            <div className="admin-text"><b>Phone Number: </b>{elm.phoneNumber}</div>
                            <div className="admin-text"><b>Date of Birth: </b>{elm.dateOfBirth}</div>
                            <div className="admin-text"><b>Gender: </b>{elm.gender}</div>
                            <div className="admin-text"><b>Address: </b>{elm.address}</div>
                            <div className="admin-text"><b>Email: </b>{elm.email}</div>
                            <div className="admin-text"><b>Medical Problems: </b>{elm.medicalProblems}</div>
                            <div className="admin-text"><b>HepatitisB Vaccination: </b>{elm.hepatitisBVaccination}</div>
                            <div className="admin-text-delete" onClick={()=>deleteRecordPatients(elm._id.$oid)}>Delete</div>
                        </div>
                    ))
                }
            </div>
        </div>
    )
}
export default Admin;