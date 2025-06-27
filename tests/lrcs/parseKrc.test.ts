import parseKrc from "../../src/util/parser/parseKrc";
import KGKRC from "../krc";

test("parse krc", () => {
  const content = parseKrc(KGKRC);
  expect(content[0].karaokeLines?.length ?? 0).toBeGreaterThan(0);
});
