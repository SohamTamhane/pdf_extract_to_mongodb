from flask import Flask, request, jsonify
from flask_cors import CORS

from PyPDF2 import PdfReader 
from pymongo import MongoClient
import bson
from bson import json_util, ObjectId
import json

app = Flask(__name__)
# Apply CORS to your entire Flask app and specify allowed origins
CORS(app, origins=["http://localhost:3000"])


# MongoDB setup
client = MongoClient('mongodb://localhost:27017/')
db = client['ram1']


# @app.route('/api/extract_data', methods=['POST'])
# def extract_data():
#     try:
#         file = request.files['file']
#         file_format = request.form['file_format']

#         if file_format == 'prescription':
#             extracted_data = extract_prescription_data(file)
#         elif file_format == 'patient_details':
#             extracted_data = extract_patient_details(file)
#         else:
#             return jsonify({'error': 'Invalid file format'}), 400

#         return jsonify(extracted_data)

#     except Exception as e:
#         return jsonify({'error': str(e)}), 500


# @app.route('/fetch_data/prescription', methods=['GET'])
# def extract_prescription_data():
#     try:
#         # Replace this with your logic to fetch data for the "prescription" document type
#         # You might need to query your database or another data source

#         # For testing purposes, you can return some sample data
#         sample_data = {
#             'patientName': '',
#             'patientAddress': '',
#             'medicines': '',
#             'directions': '',
#             'refills': '',
#         }

#         return jsonify(sample_data), 200

#     except Exception as e:
#         return jsonify({'error': str(e)}), 500


#     # Convert the PDF file to text using pytesseract
#     text = pytesseract.image_to_string(file)

#     # Image preprocessing using OpenCV
#     image = convert_from_path(file)[0]  # Convert the first page of the PDF to an image
#     image = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)  # Convert to grayscale

#     # Apply Gaussian blur to reduce noise
#     blurred_image = cv2.GaussianBlur(image, (5, 5), 0)

#     # Perform OCR on the preprocessed image
#     text = pytesseract.image_to_string(blurred_image)

#     # Extract patient name and address
#     patient_info = re.search(r'Patient Name:(.*?)Address:(.*?)', text)
#     if patient_info:
#         extracted_data['patientName'] = patient_info.group(1).strip()
#         extracted_data['patientAddress'] = patient_info.group(2).strip()

#     # Extract medicines
#     medicines = re.findall(r'Medicine:(.*?)Directions:', text)
#     extracted_data['medicines'] = [medicine.strip() for medicine in medicines]

#     # Extract directions
#     directions = re.findall(r'Directions:(.*?)Refills:', text)
#     extracted_data['directions'] = [direction.strip() for direction in directions]

#     # Extract refills
#     refills = re.search(r'Refills:(.*?)$', text)
#     if refills:
#         extracted_data['refills'] = refills.group(1).strip()

#     return extracted_data

# def extract_patient_details(file):
#     extracted_data = {
#         'patientName': '',
#         'phoneNumber': '',
#         'medicalProblems': '',
#         'hepatitisBVaccination': '',
#     }

#     # Convert the PDF file to text using pytesseract
#     text = pytesseract.image_to_string(file)

#     # Image preprocessing using OpenCV
#     image = convert_from_path(file)[0]  # Convert the first page of the PDF to an image
#     image = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)  # Convert to grayscale

#     # Apply Gaussian blur to reduce noise
#     blurred_image = cv2.GaussianBlur(image, (5, 5), 0)

#     # Perform OCR on the preprocessed image
#     text = pytesseract.image_to_string(blurred_image)

#     # Extract patient name and phone number
#     patient_info = re.search(r'Name:(.*?)Phone:(.*?)', text)
#     if patient_info:
#         extracted_data['patientName'] = patient_info.group(1).strip()
#         extracted_data['phoneNumber'] = patient_info.group(2).strip()

#     # Extract medical problems
#     medical_problems = re.findall(r'Medical Problems:(.*?)Hepatitis B Vaccination:', text)
#     extracted_data['medicalProblems'] = [problem.strip() for problem in medical_problems]

#     # Extract Hepatitis B Vaccination status
#     vaccination = re.search(r'Hepatitis B Vaccination:(.*?)$', text)
#     if vaccination:
#         extracted_data['hepatitisBVaccination'] = vaccination.group(1).strip()

#     return extracted_data


# API endpoint to upload and process PDF
@app.route('/upload-pdf', methods=['POST'])
def upload_pdf():
    try:
        # Get the uploaded PDF file
        pdf_file = request.files['pdf']

        reader = PdfReader(pdf_file) 
        page = reader.pages[0] 
        text = page.extract_text()

        pageData = text.splitlines()
        name = pageData[0].split(": ")[1]
        address = pageData[1].split(": ")[1]
        medicines = pageData[2].split(": ")[1]
        directions = pageData[3].split(": ")[1]
        refills = pageData[4].split(": ")[1]
        phone = pageData[5].split(": ")[1].replace(" ", "")
        dob = pageData[6].split(": ")[1].replace(" ", "")
        email = pageData[7].split(": ")[1].replace(" ", "")
        problems = pageData[8].split(": ")[1]
        gender = pageData[9].split(": ")[1].replace(" ", "")
        vaccination = pageData[10].split(": ")[1].replace(" ", "")

        data =  {"name": name, "address": address, "medicines": medicines, "directions": directions, "refills": refills, "phone": phone, "dob": dob, "email": email, "problems": problems, "gender": gender, "vaccination": vaccination}

        # reader = PdfReader(pdf_file) 
        # # printing number of pages in pdf file 
        # print(len(reader.pages)) 
        # # getting a specific page from the pdf file 
        # page = reader.pages[0] 
        # # extracting text from page 
        # text = page.extract_text() 
        # print(text)
        
        # Read the PDF content
        # pdf_reader = PyPDF2.PdfFileReader(pdf_file)
        # text_content = ""
        # for page_num in range(pdf_reader.numPages):
        #     page = pdf_reader.getPage(page_num)
        #     text_content += page.extractText()
        
        # print(text_content)

        # Save the extracted data to MongoDB
        # data = {"content": text_content}
        # collection.insert_one(data)
        
        return jsonify({"status": "success", "message": "PDF data saved successfully", "data": data})
    except Exception as e:
        print(e)
        return jsonify({"status": "error", "message": str(e)})



@app.route('/save_prescription_to_database', methods=['POST'])
def save_prescription_to_database():
    try:
        collection = db['prescription']
        data = request.get_json()
        x = collection.insert_one(data)
        return jsonify({"status": "success", "message": "Patient Data Saved to DB Successfully !!"})
    
    except Exception as e:
        print(e)
        return jsonify({"status": "error", "message": str(e)})

@app.route('/save_patients_to_database', methods=['POST'])
def save_patients_to_database():
    try:
        collection = db['patients']
        data = request.get_json()
        x = collection.insert_one(data)
        return jsonify({"status": "success", "message": "Patient Data Saved to DB Successfully !!"})
    
    except Exception as e:
        print(e)
        return jsonify({"status": "error", "message": str(e)})


@app.route('/admin_fetch', methods=['GET'])
def admin_fetch():
    try:
        class JSONEncoder(json.JSONEncoder):
            def default(self, o):
                if isinstance(o, ObjectId):
                    return {"$oid": str(o)}
                return json.JSONEncoder.default(self, o)
        
        collection1 = db['prescription']
        collection2 = db['patients']
        
        prescription = []
        patients = []

        for x in collection1.find():
            prescription.append(x)

        for x in collection2.find():
            patients.append(x)
        
        page_prescription = json.loads(json_util.dumps(prescription))
        page_patients = json.loads(json_util.dumps(patients))

        return jsonify({"status": "success", "message": "Data Fetched Successfully", "prescription": page_prescription, "patients": page_patients})
    
    except Exception as e:
        print(e)
        return jsonify({"status": "error", "message": str(e)})

@app.route('/admin_delete_prescription', methods=['POST'])
def admin_delete_prescription():
    try:
        collection1 = db['prescription']

        data = request.data
        new_data = data.decode('utf-8')
        json_data = json.loads(new_data)
        id1 = json_data['id']

        oid = ObjectId(id1)

        query = {"_id" : oid}
        result = collection1.find_one_and_delete(query)

        return jsonify({"status": "success", "message": "Data Fetched Successfully"})
    
    except Exception as e:
        print(e)
        return jsonify({"status": "error", "message": str(e)})


@app.route('/admin_delete_patients', methods=['POST'])
def admin_delete_patients():
    try:
        collection1 = db['patients']

        data = request.data
        new_data = data.decode('utf-8')
        json_data = json.loads(new_data)
        id1 = json_data['id']

        oid = ObjectId(id1)

        query = {"_id" : oid}
        result = collection1.find_one_and_delete(query)

        return jsonify({"status": "success", "message": "Data Fetched Successfully"})
    
    except Exception as e:
        print(e)
        return jsonify({"status": "error", "message": str(e)})


if __name__ == '__main__':
    app.run(host='localhost', port=8000)

