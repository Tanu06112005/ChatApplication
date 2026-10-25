// in this we are going to make search bar and fond all the chatters
// we will implwmwnt the feature ki new chat krte hi current user comes on top

import express from 'express'
import isLogin from '../middleware/isLogin.js'
import {getUserBySearch, getCurrentChatters} from '../routeControllers/searchUserRouterController.js'

const router = express.Router()

router.get('/search',isLogin,getUserBySearch)

router.get('/currentchatters',isLogin, getCurrentChatters)
export default router