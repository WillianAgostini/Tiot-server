const should = require("should");
const mongoose = require('mongoose');
const User = require("../models/user.js");

describe('User', () => {

    before((done) => {
        const db = mongoose.connect('mongodb://localhost/test');
        done();
    });

    after((done) => {
        mongoose.connection.close();
        done();
    });

    beforeEach( (done) => {
        var user = new User({
            username: '12345',
            password: 'testy'
        });

        account.save((error) => {
            if (error) console.log('error' + error.message);
            else console.log('no error');
            done();
        });
    });

    it('find a user by username', (done) => {
        User.findOne({ username: '12345' }, (err, user) => {
            user.username.should.eql('12345');
            console.log("   username: ", user.username);
            done();
        });
    });

    afterEach((done) => {
        User.remove({}, () => {
            done();
        });
     });

});
