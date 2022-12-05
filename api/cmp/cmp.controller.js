const cmpService = require('./cmp.service.js')

const logger = require('../../services/logger.service')

async function getCmps(req, res) {
  try {
    logger.debug('Getting Cmps')
    const filterBy = {
      txt: req.query.txt || ''
    }
    const cmps = await cmpService.query(filterBy)
    res.json(cmps)
  } catch (err) {
    logger.error('Failed to get cmps', err)
    res.status(500).send({ err: 'Failed to get cmps' })
  }
}

async function getCmpById(req, res) {
  try {
    const cmpId = req.params.id
    const cmp = await cmpService.getById(cmpId)
    res.json(cmp)
    console.log(cmp)
  } catch (err) {
    logger.error('Failed to get cmp', err)
    res.status(500).send({ err: 'Failed to get cmp' })
  }
}

async function addCmp(req, res) {
  const {loggedinUser} = req

  try {
    const cmp = req.body
    cmp.owner = loggedinUser
    const addedCmp = await cmpService.add(cmp)
    res.json(addedCmp)
  } catch (err) {
    logger.error('Failed to add cmp', err)
    res.status(500).send({ err: 'Failed to add cmp' })
  }
}


async function updateCmp(req, res) {
  try {
    const cmp = req.body
    const updatedCmp = await cmpService.update(cmp)
    res.json(updatedCmp)
  } catch (err) {
    logger.error('Failed to update cmp', err)
    res.status(500).send({ err: 'Failed to update cmp' })

  }
}

async function removeCmp(req, res) {
  try {
    const cmpId = req.params.id
    const removedId = await cmpService.remove(cmpId)
    res.send(removedId)
  } catch (err) {
    logger.error('Failed to remove cmp', err)
    res.status(500).send({ err: 'Failed to remove cmp' })
  }
}

async function addCmpMsg(req, res) {
  const {loggedinUser} = req
  try {
    const cmpId = req.params.id
    const msg = {
      txt: req.body.txt,
      by: loggedinUser
    }
    const savedMsg = await cmpService.addCmpMsg(cmpId, msg)
    res.json(savedMsg)
  } catch (err) {
    logger.error('Failed to update cmp', err)
    res.status(500).send({ err: 'Failed to update cmp' })

  }
}

async function removeCmpMsg(req, res) {
  const {loggedinUser} = req
  try {
    const cmpId = req.params.id
    const {msgId} = req.params

    const removedId = await cmpService.removeCmpMsg(cmpId, msgId)
    res.send(removedId)
  } catch (err) {
    logger.error('Failed to remove cmp msg', err)
    res.status(500).send({ err: 'Failed to remove cmp msg' })

  }
}

module.exports = {
  getCmps,
  getCmpById,
  addCmp,
  updateCmp,
  removeCmp,
  addCmpMsg,
  removeCmpMsg
}
