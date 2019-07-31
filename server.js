const express = require ('express');
const mustacheExpress = require ('mustache-express');
const bodyParser = require ('body-parser');
const mongoose = require ('mongoose');
const routes = require('./routes/routes');

mongoose.Promise = global.Promise;

//*** connecting to DB */
mongoose.connect('mongodb://localhost:27017/mongoose_express_todos', {
  useNewUrlParser: true
}).then(function(){
  console.log('Database connected');
}).catch((err) => {
  console.log("Not Connected to Database ERROR! ", err);
});

const app = express();
app.use(bodyParser.urlencoded({extended: true}));

const mustacheExpressInstance = mustacheExpress();
mustacheExpressInstance.cache = null;
app.engine('mustache', mustacheExpressInstance);
app.set('view engine', 'mustache');
app.set('views', __dirname + '/views');

//******** Express routes here ******// 
app.use('/', routes);

//catch all other (wrong) routes
app.get("*", function(req,res) {
  res.send('Invalid Route');
});


// server listening on port 3000
app.listen(3000, function() {
  console.log("server started on port 3000 successfully");
});