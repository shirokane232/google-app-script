function readRows(sheetName) {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = spreadsheet.getSheetByName(sheetName);
  if (!sheet) {
    return [];
  }

  const range = sheet.getDataRange();
  const values = range.getValues();
  if (values.length <= 1) {
    return [];
  }
  const headers = values[0];
  const dataRows = values.slice(1);
  const result = [];
  for (let i = 0; i < dataRows.length; i++) {
    const row = dataRows[i];
    const obj = {};
    for (let j = 0; j < headers.length; j++) {
      obj[headers[j]] = row[j];
    }
    result.push(obj);
  }
  return result;
}
