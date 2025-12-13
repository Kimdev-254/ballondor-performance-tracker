import axios from "axios";
import { NextResponse } from "next/server";

const API_KEY = process.env.FOOTBALL_API_KEY;
const PLAYER_ID = 739; // Haaland
const TEAM_ID = 50; // Manchester City
const SEASON = 2023;

export async function GET() {
  try {
    // 1. Fetch ALL Man City fixtures for the season
    const fixturesRes = await axios.get(
      `https://v3.football.api-sports.io/fixtures?team=${TEAM_ID}&season=${SEASON}`,
      {
        headers: { "x-apisports-key": API_KEY },
      }
    );

    const fixtures = fixturesRes.data.response;

    let timeline: { fixture: string; score: number }[] = [];

    // 2. For each fixture, get player stats
    for (const fix of fixtures) {
      const fixtureId = fix.fixture.id;

      const playersRes = await axios.get(
        `https://v3.football.api-sports.io/fixtures/players?fixture=${fixtureId}`,
        {
          headers: { "x-apisports-key": API_KEY },
        }
      );

      const players =
        playersRes.data.response?.[0]?.players ?? [];

      const haaland = players.find(
        (p: any) => p.player.id === PLAYER_ID
      );

      if (!haaland) continue;

      const stats = haaland.statistics[0];

      const score = calculateScore({
        goals: stats.goals.total ?? 0,
        assists: stats.goals.assists ?? 0,
        rating: parseFloat(stats.games.rating) || 0,
        shotsOn: stats.shots.on ?? 0,
        minutes: stats.games.minutes ?? 0,
      });

      timeline.push({
        fixture: fix.fixture.date,
        score,
      });
    }

    // 3. Sort by date (VERY IMPORTANT)
    timeline.sort(
      (a, b) =>
        new Date(a.fixture).getTime() -
        new Date(b.fixture).getTime()
    );

    return NextResponse.json({ timeline });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message },
      { status: 500 }
    );
  }
}

function calculateScore({
  goals,
  assists,
  rating,
  shotsOn,
  minutes,
}: {
  goals: number;
  assists: number;
  rating: number;
  shotsOn: number;
  minutes: number;
}) {
  return (
    goals * 10 +
    assists * 6 +
    rating * 8 +
    shotsOn * 2 +
    (minutes >= 70 ? 5 : 0)
  );
}
