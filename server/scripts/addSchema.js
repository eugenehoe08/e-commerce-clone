const User = require('../models/user');

exports.addSchema = () => {
    User.updateMany(
        {},
        {
            $set: {
                isCompany: false,
            },
        }
    )
        .then(() => {
            console.log('Schema updated');
        })
        .catch((err) => {
            console.log(err);
        });
};