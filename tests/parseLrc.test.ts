import parseLrc from "../src/util/parser/parseLrc";
import Lrc from "./lrc";

test("parse krc", () => {
  const content = parseLrc(Lrc);
  expect(content).not.toBe(undefined);
});
