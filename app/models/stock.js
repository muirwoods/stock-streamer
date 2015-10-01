let mongoose = require('mongoose');

let StockSchema = mongoose.Schema({
    symbol: {
        type: String
    },
    created: {
        type: Date
    },
    email: {
        type: String
    },
    purchasePrice: {
        type: Number
    },
    qty: {
        type: Number
    }
});

module.exports = mongoose.model('stock', StockSchema);