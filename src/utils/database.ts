import {
  MongoClient,
  ServerApiVersion,
  Collection,
  MongoServerError,
} from "mongodb";
import {
  DatabaseTransactionError,
  UnknownError,
  UserNotRegistered,
} from "./error";

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
    try {
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
    } catch (error) {
      if (error instanceof MongoServerError) {
        throw new DatabaseTransactionError(error.message);
      } else {
        throw new UnknownError();
      }
    }
  };

  public getPuuidOfLastMatch = async (discord_id: string) => {
    try {
      const doc = await this.users.findOne({ discord_id: discord_id });
      if (doc === null) throw new UserNotRegistered();
      let puuid = "";
      let match_date = 0;
      doc.riot_accounts.map((riot_account) => {
        if (match_date < riot_account.match_date) {
          puuid = riot_account.puuid;
        }
      });
      return puuid;
    } catch (error) {
      if (error instanceof MongoServerError) {
        throw new DatabaseTransactionError(error.message);
      } else if (error instanceof UserNotRegistered) {
        throw new UserNotRegistered();
      } else {
        throw new UnknownError();
      }
    }
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
        // check for duplication
        doc.riot_accounts.map((riot_account) => {
          if (riot_account.puuid === riot_account_data.puuid) {
            // throw
            return;
          }
        });
        // add new riot account
        await this.users.updateOne(
          { discord_id: discord_id },
          { $push: { riot_accounts: riot_account_data } }
        );
      }
    } catch (error) {
      if (error instanceof MongoServerError) {
        throw new DatabaseTransactionError(error.message);
      } else {
        throw new UnknownError();
      }
    }
  };

  public updateTrackMatch = async (discord_id: string, toggle: boolean) => {
    try {
      const doc = await this.users.findOne({ discord_id: discord_id });
      if (doc === null) {
        throw new UserNotRegistered();
      } else {
        await this.users.updateOne(
          { discord_id: discord_id },
          { $set: { track_match: toggle } }
        );
      }
    } catch (error) {
      if (error instanceof MongoServerError) {
        throw new DatabaseTransactionError(error.message);
      } else if (error instanceof UserNotRegistered) {
        throw new UserNotRegistered();
      } else {
        throw new UnknownError();
      }
    }
  };

  public updateMatchInfo = async (
    discord_id: string,
    puuid: string,
    match_id: string,
    match_date: number
  ) => {
    try {
      const doc = await this.users.findOne({ discord_id: discord_id });
      if (doc === null) {
        throw new UserNotRegistered();
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
              match_date: match_date,
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
      if (error instanceof MongoServerError) {
        throw new DatabaseTransactionError(error.message);
      } else if (error instanceof UserNotRegistered) {
        throw new UserNotRegistered();
      } else {
        throw new UnknownError();
      }
    }
  };
}
