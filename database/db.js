const mongoose = require('mongoose');
module.exports = async () => {
  try {
    const connectionParams = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    };
    await mongoose.connect(process.env.URL_DB, connectionParams).then(() => {
      console.log('Connect to mongodb successfully');
    });
  } catch (error) {
    console.log('Could not connect to MongoDB');
  }
};
