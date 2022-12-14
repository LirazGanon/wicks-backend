const wapService = require('./wap.service.js')
const templateService = require('./template.service.js')
const { emitTo, broadcast } = require('../../services/socket.service')

const logger = require('../../services/logger.service')

async function getWaps(req, res) {
  try {
    logger.debug('Getting Waps')
    const filterBy = {
      userId: req.query.userId || '',
      txt: req.query.txt || ''
    }
    const waps = await wapService.query(filterBy)
    res.json(waps)
  } catch (err) {
    logger.error('Failed to get waps', err)
    res.status(500).send({ err: 'Failed to get waps' })
  }
}
async function getTemplates(req, res) {
  try {
    // logger.debug('Getting templates')
    // const filterBy = {
    //   txt: req.query.txt || ''
    // }
    const templates = await templateService.query()
    res.json(templates)
  } catch (err) {
    logger.error('Failed to get templates', err)
    res.status(500).send({ err: 'Failed to get templates' })
  }
}

async function getTemplateById(req, res) {
  try {
    const templateId = req.params.id
    const template = await templateService.getById(templateId)
    res.json(template)
  } catch (err) {
    logger.error('Failed to get wap', err)
    res.status(500).send({ err: 'Failed to get wap' })
  }
}

async function getTemplateToEdit(req, res) {
  try {
    const id = req.params.id
    let wap = await wapService.getById(id)

    if (!wap) {
      const template = await templateService.getById(id)
      delete template._id
      wap = await wapService.add(JSON.parse(JSON.stringify(template)))

      res.json(wap)
    }
    else res.json(wap)
  } catch (err) {
    logger.error('Failed to get wap', err)
    res.status(500).send({ err: 'Failed to get template to edit' })
  }
}

async function getWapById(req, res) {
  try {
    const wapId = req.params.id
    const wap = await wapService.getById(wapId)
    res.json(wap)
  } catch (err) {
    logger.error('Failed to get wap', err)
    res.status(500).send({ err: 'Failed to get wap' })
  }
}
async function getWapByName(req, res) {
  try {
    const name = req.params.name
    const wap = await wapService.getByName(name)
    res.json(wap)
  } catch (err) {
    logger.error('Failed to get wap', err)
    res.status(500).send({ err: 'Failed to get wap' })
  }
}

async function addWap(req, res) {
  const { loggedinUser } = req
  try {
    const wap = req.body
    wap.owner = loggedinUser
    const addedWap = await wapService.add(wap)
    res.json(addedWap)
  } catch (err) {
    logger.error('Failed to add wap', err)
    res.status(500).send({ err: 'Failed to add wap' })
  }
}


async function updateWap(req, res) {
  try {
    const wap = req.body

    const updatedWap = await wapService.update(wap)
    // console.log('i am at after serivce updateWap')

    // broadcast({data:updatedWap,type:'updated-wap',id:soketId })
    res.json(updatedWap)
  } catch (err) {
    logger.error('Failed to update wap', err)
    res.status(500).send({ err: 'Failed to update wap' })

  }
}

async function removeWap(req, res) {
  try {
    const wapId = req.params.id
    const removedId = await wapService.remove(wapId)
    res.send(removedId)
  } catch (err) {
    logger.error('Failed to remove wap', err)
    res.status(500).send({ err: 'Failed to remove wap' })
  }
}

async function updateName(req, res) {
  // console.log(req.body)
  try {
    const {pathName} = req.body

    await wapService.updatePathName(pathName)
    res.send(pathName)
  } catch(err) {
    console.log(err)
    // throw new Error('name is taken')
    res.status(500).send({ err: 'name exists' })
  }
}

async function addWapMsg(req, res) {
  const { loggedinUser } = req
  try {
    const wapId = req.params.id
    const msg = {
      txt: req.body.txt,
      by: loggedinUser
    }
    const savedMsg = await wapService.addWapMsg(wapId, msg)
    res.json(savedMsg)
  } catch (err) {
    logger.error('Failed to update wap', err)
    res.status(500).send({ err: 'Failed to update wap' })

  }
}

async function removeWapMsg(req, res) {
  const { loggedinUser } = req
  try {
    const wapId = req.params.id
    const { msgId } = req.params

    const removedId = await wapService.removeWapMsg(wapId, msgId)
    res.send(removedId)
  } catch (err) {
    logger.error('Failed to remove wap msg', err)
    res.status(500).send({ err: 'Failed to remove wap msg' })

  }
}

module.exports = {
  getWaps,
  getTemplates,
  getWapById,
  addWap,
  updateWap,
  removeWap,
  addWapMsg,
  removeWapMsg,
  getTemplateById,
  getTemplateToEdit,
  getWapByName,
  updateName
}
