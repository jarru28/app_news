const express = require('express');
const router = express.Router();
const newsController = require('../controllers/newsController');

router.get('/', newsController.getFilterNews);
router.post('/', newsController.createNews);
router.patch('/:id', newsController.archiveNews);
router.delete('/:id', newsController.removeNews);

module.exports = router;