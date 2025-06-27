import parser from "../../src/util/parser/parser";
import NEYRC from "../yrc";
import KGKRC from "../krc";
import QQQRC from "../qrc";
import LRC from "../lrc";

test("parser", () => {
  expect(parser(NEYRC)[0].karaokeLines?.length ?? 0).toBeGreaterThan(0);
  expect(parser(KGKRC)[0].karaokeLines?.length ?? 0).toBeGreaterThan(0);
  expect(parser(QQQRC)[0].karaokeLines?.length ?? 0).toBeGreaterThan(0);
  expect(parser(LRC)[0].karaokeLines?.length ?? 0).toBe(0);
});
