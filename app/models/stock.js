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
    }
});

module.exports = mongoose.model('stock', StockSchema);