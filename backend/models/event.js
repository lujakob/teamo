var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var eventSchema = mongoose.Schema({

    id      : String,
    date    : Date,
    users   : [{ type: Schema.Types.ObjectId, ref: 'User' }]

});

// create the model for users and expose it to our app
module.exports = mongoose.model('Event', eventSchema);