require('dotenv').config();
const { createApp } = require('./app');

const app = createApp();
const port = process.env.PORT || 3333;

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
