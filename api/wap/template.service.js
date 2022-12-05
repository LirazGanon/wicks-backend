const dbService = require('../../services/db.service')
const logger = require('../../services/logger.service')
const utilService = require('../../services/util.service')
const ObjectId = require('mongodb').ObjectId
// TODO: FILTER BY USER ID
async function query(filterBy={txt:''}) {
    try {
        const criteria = {
        }
        const collection = await dbService.getCollection('template')
        var templates = await collection.find(criteria).toArray()
        return templates
    } catch (err) {
        logger.error('cannot find templates', err)
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
    removeWapMsg
}
