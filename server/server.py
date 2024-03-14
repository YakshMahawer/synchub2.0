from flask import Flask, request, jsonify
from pymongo import MongoClient
import spacy
from bson import json_util
from bson import ObjectId
import time


nlp = spacy.load("en_core_web_lg")

app = Flask(__name__)
cluster = MongoClient('mongodb+srv://yakshmahawer:fZdDSYRANzjQsfkc@synchub.shfybci.mongodb.net/?retryWrites=true&w=majority&appName=SyncHub')
db = cluster['login']
collection = db['Users']
collectionp = db['Project']
dbm = cluster['pu_synchub']
students_collection = dbm['Student']
project_collection = dbm['Project']
teachers_collection = dbm['Mentor']
assignments_collection = dbm['Assignment']

@app.route('/register_team', methods=['POST'])
def register_team():
    data = request.json
    leader_email = data.get('leaderEmail')
    member_emails = [data.get(f'mem{i}Email') for i in range(2, 5)]
    mentor_email = data.get('mentorEmail')

    students =list(students_collection.find({'email': {'$in': [leader_email] + member_emails}}))
    if len(students) != 4:
        print("One")
        return jsonify({'error': 'One or more team members not found in student collection'}), 400

    mentor = teachers_collection.find_one({'email': mentor_email})

    if not mentor:
        print("Two")
        return jsonify({'error': 'Mentor not found in mentor collection'}), 400

    for student in students:
        print(student)
        if 'status' not in student:
            break
        else:
            return jsonify({'message': students[0]['status'] }), 200

    project_data = {
        'team_members': [student['email'] for student in students],
        'mentor_id': mentor['_id'],
        'status': '1'
    }
    print(project_data)
    project_id = project_collection.insert_one(project_data).inserted_id

    students_collection.update_many(
        {'email': {'$in': [leader_email] + member_emails}},
        {'$set': {'status': '1'}}
    )

    teachers_collection.update_one(
        {'email': mentor_email},
        {'$push': {'project_ids': project_id}}
    )

    return jsonify({'message': 'Step 1 completed successfully'}), 200


@app.route('/register_project', methods=['POST'])
def register_project():
    data = request.json
    project_name = data.get('projectName')
    project_description = data.get('projectDescription')

    existing_project = project_collection.find_one({'$or': [{'project_name': project_name}, {'project_description': project_description}]})
    if existing_project:
        return jsonify({'error': 'Project with similar name or description already exists'}), 400
    
    leader_email = data.get('leaderEmail')

    project_collection.update_one(
    {'team_members.3': leader_email},
    {'$set': {'project_name': project_name, 'project_description': project_description}}
    )
    
    student = list(project_collection.find({'team_members.3':'ap7841957@gmail.com'},{'team_members':1}))
    student = student[0]['team_members']

    students_collection.update_many(
        {'email': {'$in': student }},
        {'$set': {'status': '2'}}
    )

    return jsonify({'message': 'Project details added successfully'}), 

@app.route('/create', methods=['POST','GET'])
def create():
    try:
        data = request.json

        # Extract data from request
        userType = data.get('userType')
        email = data.get('email')
        name = data.get('name')
        password = data.get('password')
        phoneNumber = data.get('phoneNumber')

        # Check if the user type is valid
        if userType not in ['student', 'teacher']:
            return jsonify({'error': 'Invalid user type'}), 400

        # Check if the email exists in the corresponding collection
        if userType == 'student':
            if students_collection.find_one({'email': email}):
                return jsonify({'error': 'Email already exists in student collection'}), 400
            else:
                students_collection.insert_one({
                    'email': email,
                    'name': name,
                    'password': password,
                    'phone_number': phoneNumber
                })
                return jsonify({'message': 'Student data inserted successfully'}), 200
        elif userType == 'teacher':
            if teachers_collection.find_one({'email': email}):
                return jsonify({'error': 'Email already exists in teacher collection'}), 400
            else:
                teachers_collection.insert_one({
                    'email': email,
                    'name': name,
                    'password': password
                })
                return jsonify({'message': 'Teacher data inserted successfully'}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500


def find_matching_projects(input_text):
    if input_text is None: 
        return []
    all_projects = list(collectionp.find())
    nlp = spacy.load("en_core_web_lg")

    min_similarity_threshold = 0.4

    matching_projects = []
    for project in all_projects:
        if project['projectName'] is None or project['description'] is None:
            continue
        name_similarity = nlp(input_text).similarity(nlp(project['projectName']))
        desc_similarity = nlp(input_text).similarity(nlp(project['description']))
        combined_similarity = (name_similarity + desc_similarity) / 2  

        if combined_similarity >= min_similarity_threshold:
            matching_projects.append((project, combined_similarity))

    sorted_projects = sorted(matching_projects, key=lambda x: x[1], reverse=True)

    top_projects = [proj[0] for proj in sorted_projects[:10]]
    return top_projects

@app.route('/search', methods=['POST'])
def search_projects():
    input_text = request.get_json().get('projectName')
    matching_projects = find_matching_projects(input_text)
    project_responses = [{'name': project['projectName'], 'description': project['description'],'leaderEmail':project['leaderEmail']} for project in matching_projects]
    print(project_responses)   
    return jsonify({'matchingProjects': project_responses})


#Yaksh TeacherDB
@app.route('/teacher', methods = ['GET', 'POST'])
def teacher():
    teacher_email = request.get_json()
    print(teacher_email['email'])
    teacher_data = list(teachers_collection.find({'email': teacher_email['email']}))
    teacher_id = teacher_data[0]['_id']
    print(teacher_id)
    project_data = list(project_collection.find({'mentor_id':teacher_id}))
    print(project_data)
    return json_util.dumps(project_data)


#For getting project details via id
@app.route('/projects', methods = ['GET', 'POST'])
def projects():
    project = request.get_json()
    print(project['id'])
    op_id = ObjectId(project['id'])
    project_data = list(project_collection.find({"_id": op_id}))
    print(project_data)
    assignment_data = list(assignments_collection.find({"project_id": project['id']}))
    print(assignment_data)
    return json_util.dumps([{"pdata": project_data}, {"adata": assignment_data}])


#For Ayush StudentDB
#65f0f666e967c25c1be68047
@app.route('/student', methods = ['GET', 'POST'])
def student():
    student_email = request.get_json()
    print(student_email['email'])
    project_data = list(project_collection.find({"team_members": {"$elemMatch": {"$eq": student_email['email']}}}))
    print(str(project_data[0]['_id']))
    assignment_data = list(assignments_collection.find({"project_id": str(project_data[0]['_id'])}))
    print(assignment_data)
    return json_util.dumps([{"pdata": project_data}, {"adata": assignment_data}])

@app.route("/updateMarks", methods=["POST"])
def updateMarks():
    assignment_id = request.get_json()
    marks = assignment_id['marks']
    op_id = ObjectId(assignment_id['id'])
    current_epoch_time = int(time.time())
    assignments_collection.update_one({'_id': op_id}, {'$set': {'marks': int(marks), 'status': "Checked", 'marks_time': current_epoch_time}})
    return {"message": "Updated SuccesFully"}

@app.route("/updateAssignment", methods=["POST"])
def updateAssignment():
    assignment_id = request.get_json()
    file = assignment_id['file']
    op_id = ObjectId(assignment_id['id'])
    current_epoch_time = int(time.time())
    assignments_collection.update_one({'_id': op_id}, {'$set': {'file': file, 'status': "Unchecked", 'submitted_at': current_epoch_time}})
    return {"message": "Updated SuccesFully"} 

@app.route("/oldProjects", methods = ["POST"])
def oldProjects():
    mentor_id = request.get_json()
    project_data = list(collectionp.find({'mentorEmail': mentor_id['email']}))
    print(project_data)
    return json_util.dumps(project_data)

@app.route("/uncheckedProjects", methods = ["POST"])
def uncheckedProjects():
    mentor_id = request.get_json()
    project_data = teachers_collection.find_one({'email': mentor_id['email']})
    print(project_data['project_ids'])
    ids = project_data['project_ids']
    unchecked_project_ids = list(assignments_collection.distinct("project_id", {"status": "Unchecked"}))
    print(unchecked_project_ids)
    for i in range(0, len(unchecked_project_ids)):
        unchecked_project_ids[i] = ObjectId(unchecked_project_ids[i])
    intersection_result = list(set(ids).intersection(unchecked_project_ids))
    print(intersection_result)
    project_data = list(project_collection.find({"_id": {"$in": [ObjectId(id) for id in intersection_result]}}))
    print(project_data)
    return json_util.dumps(project_data)

@app.route("/projectDetails", methods = ["POST"])
def projectDetails():
    project_id = request.get_json()
    print(project_id['id'])
    project_data = list(collectionp.find({'projectName': project_id['id']}))
    return json_util.dumps(project_data)
if __name__ == '__main__':
    app.run(debug=True)
