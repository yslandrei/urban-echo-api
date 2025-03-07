import pool from "../config/database";
import { QueryResult } from "pg";

export interface User {
  id: number;
  email: string;
  password: string;
  type: UserType;
  languages: string;
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
}
