const { Pool } = require('pg');

class UsersService {
  constructor() {
    this._pool = new Pool({
      host: process.env.PGHOST,
      port: process.env.PGPORT,
      user: process.env.PGUSER,
      password: process.env.PGPASSWORD,
      database: process.env.PGDATABASE,
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
