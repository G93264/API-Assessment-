const express = require('express');
const app = express();
const path = require('path');
const axios = require('axios');
const controller = require('./controllers/controller');



app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.get('/api/ping', (req, res) => {
    res.status(200).json({
        "success": true,
      });
})



app.get('/api/posts/:tags/:sortBy?/:direction?', controller.getPosts)

app.listen(3000, () => {
    console.log('APP is listening on PORT 3000!');
})

module.exports = app;





// api 
// https://api.hatchways.io/assessment/blog/posts