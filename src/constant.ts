export const AUTO_SCROLL_AFTER_USER_SCROLL = 6000;

interface KaraokeLine {
  content: string;
  start: number;
  duration: number;
}

export interface LrcLine {
  id: string;
  millisecond: number;
  content: string;
  duration?: number;
  karaokeLines?: KaraokeLine[];
}

export enum KaraokeMode {
  NoKaraoke = "no_karaoke",
  FakeKaraoke = "fake_karaoke",
  OnlyRealKaraoke = "real_karaoke",
  Karaoke = "karaoke",
}