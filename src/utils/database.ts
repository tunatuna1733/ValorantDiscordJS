import { MongoClient, ServerApiVersion, Collection } from "mongodb";

export class Database {
  client: MongoClient;
  users: Collection<UserData>;
  constructor(db_url: string) {
    this.client = new MongoClient(db_url, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      },
    });
  }

  public init = async () => {
    await this.client.connect();
    this.users = this.client.db("valorantdiscordjs").collection("users");
  };

  public getAllCollections = async () => {
    const cursor = this.users.find();
    const user_data_list: UserData[] = [];
    for await (const doc of cursor) {
      const user_data: UserData = {
        discord_id: doc.discord_id,
        track_match: doc.track_match,
        track_channel: doc.track_channel,
        riot_accounts: doc.riot_accounts,
      };
      user_data_list.push(user_data);
    }
    return user_data_list;
  };

  public upsertUser = async (riot_account_data: RiotAccountData) => {};
}
