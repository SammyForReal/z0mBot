import { Scraper, Tweet } from "@the-convocation/twitter-scraper";
import { load, MAX_TWEETS, Remembered, save } from "./memory.ts";

export const stalked: string = Deno.env.get("TWITTER_STALKED_USER")!;
const username: string = Deno.env.get("TWITTER_USERNAME")!;
const password: string = Deno.env.get("TWITTER_PASSWORD")!;
const email: string | undefined = Deno.env.get("TWITTER_EMAIL");

export const scraper = new Scraper();

await scraper.login(username, password, email);

export async function get(): Promise<Tweet[]> {
  // Prepare session
  const data: Remembered = await load();

  const updates: Tweet[] = [];

  for await (const tweet of scraper.getTweets(stalked, MAX_TWEETS)) {
    if (!(tweet && tweet.id)) continue; // How did we get here

    // Filter out tweets not relevant for "news-like posts"
    if (tweet.isPin || tweet.isRetweet || tweet.isReply) continue;

    if (!data.tweets.includes(tweet.id)) {
      // New tweet that must be reported
      updates.push(tweet);
      data.remember(tweet.id);
    }
  }

  save(data);

  return updates;
}
