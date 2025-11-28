import { NextRequest, NextResponse } from "next/server";
import { AccessToken } from "livekit-server-sdk";
import type { AccessTokenOptions, VideoGrant } from "livekit-server-sdk";

const apiKey = process.env.LIVEKIT_API_KEY;
const apiSecret = process.env.LIVEKIT_API_SECRET;

function generateRandomAlphanumeric(length: number): string {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

const createToken = (userInfo: AccessTokenOptions, grant: VideoGrant) => {
  const at = new AccessToken(apiKey, apiSecret, userInfo);
  at.addGrant(grant);
  return at.toJwt();
};

export async function POST(req: NextRequest) {
  try {
    if (!apiKey || !apiSecret) {
      return NextResponse.json(
        { error: "Environment variables aren't set up correctly" },
        { status: 500 }
      );
    }

    const roomName = `oris-ai-${generateRandomAlphanumeric(
      4
    )}-${generateRandomAlphanumeric(4)}`;
    const identity = `patient-${generateRandomAlphanumeric(6)}`;

    const grant: VideoGrant = {
      room: roomName,
      roomJoin: true,
      canPublish: true,
      canPublishData: true,
      canSubscribe: true,
    };

    const token = await createToken({ identity }, grant);

    return NextResponse.json({
      identity,
      accessToken: token,
      roomName,
    });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
