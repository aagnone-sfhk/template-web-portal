"use server";

import "server-only";
import { unstable_cacheTag as cacheTag, revalidateTag } from "next/cache";
import axios from "axios";
import { agentConfig } from "./config";

const getToken = async () => {
  "use cache";
  const params = new URLSearchParams();
  params.append("grant_type", "client_credentials");
  params.append("client_id", agentConfig.credentials.clientId);
  params.append("client_secret", agentConfig.credentials.clientSecret);
  const { data } = await axios({
    method: "post",
    url: agentConfig.getAuthEndpoint(),
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    data: params,
  });
  const accessToken = data["access_token"];
  const apiInstanceUrl = data["api_instance_url"];
  cacheTag("token");
  return { accessToken, apiInstanceUrl };
};

export const newSession = async () => {
  const { accessToken, apiInstanceUrl } = await getToken();
  const uuid = crypto.randomUUID();
  const payload = {
    externalSessionKey: uuid,
    instanceConfig: {
      endpoint: `https://${agentConfig.baseUrl}/`,
    },
    featureSupport: "Streaming",
    streamingCapabilities: {
      chunkTypes: ["Text"],
    },
    bypassUser: true,
  };
  const { data } = await axios({
    method: "post",
    url: `${apiInstanceUrl}${agentConfig.getAgentSessionEndpoint()}`,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    data: payload,
  });
  return data;
};

export const getSession = async () => {
  "use cache";
  const session = await newSession();
  cacheTag("session");
  return session;
};

export const endSession = async () => {
  const { accessToken, apiInstanceUrl } = await getToken();
  const { sessionId } = await getSession();
  try {
    const { data } = await axios({
      method: "delete",
      url: `${apiInstanceUrl}${agentConfig.getSessionEndpoint(sessionId)}`,
      headers: {
        "x-session-end-reason": "UserRequest",
        Authorization: `Bearer ${accessToken}`,
      },
    });
    revalidateTag("session");
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const sendStreamingMessage = async (
  text: string,
  sequenceId: number
) => {
  const { accessToken, apiInstanceUrl } = await getToken();
  const { sessionId } = await getSession();

  const tempModifiedTextForDemo = `${text}. For context about the ACME account, sfId=0038c00003XpThAAAV, sfIdType=Contact, agentId=005am000009hgrdAAA`;

  const { data } = await axios({
    method: "post",
    url: `${apiInstanceUrl}${agentConfig.getStreamingEndpoint(sessionId)}`,
    headers: {
      Accept: "text/event-stream",
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    data: {
      message: {
        sequenceId,
        type: "Text",
        text: tempModifiedTextForDemo,
      },
    },
    responseType: "stream",
  });
  return data;
};
