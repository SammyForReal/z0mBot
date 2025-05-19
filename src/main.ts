import { bot, notify } from "./discord.ts";
import { get, scraper } from "./twitter.ts";

const cooldown = Number(Deno.env.get("COOLDOWN_MINUTES")!);
const activity_interval = cooldown * 60 * 1000;

Deno.addSignalListener("SIGINT", () => shutdown());
Deno.addSignalListener("SIGTERM", () => shutdown());

function shutdown() {
  console.log("Bot shutting down...");
  scraper.logout();
  bot.destroy();
  Deno.exit(0);
}

while (true) {
  {
    console.log("Gathering tweets");
    const tweets = await get();

    if (tweets.length > 0) {
      console.log("UPDAGE POG! :z0mPoint:");
      notify(tweets[0]);
    }
  }

  {
    const until = Date.now() + activity_interval;
    console.log(`Now sleeping until ${new Date(until.toLocaleString())}`);
    await new Promise((resolve) => setTimeout(resolve, activity_interval));
  }
}
