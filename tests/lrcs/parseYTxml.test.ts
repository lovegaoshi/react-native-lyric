import parseYTxml from "../../src/util/parser/parseYTxml";
import YTXML from "../ytxml";

test("parse Yrc", () => {
  const content = parseYTxml(YTXML);
  console.log(JSON.stringify(content[1]));
  expect(content[0].karaokeLines?.length ?? 0).toBeGreaterThan(0);
});
