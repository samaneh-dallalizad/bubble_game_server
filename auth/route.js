const { Router } = require('express')
const User=require('./model')
const bcrypt=require('bcrypt')
const auth=require('./middleware')
const {toJWT} = require('./jwt')
const router = new Router()

function addPlayers(dispatch, gameDummyDatabase){
  return router.get("/",(req,res)=>{
    User.findAll()
    .then(response => {
      res.json(response)
      gameDummyDatabase.player.push(response.body)
      dispatch(gameDummyDatabase)
    })
    .catch(error => next(error))
  })
}

///////////////////////////////////////////
//signin add new user 
 router.post('/users', (req, res, next) => { 

  const newUser = {
    name: req.body.name,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password,10 )
  }

  User.findOne({
    where: {
      email: newUser.email
    }
  }).then(entity => {
       if(entity){
          res.json({err:'User with that email does not exist'})

       }else{

          User
          .create(newUser)
          .then(user => {
            res.status(201).json(user)
          })
          .catch(error => next(error))
           }

  })






})
/////////////////////////////////////////////
//login
function addPlayer(dispatch, gameDummyDatabase){
  return router.post('/logins',(req,res,next)=>{
  const email=req.body.email
  const password=req.body.password

  if(!email|| !password){
      res.send({
        status:0,
        Message: 'Please supply a valid email and password'
      })
  }
  else{
      User.findOne({
        where: {
          email: req.body.email
        }
      }).then(entity => {
        if (!entity) {
          res.json({
            status:0,
            message: 'User with that email does not exist'
          })
          return;
        }       
        if(bcrypt.compareSync(req.body.password, entity.password)) {       
          res.json({
            status:1,
            message:"successful",  
            user_id:entity.id
          })
          gameDummyDatabase.player.push(entity.dataValues)
          dispatch(gameDummyDatabase)
        }
        else {
          res.json({
            status:0,
            message: 'Password was incorrect'
          })
       }  
      })
    }
  })
}

module.exports = {router, addPlayer, addPlayers}