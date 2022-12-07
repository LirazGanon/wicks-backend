const dbService = require('../../services/db.service')
const logger = require('../../services/logger.service')
const utilService = require('../../services/util.service')
const ObjectId = require('mongodb').ObjectId

// TODO: FILTER BY USER ID
async function query(filterBy) {
    const criteria = _buildCriteria(filterBy)
    console.log()
    try {
        // const criteria = {
        //     // vendor: { $regex: filterBy.txt, $options: 'i' }
        // }
        const collection = await dbService.getCollection('wap')
        var waps = await collection.find(criteria).toArray()
        return waps
    } catch (err) {
        logger.error('cannot find waps', err)
        throw err
    }
}

async function getById(wapId) {
    try {
        const collection = await dbService.getCollection('wap')
        const wap = collection.findOne({ _id: ObjectId(wapId) })
        return wap
    } catch (err) {
        logger.error(`while finding wap ${wapId}`, err)
        throw err
    }
}
// async function getByUserId(userId) {
//     try {
//         const collection = await dbService.getCollection('wap')
//         const wap = collection.find({ "createdBy._id":ObjectId(userId) })
//         console.log(wap)
//         return wap
//     } catch (err) {
//         logger.error(`while finding wap ${wapId}`, err)
//         throw err
//     }
// }
function _buildCriteria(
    filterBy = {
      isPublic: undefined,
      userId: '',
      isTemplate: undefined,
      fullname: '',
    }
  ) {
    const { isPublic, userId, isTemplate, fullname } = filterBy
  
    const criteria = {}
  
    if (isPublic !== undefined) {
      criteria.isPublic = true
    }
  
    if (isTemplate !== undefined) {
      criteria.isTemplate = true
    }
  
    if (userId) {
      // criteria.createdBy = { _id: userId }
      console.log('userId')
      criteria['createdBy._id'] = userId
    }
  
    if (fullname) {
      criteria['createdBy.fullname'] = fullname
    }
  
    return criteria
  }
  

async function getTemplateToEdit(templateId) {
    try {
        const collection = await dbService.getCollection('template')
        const template = collection.findOne({ _id: ObjectId(templateId) })
        // making clone of the temlate and saving it in the wap collection
        const wap = add(JSON.parse(JSON.stringify(template)))
        return wap
    } catch (err) {
        logger.error(`while finding wap ${wapId}`, err)
        throw err
    }
}

async function remove(wapId) {
    try {
        const collection = await dbService.getCollection('wap')
        await collection.deleteOne({ _id: ObjectId(wapId) })
        return wapId
    } catch (err) {
        logger.error(`cannot remove wap ${wapId}`, err)
        throw err
    }
}

async function add(wap) {
    try {
        const collection = await dbService.getCollection('wap')
        await collection.insertOne(wap)
        return wap
    } catch (err) {
        logger.error('cannot insert wap', err)
        throw err
    }
}

async function update(wap) {
    try {
        const wapToSave = {
            cmps: wap.cmps,
        }
        const collection = await dbService.getCollection('wap')
        await collection.updateOne({ _id: ObjectId(wap._id) }, { $set: wapToSave })
        return wap
    } catch (err) {
        logger.error(`cannot update wap ${wapId}`, err)
        throw err
    }
}

async function addWapMsg(wapId, msg) {
    try {
        msg.id = utilService.makeId()
        const collection = await dbService.getCollection('wap')
        await collection.updateOne({ _id: ObjectId(wapId) }, { $push: { msgs: msg } })
        return msg
    } catch (err) {
        logger.error(`cannot add wap msg ${wapId}`, err)
        throw err
    }
}

async function removeWapMsg(wapId, msgId) {
    try {
        const collection = await dbService.getCollection('wap')
        await collection.updateOne({ _id: ObjectId(wapId) }, { $pull: { msgs: {id: msgId} } })
        return msgId
    } catch (err) {
        logger.error(`cannot add wap msg ${wapId}`, err)
        throw err
    }
}

module.exports = {
    remove,
    query,
    getById,
    add,
    update,
    addWapMsg,
    removeWapMsg,
    getTemplateToEdit
}
