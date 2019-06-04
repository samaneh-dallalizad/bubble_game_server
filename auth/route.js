const { Router } = require('express')
const User=require('./model')
const bcrypt=require('bcrypt')
const auth=require('./middleware')
const {toJWT} = require('./jwt')
const router = new Router()

router.get("/",(req,res)=>{
  User.findAll().then(response => res.json(response))
  .catch(error => next(error))
})


///////////////////////////////////////////
//signin add new user 
 router.post('/users', (req, res, next) => { 

  const newUser = {
    name: req.body.name,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password,10 )
  }
  User
  .create(newUser)
  .then(user => {
    res.status(201).json(user)
  })
  .catch(error => next(error))

})
/////////////////////////////////////////////
//login

router.post('/logins',(req,res,next)=>{

  const email=req.body.email
  const password=req.body.password

  if(!email|| !password){
      req.status(400).send({Message: 'Please supply a valid email and password'})
  }else{
      User.findOne({
        where: {
          email: req.body.email
        }
      }).then(entity => {
        if (!entity) {
          res.status(400).json({
            message: 'User with that email does not exist'
          })
          return;
        }       
        if(bcrypt.compareSync(req.body.password, entity.password)) {       
          res.json({
            jwt: toJWT({ userId: entity.id })
          })
        }
        else {
          res.status(400).send({
            message: 'Password was incorrect'
          })
       }
  

      })
  }

})

// router.get('/logout', auth, (req, res) => {
//   res.json({
//     message: `Thanks for visiting the  ${req.user.email}.`,
//   })
// })


module.exports = router