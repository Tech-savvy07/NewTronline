const mongoose = require('mongoose');

const siteData = new mongoose.Schema({
  private_key: { type: String},
  contract_address :{ type: String},
  promotion_msg: { type: String},
  sponsor_count_promotion :{ type: Number},
  promotion_status :{ type: Number},
  promotion_marque_status :{ type: Number},
}, { timestamps: true, collection: 'siteData' });

module.exports = mongoose.model('siteData', siteData)