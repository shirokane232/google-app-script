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
    const obj = { _row_index: i };
    for (let j = 0; j < headers.length; j++) {
      obj[headers[j]] = row[j];
    }
    result.push(obj);
  }
  return result;
}

function updateForRecord(sheetName, index, obj) {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = spreadsheet.getSheetByName(sheetName);
  if (!sheet) {
    return false;
  }
  const range = sheet.getDataRange();
  const values = range.getValues();
  if (values.length <= 1) {
    return false;
  }
  const headers = values[0];
  const rowToUpdate = index + 2;
  if (rowToUpdate > values.length) {
    return false;
  }
  const updatedRow = [];
  for (let j = 0; j < headers.length; j++) {
    const header = headers[j];
    updatedRow[j] = obj.hasOwnProperty(header)
      ? obj[header]
      : values[rowToUpdate - 1][j];
  }

  sheet.getRange(rowToUpdate, 1, 1, headers.length).setValues([updatedRow]);
  return true;
}

function removeRecord(sheetName, indexes) {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = spreadsheet.getSheetByName(sheetName);
  if (!sheet) {
    return false;
  }
  if (!indexes || indexes.length === 0) {
    return false;
  }
  const sortedIndexes = indexes.slice().sort((a, b) => b - a);
  const lastRow = sheet.getLastRow();
  for (const index of sortedIndexes) {
    const rowToDelete = index + 2;
    if (rowToDelete > 1 && rowToDelete <= lastRow) {
      sheet.deleteRow(rowToDelete);
    } else {
    }
  }
  return true;
}

function insertRowAt(sheetName, index, obj) {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = spreadsheet.getSheetByName(sheetName);
  if (!sheet) {
    return false;
  }
  const headersRange = sheet.getRange(1, 1, 1, sheet.getLastColumn());
  const headers = headersRange.getValues()[0];
  if (headers.length === 0) {
    return false;
  }
  const rowToInsert = index + 2;
  const newRow = headers.map((header) =>
    obj[header] !== undefined ? obj[header] : ""
  );
  sheet.insertRowBefore(rowToInsert);
  sheet.getRange(rowToInsert, 1, 1, newRow.length).setValues([newRow]);
  return true;
}
