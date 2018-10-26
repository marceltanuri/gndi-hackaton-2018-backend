const express = require('express');
const app = express();
const WeDeploy = require('wedeploy');
const _ = require('underscore');

app.get('/company-summary', (req, res) => {
    getCompanySummary().then(result => {
        res.send(JSON.stringify(result));
    });
});

app.get('/appointments-cost', (req, res) => {
    getAppointmentsCost().then(result => {
        res.send(JSON.stringify(result));
    });
});

app.get('/specialties-by-month', (req, res) => {
    getSpecialtiesByMonth().then(result => {
        res.send(JSON.stringify(result));
    });
});
   
app.listen(3000);

function getCompanySummary() {
    return WeDeploy
        .data('https://data-gndihackaton.wedeploy.io/')
        .get('user')
        .then(usersList => {
            let dependentCount = usersList.filter(user => user['isDependent']).length;
            let ownerCount = usersList.filter(user => !user['isDependent']).length;
            let totalCount = usersList.length;

            return {
                "dependentCount": dependentCount,
                "ownerCount": ownerCount,
                "totalCount": totalCount
            }
        });
}

function getAppointmentsCost() {
    return WeDeploy
        .data('https://data-gndihackaton.wedeploy.io/')
        .get('appointment')
        .then(appointmentsList => {
            let totalCost = appointmentsList
                .map(appointment => appointment['cost'])
                .reduce((prev, cur) => {
                    return prev + cur;
                });

            return {
                "totalCost": totalCost
            }
        });
}

function getSpecialtiesByMonth() {
    return WeDeploy
        .data('https://data-gndihackaton.wedeploy.io/')
        .get('appointment')
        .then(appointmentsList => {
            let dataBySpecialty = _.groupBy(appointmentsList, (appointment) => {
                return appointment['specialty'];
            });

            Object.keys(dataBySpecialty).forEach(specialty => {
                dataBySpecialty[specialty] = _.groupBy(dataBySpecialty[specialty],
                    (appointment) => {
                        return new Date(appointment['date']).getMonth();
                    });
            });

            return dataBySpecialty;
        });
}
