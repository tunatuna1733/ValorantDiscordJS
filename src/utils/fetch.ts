import axios, { AxiosResponse } from "axios";

const BASE_URL = "https://api.henrikdev.xyz/valorant";

// account related info
export const getAccountDataFromNameTag = async (name: string, tag: string) => {
  try {
    const res: AxiosResponse<RawAccountDataResponse> = await axios.get(
      `${BASE_URL}/v1/account/${name}/${tag}`
    );
    const response_data = res.data;
    return response_data;
  } catch (error) {
    throw error;
  }
};

export const getAccountDataFromPUUID = async (puuid: string) => {
  try {
    const res: AxiosResponse<RawAccountDataResponse> = await axios.get(
      `${BASE_URL}/v1/by-puuid/account/${puuid}`
    );
    const response_data = res.data;
    return response_data;
  } catch (error) {
    throw error;
  }
};

// rank related info
export const getCurrentRankFromPUUID = async (
  puuid: string,
  region: string
) => {
  try {
    const res: AxiosResponse<RawCurrentRankResponse> = await axios.get(
      `${BASE_URL}/v1/by-puuid/mmr/${region}/${puuid}`
    );
    const response_data = res.data;
    return response_data;
  } catch (error) {
    throw error;
  }
};

export const getMMRHistoryFromPUUID = async (puuid: string, region: string) => {
  try {
    const res: AxiosResponse<RawMMRHistoryResponse> = await axios.get(
      `${BASE_URL}/v1/by-puuid/mmr-history/${region}/${puuid}`
    );
    const response_data = res.data;
    return response_data;
  } catch (error) {
    throw error;
  }
};

// match related info
export const getMatchDataFromMatchID = async (match_id: string) => {
  try {
    const res: AxiosResponse<RawMatchDataResponse> = await axios.get(
      `${BASE_URL}/v2/match/${match_id}`
    );
    const response_data = res.data;
    return response_data;
  } catch (error) {
    throw error;
  }
};

export const getMatchDataHistoryFromPUUID = async (
  puuid: string,
  region: string
) => {
  try {
    const res: AxiosResponse<RawMultipleMatchDataResponse> = await axios.get(
      `${BASE_URL}/v3/by-puuid/matches/${region}/${puuid}`
    );
    const response_data = res.data;
    return response_data;
  } catch (error) {
    throw error;
  }
};
