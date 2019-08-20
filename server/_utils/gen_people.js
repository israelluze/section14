var mongoose = require('mongoose');
var faker = require('faker');
var PersonModel = require('../_models/PersonModel');

mongoose.connect('mongodb://localhost:27017/auth_test', {useNewUrlParser: true});

async function add(n) {
    try {
        for (let index = 0; index < n; index++) {
            const p = new PersonModel();
            p.name = faker.name.firstName();
            p.country = faker.address.country();
            p.email = faker.internet.email();
            p.company = faker.company.companyName();
            await p.save();        
        }    
    }
    catch(err) {
        console.log(err);
    }
}

add(100)
    .then(() => {
        console.log('OK');
        mongoose.disconnect();
    })