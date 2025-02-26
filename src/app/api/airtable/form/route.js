import Airtable from "airtable";

const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(
  process.env.AIRTABLE_BASE_ID
);

export async function POST(request) {
  try {
    const body = await request.json();
    const { fileurl, videourl, githubUrl, systemPrompt } = body;
    // console.log(MailID);
    // console.log(date);

    const createdRecords = await base("data").create([
      {
        fields: {
          "github url": githubUrl,
          system_prompt: systemPrompt,

          video_url: videourl,
        },
      },
    ]);

    return new Response(
      JSON.stringify({ success: true, record: createdRecords[0] }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Airtable error:", error);
    return new Response(JSON.stringify({ error: "Failed to insert data" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

// Optionally, you can export other methods like GET if needed, or return a 405 error for unsupported methods:
export function GET() {
  return new Response(JSON.stringify({ error: "Method Not Allowed" }), {
    status: 405,
    headers: { "Content-Type": "application/json" },
  });
}
