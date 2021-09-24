const mongoose = require('mongoose');
module.exports = async () => {
  try {
    const connectionParams = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    };
    await mongoose
      .connect('mongodb://localhost/url_shorter', connectionParams)
      .then(() => {
        console.log('Connect to mongodb successfully');
      });
  } catch (error) {
    console.log('Could not connect to MongoDB');
  }
};
