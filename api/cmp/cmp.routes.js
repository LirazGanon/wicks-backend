const express = require('express')
const { requireAuth, requireAdmin } = require('../../middlewares/requireAuth.middleware')
const { log } = require('../../middlewares/logger.middleware')
const { getCmps, getCmpById, addCmp, updateCmp, removeCmp, addCmpMsg, removeCmpMsg } = require('./cmp.controller')
const router = express.Router()

// middleware that is specific to this router
// router.use(requireAuth)

router.get('/', log, getCmps)
router.get('/:id', getCmpById)
router.post('/', requireAuth, addCmp)
router.put('/:id', requireAuth, updateCmp)
// router.delete('/:id', requireAuth, removeCmp)
router.delete('/:id', requireAuth, requireAdmin, removeCmp)

router.post('/:id/msg', requireAuth, addCmpMsg)
router.delete('/:id/msg/:msgId', requireAuth, removeCmpMsg)

module.exports = router