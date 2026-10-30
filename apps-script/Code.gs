/**
 * Found It! — teacher progress sheet (Google Apps Script)
 *
 * 1. Make a Google Sheet. [Extensions] → [Apps Script], paste this file, save.
 * 2. [Deploy] → [New deployment] → type: Web app
 *    Execute as: Me / Who has access: Anyone → Deploy, then authorize.
 * 3. Copy the web app URL (ends with /exec) into VITE_GOOGLE_SCRIPT_URL.
 *
 * One row per finished round. No names: students are known only by a random practice code.
 * The sheet itself does not need to be shared.
 */

const SHEET_NAME = 'Progress';
const HEADERS = [
  'timestamp',
  'student_code',
  'item',
  'round',
  's1',
  's2',
  's3',
  's4',
  's5',
  'first_try',
  'with_help',
  'skipped',
  'total_failed_tries',
  'stars',
];

function getSheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
  }
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const data = JSON.parse(e.postData.contents);
    const row = HEADERS.map(function (key) {
      if (key === 'timestamp') return new Date();
      const value = data[key];
      return value === undefined || value === null ? '' : value;
    });
    getSheet_().appendRow(row);
    return ContentService.createTextOutput(JSON.stringify({ ok: true })).setMimeType(
      ContentService.MimeType.JSON
    );
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ ok: false, error: String(err) })).setMimeType(
      ContentService.MimeType.JSON
    );
  } finally {
    lock.releaseLock();
  }
}

function doGet() {
  return ContentService.createTextOutput('Found It! progress sheet is running.');
}
