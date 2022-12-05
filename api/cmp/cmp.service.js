const dbService = require('../../services/db.service')
const logger = require('../../services/logger.service')
const utilService = require('../../services/util.service')
const ObjectId = require('mongodb').ObjectId

async function query(filterBy={txt:''}) {
    try {
        const criteria = {
            // vendor: { $regex: filterBy.txt, $options: 'i' }
        }
        const collection = await dbService.getCollection('cmp')
        var cmps = await collection.find(criteria).toArray()
        return cmps
    } catch (err) {
        logger.error('cannot find cmps', err)
        throw err
    }
}

async function getById(cmpId) {
    try {
        const collection = await dbService.getCollection('cmp')
        const cmp = collection.findOne({ _id: ObjectId(cmpId) })
        return cmp
    } catch (err) {
        logger.error(`while finding cmp ${cmpId}`, err)
        throw err
    }
}

async function remove(cmpId) {
    try {
        const collection = await dbService.getCollection('cmp')
        await collection.deleteOne({ _id: ObjectId(cmpId) })
        return cmpId
    } catch (err) {
        logger.error(`cannot remove cmp ${cmpId}`, err)
        throw err
    }
}

async function add(cmp) {
    try {
        const collection = await dbService.getCollection('cmp')
        console.log(cmp)
        await collection.insertOne(cmp)
        return cmp
    } catch (err) {
        logger.error('cannot insert cmp', err)
        throw err
    }
}

async function update(cmp) {
    try {
        const cmpToSave = {
            cmp,
        }
        const collection = await dbService.getCollection('cmp')
        await collection.updateOne({ _id: ObjectId(cmp._id) }, { $set: cmpToSave })
        console.log(cmp)
        return cmp
    } catch (err) {
        logger.error(`cannot update cmp ${cmpId}`, err)
        throw err
    }
}

async function addCmpMsg(cmpId, msg) {
    try {
        msg.id = utilService.makeId()
        const collection = await dbService.getCollection('cmp')
        await collection.updateOne({ _id: ObjectId(cmpId) }, { $push: { msgs: msg } })
        return msg
    } catch (err) {
        logger.error(`cannot add cmp msg ${cmpId}`, err)
        throw err
    }
}

async function removeCmpMsg(cmpId, msgId) {
    try {
        const collection = await dbService.getCollection('cmp')
        await collection.updateOne({ _id: ObjectId(cmpId) }, { $pull: { msgs: {id: msgId} } })
        return msgId
    } catch (err) {
        logger.error(`cannot add cmp msg ${cmpId}`, err)
        throw err
    }
}

module.exports = {
    remove,
    query,
    getById,
    add,
    update,
    addCmpMsg,
    removeCmpMsg
}
