import axios from "axios";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const PLAYER_ID = 739; // Haaland
    const SEASON = 2024;
    const LEAGUE = 39; // Premier League
    const API_KEY = process.env.FOOTBALL_API_KEY;

    const { data } = await axios.get(
      `https://v3.football.api-sports.io/players?id=${PLAYER_ID}&season=${SEASON}&league=${LEAGUE}`,
      { headers: { "x-apisports-key": API_KEY } }
    );

    const matches = data.response[0].statistics[0].games;

    // Build graph-ready dataset
    const timeline = data.response[0].statistics[0].games.map((game: any) => {
      const stats = data.response[0].statistics[0];

      return {
        fixture: game.fixture?.date || "Unknown",
        score: calculateScore({
          goals: stats.goals.total || 0,
          assists: stats.goals.assists || 0,
          rating: parseFloat(stats.games.rating) || 0,
          shotsOn: stats.shots.on || 0,
          shotsTotal: stats.shots.total || 0,
          minutes: stats.games.minutes || 0,
        }),
      };
    });

    return NextResponse.json({ timeline });
  } catch (e) {
    return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });
  }
}

function calculateScore({ goals, assists, rating, shotsOn, shotsTotal, minutes }: any) {
  return (
    goals * 10 +
    assists * 6 +
    rating * 8 +
    shotsOn * 2 +
    (shotsOn / (shotsTotal || 1)) * 5 +
    (minutes > 70 ? 5 : 0)
  );
}
