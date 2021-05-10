import { getServer } from "./server";

describe("server", () => {
  test("returns the default value", async () => {
    const server = await getServer();
    await server.close();
  });
});
