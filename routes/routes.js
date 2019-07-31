const router = require('express').Router();
const Todo = require('../models/todo');
const Joi = require('joi');

const idJoiValidation = Joi.object().keys({
  id: Joi.string().regex(/^[\w]{24}$/).required()
});

//******** Express routes here ******// 

router.get("/", function(req, res) {
  Todo.find({}).then(function(results){
    let todos= results.filter(function(todo) {
      return !todo.done;
    }); 

    let doneTodos = results.filter(function(todo) {
      return todo.done;
    });

    res.render('index', { todos: todos, doneTodos: doneTodos });
  });
});

router.post('/todos', function(req,res) {
  let newTodo = new Todo({ description: req.body.description });

  newTodo.save().then(function(result){
      console.log(result);
      res.redirect('/');
    }).catch(function(err){
      console.log(err);
      res.redirect('/');      
    });
});

router.post('/todos/:id/todoCompleted', function(req, res){
  
  let todoId = req.params.id;
  const validId = Joi.validate(req.params, idJoiValidation);
  if (!validId){
    console.log('provide correct id');    
  } else {

  Todo.findById(todoId).exec().then(function(result){
    result.done = !result.done;
    return result.save();
  }).then(function(result){
    res.redirect('/');
  });

  } 
});

router.delete('/todos/:id', function(req, res, next){

  let id = req.params.id;

  Todo.findByIdAndRemove({_id: id }).then(function(todo){
    res.send({
      type: 'DELETE',
      todo: todo
    });
  })
})

module.exports = router;