import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function Home() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedDocumentType, setSelectedDocumentType] = useState('prescription');
  const [extractedData, setExtractedData] = useState(null);
  
  const [formDataPrescription, setFormDataPrescription] = useState({
    patientName: '',
    patientAddress: '',
    medicines: '',
    directions: '',
    refills: '',
  });
  const [formDataPatientDetails, setFormDataPatientDetails] = useState({
    patientName: '',
    phoneNumber: '',
    dateOfBirth: '',
    gender: 'Male',
    address: '',
    email: '',
    medicalProblems: '',
    hepatitisBVaccination: 'No',
  });
  const [saveMessage, setSaveMessage] = useState('');

  const backendUrl = 'http://127.0.0.1:5000'; // Replace with your actual backend URL
  // Replace with your actual backend URL

  useEffect(() => {
    fetchDataFromBackend();
  }, [selectedDocumentType]);

  const fetchDataFromBackend = async () => {
    try {
      const response = await axios.get(`${backendUrl}/fetch_data/${selectedDocumentType}`);
      if (response.status === 200) {
        const data = response.data;
        if (selectedDocumentType === 'prescription') {
          setFormDataPrescription(data);
        } else if (selectedDocumentType === 'patient_details') {
          setFormDataPatientDetails(data);
        }
      } else {
        console.error('Error occurred while fetching data from the backend.');
      }
    } catch (error) {
      console.error('Error occurred while making the request.');
    }
  };

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleDocumentTypeChange = (event) => {
    setSelectedDocumentType(event.target.value);
  };

  const handleExtract = async () => {
    if (selectedFile) {
      const formData = new FormData();
      formData.append('pdf', selectedFile);
      // formData.append('file_format', selectedDocumentType);

      try {
        // const response = await axios.post(`${backendUrl}/extract_from_doc`, formData);
        const response = await axios.post(`${backendUrl}/upload-pdf`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        if (response.status === 200) {
          const data = response.data;
          setExtractedData(data);

          if (selectedDocumentType === 'prescription') {

            setFormDataPrescription({
              patientName: data.data.name,
              patientAddress: data.data.address,
              medicines: data.data.medicines,
              directions: data.data.directions,
              refills: data.data.refills
            })
          } else if (selectedDocumentType === 'patient_details') {
            setFormDataPatientDetails({
              patientName: data.data.name,
              phoneNumber: data.data.phone,
              dateOfBirth: data.data.dob,
              gender: data.data.gender,
              address: data.data.address,
              email: data.data.email,
              medicalProblems: data.data.problems,
              hepatitisBVaccination: data.data.vaccination,
            });
          }
        } else {
          console.error('Error occurred while processing the document.');
        }
      } catch (error) {
        console.error('Error occurred while making the request.');
      }
    } else {
      alert('Please select a PDF file to upload.');
      console.error('Please select a PDF file to upload.');
    }
  };

  const handleInputChangePrescription = (event) => {
    const { name, value } = event.target;
    setFormDataPrescription({ ...formDataPrescription, [name]: value });
  };

  const handleInputChangePatientDetails = (event) => {
    const { name, value } = event.target;
    setFormDataPatientDetails({ ...formDataPatientDetails, [name]: value });
  };

  const handleSave = async () => {
    try {
      let dataToSave;
      let type;
      if (selectedDocumentType === 'prescription') {
        dataToSave = formDataPrescription;
        type = "prescription";
      } else if (selectedDocumentType === 'patient_details') {
        dataToSave = formDataPatientDetails;
        type = "patients";
      }

      const response = await axios.post(`${backendUrl}/save_${type}_to_database`, dataToSave, {
        headers: {
          'Content-Type': 'application/json',
        },
      });


      if (response.status === 200) {
        // Handle a successful response (data saved)
        alert('Data saved successfully.');
        setSaveMessage('Data saved successfully.');
        setTimeout(() => setSaveMessage(''), 5000);
      } else {
        console.error('Error occurred while saving data to the database.');
      }

    } catch (error) {
      console.error('Error occurred while making the request.');
    }
  };

  return (
    <div className="app-container">
      <h1>Medical Data Extraction</h1>
      <div className="upload-section">
        <label htmlFor="fileInput">Choose a PDF file</label>
        <input type="file" accept=".pdf" id="fileInput" onChange={handleFileChange} />
        <button onClick={handleExtract}>Extract</button>
      </div>
      <div className="selection-section">
        <select onChange={handleDocumentTypeChange} value={selectedDocumentType}>
          <option value="prescription">Prescription</option>
          <option value="patient_details">Patient Details</option>
          {/* Add options for more document types here */}
        </select>
      </div>
      {extractedData && (
        <div className="extracted-data">
          <h2>Extracted Data</h2>
          <pre>{JSON.stringify(extractedData, null, 2)}</pre>
        </div>
      )}
      {selectedDocumentType === 'prescription' && (
        <div className="form-section">
          <h2>Prescription Form</h2>
          <form>
            <div className="form-field">
              <input type="text" name="patientName" value={formDataPrescription.patientName} onChange={handleInputChangePrescription} placeholder="Patient Name" />
            </div>
            <div className="form-field">
              <input type="text" name="patientAddress" value={formDataPrescription.patientAddress} onChange={handleInputChangePrescription} placeholder="Patient Address" />
            </div>
            <div className="form-field">
              <input type="text" name="medicines" value={formDataPrescription.medicines} onChange={handleInputChangePrescription} placeholder="Medicines" />
            </div>
            <div className="form-field">
              <input type="text" name="directions" value={formDataPrescription.directions} onChange={handleInputChangePrescription} placeholder="Directions" />
            </div>
            <div className="form-field">
              <input type="text" name="refills" value={formDataPrescription.refills} onChange={handleInputChangePrescription} placeholder="Refills" />
            </div>
            <button type="button" onClick={handleSave}>Save</button>
          </form>
        </div>
      )}
      {selectedDocumentType === 'patient_details' && (
        <div className="form-section">
          <h2>Patient Details Form</h2>
          <form>
            <div className="form-field">
              <input type="text" name="patientName" value={formDataPatientDetails.patientName} onChange={handleInputChangePatientDetails} placeholder="Patient Name" />
            </div>
            <div className="form-field">
              <input type="text" name="phoneNumber" value={formDataPatientDetails.phoneNumber} onChange={handleInputChangePatientDetails} placeholder="Phone Number" />
            </div>
            <div className="form-field">
              <input type="text" name="dateOfBirth" value={formDataPatientDetails.dateOfBirth} onChange={handleInputChangePatientDetails} placeholder="Date of Birth" />
            </div>
            <div className="form-field">
              <select name="gender" value={formDataPatientDetails.gender} onChange={handleInputChangePatientDetails}>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="form-field">
              <input type="text" name="address" value={formDataPatientDetails.address} onChange={handleInputChangePatientDetails} placeholder="Address" />
            </div>
            <div className="form-field">
              <input type="text" name="email" value={formDataPatientDetails.email} onChange={handleInputChangePatientDetails} placeholder="Email" />
            </div>
            <div className="form-field">
              <input type="text" name="medicalProblems" value={formDataPatientDetails.medicalProblems} onChange={handleInputChangePatientDetails} placeholder="Medical Problems" />
            </div>
            <div className="form-field">
              <select name="hepatitisBVaccination" value={formDataPatientDetails.hepatitisBVaccination} onChange={handleInputChangePatientDetails}>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </div>
            <button type="button" onClick={handleSave}>Save</button>
          </form>
        </div>
      )}
      {saveMessage && <p className="save-message">{saveMessage}</p>}
    </div>
  );
}

export default Home;


