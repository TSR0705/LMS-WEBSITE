import { createClient } from "@sanity/client";

const client = createClient({
  projectId: "xnh2ot6e",
  dataset: "production",
  useCdn: false,
  apiVersion: "2024-01-01",
});

async function main() {
  const query = `*[_type == "lesson" && defined(content)]`;
  const lessons = await client.fetch(query);
  
  for (const lesson of lessons) {
    console.log("Found lesson:", lesson.title);
    const hasH1 = lesson.content.some((block) => block.style === "h1" || block.style === "h2" || block.style === "h3");
    console.log("Has heading styles?", hasH1);
  }
}

main().catch(console.error);
