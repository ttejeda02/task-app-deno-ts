import { Client } from "mysql";

export const createDbConnection = async (): Promise<Client> => {
    const client = new Client();
    await client.connect({
        hostname: Deno.env.get("DB_HOST"),
        username: Deno.env.get("DB_USER"),
        db: Deno.env.get("DB_NAME"),
        password: Deno.env.get("DB_PASSWORD"),
        poolSize: 3,
    });

  return client;
}