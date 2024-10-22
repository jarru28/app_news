const News = require('../models/News');
const getFilterNews = async (isArchived) => {
  let query = {};
  let order = {}
    if (isArchived === 'true') {
      query.archiveDate = { $ne: null };
      order= { archiveDate: -1 }
    } else {
      query.archiveDate = { $eq: null };
      order = { date: -1 }
    }

  const newsList = await News.find(query).sort(order)
  return newsList;
};

const createNews = async (newsData) => {
  const news = new News(newsData);
  return await news.save();
};

const archiveNews = async (id,date) => {
  const newsUpdated = await News.findByIdAndUpdate( id, {  archiveDate: date }, { new: true })
  return newsUpdated;
};
const removeNews = async (id) => {
  const newsDeleted = await News.findByIdAndDelete(id)
  return newsDeleted;
};

module.exports = {
  getFilterNews,
  createNews,
  archiveNews,
  removeNews
}