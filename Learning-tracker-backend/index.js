require('dotenv').config()
const app = require('./app');
const { info } = require('./utils/logger');

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    info(`Server running on port ${PORT}`);
})