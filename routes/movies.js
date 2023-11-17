const express = require('express');
const router = express.Router();
const apiAdapter = require('./apiAdapter');

const api = apiAdapter(`http://${process.env.API_MOVIES}`);

router.get('/', async (req, res) => {
  try {
    const movies = await api.get('/');
    return res.json({
      status: 'success',
      data: movies.data
    });
  } catch (error) {
    console.log(error);
  }
});

router.get('/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const movies = await api.get(`/${id}`);
    return res.json(movies.data);
  } catch (error) {
    console.log(error);
  }
});

router.post('/', async (req, res) => {
  try {
    const movie = await api.post('/', req.body);
    return res.json(movie.data);
  } catch (error) {
    console.log(error);
  }
})

module.exports = router;