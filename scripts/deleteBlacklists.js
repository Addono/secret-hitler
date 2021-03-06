require('dotenv').config();
const Account = require('../models/account'); // temp
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect(`${process.env.MONGODB_URI || 'localhost:27017'}/secret-hitler-app`);

let count = 0;

Account.findOne({ 'blacklist.1': { $exists: true } })
	.cursor()
	.eachAsync(account => {
		account.gameSettings.blacklist = [];
		account.save();
		count++;
		if (Number.isInteger(count / 100)) {
			console.log('processed account ' + count);
		}
	})
	.then(() => {
		console.log('done');
	})
	.catch(err => {
		console.log(err, 'caught err');
	});
