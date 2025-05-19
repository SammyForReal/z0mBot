import { Tweet } from "@the-convocation/twitter-scraper";
import { stalked } from "./twitter.ts";

function removeUrls(message: string | undefined): string {
  const urlPattern = /\s*https?:\/\/[^\s]+/g;
  return (message ?? "").replace(urlPattern, "").trim();
}

function replaceUsername(
  message: string = "",
  username: string,
  name: string,
): string {
  const usernamePattern = new RegExp(`@${username}`, "g");
  return message.replace(
    usernamePattern,
    `[${name}](<https://x.com/${username}>)`,
  );
}

function link(message: string, tweet: Tweet): string {
  const source = tweet.permanentUrl ?? "https://x.com/" + stalked;

  let link = `\n[(→)](<${source}>)`;

  return message + link;
}

export function message(tweet: Tweet): string {
  let message = removeUrls(tweet.text);

  for (let i = 0; i < tweet.mentions.length; i++) {
    const person = tweet.mentions[i];
    if (person && person.username && person.name) {
      message = replaceUsername(message, person.username, person.name);
    }
  }

  message = link(message, tweet);

  if (tweet.urls.length > 0) {
    message += "\n\n" + tweet.urls.join("\n");
  }

  return message;
}

export function gatherMedia(tweet: Tweet): string[] {
  const media: string[] = [];

  for (let i = 0; i < tweet.photos.length; i++) {
    media.push(tweet.photos[i].url);
  }
  for (let i = 0; i < tweet.videos.length; i++) {
    if (!tweet.videos[i].url) continue;
    media.push(tweet.videos[i].url as string);
  }

  return media;
}
