const location: string = "saved/data.json";

type IDS = [string?, string?, string?];
export const MAX_TWEETS: number = 3;

export class Remembered {
  tweets: IDS;

  constructor(tweets: IDS) {
    this.tweets = tweets;
  }

  remember(id: string): void {
    if (this.tweets.length >= MAX_TWEETS) {
      this.tweets.shift();
    }
    this.tweets.push(id);
  }
}

export function save(data: Remembered): Promise<void> {
  const jsonData = JSON.stringify(data, null, 2);
  return Deno.writeTextFile(location, jsonData);
}

export async function load(): Promise<Remembered> {
  try {
    const jsonData = await Deno.readTextFile(location);
    return new Remembered(JSON.parse(jsonData).tweets);
  } catch {
    return new Remembered([]);
  }
}
