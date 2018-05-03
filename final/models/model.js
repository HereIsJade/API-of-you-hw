var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// See http://mongoosejs.com/docs/schematypes.html

var wishSchema = new Schema({
	wishText: String,
	rate: Number,
	voice: String,
	dateAdded : { type: Date, default: Date.now },
})

wishSchema.index({wishText: 1, dateAdded: 1}, {unique: true});
// export 'Wish' model so we can interact with it in other files
module.exports = mongoose.model('Wish',wishSchema);
