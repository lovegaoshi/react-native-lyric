import type { LrcLine } from "../../constant";
import getRandomString from "../getRandomString";
import parse from "./parseHelper";

const ParagraphRegex = /<p\b([^>]*)>([\s\S]*?)<\/p>/g;
const SegmentRegex = /<s\b([^>]*)>([\s\S]*?)<\/s>/g;
const AttributeRegex = /(\w+)="([^"]*)"/g;
const TagRegex = /<[^>]+>/g;

const decodeXml = (text: string) =>
  text
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&");

const parseAttributes = (attributeString: string) =>
  Object.fromEntries(
    Array.from(attributeString.matchAll(AttributeRegex), ([, key, value]) => [
      key,
      value,
    ]),
  );

export default (lrc: string, showUnformatted = true): LrcLine[] => {
  const lrcLineList: LrcLine[] = [];
  const unformattedLrc: string[] = [];
  const paragraphs = Array.from(lrc.matchAll(ParagraphRegex));

  if (paragraphs.length === 0) {
    unformattedLrc.push(...lrc.split("\n"));
    return parse(lrcLineList, unformattedLrc, showUnformatted);
  }

  for (const [paragraphIndex, [, attributeString, innerContent]] of paragraphs.entries()) {
    const attributes = parseAttributes(attributeString);
    const millisecond = Number(attributes.t);
    const duration = attributes.d ? Number(attributes.d) : undefined;
    const nextParagraph = paragraphs[paragraphIndex + 1];
    const nextParagraphMillisecond = nextParagraph
      ? Number(parseAttributes(nextParagraph[1]).t)
      : undefined;

    if (Number.isNaN(millisecond)) {
      continue;
    }

    const karaokeSegments = Array.from(innerContent.matchAll(SegmentRegex));
    if (karaokeSegments.length > 0) {
      const karaokeLines = karaokeSegments.map((segment, index) => {
        const segmentAttributes = parseAttributes(segment[1]);
        const start = Number(segmentAttributes.t ?? 0);
        const nextSegment = karaokeSegments[index + 1];
        const nextStart = nextSegment
          ? Number(parseAttributes(nextSegment[1]).t ?? 0)
          : undefined;
        const text = decodeXml(segment[2].replace(TagRegex, ""));

        return {
          start: start + millisecond,
          duration:
            nextStart !== undefined
              ? Math.max(nextStart - start, 0)
              : Math.max(
                  (nextParagraphMillisecond ?? millisecond + (duration ?? start)) -
                    millisecond -
                    start,
                  0,
                ),
          content: text,
        };
      });

      lrcLineList.push({
        id: getRandomString(),
        millisecond,
        duration,
        content: karaokeLines.reduce((acc, curr) => acc + curr.content, ""),
        karaokeLines,
      });
      continue;
    }

    const content = decodeXml(innerContent.replace(TagRegex, "").trim());
    if (!content) continue;

    lrcLineList.push({
      id: getRandomString(),
      millisecond,
      duration,
      content,
    });
  }

  return parse(lrcLineList, unformattedLrc, showUnformatted);
};
