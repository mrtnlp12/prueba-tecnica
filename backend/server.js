const mongoose = require('mongoose');
const app = require('./app');


const PORT = 3001;
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port: ${PORT}`);
    });
  })
  .catch((err) => console.error('Error connecting db:', err));


