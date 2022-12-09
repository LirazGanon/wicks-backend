const userService = require('./user.service')
const socketService = require('../../services/socket.service')
const logger = require('../../services/logger.service')

async function getUser(req, res) {
    try {
        const user = await userService.getById(req.params.id)
        res.send(user)
    } catch (err) {
        logger.error('Failed to get user', err)
        res.status(500).send({ err: 'Failed to get user' })
    }
}
async function getGoogleUser(req, res) {
    const { OAuth2Client } = require("google-auth-library")
    const client = new OAuth2Client()
    console.log(req.body.access_token)

    // Call this function to validate OAuth2 authorization code sent from client-side
    async function verifyToken(token) {
      client.setCredentials({ access_token: token })
      const userinfo = await client.request({
        url: "https://www.googleapis.com/oauth2/v3/userinfo",
      });
      return userinfo.data
    }
    
    verifyToken(req.body.access_token)
    .then((userInfo) => {
        res.send(userInfo) 
    })
    .catch((error) => {
        console.log(error)
    })
}

async function getUsers(req, res) {
    try {
        const filterBy = {
            txt: req.query?.txt || '',
            minBalance: +req.query?.minBalance || 0
        }
        const users = await userService.query(filterBy)
        res.send(users)
    } catch (err) {
        logger.error('Failed to get users', err)
        res.status(500).send({ err: 'Failed to get users' })
    }
}

async function deleteUser(req, res) {
    try {
        await userService.remove(req.params.id)
        res.send({ msg: 'Deleted successfully' })
    } catch (err) {
        logger.error('Failed to delete user', err)
        res.status(500).send({ err: 'Failed to delete user' })
    }
}

async function updateUser(req, res) {
    try {
        const user = req.body
        const savedUser = await userService.update(user)
        res.send(savedUser)
    } catch (err) {
        logger.error('Failed to update user', err)
        res.status(500).send({ err: 'Failed to update user' })
    }
}

module.exports = {
    getUser,
    getUsers,
    deleteUser,
    updateUser,
    getGoogleUser
}