const mongoose = require('mongoose');

const centerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  hours: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  }
});

const Center = mongoose.model('Center', centerSchema);

/*
module.exports = Center;

const centerSchema2 = new mongoose.Schema({
    name: {
      type: String,
      required: true
    },
    address: {
      type: String,
      required: true
    },
    hours: {
      type: String,
      required: true
    }
  });
const VaccinationCenter = mongoose.model('VaccinationCenter', centerSchema2);

module.exports = VaccinationCenter;

*/