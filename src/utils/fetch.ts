import axios, { AxiosResponse, AxiosError } from "axios";
import { ResourceNotFoundError, UnknownAPIError, UnknownError } from "./error";
import { henrik_api_key } from "..";

const BASE_URL = "https://api.henrikdev.xyz/valorant";

// account related info
export const getAccountDataFromNameTag = async (name: string, tag: string) => {
  try {
    const res: AxiosResponse<RawAccountDataResponse> = await axios.get(
      `${BASE_URL}/v1/account/${name}/${tag}`,
      { headers: { Authorization: henrik_api_key } }
    );
    const response_data = res.data;
    return response_data;
  } catch (error) {
    if (error instanceof AxiosError) {
      if (error.status === 404) {
        throw new ResourceNotFoundError();
      } else {
        throw new UnknownAPIError(error.message);
      }
    } else {
      throw new UnknownError();
    }
  }
};

export const getAccountDataFromPUUID = async (puuid: string) => {
  try {
    const res: AxiosResponse<RawAccountDataResponse> = await axios.get(
      `${BASE_URL}/v1/by-puuid/account/${puuid}`,
      { headers: { Authorization: henrik_api_key } }
    );
    const response_data = res.data;
    return response_data;
  } catch (error) {
    if (error instanceof AxiosError) {
      if (error.status === 404) {
        throw new ResourceNotFoundError();
      } else {
        throw new UnknownAPIError(error.message);
      }
    } else {
      throw new UnknownError();
    }
  }
};

// rank related info
export const getCurrentRankFromPUUID = async (
  puuid: string,
  region: string
) => {
  try {
    const res: AxiosResponse<RawCurrentRankResponse> = await axios.get(
      `${BASE_URL}/v1/by-puuid/mmr/${region}/${puuid}`,
      { headers: { Authorization: henrik_api_key } }
    );
    const response_data = res.data;
    return response_data;
  } catch (error) {
    if (error instanceof AxiosError) {
      if (error.status === 404) {
        throw new ResourceNotFoundError();
      } else {
        throw new UnknownAPIError(error.message);
      }
    } else {
      throw new UnknownError();
    }
  }
};

export const getMMRHistoryFromPUUID = async (puuid: string, region: string) => {
  try {
    const res: AxiosResponse<RawMMRHistoryResponse> = await axios.get(
      `${BASE_URL}/v1/by-puuid/mmr-history/${region}/${puuid}`,
      { headers: { Authorization: henrik_api_key } }
    );
    const response_data = res.data;
    return response_data;
  } catch (error) {
    if (error instanceof AxiosError) {
      if (error.status === 404) {
        throw new ResourceNotFoundError();
      } else {
        throw new UnknownAPIError(error.message);
      }
    } else {
      throw new UnknownError();
    }
  }
};

export const getLastCompetitiveMatchFromPUUID = async (
  puuid: string,
  region: string
) => {
  try {
    const res = await getMMRHistoryFromPUUID(puuid, region);
    return { match_id: res.data[0].match_id, match_date: res.data[0].date_raw };
  } catch (error) {
    if (error instanceof AxiosError) {
      if (error.status === 404) {
        throw new ResourceNotFoundError();
      } else {
        throw new UnknownAPIError(error.message);
      }
    } else {
      throw new UnknownError();
    }
  }
};

// match related info
export const getMatchDataFromMatchID = async (match_id: string) => {
  try {
    const res: AxiosResponse<RawMatchDataResponse> = await axios.get(
      `${BASE_URL}/v2/match/${match_id}`,
      { headers: { Authorization: henrik_api_key } }
    );
    const response_data = res.data;
    return response_data;
  } catch (error) {
    if (error instanceof AxiosError) {
      if (error.status === 404) {
        throw new ResourceNotFoundError();
      } else {
        throw new UnknownAPIError(error.message);
      }
    } else {
      throw new UnknownError();
    }
  }
};

export const getMatchDataHistoryFromPUUID = async (
  puuid: string,
  region: string
) => {
  try {
    const res: AxiosResponse<RawMultipleMatchDataResponse> = await axios.get(
      `${BASE_URL}/v3/by-puuid/matches/${region}/${puuid}`,
      { headers: { Authorization: henrik_api_key } }
    );
    const response_data = res.data;
    return response_data;
  } catch (error) {
    if (error instanceof AxiosError) {
      if (error.status === 404) {
        throw new ResourceNotFoundError();
      } else {
        throw new UnknownAPIError(error.message);
      }
    } else {
      throw new UnknownError();
    }
  }
};
