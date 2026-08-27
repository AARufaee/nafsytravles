import { servePage } from "@/lib/serve-static-page";

export async function GET() {
  return servePage("request.html");
}
