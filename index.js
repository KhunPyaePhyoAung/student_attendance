require('dotenv').config();
const app = require('./app');

const PORT = process.env.SERVER_PORT || 3000;

app.listen(PORT, () => {
    console.log('Server running at PORT : ' + PORT);
});