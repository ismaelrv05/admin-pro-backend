const mongoose = require('mongoose');

const dbConnection = async () => {

    try {

        await mongoose.connect(process.env.DB_CNN, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            //useCreateIndex: true not supported in new versions of Mongoose
        });

        console.log('Database connection is established successfully');

    } catch (error) {
        console.error(error);
        throw new Error('Error connecting to the database');

    }

}

module.exports = {
    dbConnection,
}
