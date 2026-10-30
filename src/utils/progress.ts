import { ItemId, RoundNumber, RoundSummary, TurnRecord } from '../types';
import { getTurnResult } from './feedbackEngine';

/**
 * Practice records without personal information.
 * - Each phone gets a random practice code (e.g. "Blue Fox 27"). No name, no login.
 *   Students write "name – code" on paper for the teacher; the app never sees the name.
 * - The last results stay on this phone (localStorage) for "better than last time".
 * - If VITE_GOOGLE_SCRIPT_URL is set, each finished round is also sent to the teacher's Google Sheet.
 */

const CODE_KEY = 'foundit.studentCode';
const HISTORY_KEY = 'foundit.history';
const MAX_HISTORY = 60;

const COLORS = ['Blue', 'Green', 'Red', 'Yellow', 'Purple', 'Orange', 'Pink', 'Gray'];
const ANIMALS = ['Fox', 'Panda', 'Tiger', 'Rabbit', 'Koala', 'Otter', 'Whale', 'Owl', 'Penguin', 'Dolphin', 'Turtle', 'Lion'];

let memoryCode: string | null = null;
let memoryHistory: HistoryEntry[] = [];

export interface HistoryEntry {
  date: string; // YYYY-MM-DD
  item: ItemId;
  round: RoundNumber;
  summary: RoundSummary;
}

function randomInt(max: number): number {
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    return crypto.getRandomValues(new Uint32Array(1))[0] % max;
  }
  return Math.floor(Math.random() * max);
}

function readStorage(key: string): string | null {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function writeStorage(key: string, value: string): void {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // Storage blocked (private mode): keep it in memory for this visit only
  }
}

export function todayString(): string {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export function getStudentCode(): string {
  const saved = readStorage(CODE_KEY);
  if (saved) return saved;
  if (!memoryCode) {
    memoryCode = `${COLORS[randomInt(COLORS.length)]} ${ANIMALS[randomInt(ANIMALS.length)]} ${10 + randomInt(90)}`;
  }
  writeStorage(CODE_KEY, memoryCode);
  return memoryCode;
}

function loadHistory(): HistoryEntry[] {
  const raw = readStorage(HISTORY_KEY);
  if (!raw) return memoryHistory;
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : memoryHistory;
  } catch {
    return memoryHistory;
  }
}

/** The most recent earlier result for the same item and round on this phone */
export function getLastResult(item: ItemId, round: RoundNumber): HistoryEntry | undefined {
  const history = loadHistory();
  for (let i = history.length - 1; i >= 0; i--) {
    if (history[i].item === item && history[i].round === round) return history[i];
  }
  return undefined;
}

export function saveResult(entry: HistoryEntry): void {
  const history = [...loadHistory(), entry].slice(-MAX_HISTORY);
  memoryHistory = history;
  writeStorage(HISTORY_KEY, JSON.stringify(history));
}

const RESULT_LABEL = { first_try: '✓', with_help: '💪', skipped: '↷' } as const;

/**
 * Sends one finished round to the teacher's Google Sheet (Apps Script web app).
 * Does nothing when no URL is configured. Never blocks or breaks the app.
 */
export function sendToTeacherSheet(params: {
  code: string;
  item: ItemId;
  round: RoundNumber;
  records: TurnRecord[];
  summary: RoundSummary;
  stars: number;
}): void {
  const url = import.meta.env.VITE_GOOGLE_SCRIPT_URL as string | undefined;
  if (!url) return;

  const row = {
    timestamp: new Date().toISOString(),
    student_code: params.code,
    item: params.item,
    round: params.round,
    s1: '', s2: '', s3: '', s4: '', s5: '',
    first_try: params.summary.firstTry,
    with_help: params.summary.withHelp,
    skipped: params.summary.skipped,
    total_failed_tries: params.records.reduce((sum, r) => sum + r.tries, 0),
    stars: params.stars,
  };
  params.records.forEach((r, i) => {
    const key = `s${i + 1}` as 's1' | 's2' | 's3' | 's4' | 's5';
    if (key in row) row[key] = RESULT_LABEL[getTurnResult(r)];
  });

  try {
    // text/plain avoids a CORS preflight; Apps Script reads e.postData.contents
    fetch(url, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(row),
    }).catch(() => {});
  } catch {
    // ignore
  }
}

/** Star rules (Section 6): ⭐⭐⭐ no skips · ⭐⭐ 1–2 skips · ⭐ finished */
export function countStars(skipped: number): number {
  if (skipped === 0) return 3;
  if (skipped <= 2) return 2;
  return 1;
}
