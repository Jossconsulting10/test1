function doGet() {
  return HtmlService
    .createHtmlOutputFromFile("Index")
    .setTitle("JOSS CEO Tracker")
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function setupSheets() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();

  createSheet_(ss, "Clients", [
    "Timestamp","Full Name","Email","Phone / Handle","Business Name",
    "Business Type","State","Business Address","Service","Amount Paid",
    "Status","Follow-Up Date","Source","Notes","Internal Notes"
  ]);

  createSheet_(ss, "Sales Tracker", [
    "Timestamp","Offer","Price","Client","Date"
  ]);

  createSheet_(ss, "Daily Tracker", [
    "Timestamp","Business","Date","Clock In","Clock Out","Hours Worked",
    "Reels Created","DMs Sent","Follow-Ups","New Leads","Sales Closed",
    "Revenue","Energy Level","Notes","Sales Detail"
  ]);

  createSheet_(ss, "Tasks", [
    "Timestamp","Task","Group","Priority","Status","Action"
  ]);

  createSheet_(ss, "Weekly Review", [
    "Timestamp","Section","Question","Answer"
  ]);

  createSheet_(ss, "Business Goals", [
    "Timestamp","Goal Type","Goal Name","Target Amount","Current Amount","Deadline","Status","Notes"
  ]);

  createSheet_(ss, "Expenses", [
    "Timestamp","Date","Category","Vendor","Description","Amount","Payment Method","Notes"
  ]);

  createSheet_(ss, "Lead Pipeline", [
    "Timestamp","Full Name","Contact","Source","Interest","Stage","Follow-Up Date","Notes"
  ]);

  createSheet_(ss, "Content Tracker", [
    "Timestamp","Date","Platform","Content Type","Topic","CTA","Status","Views","Leads","Sales","Notes"
  ]);

  createSheet_(ss, "Monthly Review", [
    "Timestamp","Month","Revenue","Expenses","Profit","Best Offer","Best Platform","Biggest Lesson","Next Month Focus"
  ]);

  return "SETUP COMPLETE";
}

function saveToSheet(data) {
  try {
    var sheetName = data.sheet;
    delete data.sheet;

    if (!sheetName) {
      return "ERROR: Missing sheet name";
    }

    return appendToSheet_(sheetName, data);

  } catch (error) {
    return "ERROR: " + error.message;
  }
}

function appendToSheet_(sheetName, data) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(sheetName);

  if (!sheet) {
    sheet = ss.insertSheet(sheetName);
  }

  var keys = Object.keys(data);

  if (keys.length === 0) {
    return "NO DATA RECEIVED";
  }

  if (sheet.getLastRow() === 0 || sheet.getLastColumn() === 0) {
    sheet.appendRow(keys);
    styleHeader_(sheet, keys.length);
  }

  var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];

  keys.forEach(function(key) {
    if (headers.indexOf(key) === -1) {
      sheet.getRange(1, sheet.getLastColumn() + 1).setValue(key);
      headers.push(key);
    }
  });

  var row = headers.map(function(header) {
    return data[header] !== undefined ? data[header] : "";
  });

  sheet.appendRow(row);
  SpreadsheetApp.flush();

  return "SAVED TO " + sheetName;
}

function createSheet_(ss, name, headers) {
  var sheet = ss.getSheetByName(name);

  if (!sheet) {
    sheet = ss.insertSheet(name);
  }

  if (sheet.getLastRow() === 0 || sheet.getLastColumn() === 0) {
    sheet.appendRow(headers);
    styleHeader_(sheet, headers.length);
  }
}

function styleHeader_(sheet, columns) {
  sheet.getRange(1, 1, 1, columns)
    .setBackground("#141414")
    .setFontColor("#ffffff")
    .setFontWeight("bold")
    .setHorizontalAlignment("center");

  sheet.setFrozenRows(1);
  sheet.autoResizeColumns(1, columns);
}

function testSaveClient() {
  return appendToSheet_("Clients", {
    "Timestamp": new Date(),
    "Full Name": "Test Client",
    "Email": "test@email.com",
    "Phone / Handle": "123456",
    "Business Name": "Test LLC",
    "Business Type": "LLC",
    "State": "FL",
    "Business Address": "Test Address",
    "Service": "Test Service",
    "Amount Paid": "1",
    "Status": "Lead",
    "Follow-Up Date": "",
    "Source": "Test",
    "Notes": "Test row",
    "Internal Notes": "Backend working"
  });
}
