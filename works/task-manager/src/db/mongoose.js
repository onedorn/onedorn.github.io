const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_DB_URL_PROD, {
            useNewUrlParser: true,
            useFindAndModify: false,
            useCreateIndex: true,
            useUnifiedTopology: true
        });

        console.log('Mongo DB connected');
    } catch (e) {
        console.log(e.message);
        process.exit(1)
    }
};

module.exports = connectDB;
