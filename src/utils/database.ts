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

  public upsertUser = async (
    discord_id: string,
    riot_account_data: RiotAccountData
  ) => {
    try {
      const doc = await this.users.findOne({ discord_id: discord_id });
      if (doc === null) {
        // insert new user
        const user_data: UserData = {
          discord_id: discord_id,
          track_match: false,
          track_channel: "0",
          riot_accounts: [riot_account_data],
        };
        await this.users.insertOne(user_data);
      } else {
        // add new riot account
        await this.users.updateOne(
          { discord_id: discord_id },
          { $push: { riot_accounts: riot_account_data } }
        );
      }
    } catch (error) {
      throw error;
    }
  };

  public updateTrackMatch = async (discord_id: string, toggle: boolean) => {
    try {
      const doc = await this.users.findOne({ discord_id: discord_id });
      if (doc === null) {
        // registeraion needed
        return false;
      } else {
        await this.users.updateOne(
          { discord_id: discord_id },
          { $set: { track_match: toggle } }
        );
      }
    } catch (error) {
      throw error;
    }
  };

  public updateMatchID = async (
    discord_id: string,
    puuid: string,
    match_id: string
  ) => {
    try {
      const doc = await this.users.findOne({ discord_id: discord_id });
      if (doc === null) {
        // registeraion needed
        return false;
      } else {
        let new_riot_account_data: RiotAccountData[] = [];
        const riot_account_data: RiotAccountData[] = doc.riot_accounts;
        riot_account_data.map((riot_account) => {
          if (riot_account.puuid === puuid) {
            const new_riot_account: RiotAccountData = {
              id: riot_account.id,
              tag: riot_account.tag,
              puuid: riot_account.puuid,
              last_match_id: match_id,
            };
            new_riot_account_data.push(new_riot_account);
          } else {
            new_riot_account_data.push(riot_account);
          }
        });
        const new_user_data: UserData = {
          discord_id: doc.discord_id,
          track_match: doc.track_match,
          track_channel: doc.track_channel,
          riot_accounts: new_riot_account_data,
        };
        await this.users.updateOne(
          { discord_id: discord_id },
          { $set: new_user_data }
        );
      }
    } catch (error) {
      throw error;
    }
  };
}
