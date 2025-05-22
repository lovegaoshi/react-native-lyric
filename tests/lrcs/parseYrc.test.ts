import parseYrc from "../../src/util/parser/parseYrc";
import NEYRC from "../yrc";

test("parse Yrc", () => {
  const content = parseYrc(NEYRC);
  expect(content[0].karaokeLines?.length ?? 0).toBeGreaterThan(0);
});
