const router = require('express').Router(); 
const generateToken = require('../../lib/generateToken');
const { checkIfUsernameExist, checkIfUsernameNotExist } = require('./auth-middleware');
const bcrypt = require('bcryptjs')
const Auth = require('../users/user-model');

router.post('/register', checkIfUsernameExist , async (req, res, next) => {
    try {
      let user = req.body;
  
      const rounds = process.env.BCRYPT_ROUNDS || 8;
      const hash = bcrypt.hashSync(user.password, rounds);
  
      user.password = hash;
  
      await Auth.add(user)
        .then((saved) => {
          res.status(201).json(saved);
        })
        .catch(next)
    }
  
    catch (err) {
      next(err)
    }
  });

  router.post('/login', checkIfUsernameNotExist , async (req, res, next) => {
    try{
      let { username, password } = req.body;
      await Auth.getByFilter({username})
      .then(([user]) => {
        if(user && bcrypt.compareSync(password, user.password)){
          const token = generateToken(user);
          res.status(200).json({
            message: `welcome back ${user.username}`,
            token
          })
        }
        else{
          res.status(401).json({ message: 'Invalid Credentials'})
        }
      })
    }
    catch(err){
      next(err)
    }
});


module.exports = router;