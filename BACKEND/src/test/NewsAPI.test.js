
const request = require('supertest');
const News = require('../models/News');
const {app, server} = require('../index');
const { disconnectDB } = require('../database');
const URI_NEWS = '/api/news';

afterAll(() => {
    disconnectDB()
    server.close()
});

beforeEach(async () => {
  await News.deleteMany({});
});

describe('News API', () => {
  
  describe('GET /api/news', () => {
    it('should return only new News', async () => {
      await News.create([
        { title: 'News 1', description: 'Desc 1', content: 'Content 1', author: 'Author 1', date: new Date() },
        { title: 'News 2', description: 'Desc 2', content: 'Content 2', author: 'Author 2',date: new Date() },
        { title: 'News 2', description: 'Desc 2', content: 'Content 2', author: 'Author 2',date: new Date(), archiveDate: new Date() }
      ]);

      const response = await request(app).get(`${URI_NEWS}?isArchived=false`);
      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(2);
    });

    it('should return only archived news', async () => {
      await News.create([
        { title: 'News 1', description: 'Desc 1', content: 'Content 1', author: 'Author 1', date: new Date()},
        { title: 'News 2', description: 'Desc 2', content: 'Content 2', author: 'Author 2',date: new Date(), archiveDate: new Date() }
      ]);

      const response = await request(app).get(`${URI_NEWS}?isArchived=true`);
      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(1);
      expect(response.body[0].archiveDate).toBeDefined();
    });
  });

  describe('POST /api/news', () => {
    it('should create a new news item', async () => {
      const newsData = { title: 'News 1', description: 'Desc 1', content: 'Content 1', author: 'Author 1',date: new Date() };
      const response = await request(app).post(URI_NEWS).send(newsData);

      expect(response.status).toBe(201);
      expect(response.body.title).toBe(newsData.title);
    });

    it('should return an error if title is missing', async () => {
      const newsData = {description: 'Desc 1', content: 'Content 1', author: 'Author 1',date: new Date() };
      const response = await request(app).post(URI_NEWS).send(newsData);

      expect(response.status).toBe(400);
    });
  });

  describe('PATCH /api/news/:id', () => {
    it('should archive a news item', async () => {
      const news = await News.create({ title: 'News 1', description: 'Desc 1', content: 'Content 1', author: 'Author 1',date: new Date() });
      const response = await request(app).patch(`${URI_NEWS}/${news._id}`).send({archiveDate: new Date()});

      expect(response.status).toBe(200);
      expect(response.body.archiveDate).toBeDefined();
    });
  });

  describe('DELETE /api/news/:id', () => {
    it('should delete a news item', async () => {
      const news = await News.create({ title: 'News 1', description: 'Desc 1', content: 'Content 1', author: 'Author 1',date: new Date() });
      const response = await request(app).delete(`${URI_NEWS}/${news._id}`);

      expect(response.status).toBe(200);

      const deletedNews = await News.findById(news._id);
      expect(deletedNews).toBeNull();
    });
  });
});