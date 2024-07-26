const next = require('next');
const { sequelize } = require('./models');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

require('dotenv').config();

app.prepare().then(() => {
    sequelize.sync({ force: true })
        .then(() => {
            app.listen(3000, (err) => {
                if (err) throw err;
                console.log('> Ready on http://localhost:3000');
            });
        })
        .catch(error => console.error('Unable to create tables:', error));
});
