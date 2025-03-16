import pool from "../config/database";
import { QueryResult } from "pg";

export interface User {
  id: string;
  email: string;
  password: string;
  type: UserType;
  languages: string;
  friend_code: string;
}

export enum UserType {
  volunteer = "volunteer",
  blind = "blind",
}

export class UserModel {
  static async findByEmail(email: string): Promise<User | null> {
    const query = "SELECT * FROM users WHERE email = $1";
    const result: QueryResult = await pool.query(query, [email]);
    return result.rows[0] || null;
  }

  static async findById(id: string): Promise<User | null> {
    const query = "SELECT * FROM users WHERE id = $1";
    const result: QueryResult = await pool.query(query, [id]);
    return result.rows[0] || null;
  }

  static async create(
    email: string,
    hashedPassword: string,
    type: string
  ): Promise<User> {
    const query =
      "INSERT INTO users (email, password, type) VALUES ($1, $2, $3) RETURNING *";
    const result: QueryResult = await pool.query(query, [
      email,
      hashedPassword,
      type,
    ]);
    return result.rows[0];
  }

  static async updateLanguages(id: string, languages: string) {
    const query = "UPDATE users SET languages = $1 WHERE id = $2";
    await pool.query(query, [languages, id]);
  }

  static async getLanguages(id: string): Promise<string[]> {
    const query = "SELECT languages FROM users WHERE id = $1";
    const result: QueryResult = await pool.query(query, [id]);
    return result.rows[0].languages;
  }

  static async getVolunteersIdByLanguages(
    languages: string
  ): Promise<string[]> {
    const query = `SELECT id FROM users WHERE type = 'volunteer' AND languages && ARRAY[${languages}]`;
    const result: QueryResult = await pool.query(query);
    return result.rows.map((row) => row.id);
  }

  static async getUserByFriendCode(friendCode: string): Promise<User | null> {
    const query = "SELECT * FROM users WHERE friend_code = $1";
    const result: QueryResult = await pool.query(query, [friendCode]);
    return result.rows[0] || null;
  }
}
