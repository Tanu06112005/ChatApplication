import express from 'express'
import {sendMessage,recieveMessage} from '../routeControllers/messageRouteController.js'
import isLogin from '../middleware/isLogin.js'

const router = express.Router()

// if user is logged in tbhi vo messages kr paye
// for this we need to create a middleware 

// abi msg send kiya : post
router.post('/send/:id',isLogin, sendMessage)

// noe msg recieve krna h: get

router.get('/:id',isLogin, recieveMessage)


export default router
