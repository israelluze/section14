var mongoose = require('mongoose');
var faker = require('faker');
var ProductModel = require('../_models/ProductModel');

mongoose.connect('mongodb://localhost:27017/auth_test', {useNewUrlParser: true});

async function add(n) {
    try {
        for (let index = 0; index < n; index++) {
            const p = new ProductModel();
            p.name = faker.commerce.productName();
            p.department = faker.commerce.department();
            p.price = faker.commerce.price();
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