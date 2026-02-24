import { db } from "../../config/database";

export const createUser = async (email: string, password: string) => {
  const result = await db.query(
    "INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id, email, role",
    [email, password]
  );
  return result.rows[0];
};

export const findUserByEmail = async (email: string) => {
  const result = await db.query(
    "SELECT * FROM users WHERE email = $1",
    [email]
  );
  return result.rows[0];
};
