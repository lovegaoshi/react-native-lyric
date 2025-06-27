import parseQrc from "../../src/util/parser/parseQrc";
import QQQRC from "../qrc";

test("parse qrc", () => {
  const content = parseQrc(QQQRC);
  expect(content[0].karaokeLines?.length ?? 0).toBeGreaterThan(0);
});
