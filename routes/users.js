const express = require('express');
const router = express.Router();
const apiAdapter = require('./apiAdapter');

const api = apiAdapter('http://localhost:3001');

router.get('/', async (req, res) => {
  try {
    const users = await api.get('/');
    return res.json({
      status: 'success',
      data: users.data
    });
  } catch (error) {
    console.log(error);
  }
});

router.get('/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const users = await api.get(`/${id}`);
    return res.json(users.data);
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;