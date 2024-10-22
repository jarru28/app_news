const newsService = require('../services/newsService');

const getFilterNews = async (req, res, next) => {
  try {
    let { isArchived } = req.query;
    if (isArchived === undefined) {
      return res.status(400).send({
        status: 'error',
        message: 'isArchived missing in query params'
      });
    } else if (isArchived !== 'true' && isArchived !== 'false') {
      return res.status(400).send({
        status: 'error',
        message: `isArchived must be either "true" or "false"`
      });
    }

    const news = await newsService.getFilterNews(isArchived);
    res.status(200).send(news);
  } catch (error) {
    next(error);
  }
};

const createNews = async (req, res, next) => {
  try {
    const { title, description, content, author,date,archiveDate } = req.body;
    if (!title || !description || !content || !author) {
      return res.status(400).send({
        status: 'error',
        message: 'Missing required fields: title, description, content, and author are required'
      });
    }
    if (!date || isNaN(Date.parse(date))) {
      return res.status(400).send({
        status: 'error',
        message: 'Invalid date: date must be a valid date string'
      });
    }
    if (archiveDate && isNaN(Date.parse(archiveDate))) {
      return res.status(400).send({
        status: 'error',
        message: 'Invalid date: archivedDate must be a valid date string'
      });
    }
    const newsData = {
      title,
      description,
      content,
      author,
      date,
      archiveDate: archiveDate || null
    };

    const news = await newsService.createNews(newsData);
    
    req.app.get('io').emit('newNews', news);
    
    res.status(201).send(news);
  } catch (error) {
    next(error);
  }
};

const archiveNews = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {archiveDate } = req.body;

    if (!archiveDate || isNaN(Date.parse(archiveDate))) {
      return res.status(400).send({
        status: 'error',
        message: 'Invalid date: archivedDate must be a valid date string'
      });
    }

    const news = await newsService.archiveNews(id, archiveDate);
    if (!news) {
      return res.status(404).send({
        status: 'error',
        message: 'News not found with given id'
      });
    }

    res.status(200).send(news);
  } catch (error) {
    next(error);
  }
};

const removeNews = async (req, res, next) => {
  try {
    const { id } = req.params;

    const result = await newsService.removeNews(id);
    if (!result) {
      return res.status(404).send({
        status: 'error',
        message: 'News not found with given id'
      });
    }

    res.status(200).send({
      message: 'News successfully removed'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getFilterNews,
  createNews,
  archiveNews,
  removeNews
};