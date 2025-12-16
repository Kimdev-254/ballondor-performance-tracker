import axios from "axios";
import { NextResponse } from "next/server";

const API_KEY = process.env.FOOTBALL_API_KEY;
const PLAYER_ID = 739; // Haaland
const TEAM_ID = 50; // Man City
const SEASON = 2024;

export async function GET() {
  try {
    const fixturesRes = await axios.get(
      `https://v3.football.api-sports.io/fixtures?team=${TEAM_ID}&season=${SEASON}`,
      { headers: { "x-apisports-key": API_KEY } }
    );

    const fixtures = fixturesRes.data.response;

    let timeline: any[] = [];
    let index = 0;
    let previousImpact = 0;

    for (const fix of fixtures) {
      const fixtureId = fix.fixture.id;

      const playersRes = await axios.get(
        `https://v3.football.api-sports.io/fixtures/players?fixture=${fixtureId}`,
        { headers: { "x-apisports-key": API_KEY } }
      );

      const players = playersRes.data.response?.[0]?.players ?? [];
      const haaland = players.find((p: any) => p.player.id === PLAYER_ID);
      if (!haaland) continue;

      const s = haaland.statistics[0];

      const impact =
        (s.goals.total ?? 0) * 12 +
        (s.goals.assists ?? 0) * 8 +
        (parseFloat(s.games.rating) || 0) * 6 +
        (s.games.minutes >= 70 ? 4 : 0);

      const momentum = impact >= previousImpact ? 1.1 : 0.95;
      const delta = impact * momentum;
      index += delta;

      timeline.push({
        date: fix.fixture.date,
        index: Math.round(index),
        delta: Math.round(delta),
        reasons: [
          `${s.goals.total ?? 0} goals`,
          `${s.goals.assists ?? 0} assists`,
          `${s.games.minutes} mins`,
          `rating ${s.games.rating ?? "N/A"}`,
          momentum > 1 ? "positive momentum" : "drop in form",
        ],
      });

      previousImpact = impact;
    }

    timeline.sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    return NextResponse.json({ timeline });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
