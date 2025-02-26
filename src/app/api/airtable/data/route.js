import { NextResponse } from "next/server";
import Airtable from "airtable";

const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(
  process.env.AIRTABLE_BASE_ID
);
const TABLE_NAME = "Task";

export async function POST(request) {
  try {
    const { taskid } = await request.json();

    const records = await base(TABLE_NAME)
      .select({
        filterByFormula: `{taskId} = '${taskid}'`,
        maxRecords: 1,
      })
      .firstPage();

    if (!records || records.length === 0) {
      return NextResponse.json(
        { success: false, message: "Email not found" },
        { status: 404 }
      );
    }

    const record = records[0];
    const storedKey = record.get("key");
    const taskID = record.get("taskId");
    console.log(records[0]);
    const formatedData = {
      description: record.get("description"),
      title: record.get("title"),
      taskId: record.get("taskId"),
      resources: record.get("resources"),
    };
    const formatedData1 = JSON.stringify(formatedData);

    if (taskID === taskid) {
      return NextResponse.json({ success: true, formatedData });
    } else {
      return NextResponse.json(
        { success: false, message: "Key does not match" },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error("Error in POST /login:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
