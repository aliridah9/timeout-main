import globalConfig from "../../global-config.json";

async function main() {
  const nodeEnv = (process.env.NODE_ENV ?? "development") as "test" | "development";
  if (nodeEnv === "test") {
    // @ts-expect-error implicitly has an 'any' type.
    await import("../../date-stub");
  }

  const { default: app } = await import("./app");
  const port = globalConfig[nodeEnv].server.port;
  app.listen(port, () => console.log(`Listening on port ${port}.`));
}

main();
