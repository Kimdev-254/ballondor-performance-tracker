export async function GET() {
  return new Response(JSON.stringify({ stats: [] }), {
    headers: { "Content-Type": "application/json" },
  });
}
