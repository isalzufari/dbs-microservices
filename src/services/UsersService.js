const { Pool } = require('pg');

class UsersService {
  constructor() {
    this._pool = new Pool({
      user: 'postgres',
      database: 'cinema',
      password: '1234',
      host: 'localhost',
      port: 5433,
    });
  }

  async getUsers() {
    const result = await this._pool.query('SELECT * FROM users');
    return result.rows;
  }

  async getUserById(id) {
    const query = {
      text: 'SELECT * FROM users WHERE id = $1',
      values: [id],
    }
    const result = await this._pool.query(query);
    if (!result.rowCount) {
      return 'User tidak ditemukan';
    }

    return result.rows;
  }
}

module.exports = UsersService;
