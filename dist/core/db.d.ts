import { Knex } from "knex";
export interface DB {
    primary: Knex | null;
    [key: string]: Knex | null;
}
export declare function getDB(): DB;
declare const _default: DB;
export default _default;
