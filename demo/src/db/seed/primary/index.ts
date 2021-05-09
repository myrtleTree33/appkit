import { Knex } from "knex";

export const seed = async (knex: Knex) => {
  await knex("users")
    .del()
    .insert([
      {
        id: 1,
        username: "john",
        email: "john@gmail.com",
        password: "whatever",
      },
      {
        id: 2,
        username: "mary",
        email: "mary@gmail.com",
        password: "whatever",
      },
    ]);
};
