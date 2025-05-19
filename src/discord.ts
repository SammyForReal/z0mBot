import { Tweet } from "@the-convocation/twitter-scraper";
import {
  ChannelType,
  Client,
  GatewayIntentBits,
  PermissionFlagsBits,
} from "discord.js";
import { gatherMedia, message as formatted_message } from "./formatter.ts";

export const bot = new Client({ intents: [GatewayIntentBits.Guilds] });

bot.once("ready", () => {
  console.log(`Logged in as ${bot.user?.tag}!`);
});

console.log("Starting bot");
const token: string = Deno.env.get("DISCORD_TOKEN")!;
bot.login(token);

// Permission integer for discord: 59392 (Send Messages, Manage Messages, Embed Links, Attach Files)
const client_id: string = Deno.env.get("DISCORD_CLIENT_ID")!;
console.log(
  `Invite Link: https://discord.com/oauth2/authorize?client_id=${client_id}&permissions=59392`,
);

export function notify(tweet: Tweet) {
  const message = formatted_message(tweet);
  const files = gatherMedia(tweet);

  console.log("Sending notification to all guilds");

  const guilds = bot.guilds.cache;

  guilds.forEach(async (guild) => {
    if (bot.user === null) return;
    const member_self = await guild.members.fetchMe();

    const channels = guild.channels.cache;
    const channel = channels.find((channel) =>
      channel &&
      channel.type === ChannelType.GuildText &&
      channel.permissionsFor(member_self).has(PermissionFlagsBits.SendMessages)
    );

    if (!(channel && channel.isTextBased())) {
      return; // No channel is visible for us in that guild
    }

    channel.send({
      content: message,
      files: files,
    });
  });
}
