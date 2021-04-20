import { Knex } from "knex";
export interface DB {
    primary: Knex | null;
    [key: string]: Knex | null;
}
export interface DBConfig {
    primary: Knex.Config | null;
    [key: string]: Knex.Config | null;
}
export declare const config: DBConfig;
declare const _default: DB;
export default _default;
