import { QueryResult } from "pg";
import pool from "../config/database";
import { User } from "./user.model";

export interface Designation {
  blind_id: string;
  volunteer_id: string;
}

export class DesignationModel {
  static async addDesignation(
    designation: Designation
  ): Promise<Designation | null> {
    const query =
      "INSERT INTO designations (blind_id, volunteer_id) VALUES ($1, $2) RETURNING *";
    const result: QueryResult = await pool.query(query, [
      designation.blind_id,
      designation.volunteer_id,
    ]);
    return result.rows[0] || null;
  }

  static async removeDesignation(
    designation: Designation
  ): Promise<Designation | null> {
    const query =
      "DELETE FROM designations WHERE blind_id = $1 AND volunteer_id = $2 RETURNING *";
    const result: QueryResult = await pool.query(query, [
      designation.blind_id,
      designation.volunteer_id,
    ]);
    return result.rows[0] || null;
  }

  static async getDesignatedVolunteersIdByBlindId(
    blind_id: string
  ): Promise<string[]> {
    const query = `SELECT volunteer_id FROM designations WHERE blind_id = $1`;
    const result: QueryResult = await pool.query(query, [blind_id]);
    return result.rows.map((row) => row.volunteer_id);
  }

  static async getVisuallyImpairedUsersDesignatedToVolunteerId(
    volunteer_id: string
  ): Promise<User[]> {
    const query = `SELECT users.id, users.email FROM designations JOIN users ON users.id = designations.blind_id WHERE designations.volunteer_id = $1`;
    const result: QueryResult = await pool.query(query, [volunteer_id]);
    return result.rows;
  }
}
