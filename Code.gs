// JOSS CONSULTING GROUP — CEO TRACKER BACKEND
// Use this full code in Code.gs

function doGet() {
  return HtmlService
    .createHtmlOutputFromFile("Index")
    .setTitle("JOSS Consulting Group — CEO Tracker")
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function setupSheets() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();

  createSheet_(ss, "Clients", [
    "Timestamp", "Full Name", "Email", "Phone / Handle", "Business Name",
    "Business Type", "State", "Business Address", "Service", "Amount Paid",
    "Status", "Follow-Up Date", "Source", "Notes", "Internal Notes"
  ]);

  createSheet_(ss, "Sales Tracker", [
    "Timestamp", "Offer", "Price", "Client", "Date"
  ]);

  createSheet_(ss, "Daily Tracker", [
    "Timestamp", "Business", "Date", "Clock In", "Clock Out", "Hours Worked",
    "Reels Created", "DMs Sent", "Follow-Ups", "New Leads", "Sales Closed",
    "Revenue", "Energy Level", "Notes", "Sales Detail"
  ]);

  createSheet_(ss, "Tasks", [
    "Timestamp", "Task", "Group", "Priority", "Status", "Action"
  ]);

  createSheet_(ss, "Weekly Review", [
    "Timestamp", "Section", "Question", "Answer"
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

  } catch (err) {
    return "ERROR: " + err.message;
  }
}

function saveTaskToSheet(taskData) {
  return appendToSheet_("Tasks", {
    "Timestamp": new Date(),
    "Task": taskData.task || "",
    "Group": taskData.group || "",
    "Priority": taskData.priority || "",
    "Status": taskData.status || "",
    "Action": taskData.action || ""
  });
}

function saveWeeklyReviewToSheet(reviewData) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("Weekly Review");

  if (!sheet) {
    sheet = ss.insertSheet("Weekly Review");
    sheet.appendRow(["Timestamp", "Section", "Question", "Answer"]);
    styleHeader_(sheet, 4);
  }

  reviewData.forEach(function(item) {
    sheet.appendRow([
      new Date(),
      item.section || "",
      item.question || "",
      item.answer || ""
    ]);
  });

  SpreadsheetApp.flush();
  return "WEEKLY REVIEW SAVED";
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

  if (sheet.getLastRow() === 0) {
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
    "Phone / Handle": "555-000-0000",
    "Business Name": "Test Business LLC",
    "Business Type": "LLC",
    "State": "Florida",
    "Business Address": "Test Address",
    "Service": "Test Service",
    "Amount Paid": "1",
    "Status": "Lead",
    "Follow-Up Date": "",
    "Source": "Test",
    "Notes": "This is a test row.",
    "Internal Notes": "Testing backend."
  });
}
