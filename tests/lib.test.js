import { describe, expect, it } from "vitest";
import { indexSources, parseAnswer, splitCitations } from "../src/lib/answer.js";
import { parseFrame } from "../src/lib/sse.js";

describe("splitCitations", () => {
  it("splits text and adjacent markers in order", () => {
    expect(splitCitations("A fact [C1][C3]."))
      .toEqual([{ type: "text", text: "A fact " }, { type: "cite", key: "C1" }, { type: "cite", key: "C3" }, { type: "text", text: "." }]);
  });
  it("leaves text without markers alone", () => {
    expect(splitCitations("plain")).toEqual([{ type: "text", text: "plain" }]);
  });
});

describe("bold", () => {
  it("renders **text** as a bold part, not literal asterisks", () => {
    expect(splitCitations("**GOVERN, MAP, MEASURE,** and more"))
      .toEqual([{ type: "bold", parts: [{ type: "text", text: "GOVERN, MAP, MEASURE," }] }, { type: "text", text: " and more" }]);
  });
  it("keeps a citation inside bold", () => {
    expect(splitCitations("**GOVERN [C1]**")[0].parts.map((p) => p.type)).toEqual(["text", "cite"]);
  });
  it("hides an unclosed ** while streaming", () => {
    expect(splitCitations("The **GOV")).toEqual([{ type: "text", text: "The GOV" }]);
  });
});

describe("parseAnswer", () => {
  it("groups bullets into one list between paragraphs", () => {
    const blocks = parseAnswer("Lead-in:\n- one [C1].\n- two [C2].\nTail.");
    expect(blocks.map((b) => b.type)).toEqual(["p", "ul", "p"]);
    expect(blocks[1].items).toHaveLength(2);
  });
  it("never produces HTML: markup stays literal text", () => {
    const [p] = parseAnswer("<img src=x onerror=alert(1)> [C1]");
    expect(p.parts[0]).toEqual({ type: "text", text: "<img src=x onerror=alert(1)> " });
  });
});

describe("indexSources", () => {
  it("maps every key of a merged source to the same entry", () => {
    const s = { keys: ["C1", "C2"], label: "L", url: "u", kind: "prose" };
    const idx = indexSources([s]);
    expect(idx.C1).toBe(s);
    expect(idx.C2).toBe(s);
  });
});

describe("parseFrame", () => {
  it("parses event and JSON data", () => {
    expect(parseFrame('event: token\ndata: {"text":"hi"}')).toEqual(["token", { text: "hi" }]);
  });
  it("ignores incomplete frames", () => {
    expect(parseFrame("event: token")).toBeNull();
  });
});
