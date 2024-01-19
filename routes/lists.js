const express = require('express');
const router = express.Router();

const {
    getAllLists,
    getList,
    createList,
    updateList,
    deleteList
} = require('../controllers/lists');

router.route('/').post(createList).get(getAllLists);
router.route('/:id').get(getList).delete(deleteList).patch(updateList);

module.exports = router;