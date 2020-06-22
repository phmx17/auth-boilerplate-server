module.exports = async () => {
    mongoose = require("mongoose");
    await mongoose.connect('mongodb+srv://SY:boner@cluster0-nxshw.mongodb.net/test?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
    });
};
