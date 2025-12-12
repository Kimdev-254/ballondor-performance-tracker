import axios from "axios";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const PLAYER_ID = 739; // Haaland
    const SEASON = 2023;
    const TEAM_ID = 50; // Man City
    const API_KEY = process.env.FOOTBALL_API_KEY;

    // Ensure API Key is present
    if (!API_KEY) {
      return NextResponse.json(
        { error: "FOOTBALL_API_KEY is not defined" },
        { status: 500 }
      );
    }

    // 1. Get all Man City fixtures for the season
    const fixturesRes = await axios.get(
      `https://v3.football.api-sports.io/fixtures?team=${TEAM_ID}&season=${SEASON}`,
      { headers: { "x-apisports-key": API_KEY } }
    );

    const fixtures = fixturesRes.data.response;

    let timeline: any[] = [];

    // 2. Loop through fixtures to get Haaland's match performance
    for (const fix of fixtures) {
      const fixtureId = fix.fixture.id;

      const playerStatsRes = await axios.get(
        `https://v3.football.api-sports.io/fixtures/players?fixture=${fixtureId}`,
        { headers: { "x-apisports-key": API_KEY } }
      );

      const players = playerStatsRes.data.response[0]?.players || [];

      const haaland = players.find((p: any) => p.player.id === PLAYER_ID);

      if (!haaland) continue;

      const stats = haaland.statistics[0];

      timeline.push({
        fixture: fix.fixture.date,
        score: calculateScore({
          goals: stats.goals.total || 0,
          assists: stats.goals.assists || 0,
          rating: parseFloat(stats.games.rating) || 0,
          shotsOn: stats.shots.on || 0,
          shotsTotal: stats.shots.total || 0,
          minutes: stats.games.minutes || 0,
        }),
      });
    }

    return NextResponse.json({ timeline });
  } catch (e: unknown) {
    // --- FIX APPLIED HERE ---
    // Use a type guard to handle the 'unknown' type of the caught error 'e'
    if (e instanceof Error) {
      return NextResponse.json({ error: e.message }, { status: 500 });
    } else {
      // Fallback for non-Error objects that might be thrown
      return NextResponse.json(
        { error: "An unknown error occurred" },
        { status: 500 }
      );
    }
  }
}

function calculateScore({
  goals,
  assists,
  rating,
  shotsOn,
  shotsTotal,
  minutes,
}: any) {
  return (
    goals * 10 +
    assists * 6 +
    rating * 8 +
    shotsOn * 2 +
    (shotsOn / (shotsTotal || 1)) * 5 +
    (minutes > 70 ? 5 : 0)
  );
}
