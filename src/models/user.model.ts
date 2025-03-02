import pool from '../config/database.js';
import { QueryResult } from 'pg';

export interface User {
  id: number;
  email: string;
  password: string;
}

export class UserModel {
  static async findByEmail(email: string): Promise<User | null> {
    const query = 'SELECT * FROM users WHERE email = $1';
    const result: QueryResult = await pool.query(query, [email]);
    return result.rows[0] || null;
  }

  static async create(email: string, hashedPassword: string): Promise<User> {
    const query = 'INSERT INTO users (email, password) VALUES ($1, $2) RETURNING *';
    const result: QueryResult = await pool.query(query, [email, hashedPassword]);
    return result.rows[0];
  }
}