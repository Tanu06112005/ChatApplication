import express from 'express'
import { userRegister, userLogin, userLogOut } from '../routeControllers/userRouteController.js'

const router = express.Router()

router.post('/register',userRegister) // the second argument is the controller 

router.post('/login',userLogin)

router.post('/logout',userLogOut)


// router.get('/register', (req, res) => {
//     console.log("GET register route is working");

//     res.send("Register GET route working");
// });
export default router