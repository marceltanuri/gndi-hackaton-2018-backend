const WeDeploy = require('wedeploy');
const DateGenerator = require('random-date-generator');
const RandomName = require('node-random-name');
const Uuid = require('uuid/v4');

function createAppointmentData(userId) {
    let cost = generateCost()
    let date = generateDate()
    let region = ""
    let speciality = generateSpeciality()

    return createAppointment(cost, date, region, speciality, userId)
}

function createAppointment(cost, date, region, specialty, userId) {
    let id = Uuid()

    return WeDeploy
        .data('https://data-gndihackaton.wedeploy.io/')
        .create('appointment', {
            "id": id,
            "cost": cost,
            "date": date,
            "region": region,
            "specialty": specialty,
            "userId": userId,
        })
}

function createUserData(id, isDependent) {
    let age = generateAge()
    let gender = generateGender()
    let name = RandomName({gender: gender})
    let maritalStatus = generateMaritalStatus()

    return createUser(id, name, age, gender, maritalStatus, isDependent)
}

function createUser(id, name, age, gender, maritalStatus, isDependent) {
    return WeDeploy
        .data('https://data-gndihackaton.wedeploy.io/')
        .create('user', {
            "id": id,
            "name": name,
            "age": age,
            "gender": gender,
            "maritalStatus": maritalStatus,
            "isDependent": isDependent
        })
}

function createData() {
    let allPromises = []

    for (i = 1; i <= 100; i++) {
        let id = Uuid()

        allPromises.push(createUserData(id, false));

        let dependentNum = getRandomInt(0, 2)
        
        for(j = 1; j < dependentNum; j++) {
            let dependentId = Uuid()

            allPromises.push(createUserData(dependentId, true))

            let appointmentNum = getRandomInt(0, 15)
            
            for(j = 1; j < appointmentNum; j++) {
                allPromises.push(createAppointmentData(dependentId))
            }
        }

        let appointmentNum = getRandomInt(0, 15)
        
        for(j = 1; j < appointmentNum; j++) {
            allPromises.push(createAppointmentData(id))
        }
    }

    return Promise.all(allPromises)
}

//UTIL

function generateDate() {
    let startDate = new Date(2018, 0, 1);
    let endDate = new Date();
    return DateGenerator.getRandomDateInRange(startDate, endDate);
}

function generateAge(){
    let min = 16;
    let max = 80;
    return getRandomInt(min, max);
}

function getRandomInt(min, max){
    let random = Math.floor(Math.random() * (max - min + 1) + min);
    return random;
}

function generateGender(){
    let gender = ["Male", "Female", "Declined to self identified"]
    return gender[getRandomInt(0,2)];
}

function generateMaritalStatus(){
    let maritalStatus = ["Single", "Married", "Widowed", "Divorced"]
    return maritalStatus[getRandomInt(0,3)];
}

function generateCost(){    
    return getRandomInt(50,400);
}

function generateSpeciality(gender){
    let specialty = ["Neurologia", "Ortopedia", "Psiquiatria", "Pediatria", "Clínica Médica", "Ginecologia", "Urologia", "Angiologia", "Cardiologia", "Proctologia"]
    //TODO avoiding wrong speciality when gender is male
    return specialty[getRandomInt(0,9)];
}

createData().then(() => {
    console.log("abc")
})
