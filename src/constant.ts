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
