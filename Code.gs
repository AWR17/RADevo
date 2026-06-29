// 

/**************************************************************
 * CONFIG
 **************************************************************/
const CONFIG = {
  SHEET_ID:   "1q_UpbIkzrt6ErM5_ogjQDD-LEnL9DWUgJ42UWvIlvPE",
  SHEET_NAME: "Scores",
  PROGRESS_SHEET:   "StudentProgress",
  QUESTIONS_SHEET:  "Questions",
  QUIZ_REG_SHEET:   "QuizRegistry",
  CLASSES_SHEET:    "Classes",

  COLORS: {
    LATEST:    "#c6efce",
    OLDER:     "#ffffff",
    SUBMITTED: "#fff2cc"
  },

  TEACHERS: [
    "aradford.dfa@affinitylp.co.uk",
    "sgangar.dfa@affinitylp.co.uk"
  ],

  CLASSES: [
    "Test Year | Test Subject – Test Class",
    "Year 10 | IT – 10L7/It",
    "Year 10 | IT – 10M10/It",
    "Year 10 | Computer Science – 10K7/Cm",
    "Year 11 | IT – 11L9/It",
    "Year 11 | IT – 11M8/It",
    "Year 11 | Computer Science – 11L8/Cm",
    "Year 11 | Computer Science – 11K7/Cm",
    "Year 12 | IT – 12E/I11",
    "Year 12 | IT – 12C/I11",
    "Year 12 | Computer Science – 12D/Cm1",
    "Year 13 | IT – 13B/I11",
    "Year 13 | IT – 12C/I11",
    "Year 13 | Computer Science – 13B/Cm1"
  ],

  QUIZZES: [
    {
      key:      "unit1",
      name:     "AAQ IT Unit 1 – Information Technology Systems",
      file:     "Quiz",
      qFunc:    "getQuestions_AAQ_Unit1_IT",
      desc:     "Hardware, software, networks, cloud computing, data protection & legislation"
    },
    {
      key:      "cyber",
      name:     "AAQ IT Unit 2 – Cyber Security & Incident Management",
      file:     "Quiz",
      qFunc:    "getQuestions_AAQ_Unit2_Cyber",
      desc:     "Threats, security controls, incident response & UK legislation"
    },
    {
      key:      "gcse_systems",
      name:     "OCR GCSE CS J277 – 1.1 Systems Architecture",
      file:     "Quiz",
      qFunc:    "getQuestions_GCSE_CS_1_1",
      desc:     "CPU components, registers, FDE cycle, Von Neumann architecture & embedded systems"
    },
    {
      key:      "hci",
      name:     "OCR Cambridge National IT R050 – Topic Area 2: HCI in Everyday Life",
      file:     "Quiz",
      qFunc:    "getQuestions_CamNat_IT_TA2_HCI",
      desc:     "HCI application areas, hardware & software considerations, user interaction methods"
    },
    {
      key:      "legalethical",
      name:     "OCR A Level Computer Science H446 – 1.5: Legal, Moral, Cultural and Ethical Issues",
      file:     "Quiz",
      qFunc:    "getQuestions_ALevel_CS_1_5",
      desc:     "Computing legislation, automated decisions, AI ethics, environment, censorship & cultural issues"
    }
  ],

  QUESTIONS_PER_ACTIVITY: 10,  // how many to serve from the bank each session

  SCORE_HEADERS: [
    "Timestamp", "Student Name", "Email", "Class",
    "Quiz", "Activity", "Correct", "Total", "Percentage", "Status"
  ],
  PROGRESS_HEADERS: [
    "Timestamp", "Email", "Quiz", "Activity", "QuestionID", "Correct"
  ]
};



/**************************************************************
 * GET CLASS->QUIZ MAP for dashboard
 * Returns { "Year 10 | IT – 10L7/It": ["hci"], ... }
 * Built from the same SCHOOL_CONFIG that Home.html uses,
 * so the dashboard always matches what students can access.
 * Class key format matches what Home.html stores in sessionStorage:
 * year + " | " + subject + " – " + classCode
 **************************************************************/
function getClassQuizMap() {
  // SCHOOL_CONFIG mirrors Home.html — edit both together if classes change
  var SCHOOL_CONFIG = [
    {
      year: "Test Year",
      subjects: [
        { subject: "Test Subject",
          classes: [
            { cls: "Test Class", quizKeys: ["cyber"] }
          ]
        }
      ]
    },
    {
      year: "Year 10",
      subjects: [
        { subject: "Information Technology (OCR Cambridge National)",
          classes: [
            { cls: "10L7/It",  quizKeys: ["hci"] },
            { cls: "10M10/It", quizKeys: ["hci"] }
          ]
        },
        { subject: "Computer Science (OCR GCSE)",
          classes: [
            { cls: "10K7/Cm", quizKeys: ["gcse_systems"] }
          ]
        }
      ]
    },
    {
      year: "Year 11",
      subjects: [
        { subject: "Information Technology (OCR Cambridge National)",
          classes: [
            { cls: "11L9/It", quizKeys: ["hci"] },
            { cls: "11M8/It", quizKeys: ["hci"] }
          ]
        },
        { subject: "Computer Science (OCR GCSE)",
          classes: [
            { cls: "11L8/Cm", quizKeys: ["gcse_systems"] },
            { cls: "11K7/Cm", quizKeys: ["gcse_systems"] }
          ]
        }
      ]
    },
    {
      year: "Year 12",
      subjects: [
        { subject: "Information Technology (BTEC AAQ)",
          classes: [
            { cls: "12E/I11", quizKeys: ["unit1", "cyber"] },
            { cls: "12C/I11", quizKeys: ["unit1", "cyber"] }
          ]
        },
        { subject: "Computer Science (OCR A Level)",
          classes: [
            { cls: "12D/Cm1", quizKeys: ["legalethical"] }
          ]
        }
      ]
    },
    {
      year: "Year 13",
      subjects: [
        { subject: "Information Technology (BTEC AAQ)",
          classes: [
            { cls: "13B/I11", quizKeys: ["unit1", "cyber"] },
            { cls: "12C/I11", quizKeys: ["unit1", "cyber"] }
          ]
        },
        { subject: "Computer Science (OCR A Level)",
          classes: [
            { cls: "13B/Cm1", quizKeys: ["legalethical"] }
          ]
        }
      ]
    }
  ];

  // Build map: full class label -> array of allowed quiz NAMES
  var map = {};
  SCHOOL_CONFIG.forEach(function(yearObj) {
    yearObj.subjects.forEach(function(subObj) {
      subObj.classes.forEach(function(clsObj) {
        // Build the same label Home.html stores:
        // year + " | " + subject + " – " + classCode
        var label = yearObj.year + " | " + subObj.subject + " – " + clsObj.cls;
        // Convert quiz keys to full quiz names
        var quizNames = clsObj.quizKeys.map(function(key) {
          var q = CONFIG.QUIZZES.find(function(q){ return q.key === key; });
          return q ? q.name : null;
        }).filter(Boolean);
        map[label] = quizNames;
      });
    });
  });

  return map;
}

/**************************************************************
 * TEST FUNCTION — run this directly in the Apps Script editor
 * Click the > Run button with this function selected.
 * Check the Execution log below for results.
 **************************************************************/
function testDashboardFromBrowser(callerEmail) {
  // This can be called directly from the browser console via:
  // google.script.run.withSuccessHandler(console.log).testDashboardFromBrowser(USER_EMAIL)
  try {
    var email = (callerEmail || "").toLowerCase().trim();
    return {
      receivedEmail: email,
      teachersList:  CONFIG.TEACHERS,
      isTeacher:     isTeacher_(email),
      sheetId:       CONFIG.SHEET_ID,
      sheetTest:     (function() {
        try {
          var ss = SpreadsheetApp.openById(CONFIG.SHEET_ID);
          var sh = ss.getSheetByName(CONFIG.SHEET_NAME);
          return sh ? ("Sheet found, rows: " + sh.getLastRow()) : "Sheet tab not found";
        } catch(e) { return "Sheet error: " + e.message; }
      })()
    };
  } catch(e) {
    return { error: e.message };
  }
}

function testDashboard() {
  console.log("=== testDashboard ===");
  console.log("SHEET_ID: " + CONFIG.SHEET_ID);
  console.log("TEACHERS: " + JSON.stringify(CONFIG.TEACHERS));

  // Test sheet access
  try {
    var ss = SpreadsheetApp.openById(CONFIG.SHEET_ID);
    console.log("[OK] Sheet opened: " + ss.getName());

    var sheet = ss.getSheetByName(CONFIG.SHEET_NAME);
    if (sheet) {
      console.log("[OK] Scores tab found. Rows: " + sheet.getLastRow() + ", Cols: " + sheet.getLastColumn());
    } else {
      console.log("[X] Scores tab NOT found — will be created on first save");
    }
  } catch(e) {
    console.log("[X] Sheet error: " + e.message);
  }

  // Test getDashboardData with your email
  var testEmail = CONFIG.TEACHERS[0];
  console.log("Testing getDashboardData with: " + testEmail);
  var result = getDashboardData(testEmail);
  console.log("Result type: " + typeof result);
  if (result && result.error) {
    console.log("[X] Error: " + result.error);
  } else if (result && result.rows) {
    console.log("[OK] Rows returned: " + result.rows.length);
    if (result.rows.length > 0) {
      console.log("First row: " + JSON.stringify(result.rows[0]));
    }
  } else {
    console.log("[X] Unexpected result: " + JSON.stringify(result));
  }
}

/**************************************************************
 * WEB APP ENTRY POINT
 **************************************************************/
function doGet(e) {
  e = e || {};
  e.parameter = e.parameter || {};
  const email = getUserEmail_();

  if (!email) {
    return HtmlService.createHtmlOutput(
      "<p style='font-family:sans-serif;padding:40px;color:#b91c1c;'>" +
      "[!] Please open this page while signed in to your school Google account.</p>"
    );
  }

  // ── LOGIN GATE 
  // Every route goes through login first UNLESS ?confirmed=1 is present.
  // After login the student/teacher is sent back to their intended destination
  // with ?confirmed=1 appended so we know they've passed through login.
  var confirmed = e.parameter.confirmed === "1";
  var baseUrl   = ScriptApp.getService().getUrl();

  if (!confirmed) {
    // Always land on Home after login — teachers can navigate to dashboard from there.
    // Only preserve quiz parameter so direct quiz links still work after login.
    var dest = baseUrl + "?confirmed=1";
    if (e.parameter.quiz)  dest += "&quiz=" + encodeURIComponent(e.parameter.quiz);

    const login = HtmlService.createTemplateFromFile("Login");
    login.userEmail = email;
    login.userName  = getUserName_(email);
    login.baseUrl   = dest;
    return login.evaluate()
      .setTitle("Sign In – Computer Science & IT Revision")
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
      .addMetaTag("viewport", "width=device-width, initial-scale=1");
  }

  // After login (confirmed=1 with no specific view), route by role
  // go=portal overrides teacher redirect — allows teachers to access Home/Quiz as student
  if (confirmed && !e.parameter.view && !e.parameter.quiz && e.parameter.go !== "portal") {
    if (isTeacher_(email)) {
      // Teachers go straight to dashboard
      const teacherDash = HtmlService.createTemplateFromFile("Dashboard");
      teacherDash.userEmail = email;
      teacherDash.userName  = getUserName_(email);
      return teacherDash.evaluate()
        .setTitle("Teacher Dashboard")
        .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
        .addMetaTag("viewport", "width=device-width, initial-scale=1");
    }
    // Students go to StudentDashboard
    const sDash = HtmlService.createTemplateFromFile("StudentDashboard");
    sDash.userEmail = email;
    sDash.userName  = getUserName_(email);
    return sDash.evaluate()
      .setTitle("RADevo")
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
      .addMetaTag("viewport", "width=device-width, initial-scale=1");
  }

  // Dashboard routes — require via=home or via=refresh
  var via = e.parameter.via;
  var validVia = (via === "home" || via === "refresh");

  if (e.parameter.view === "dashboard" && validVia) {
    const dash = HtmlService.createTemplateFromFile("Dashboard");
    dash.userEmail = email;
    dash.userName  = getUserName_(email);
    return dash.evaluate()
      .setTitle("Teacher Dashboard")
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
      .addMetaTag("viewport", "width=device-width, initial-scale=1");
  }

  if (e.parameter.view === "homework" && validVia) {
    const hw = HtmlService.createTemplateFromFile("Homework");
    hw.userEmail = email;
    hw.userName  = getUserName_(email);
    return hw.evaluate()
      .setTitle("Homework – Teacher Dashboard")
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
      .addMetaTag("viewport", "width=device-width, initial-scale=1");
  }

  // Teacher preview of student dashboard
  if (e.parameter.view === "student" && validVia && isTeacher_(email)) {
    const sd = HtmlService.createTemplateFromFile("StudentDashboard");
    sd.userEmail = email;
    sd.userName  = getUserName_(email);
    return sd.evaluate()
      .setTitle("RADevo – Student View")
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
      .addMetaTag("viewport", "width=device-width, initial-scale=1");
  }

  if (e.parameter.view === "assignments" && validVia) {
    const ag = HtmlService.createTemplateFromFile("Assignments");
    ag.userEmail = email;
    ag.userName  = getUserName_(email);
    return ag.evaluate()
      .setTitle("Assignments – Teacher Dashboard")
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
      .addMetaTag("viewport", "width=device-width, initial-scale=1");
  }

  if (e.parameter.view === "management" && validVia) {
    const mg = HtmlService.createTemplateFromFile("Management");
    mg.userEmail = email;
    mg.userName  = getUserName_(email);
    return mg.evaluate()
      .setTitle("Management – Teacher Dashboard")
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
      .addMetaTag("viewport", "width=device-width, initial-scale=1");
  }

  // Quiz route
  const quizKey = e.parameter.quiz || "";

  if (!quizKey) {
    const home = HtmlService.createTemplateFromFile("Home");
    home.userEmail  = email;
    home.userName   = getUserName_(email);
    home.quizzes    = CONFIG.QUIZZES;
    home.classes    = CONFIG.CLASSES;
    home.isTeacher  = isTeacher_(email);
    return home.evaluate()
      .setTitle("IT Revision Quiz Portal")
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
      .addMetaTag("viewport", "width=device-width, initial-scale=1");
  }

  const quiz = CONFIG.QUIZZES.find(q => q.key === quizKey);
  if (!quiz) {
    return HtmlService.createHtmlOutput("<p style='font-family:sans-serif;padding:40px;'>Quiz not found.</p>");
  }

  const template = HtmlService.createTemplateFromFile(quiz.file);
  template.userEmail  = email;
  template.userName   = getUserName_(email);
  template.quizKey    = quiz.key;
  template.quizName   = quiz.name;

  return template.evaluate()
    .setTitle(quiz.name)
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
    .addMetaTag("viewport", "width=device-width, initial-scale=1");
}


/**************************************************************
 * INCLUDE HELPER
 **************************************************************/
function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}


/**************************************************************
 * HELPERS
 **************************************************************/
function getQuizList()    { return CONFIG.QUIZZES; }
function getBaseUrl()     { return ScriptApp.getService().getUrl(); }
function isTeacher_(e)    { return CONFIG.TEACHERS.map(t => t.toLowerCase()).includes(e.toLowerCase()); }
function getUserEmail_() {
  // With executeAs:USER_DEPLOYING, getEffectiveUser returns the deployer's email.
  // With executeAs:USER_ACCESSING, getActiveUser returns the actual user's email.
  // We try both — this function is only reliable in doGet context.
  // For google.script.run calls, callerEmail parameter is used instead.
  var email = "";
  try { email = Session.getActiveUser().getEmail(); } catch(e) {}
  if (!email) {
    try { email = Session.getEffectiveUser().getEmail(); } catch(e) {}
  }
  return email || "";
}

function getEmailFromToken_(userToken) {
  // Validates a user token passed from the client
  // Returns the email if it matches a known user pattern
  if (!userToken) return "";
  var token = userToken.toString().toLowerCase().trim();
  // Basic sanity check — must look like an email
  if (token.indexOf("@") === -1) return "";
  return token;
}
function getUserName_(email) { return email; }
function safePercent_(c, t)  { return t ? Math.round((c / t) * 100) : 0; }


/**************************************************************
 * GET QUESTIONS FOR A QUIZ SESSION
 * Called by Quiz.html on load.
 * Returns 10 randomly selected questions per activity type,
 * weighted toward questions the student previously got wrong.
 **************************************************************/
function getSessionQuestions(quizKey, callerEmail) {
  const email = callerEmail || getUserEmail_();

  // First check sheet-based questions, then fall back to .gs functions
  var sheetBank = getSheetQuestions_(quizKey);
  if (sheetBank) {
    var wrongIds = getWrongQuestionIds_(email, quizKey);
    return {
      quizName: (getAllQuizzes().find(function(q){ return q.key===quizKey; })||{}).name || quizKey,
      fitb:  selectQuestions_(sheetBank.fitb,  CONFIG.QUESTIONS_PER_ACTIVITY, wrongIds),
      match: selectQuestions_(sheetBank.match, CONFIG.QUESTIONS_PER_ACTIVITY, wrongIds),
      mc:    selectQuestions_(sheetBank.mc,    CONFIG.QUESTIONS_PER_ACTIVITY, wrongIds),
      tf:    selectQuestions_(sheetBank.tf,    CONFIG.QUESTIONS_PER_ACTIVITY, wrongIds)
    };
  }

  // Fall back to hardcoded .gs question banks
  const quiz = CONFIG.QUIZZES.find(q => q.key === quizKey);
  if (!quiz || !quiz.qFunc) return null;

  // Call the question bank function dynamically
  const bank = this[quiz.qFunc]();

  // Get this student's wrong question IDs for adaptive weighting
  const gsWrongIds = getWrongQuestionIds_(email, quizKey);

  return {
    quizName: bank.quizName,
    fitb:  selectQuestions_(bank.fitb,  CONFIG.QUESTIONS_PER_ACTIVITY, gsWrongIds),
    match: selectQuestions_(bank.match, CONFIG.QUESTIONS_PER_ACTIVITY, gsWrongIds),
    mc:    selectQuestions_(bank.mc,    CONFIG.QUESTIONS_PER_ACTIVITY, gsWrongIds),
    tf:    selectQuestions_(bank.tf,    CONFIG.QUESTIONS_PER_ACTIVITY, gsWrongIds)
  };
}


/**************************************************************
 * SELECT QUESTIONS with adaptive weighting
 * Wrong questions get 3× chance of being picked.
 **************************************************************/
function selectQuestions_(pool, n, wrongIds) {
  const wrongSet = new Set(wrongIds);
  n = Math.min(n, pool.length);

  // Build weighted pool: wrong answers appear 3 times, correct once
  const weighted = [];
  pool.forEach(q => {
    weighted.push(q);
    if (wrongSet.has(q.id)) {
      weighted.push(q);
      weighted.push(q);
    }
  });

  // Fisher-Yates shuffle
  for (let i = weighted.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [weighted[i], weighted[j]] = [weighted[j], weighted[i]];
  }

  // Pick n unique questions
  const seen = new Set();
  const result = [];
  for (const q of weighted) {
    if (!seen.has(q.id)) {
      seen.add(q.id);
      result.push(q);
      if (result.length === n) break;
    }
  }
  return result;
}


/**************************************************************
 * GET WRONG QUESTION IDs for a student+quiz (for adaptive)
 **************************************************************/
function getWrongQuestionIds_(email, quizKey) {
  try {
    const ss    = SpreadsheetApp.openById(CONFIG.SHEET_ID);
    const sheet = ss.getSheetByName(CONFIG.PROGRESS_SHEET);
    if (!sheet) return [];

    const last = sheet.getLastRow();
    if (last < 2) return [];

    const data = sheet.getRange(2, 1, last - 1, 6).getValues();

    // For each question, find the most recent attempt
    const latestMap = {}; // questionId -> { correct, timestamp }
    data.forEach(r => {
      const ts      = r[0];
      const rowEmail = r[1];
      const rowQuiz  = r[2];
      const qId      = r[4];
      const correct  = r[5];
      if (rowEmail !== email || rowQuiz !== quizKey) return;
      if (!latestMap[qId] || ts > latestMap[qId].ts) {
        latestMap[qId] = { correct, ts };
      }
    });

    // Return IDs where the latest attempt was wrong
    return Object.entries(latestMap)
      .filter(([, v]) => !v.correct)
      .map(([id]) => id);
  } catch(e) {
    return [];
  }
}


/**************************************************************
 * SAVE SCORE (activity-level)
 **************************************************************/
function saveScore(activityName, correct, total, studentClass, quizName, callerEmail) {
  const email = callerEmail || getUserEmail_();
  const sheet = ScoreRepo.getSheet();
  const pct   = safePercent_(correct, total);

  sheet.appendRow([
    new Date(),
    getUserName_(email),
    email,
    studentClass || "Unknown",
    quizName     || "Unknown Quiz",
    activityName,
    correct,
    total,
    pct,
    "LATEST"
  ]);

  SheetService.rehighlight(sheet);
  return { success: true, pct };
}


/**************************************************************
 * SAVE QUESTION RESULTS (per-question, for adaptive difficulty)
 **************************************************************/
function saveQuestionResults(quizKey, activityName, results, callerEmail) {
  // results = [{ id, correct }]
  const email = callerEmail || getUserEmail_();
  const ss    = SpreadsheetApp.openById(CONFIG.SHEET_ID);
  let sheet   = ss.getSheetByName(CONFIG.PROGRESS_SHEET);

  if (!sheet) {
    sheet = ss.insertSheet(CONFIG.PROGRESS_SHEET);
    sheet.appendRow(CONFIG.PROGRESS_HEADERS);
    sheet.getRange(1, 1, 1, CONFIG.PROGRESS_HEADERS.length)
      .setBackground("#14532d").setFontColor("#fff").setFontWeight("bold");
    sheet.setFrozenRows(1);
  }

  const now = new Date();
  const rows = results.map(r => [now, email, quizKey, activityName, r.id, r.correct]);
  if (rows.length) {
    sheet.getRange(sheet.getLastRow() + 1, 1, rows.length, 6).setValues(rows);
  }
  return { success: true };
}


/**************************************************************
 * FINAL SUBMISSION
 **************************************************************/
function markSubmitted(scores, studentClass, quizName, callerEmail) {
  const email = callerEmail || getUserEmail_();
  const sheet = ScoreRepo.getSheet();

  const totals = scores.reduce((a, r) => {
    a.correct += r.correct;
    a.total   += r.total;
    return a;
  }, { correct: 0, total: 0 });

  const pct = safePercent_(totals.correct, totals.total);

  sheet.appendRow([
    new Date(),
    getUserName_(email),
    email,
    studentClass || "Unknown",
    quizName     || "Unknown Quiz",
    "FINAL SUBMISSION",
    totals.correct,
    totals.total,
    pct,
    "SUBMITTED"
  ]);

  SheetService.styleSubmissionRow(sheet);
  SheetService.rehighlight(sheet);
  return { success: true };
}


/**************************************************************
 * GET STUDENT PROGRESS HISTORY (for the History tab)
 **************************************************************/
function getMyProgress(quizKey, callerEmail) {
  const email = callerEmail || getUserEmail_();
  const ss    = SpreadsheetApp.openById(CONFIG.SHEET_ID);

  // Scores sheet — activity-level history
  const scoreSheet = ss.getSheetByName(CONFIG.SHEET_NAME);
  const scores = [];
  if (scoreSheet && scoreSheet.getLastRow() > 1) {
    const data = scoreSheet.getRange(2, 1, scoreSheet.getLastRow() - 1, 10).getValues();
    data.forEach(r => {
      if (r[2] === email && r[4] === quizKey) {  // col C = email, col E = quizKey... wait, col E = quizName
        // Match by quiz name
      }
    });

    // Find quiz name for this key
    const quiz = CONFIG.QUIZZES.find(q => q.key === quizKey);
    const quizName = quiz ? quiz.name : quizKey;

    data.forEach(r => {
      if (r[2] === email && r[4] === quizName) {
        scores.push({
          timestamp: r[0] ? new Date(r[0]).toISOString() : "",
          activity:  r[5],
          correct:   Number(r[6]),
          total:     Number(r[7]),
          pct:       Number(r[8]),
          status:    r[9]
        });
      }
    });
  }

  // Progress sheet — per-question wrong IDs for adaptive info
  const wrongIds = getWrongQuestionIds_(email, quizKey);

  return {
    scores:   scores.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)),
    wrongCount: wrongIds.length
  };
}



/**************************************************************
 * CONFIG SHEET — stores API key and other settings
 **************************************************************/
var CONFIG_SHEET_NAME = "Config";
var CONFIG_HEADERS    = ["Key", "Value", "UpdatedAt", "UpdatedBy"];

function getConfigSheet_(ss) {
  var sheet = ss.getSheetByName(CONFIG_SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(CONFIG_SHEET_NAME);
    sheet.appendRow(CONFIG_HEADERS);
    sheet.getRange(1,1,1,4)
      .setBackground("#14532d").setFontColor("#fff").setFontWeight("bold");
    sheet.setFrozenRows(1);
    sheet.setColumnWidth(1, 180);
    sheet.setColumnWidth(2, 400);
    // Add default rows
    sheet.appendRow(["anthropic_api_key", "", new Date(), ""]);
    // Protect the sheet so students can't see the API key
    var protection = sheet.protect().setDescription("Config — teacher only");
    protection.setWarningOnly(true);
  }
  return sheet;
}

function getConfigValue_(key) {
  try {
    var ss    = SpreadsheetApp.openById(CONFIG.SHEET_ID);
    var sheet = ss.getSheetByName(CONFIG_SHEET_NAME);
    if (!sheet || sheet.getLastRow() < 2) return "";
    var rows = sheet.getRange(2, 1, sheet.getLastRow()-1, 2).getValues();
    for (var i = 0; i < rows.length; i++) {
      if (String(rows[i][0]).trim() === key) return String(rows[i][1]).trim();
    }
    return "";
  } catch(e) { return ""; }
}

function setConfigValue_(key, value, updatedBy) {
  var ss    = SpreadsheetApp.openById(CONFIG.SHEET_ID);
  var sheet = getConfigSheet_(ss);
  var rows  = sheet.getLastRow() > 1
    ? sheet.getRange(2, 1, sheet.getLastRow()-1, 2).getValues()
    : [];
  for (var i = 0; i < rows.length; i++) {
    if (String(rows[i][0]).trim() === key) {
      sheet.getRange(i+2, 2).setValue(value);
      sheet.getRange(i+2, 3).setValue(new Date());
      sheet.getRange(i+2, 4).setValue(updatedBy);
      return;
    }
  }
  // Not found — add new row
  sheet.appendRow([key, value, new Date(), updatedBy]);
}


/**************************************************************
 * SAVE CONFIG (called from dashboard)
 **************************************************************/
function saveConfig(settings, callerEmail) {
  try {
    var email = (callerEmail || "").toLowerCase().trim();
    if (!isTeacher_(email)) return { error: "Access denied." };

    Object.keys(settings).forEach(function(key) {
      setConfigValue_(key, settings[key], email);
    });

    return { success: true };
  } catch(e) {
    return { error: "saveConfig error: " + e.message };
  }
}


/**************************************************************
 * GET CONFIG (called from dashboard)
 **************************************************************/
function getConfig(callerEmail) {
  try {
    var email = (callerEmail || "").toLowerCase().trim();
    if (!isTeacher_(email)) return { error: "Access denied." };

    var ss    = SpreadsheetApp.openById(CONFIG.SHEET_ID);
    var sheet = getConfigSheet_(ss); // creates if not exists
    if (sheet.getLastRow() < 2) return { settings: {} };

    var rows     = sheet.getRange(2, 1, sheet.getLastRow()-1, 2).getValues();
    var settings = {};
    rows.forEach(function(r) {
      if (r[0]) settings[String(r[0]).trim()] = String(r[1]).trim();
    });
    return { settings: settings };
  } catch(e) {
    return { error: "getConfig error: " + e.message };
  }
}

/**************************************************************
 * HOMEWORK CONFIGURATION
 **************************************************************/
var HOMEWORK_SHEET = "Homework";
var HOMEWORK_HEADERS = [
  "ID", "Set By", "Class", "Quiz Name", "Quiz Key",
  "Due Date", "Message", "Students Emailed", "Set At", "Status"
];


/**************************************************************
 * GET HOMEWORK SHEET
 **************************************************************/
function getHomeworkSheet_(ss) {
  var sheet = ss.getSheetByName(HOMEWORK_SHEET);
  if (!sheet) {
    sheet = ss.insertSheet(HOMEWORK_SHEET);
    sheet.appendRow(HOMEWORK_HEADERS);
    sheet.getRange(1, 1, 1, HOMEWORK_HEADERS.length)
      .setBackground("#14532d").setFontColor("#fff").setFontWeight("bold");
    sheet.setFrozenRows(1);
    sheet.setColumnWidth(1, 120);
    sheet.setColumnWidth(4, 300);
    sheet.setColumnWidth(7, 300);
  }
  return sheet;
}


/**************************************************************
 * SET HOMEWORK
 * Called from Dashboard when teacher clicks Send.
 * - Saves homework record to sheet
 * - Sends initial email to all students in class who have logged in
 * - Creates time-based triggers for reminder + chase emails
 **************************************************************/
function setHomework(payload, callerEmail) {
  try {
    var email = (callerEmail || "").toLowerCase().trim();
    if (!isTeacher_(email)) return { error: "Access denied." };

    var cls      = payload.className;
    var quizKey  = payload.quizKey;
    var quizName = payload.quizName;
    var dueDate  = new Date(payload.dueDate);  // ISO string from client
    var message  = payload.message || "";
    var baseUrl  = ScriptApp.getService().getUrl();
    var quizUrl  = baseUrl + "?quiz=" + encodeURIComponent(quizKey);

    // Get student emails for this class from Scores sheet
    var students = getStudentsForClass_(cls);
    if (!students.length) {
      return { error: "No students found for " + cls + ". Students must have logged in at least once." };
    }

    // Generate a unique homework ID
    var hwId = "HW_" + new Date().getTime();

    // Save to Homework sheet
    var ss    = SpreadsheetApp.openById(CONFIG.SHEET_ID);
    var hwSheet = getHomeworkSheet_(ss);
    hwSheet.appendRow([
      hwId,
      email,
      cls,
      quizName,
      quizKey,
      dueDate,
      message,
      students.length,
      new Date(),
      "Active"
    ]);

    // Send initial homework email to all students
    var sent = 0;
    students.forEach(function(studentEmail) {
      try {
        sendHomeworkEmail_(studentEmail, email, {
          type:      "set",
          cls:       cls,
          quizName:  quizName,
          quizUrl:   quizUrl,
          dueDate:   dueDate,
          message:   message,
          hwId:      hwId
        });
        sent++;
      } catch(e) {
        console.log("Failed to email " + studentEmail + ": " + e.message);
      }
    });

    // Triggers are handled by a daily checker (dailyHomeworkCheck)
    // which runs automatically at 8am every day via a permanent trigger.
    // Call installDailyTrigger() once from the Apps Script editor to set it up.

    return {
      success:  true,
      sent:     sent,
      students: students.length,
      hwId:     hwId
    };

  } catch(e) {
    return { error: "setHomework error: " + e.message };
  }
}


/**************************************************************
 * GET STUDENTS FOR A CLASS
 * Returns unique emails from Scores sheet for a given class.
 **************************************************************/
function getStudentsForClass_(className) {
  var ss    = SpreadsheetApp.openById(CONFIG.SHEET_ID);
  var sheet = ss.getSheetByName(CONFIG.SHEET_NAME);
  if (!sheet || sheet.getLastRow() < 2) return [];

  var numCols = Math.min(sheet.getLastColumn(), 10);
  var data    = sheet.getRange(2, 1, sheet.getLastRow() - 1, numCols).getValues();
  var emails  = {};

  data.forEach(function(r) {
    var rowEmail = String(r[2] || "").toLowerCase().trim();
    var rowClass = String(r[3] || "");
    if (rowEmail && rowClass === className) {
      emails[rowEmail] = true;
    }
  });

  return Object.keys(emails);
}


/**************************************************************
 * SEND HOMEWORK EMAIL
 * Sends a branded HTML email to a student.
 **************************************************************/
function sendHomeworkEmail_(toEmail, fromEmail, opts) {
  var dueDateStr = opts.dueDate
    ? Utilities.formatDate(opts.dueDate, Session.getScriptTimeZone(), "EEEE d MMMM yyyy")
    : "";

  var subjectMap = {
    set:      "New Homework: " + opts.quizName,
    reminder: "Reminder: Homework due tomorrow — " + opts.quizName,
    chase:    "Overdue: " + opts.quizName
  };
  var subject = subjectMap[opts.type] || subjectMap.set;

  var typeConfig = {
    set:      { accent:"#2563EB", label:"New Homework",  icon:"&#128218;" },
    reminder: { accent:"#F97316", label:"Due Tomorrow",  icon:"&#9200;" },
    chase:    { accent:"#EC4899", label:"Overdue",       icon:"&#9888;" }
  };
  var introMap = {
    set:      "Your teacher has set a revision quiz for you to complete at home.",
    reminder: "Your homework is due <strong>tomorrow</strong> — don't forget to complete it!",
    chase:    "Your homework was due yesterday and hasn't been submitted yet. Please complete it as soon as possible."
  };
  var cfg   = typeConfig[opts.type] || typeConfig.set;
  var intro = introMap[opts.type]   || introMap.set;

  var customMsg = opts.message
    ? '<tr><td style="padding:0 32px 24px;"><div style="background:#F8F9FF;border-left:3px solid #7C3AED;border-radius:0 8px 8px 0;padding:12px 16px;font-size:14px;color:#374151;font-style:italic;line-height:1.6;">' + opts.message + '</div></td></tr>'
    : '';

  var logoSrc =  + LOGO_SECONDARY + r;

  var body = [
    '<!DOCTYPE html><html><head><meta charset="UTF-8"></head>',
    '<body style="margin:0;padding:0;background:#F1F5F9;font-family:Arial,sans-serif;">',
    '<table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 16px;">',
    '<tr><td align="center">',
    '<table width="580" cellpadding="0" cellspacing="0" style="max-width:580px;background:#fff;border-radius:20px;overflow:hidden;box-shadow:0 4px 24px rgba(11,18,43,.12);">',
    '<tr><td style="background:linear-gradient(90deg,#2563EB,#7C3AED,#EC4899,#F97316);height:4px;font-size:0;line-height:0;"> </td></tr>',
    '<tr><td style="background:#0B122B;padding:28px 32px;"><table width="100%" cellpadding="0" cellspacing="0"><tr>',
    '<td><img src="' + logoSrc + '" alt="RADevo" height="40" style="display:block;"></td>',
    '<td align="right"><span style="background:' + cfg.accent + ';color:#fff;padding:4px 14px;border-radius:20px;font-size:11px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;">' + cfg.icon + ' ' + cfg.label + '</span></td>',
    '</tr></table></td></tr>',
    '<tr><td style="background:#F8F9FF;padding:12px 32px;border-bottom:1px solid #E5E9F5;">',
    '<span style="font-size:12px;font-weight:600;color:#6B7280;">' + opts.className + '</span></td></tr>',
    '<tr><td style="padding:32px 32px 24px;">',
    '<p style="margin:0 0 16px;font-size:15px;color:#374151;line-height:1.6;">Dear Student,</p>',
    '<p style="margin:0;font-size:15px;color:#374151;line-height:1.6;">' + intro + '</p>',
    '</td></tr>',
    customMsg,
    '<tr><td style="padding:0 32px 28px;">',
    '<table width="100%" cellpadding="0" cellspacing="0" style="background:#F8F9FF;border:1px solid #E5E9F5;border-radius:14px;overflow:hidden;">',
    '<tr><td style="background:' + cfg.accent + ';padding:3px;font-size:0;line-height:0;"> </td></tr>',
    '<tr><td style="padding:20px 24px;"><table cellpadding="0" cellspacing="0" width="100%">',
    '<tr><td><span style="font-size:11px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:#6B7280;">Quiz</span><br>',
    '<span style="font-size:17px;font-weight:700;color:#0B122B;">' + opts.quizName + '</span></td></tr>',
    opts.dueDate ? '<tr><td style="padding-top:14px;"><span style="font-size:11px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:#6B7280;">Due Date</span><br><span style="font-size:15px;font-weight:600;color:#0B122B;">' + dueDateStr + '</span></td></tr>' : '',
    '</table></td></tr></table></td></tr>',
    '<tr><td style="padding:0 32px 32px;">',
    '<table cellpadding="0" cellspacing="0"><tr>',
    '<td style="background:linear-gradient(135deg,#2563EB,#7C3AED);border-radius:12px;">',
    '<a href="' + opts.quizUrl + '" style="display:inline-block;padding:14px 32px;color:#fff;font-size:15px;font-weight:700;text-decoration:none;letter-spacing:.02em;">Start Quiz &rarr;</a>',
    '</td></tr></table></td></tr>',
    '<tr><td style="background:#F8F9FF;border-top:1px solid #E5E9F5;padding:20px 32px;">',
    '<p style="margin:0;font-size:12px;color:#9CA3AF;line-height:1.6;">Sign in with your school Google account when prompted. Your scores are saved automatically.<br>This message was sent via RADevo &mdash; please do not reply directly.</p>',
    '</td></tr>',
    '<tr><td style="background:linear-gradient(90deg,#F97316,#EC4899,#7C3AED,#2563EB);height:3px;font-size:0;line-height:0;"> </td></tr>',
    '</table></td></tr></table></body></html>'
  ].join('');

  MailApp.sendEmail({
    to:       toEmail,
    replyTo:  fromEmail,
    subject:  subject,
    htmlBody: body
  });
}

/**************************************************************
 * TRIGGERED: SEND HOMEWORK REMINDERS (runs day before due date)
 * Finds all active homework due tomorrow and sends reminders.
 **************************************************************/
function sendHomeworkReminders() {
  var ss      = SpreadsheetApp.openById(CONFIG.SHEET_ID);
  var hwSheet = getHomeworkSheet_(ss);
  if (!hwSheet || hwSheet.getLastRow() < 2) return;

  var tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  var tomorrowStr = Utilities.formatDate(tomorrow, Session.getScriptTimeZone(), "yyyy-MM-dd");

  var data = hwSheet.getRange(2, 1, hwSheet.getLastRow() - 1, HOMEWORK_HEADERS.length).getValues();
  var baseUrl = ScriptApp.getService().getUrl();

  data.forEach(function(r) {
    var status   = String(r[9]);
    var dueDate  = r[5] ? new Date(r[5]) : null;
    if (!dueDate || status !== "Active") return;

    var dueDateStr = Utilities.formatDate(dueDate, Session.getScriptTimeZone(), "yyyy-MM-dd");
    if (dueDateStr !== tomorrowStr) return;

    var hwId     = r[0];
    var setBy    = r[1];
    var cls      = r[2];
    var quizName = r[3];
    var quizKey  = r[4];
    var message  = r[6];
    var quizUrl  = baseUrl + "?quiz=" + encodeURIComponent(quizKey);
    var students = getStudentsForClass_(cls);

    students.forEach(function(studentEmail) {
      try {
        sendHomeworkEmail_(studentEmail, setBy, {
          type: "reminder", cls: cls, quizName: quizName,
          quizUrl: quizUrl, dueDate: dueDate, message: message, hwId: hwId
        });
      } catch(e) {
        console.log("Reminder failed for " + studentEmail + ": " + e.message);
      }
    });
  });
}


/**************************************************************
 * TRIGGERED: SEND HOMEWORK CHASE (runs day after due date)
 * Sends chase emails only to students who have NOT submitted.
 **************************************************************/
function sendHomeworkChase() {
  var ss      = SpreadsheetApp.openById(CONFIG.SHEET_ID);
  var hwSheet = getHomeworkSheet_(ss);
  if (!hwSheet || hwSheet.getLastRow() < 2) return;

  var yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  var yesterdayStr = Utilities.formatDate(yesterday, Session.getScriptTimeZone(), "yyyy-MM-dd");

  var scoreSheet = ss.getSheetByName(CONFIG.SHEET_NAME);
  var baseUrl    = ScriptApp.getService().getUrl();
  var data = hwSheet.getRange(2, 1, hwSheet.getLastRow() - 1, HOMEWORK_HEADERS.length).getValues();

  data.forEach(function(r) {
    var status  = String(r[9]);
    var dueDate = r[5] ? new Date(r[5]) : null;
    if (!dueDate || status !== "Active") return;

    var dueDateStr = Utilities.formatDate(dueDate, Session.getScriptTimeZone(), "yyyy-MM-dd");
    if (dueDateStr !== yesterdayStr) return;

    var hwId     = r[0];
    var setBy    = r[1];
    var cls      = r[2];
    var quizName = r[3];
    var quizKey  = r[4];
    var message  = r[6];
    var quizUrl  = baseUrl + "?quiz=" + encodeURIComponent(quizKey);

    var students    = getStudentsForClass_(cls);
    var submitted   = getSubmittedStudents_(cls, quizName);
    var notSubmitted = students.filter(function(e) {
      return !submitted[e.toLowerCase()];
    });

    notSubmitted.forEach(function(studentEmail) {
      try {
        sendHomeworkEmail_(studentEmail, setBy, {
          type: "chase", cls: cls, quizName: quizName,
          quizUrl: quizUrl, dueDate: dueDate, message: message, hwId: hwId
        });
      } catch(e) {
        console.log("Chase failed for " + studentEmail + ": " + e.message);
      }
    });

    // Mark homework as Chased
    // find row index and update status
    var rows = hwSheet.getRange(2, 1, hwSheet.getLastRow()-1, 1).getValues();
    for (var i = 0; i < rows.length; i++) {
      if (rows[i][0] === hwId) {
        hwSheet.getRange(i + 2, 10).setValue("Chased");
        break;
      }
    }
  });
}


/**************************************************************
 * GET SUBMITTED STUDENTS for a class + quiz
 * Returns { email: true } for students who have SUBMITTED
 **************************************************************/
function getSubmittedStudents_(className, quizName) {
  var ss    = SpreadsheetApp.openById(CONFIG.SHEET_ID);
  var sheet = ss.getSheetByName(CONFIG.SHEET_NAME);
  if (!sheet || sheet.getLastRow() < 2) return {};

  var numCols = Math.min(sheet.getLastColumn(), 10);
  var data    = sheet.getRange(2, 1, sheet.getLastRow()-1, numCols).getValues();
  var submitted = {};

  data.forEach(function(r) {
    var rowEmail  = String(r[2] || "").toLowerCase().trim();
    var rowClass  = String(r[3] || "");
    var rowQuiz   = String(r[4] || "");
    var rowStatus = String(r[9] || "");
    if (rowEmail && rowClass === className && rowQuiz === quizName
        && rowStatus === "SUBMITTED") {
      submitted[rowEmail] = true;
    }
  });

  return submitted;
}


/**************************************************************
 * GET HOMEWORK LIST (for dashboard tracker)
 **************************************************************/
function getHomeworkList(callerEmail) {
  try {
    var email = (callerEmail || "").toLowerCase().trim();
    if (!isTeacher_(email)) return { error: "Access denied." };

    var ss      = SpreadsheetApp.openById(CONFIG.SHEET_ID);
    var hwSheet = getHomeworkSheet_(ss);
    if (!hwSheet || hwSheet.getLastRow() < 2) return { homework: [] };

    var data = hwSheet.getRange(2, 1, hwSheet.getLastRow()-1, HOMEWORK_HEADERS.length).getValues();

    // Read scores sheet once for all submission counts
    var scoreSheet  = ss.getSheetByName(CONFIG.SHEET_NAME);
    var submittedMap = {}; // "className|quizName" -> Set of emails
    var studentMap   = {}; // "className" -> Set of emails

    if (scoreSheet && scoreSheet.getLastRow() > 1) {
      var numCols = Math.min(scoreSheet.getLastColumn(), 10);
      var sRows   = scoreSheet.getRange(2, 1, scoreSheet.getLastRow()-1, numCols).getValues();
      sRows.forEach(function(r) {
        var rowEmail  = String(r[2] || "").toLowerCase().trim();
        var rowClass  = String(r[3] || "");
        var rowQuiz   = String(r[4] || "");
        var rowStatus = String(r[9] || "");
        if (!rowEmail || !rowClass) return;

        // All students per class
        if (!studentMap[rowClass]) studentMap[rowClass] = {};
        studentMap[rowClass][rowEmail] = true;

        // Submitted students per class+quiz
        if (rowStatus === "SUBMITTED") {
          var key = rowClass + "|" + rowQuiz;
          if (!submittedMap[key]) submittedMap[key] = {};
          submittedMap[key][rowEmail] = true;
        }
      });
    }

    var homework = data.map(function(r) {
      var cls      = String(r[2] || "");
      var quizName = String(r[3] || "");
      var dueDate  = r[5] ? new Date(r[5]) : null;
      var key      = cls + "|" + quizName;
      var subCount = submittedMap[key] ? Object.keys(submittedMap[key]).length : 0;
      var total    = studentMap[cls]   ? Object.keys(studentMap[cls]).length   : Number(r[7]) || 0;

      return {
        id:        String(r[0] || ""),
        setBy:     String(r[1] || ""),
        className: cls,
        quizName:  quizName,
        dueDate:   dueDate ? dueDate.toISOString() : "",
        message:   String(r[6] || ""),
        emailed:   Number(r[7]) || 0,
        setAt:     r[8] ? new Date(r[8]).toISOString() : "",
        status:    String(r[9] || ""),
        submitted: subCount,
        total:     total
      };
    });

    // Most recent first
    homework.sort(function(a, b) { return new Date(b.setAt) - new Date(a.setAt); });

    return { homework: homework };
  } catch(e) {
    return { error: "getHomeworkList error: " + e.message };
  }
}

/**************************************************************
 * DAILY HOMEWORK CHECK
 * Runs every day at 8am via a permanent time-based trigger.
 * Call installDailyTrigger() ONCE from the Apps Script editor
 * to set it up — Run > installDailyTrigger.
 * Handles both reminder emails and chase emails automatically.
 **************************************************************/
function dailyHomeworkCheck() {
  var ss      = SpreadsheetApp.openById(CONFIG.SHEET_ID);
  var hwSheet = getHomeworkSheet_(ss);
  if (!hwSheet || hwSheet.getLastRow() < 2) return;

  var today     = new Date();
  var todayStr  = Utilities.formatDate(today, Session.getScriptTimeZone(), "yyyy-MM-dd");
  var baseUrl   = ScriptApp.getService().getUrl();

  var data = hwSheet.getRange(2, 1, hwSheet.getLastRow()-1, HOMEWORK_HEADERS.length).getValues();

  data.forEach(function(r, i) {
    var status   = String(r[9] || "");
    var dueDate  = r[5] ? new Date(r[5]) : null;
    if (!dueDate) return;

    var dueDateStr      = Utilities.formatDate(dueDate, Session.getScriptTimeZone(), "yyyy-MM-dd");
    var dayBeforeStr    = Utilities.formatDate(
      new Date(dueDate.getTime() - 86400000), Session.getScriptTimeZone(), "yyyy-MM-dd"
    );
    var dayAfterStr     = Utilities.formatDate(
      new Date(dueDate.getTime() + 86400000), Session.getScriptTimeZone(), "yyyy-MM-dd"
    );

    var hwId     = r[0];
    var setBy    = r[1];
    var cls      = r[2];
    var quizName = r[3];
    var quizKey  = r[4];
    var message  = r[6];
    var quizUrl  = baseUrl + "?confirmed=1&quiz=" + encodeURIComponent(quizKey);

    // Send reminder the day before due date
    if (todayStr === dayBeforeStr && status === "Active") {
      console.log("Sending reminders for: " + hwId);
      var students = getStudentsForClass_(cls);
      students.forEach(function(studentEmail) {
        try {
          sendHomeworkEmail_(studentEmail, setBy, {
            type: "reminder", cls: cls, quizName: quizName,
            quizUrl: quizUrl, dueDate: dueDate, message: message, hwId: hwId
          });
        } catch(e) { console.log("Reminder failed for " + studentEmail + ": " + e.message); }
      });
    }

    // Send chase the day after due date (only to non-submitters)
    if (todayStr === dayAfterStr && status === "Active") {
      console.log("Sending chase emails for: " + hwId);
      var students      = getStudentsForClass_(cls);
      var submitted     = getSubmittedStudents_(cls, quizName);
      var notSubmitted  = students.filter(function(e) { return !submitted[e.toLowerCase()]; });

      notSubmitted.forEach(function(studentEmail) {
        try {
          sendHomeworkEmail_(studentEmail, setBy, {
            type: "chase", cls: cls, quizName: quizName,
            quizUrl: quizUrl, dueDate: dueDate, message: message, hwId: hwId
          });
        } catch(e) { console.log("Chase failed for " + studentEmail + ": " + e.message); }
      });

      // Mark as Chased in sheet
      hwSheet.getRange(i + 2, 10).setValue("Chased");
    }
  });
}


/**************************************************************
 * INSTALL DAILY TRIGGER
 * Run this ONCE from the Apps Script editor:
 *   Select installDailyTrigger in the function dropdown -> Run
 * This creates a permanent 8am daily trigger for dailyHomeworkCheck.
 * Only needs to be done once — it persists even after redeployment.
 **************************************************************/
function installDailyTrigger() {
  // Remove any existing dailyHomeworkCheck triggers first to avoid duplicates
  ScriptApp.getProjectTriggers().forEach(function(t) {
    if (t.getHandlerFunction() === "dailyHomeworkCheck") {
      ScriptApp.deleteTrigger(t);
    }
  });

  // Create new daily trigger at 8am London time
  ScriptApp.newTrigger("dailyHomeworkCheck")
    .timeBased()
    .everyDays(1)
    .atHour(8)
    .inTimezone("Europe/London")
    .create();

  console.log("[OK] Daily homework check trigger installed — runs every day at 8am.");
}

/**************************************************************
 * LEADERBOARD OPT-IN SHEET
 * Stores one row per student per quiz: email, quizKey, optedIn
 **************************************************************/
var OPTIN_SHEET = "LeaderboardOptIn";

function getOptInSheet_(ss) {
  var sheet = ss.getSheetByName(OPTIN_SHEET);
  if (!sheet) {
    sheet = ss.insertSheet(OPTIN_SHEET);
    sheet.appendRow(["Email", "QuizKey", "OptedIn", "DisplayName"]);
    sheet.getRange(1,1,1,4)
      .setBackground("#14532d").setFontColor("#fff").setFontWeight("bold");
    sheet.setFrozenRows(1);
  }
  return sheet;
}


/**************************************************************
 * SET LEADERBOARD OPT-IN
 * Called by Quiz.html when student toggles the switch.
 **************************************************************/
function setLeaderboardOptIn(quizKey, optedIn, callerEmail) {
  var email  = callerEmail || getUserEmail_();
  var ss     = SpreadsheetApp.openById(CONFIG.SHEET_ID);
  var sheet  = getOptInSheet_(ss);

  // Use first two chars of email prefix as anonymous display name
  var prefix      = email.split('@')[0];
  var displayName = prefix.slice(0,2).toUpperCase() + '****';

  var last = sheet.getLastRow();
  var data = last > 1 ? sheet.getRange(2, 1, last - 1, 4).getValues() : [];

  // Find existing row for this student + quiz
  var found = false;
  for (var i = 0; i < data.length; i++) {
    if (data[i][0] === email && data[i][1] === quizKey) {
      sheet.getRange(i + 2, 3).setValue(optedIn);
      found = true;
      break;
    }
  }

  if (!found) {
    sheet.appendRow([email, quizKey, optedIn, displayName]);
  }

  return { success: true };
}


/**************************************************************
 * GET LEADERBOARD
 * Returns top scores for a class+quiz, only for opted-in students.
 * activity = "overall" | "Fill in the Blanks" | "Match Keywords" etc.
 **************************************************************/
function getLeaderboard(quizKey, studentClass, activity, callerEmail) {
  var email = callerEmail || getUserEmail_();
  var ss    = SpreadsheetApp.openById(CONFIG.SHEET_ID);

  // ── Get opt-in list 
  var optSheet = getOptInSheet_(ss);
  var optLast  = optSheet.getLastRow();
  var optMap   = {};   // email -> { optedIn, displayName }

  if (optLast > 1) {
    optSheet.getRange(2, 1, optLast - 1, 4).getValues().forEach(function(r) {
      if (r[1] === quizKey) {
        optMap[r[0]] = { optedIn: r[2], displayName: r[3] };
      }
    });
  }

  // Current student's opt-in state
  var myOptIn = optMap[email] ? !!optMap[email].optedIn : false;

  // ── Get scores 
  var scoreSheet = ScoreRepo.getSheet();
  var data       = ScoreRepo.getData(scoreSheet);

  // Find quiz name from key
  var quiz     = CONFIG.QUIZZES.find(function(q){ return q.key === quizKey; });
  var quizName = quiz ? quiz.name : quizKey;

  // Filter to this class + quiz + LATEST status (not FINAL SUBMISSION rows)
  // Class matching: studentClass may be "Year 12 | IT – 12E/I11" — match on contains
  var relevant = data.filter(function(r) {
    if (r.quizName  !== quizName)          return false;
    if (r.status    !== 'LATEST')          return false;
    if (r.activity  === 'FINAL SUBMISSION') return false;
    // Class filter: match if stored class contains the student's class string
    if (studentClass && studentClass !== 'Unknown') {
      if (!r.className || r.className.indexOf(studentClass.split('–').pop().trim()) === -1) {
        // Also try direct match
        if (r.className !== studentClass) return false;
      }
    }
    return true;
  });

  // Only include opted-in students (always include current student regardless)
  relevant = relevant.filter(function(r) {
    return r.email === email || (optMap[r.email] && optMap[r.email].optedIn);
  });

  // ── Compute best score per student 
  var studentMap = {};  // email -> { correct, total, pct, count }

  relevant.forEach(function(r) {
    var pct = Number(r.pct);
    if (!studentMap[r.email]) {
      studentMap[r.email] = { correct:0, total:0, pct:0, actScores:{}, count:0 };
    }
    var s = studentMap[r.email];

    if (activity === 'overall') {
      // Average across all activities — store best per activity
      if (!s.actScores[r.activity] || pct > s.actScores[r.activity]) {
        s.actScores[r.activity] = pct;
      }
    } else {
      // Specific activity — take best attempt
      if (pct > s.pct) {
        s.correct = Number(r.correct);
        s.total   = Number(r.total);
        s.pct     = pct;
      }
    }
  });

  // Compute overall average
  if (activity === 'overall') {
    Object.keys(studentMap).forEach(function(em) {
      var s      = studentMap[em];
      var scores = Object.values(s.actScores);
      s.pct     = scores.length ? Math.round(scores.reduce(function(a,b){return a+b;},0)/scores.length) : 0;
      s.correct = null;
      s.total   = null;
    });
  }

  // ── Build sorted entries 
  var entries = Object.keys(studentMap).map(function(em) {
    var s = studentMap[em];
    return {
      email:       em,
      displayName: optMap[em] ? optMap[em].displayName : em.split('@')[0].slice(0,2).toUpperCase()+'****',
      correct:     (s.correct != null && !isNaN(s.correct)) ? Number(s.correct) : null,
      total:       (s.total   != null && !isNaN(s.total))   ? Number(s.total)   : null,
      pct:         Number(s.pct) || 0
    };
  });

  // Sort by pct descending
  entries.sort(function(a,b){ return b.pct - a.pct; });

  // Cap at top 20
  entries = entries.slice(0, 20);

  return {
    entries:  entries,
    myOptIn:  myOptIn
  };
}

/**************************************************************
 * DASHBOARD DATA
 **************************************************************/
function getDashboardData(callerEmail) {
  try {
    const email = (callerEmail || "").toLowerCase().trim();
    if (!email)           return { error: "No email received." };
    if (!isTeacher_(email)) return { error: "Access denied for: " + email };

    const ss    = SpreadsheetApp.openById(CONFIG.SHEET_ID);
    const sheet = ss.getSheetByName(CONFIG.SHEET_NAME);
    if (!sheet) return { rows: [] };

    const last    = sheet.getLastRow();
    const numCols = sheet.getLastColumn();
    if (last < 2)  return { rows: [] };

    console.log("Reading sheet: last row=" + last + ", cols=" + numCols);

    // Read ALL columns up to 10 — detect per-row whether quiz column exists
    const colsToRead = Math.min(numCols, 10);
    const raw = sheet.getRange(2, 1, last - 1, colsToRead).getValues();

    console.log("Raw rows read: " + raw.length);

    // Known quiz names — hardcoded only to avoid calling getAllQuizzes() here
    const knownQuizNames = CONFIG.QUIZZES.map(function(q){ return q.name; });
    // Known activity names
    const knownActivities = ["Fill in the Blanks","Match Keywords","Multiple Choice",
                              "True or False","FINAL SUBMISSION"];

    const rows = [];
    for (var i = 0; i < raw.length; i++) {
      var r = raw[i];
      try {
        var ts = "";
        if (r[0]) {
          try { ts = new Date(r[0]).toISOString(); } catch(e) { ts = String(r[0]); }
        }

        // Detect whether this row has a Quiz column (col index 4)
        // by checking if col[4] looks like a quiz name or an activity name
        // Col layout WITH quiz:    [ts, name, email, class, QUIZ, activity, correct, total, pct, status]
        // Col layout WITHOUT quiz: [ts, name, email, class, ACTIVITY, correct, total, pct, status]
        var col4 = String(r[4] || "");
        var rowHasQuiz = knownQuizNames.some(function(q){ return col4 === q; })
                      || (col4.length > 0
                          && !knownActivities.some(function(a){ return col4 === a; })
                          && col4 !== "FINAL SUBMISSION"
                          && isNaN(Number(col4)));

        if (rowHasQuiz) {
          rows.push({
            timestamp: ts,
            name:      String(r[1] || ""),
            email:     String(r[2] || ""),
            className: String(r[3] || ""),
            quizName:  String(r[4] || ""),
            activity:  String(r[5] || ""),
            correct:   Number(r[6]) || 0,
            total:     Number(r[7]) || 0,
            pct:       Number(r[8]) || 0,
            status:    String(r[9] || "")
          });
        } else {
          rows.push({
            timestamp: ts,
            name:      String(r[1] || ""),
            email:     String(r[2] || ""),
            className: String(r[3] || ""),
            quizName:  "Unknown Quiz",
            activity:  String(r[4] || ""),
            correct:   Number(r[5]) || 0,
            total:     Number(r[6]) || 0,
            pct:       Number(r[7]) || 0,
            status:    String(r[8] || "")
          });
        }
      } catch(rowErr) {
        console.log("Skipped row " + (i+2) + ": " + rowErr.message);
      }
    }

    return { rows: rows };

  } catch(err) {
    return { error: "getDashboardData crashed: " + err.message };
  }
}


/**************************************************************
 * SHEET SERVICE
 **************************************************************/
const SheetService = {
  rehighlight(sheet) {
    const data = ScoreRepo.getData(sheet);
    if (!data.length) return;

    const latestMap = {};
    data.forEach((row, i) => {
      if (row.activity === "FINAL SUBMISSION") return;
      const key = row.email + "|" + row.quizName + "|" + row.activity;
      const ts  = new Date(row.timestamp).getTime();
      if (!latestMap[key] || ts > latestMap[key].ts) {
        latestMap[key] = { index: i, ts };
      }
    });

    const latestSet = new Set(Object.values(latestMap).map(v => v.index));
    const bg = [], status = [];

    data.forEach((row, i) => {
      if (row.activity === "FINAL SUBMISSION") {
        bg.push(new Array(10).fill(CONFIG.COLORS.SUBMITTED));
        status.push(["SUBMITTED"]);
      } else if (latestSet.has(i)) {
        bg.push(new Array(10).fill(CONFIG.COLORS.LATEST));
        status.push(["LATEST"]);
      } else {
        bg.push(new Array(10).fill(CONFIG.COLORS.OLDER));
        status.push(["PREVIOUS"]);
      }
    });

    sheet.getRange(2, 1, data.length, 10).setBackgrounds(bg);
    sheet.getRange(2, 10, data.length, 1).setValues(status);
  },

  styleSubmissionRow(sheet) {
    const last = sheet.getLastRow();
    sheet.getRange(last, 1, 1, 10).setBackground(CONFIG.COLORS.SUBMITTED).setFontWeight("bold");
  }
};


/**************************************************************
 * SCORE REPO
 **************************************************************/
const ScoreRepo = {
  getSheet() {
    const ss    = SpreadsheetApp.openById(CONFIG.SHEET_ID);
    let   sheet = ss.getSheetByName(CONFIG.SHEET_NAME);
    if (!sheet) {
      sheet = ss.insertSheet(CONFIG.SHEET_NAME);
      sheet.appendRow(CONFIG.SCORE_HEADERS);
      sheet.getRange(1, 1, 1, CONFIG.SCORE_HEADERS.length)
        .setBackground("#14532d").setFontColor("#ffffff").setFontWeight("bold");
      sheet.setFrozenRows(1);
      sheet.setColumnWidths(1, 10, 160);
      sheet.setColumnWidth(5, 320);
    }
    return sheet;
  },

  getData(sheet) {
    const last = sheet.getLastRow();
    if (last < 2) return [];

    // Detect how many columns the sheet actually has
    // (older rows may have 9 cols without Quiz; newer have 10)
    const numCols = sheet.getLastColumn();
    const has10 = numCols >= 10;

    return sheet.getRange(2, 1, last - 1, has10 ? 10 : 9).getValues().map(r => {
      if (has10) {
        return {
          timestamp: r[0], name: r[1], email: r[2],
          className: r[3], quizName: r[4], activity: r[5],
          correct: r[6], total: r[7], pct: r[8], status: r[9]
        };
      } else {
        // Legacy 9-col format (no Quiz column)
        return {
          timestamp: r[0], name: r[1], email: r[2],
          className: r[3], quizName: "Unknown Quiz", activity: r[4],
          correct: r[5], total: r[6], pct: r[7], status: r[8]
        };
      }
    });
  }
};


/**************************************************************
 * SHEET HELPERS — Questions, QuizRegistry, Classes
 **************************************************************/
function getQuestionsSheet_(ss) {
  var sheet = ss.getSheetByName(CONFIG.QUESTIONS_SHEET);
  if (!sheet) {
    sheet = ss.insertSheet(CONFIG.QUESTIONS_SHEET);
    sheet.appendRow(["QuizKey","QuizName","ActivityType","QuestionID","QuestionJSON"]);
    sheet.getRange(1,1,1,5).setBackground("#14532d").setFontColor("#fff").setFontWeight("bold");
    sheet.setFrozenRows(1);
    sheet.setColumnWidth(5, 600);
  }
  return sheet;
}

function getQuizRegistrySheet_(ss) {
  var sheet = ss.getSheetByName(CONFIG.QUIZ_REG_SHEET);
  if (!sheet) {
    sheet = ss.insertSheet(CONFIG.QUIZ_REG_SHEET);
    sheet.appendRow(["QuizKey","QuizName","Description","Source","CreatedAt","CreatedBy"]);
    sheet.getRange(1,1,1,6).setBackground("#14532d").setFontColor("#fff").setFontWeight("bold");
    sheet.setFrozenRows(1);
    sheet.setColumnWidth(2,280); sheet.setColumnWidth(3,400);
  }
  return sheet;
}

function getClassesSheet_(ss) {
  var sheet = ss.getSheetByName(CONFIG.CLASSES_SHEET);
  if (!sheet) {
    sheet = ss.insertSheet(CONFIG.CLASSES_SHEET);
    sheet.appendRow(["Year","Subject","ClassName","FullLabel","QuizKeys","CreatedAt","CreatedBy"]);
    sheet.getRange(1,1,1,7).setBackground("#14532d").setFontColor("#fff").setFontWeight("bold");
    sheet.setFrozenRows(1);
    sheet.setColumnWidth(4,280); sheet.setColumnWidth(5,400);
  }
  return sheet;
}


/**************************************************************
 * GET ALL QUIZZES (hardcoded + sheet-based)
 * Returns merged list for Home.html and Quiz.html routing
 **************************************************************/
function getAllQuizzes() {
  var quizzes = CONFIG.QUIZZES.slice(); // start with hardcoded ones
  try {
    var ss    = SpreadsheetApp.openById(CONFIG.SHEET_ID);
    var sheet = getQuizRegistrySheet_(ss);
    if (sheet.getLastRow() < 2) return quizzes;
    var rows  = sheet.getRange(2,1,sheet.getLastRow()-1,4).getValues();
    rows.forEach(function(r) {
      var key = String(r[0]||"").trim();
      if (!key) return;
      // Don't duplicate hardcoded quizzes
      if (quizzes.some(function(q){ return q.key === key; })) return;
      quizzes.push({
        key:   key,
        name:  String(r[1]||""),
        file:  "Quiz",
        qFunc: null, // signals sheet-based questions
        desc:  String(r[2]||""),
        source:"sheet"
      });
    });
  } catch(e) { console.log("getAllQuizzes error: "+e.message); }
  return quizzes;
}


/**************************************************************
 * GET QUESTIONS FROM SHEET for a given quiz key
 **************************************************************/
function getSheetQuestions_(quizKey) {
  var ss    = SpreadsheetApp.openById(CONFIG.SHEET_ID);
  var sheet = ss.getSheetByName(CONFIG.QUESTIONS_SHEET);
  if (!sheet || sheet.getLastRow() < 2) return null;

  var rows  = sheet.getRange(2,1,sheet.getLastRow()-1,5).getValues();
  var bank  = { fitb:[], match:[], mc:[], tf:[] };
  var found = false;

  rows.forEach(function(r) {
    if (String(r[0]).trim() !== quizKey) return;
    found = true;
    var type = String(r[2]||"").toLowerCase();
    try {
      var q = JSON.parse(r[4]);
      if (type === "fitb")  bank.fitb.push(q);
      if (type === "match") bank.match.push(q);
      if (type === "mc")    bank.mc.push(q);
      if (type === "tf")    bank.tf.push(q);
    } catch(e) { console.log("Parse error row: "+e.message); }
  });

  return found ? bank : null;
}


/**************************************************************
 * GET ALL CLASSES (hardcoded + sheet-based)
 **************************************************************/
function getAllClasses() {
  var classes = CONFIG.CLASSES.slice();
  try {
    var ss    = SpreadsheetApp.openById(CONFIG.SHEET_ID);
    var sheet = getClassesSheet_(ss);
    if (sheet.getLastRow() < 2) return classes;
    var rows  = sheet.getRange(2,1,sheet.getLastRow()-1,4).getValues();
    rows.forEach(function(r) {
      var label = String(r[3]||"").trim();
      if (label && classes.indexOf(label) === -1) classes.push(label);
    });
  } catch(e) { console.log("getAllClasses error: "+e.message); }
  return classes;
}


/**************************************************************
 * GET CLASS->QUIZ ASSIGNMENTS FROM SHEET
 **************************************************************/
function getClassAssignments() {
  var ss    = SpreadsheetApp.openById(CONFIG.SHEET_ID);
  var sheet = getClassesSheet_(ss);
  var map   = {};
  if (sheet.getLastRow() < 2) return map;
  var rows  = sheet.getRange(2,1,sheet.getLastRow()-1,5).getValues();
  rows.forEach(function(r) {
    var label    = String(r[3]||"").trim();
    var quizKeys = String(r[4]||"").split(",").map(function(k){ return k.trim(); }).filter(Boolean);
    if (label) map[label] = quizKeys;
  });
  return map;
}


/**************************************************************
 * ADD CLASS
 * Called from dashboard. Saves to Classes sheet.
 **************************************************************/
function addClass(payload, callerEmail) {
  try {
    var email = (callerEmail||"").toLowerCase().trim();
    if (!isTeacher_(email)) return { error: "Access denied." };

    var year      = payload.year;
    var subject   = payload.subject;
    var className = payload.className;
    var quizKeys  = payload.quizKeys || [];
    var label     = year + " | " + subject + " \u2013 " + className;

    var ss    = SpreadsheetApp.openById(CONFIG.SHEET_ID);
    var sheet = getClassesSheet_(ss);

    // Check for duplicate
    if (sheet.getLastRow() > 1) {
      var rows = sheet.getRange(2,1,sheet.getLastRow()-1,4).getValues();
      for (var i=0; i<rows.length; i++) {
        if (String(rows[i][3]).trim() === label) {
          return { error: "A class with this name already exists: "+label };
        }
      }
    }

    sheet.appendRow([year, subject, className, label, quizKeys.join(","), new Date(), email]);
    return { success: true, label: label };

  } catch(e) {
    return { error: "addClass error: "+e.message };
  }
}


/**************************************************************
 * UPDATE CLASS QUIZ ASSIGNMENTS
 * Called from dashboard assignment table.
 **************************************************************/
function updateClassAssignment(classLabel, quizKeys, callerEmail) {
  try {
    var email = (callerEmail||"").toLowerCase().trim();
    if (!isTeacher_(email)) return { error: "Access denied." };

    var ss    = SpreadsheetApp.openById(CONFIG.SHEET_ID);
    var sheet = getClassesSheet_(ss);

    // Check if class already exists in sheet
    if (sheet.getLastRow() > 1) {
      var rows = sheet.getRange(2,1,sheet.getLastRow()-1,5).getValues();
      for (var i=0; i<rows.length; i++) {
        if (String(rows[i][3]).trim() === classLabel) {
          sheet.getRange(i+2, 5).setValue(quizKeys.join(","));
          return { success: true };
        }
      }
    }

    // Not in sheet yet (config class) — add it with the assignment
    var parts   = classLabel.split(" | ");
    var year    = parts[0] || "";
    var rest    = (parts[1] || "").split(" – ");
    var subject = rest[0] || "";
    var cls     = rest[1] || classLabel;
    sheet.appendRow([year, subject, cls, classLabel, quizKeys.join(","), new Date(), email]);
    return { success: true };

  } catch(e) {
    return { error: "updateClassAssignment error: "+e.message };
  }
}


/**************************************************************
 * RENAME CLASS
 * Updates the class label in the Classes sheet.
 * Only sheet-based classes can be renamed here.
 **************************************************************/
function renameClass(oldLabel, newLabel, callerEmail) {
  try {
    var email = (callerEmail || "").toLowerCase().trim();
    if (!isTeacher_(email)) return { error: "Access denied." };
    if (!newLabel || !newLabel.trim()) return { error: "New name cannot be empty." };
    newLabel = newLabel.trim();

    var ss    = SpreadsheetApp.openById(CONFIG.SHEET_ID);
    var sheet = getClassesSheet_(ss);
    if (!sheet || sheet.getLastRow() < 2) return { error: "Class not found." };

    var rows = sheet.getRange(2, 1, sheet.getLastRow()-1, 4).getValues();
    for (var i = 0; i < rows.length; i++) {
      if (String(rows[i][3]).trim() === oldLabel) {
        sheet.getRange(i+2, 4).setValue(newLabel);
        return { success: true, newLabel: newLabel };
      }
    }
    return { error: "Class not found in sheet: " + oldLabel };
  } catch(e) {
    return { error: "renameClass error: " + e.message };
  }
}

/**************************************************************
 * DELETE CLASS
 * Removes a class from the Classes sheet by its full label.
 * Only sheet-based classes can be deleted — config classes
 * must be edited in Code.gs directly.
 **************************************************************/
function deleteClass(classLabel, callerEmail) {
  try {
    var email = (callerEmail || "").toLowerCase().trim();
    if (!isTeacher_(email)) return { error: "Access denied." };

    var ss    = SpreadsheetApp.openById(CONFIG.SHEET_ID);
    var sheet = getClassesSheet_(ss);
    if (!sheet || sheet.getLastRow() < 2) return { error: "No classes found." };

    var rows = sheet.getRange(2, 1, sheet.getLastRow()-1, 4).getValues();
    for (var i = 0; i < rows.length; i++) {
      if (String(rows[i][3]).trim() === classLabel) {
        sheet.deleteRow(i + 2);
        return { success: true, deleted: classLabel };
      }
    }
    return { error: "Class not found: " + classLabel };
  } catch(e) {
    return { error: "deleteClass error: " + e.message };
  }
}

/**************************************************************
 * GENERATE QUIZ WITH AI
 * Calls Anthropic API to generate 20 questions per activity type.
 * Saves results to Questions and QuizRegistry sheets.
 **************************************************************/
function generateQuizWithAI(payload, callerEmail) {
  try {
    var email = (callerEmail||"").toLowerCase().trim();
    if (!isTeacher_(email)) return { error: "Access denied." };

    var quizName    = payload.quizName;
    var description = payload.description;
    var apiKey      = payload.apiKey;

    if (!quizName || !description) return { error: "Quiz name and description are required." };
    // If no API key provided, try to read from Config sheet
    if (!apiKey) {
      apiKey = getConfigValue_("anthropic_api_key");
    }
    if (!apiKey) return { error: "No Anthropic API key found. Please add it in the dashboard Settings section." };

    // Generate a clean quiz key from the name
    var quizKey = quizName
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, "")
      .trim()
      .replace(/\s+/g, "_")
      .slice(0, 30);

    // Check for duplicate key
    var ss      = SpreadsheetApp.openById(CONFIG.SHEET_ID);
    var regSheet = getQuizRegistrySheet_(ss);
    if (regSheet.getLastRow() > 1) {
      var regRows = regSheet.getRange(2,1,regSheet.getLastRow()-1,1).getValues();
      for (var i=0; i<regRows.length; i++) {
        if (String(regRows[i][0]).trim() === quizKey) {
          quizKey = quizKey + "_" + new Date().getTime().toString().slice(-4);
        }
      }
    }

    // Build the prompt
    var prompt = buildQuizPrompt_(quizName, description, quizKey);

    // Call Anthropic API in 4 separate requests (one per activity type)
    // to avoid timeouts from large single requests
    var qSheet = getQuestionsSheet_(ss);
    var totalCounts = { fitb: 0, match: 0, mc: 0, tf: 0 };
    var types = [
      { key: "fitb",  label: "Fill in the Blanks" },
      { key: "match", label: "Matching keywords to definitions" },
      { key: "mc",    label: "Multiple Choice" },
      { key: "tf",    label: "True or False" }
    ];

    for (var t = 0; t < types.length; t++) {
      var typeKey   = types[t].key;
      var typeLabel = types[t].label;
      var typePrompt = buildQuizTypePrompt_(quizName, description, quizKey, typeKey, typeLabel);

      // Pause between calls to stay under rate limit (4000 tokens/min)
      if (t > 0) Utilities.sleep(15000);

      // MC needs more tokens due to 4 options per question
      var maxTok = (typeKey === "mc" || typeKey === "fitb") ? 3000 : 2000;

      var resp = UrlFetchApp.fetch("https://api.anthropic.com/v1/messages", {
        method: "post",
        headers: {
          "Content-Type":      "application/json",
          "x-api-key":         apiKey,
          "anthropic-version": "2023-06-01"
        },
        payload: JSON.stringify({
          model:      "claude-haiku-4-5",
          max_tokens: maxTok,
          messages:   [{ role: "user", content: typePrompt }]
        }),
        muteHttpExceptions: true
      });

      var respCode = resp.getResponseCode();
      var respText = resp.getContentText();

      if (respCode !== 200) {
        return { error: "API error on " + typeLabel + " (" + respCode + "): " + respText.slice(0,200) };
      }

      var parsed  = JSON.parse(respText);
      var rawJson = parsed.content[0].text
        .replace(/^```json\s*/,"").replace(/^```\s*/,"").replace(/\s*```$/,"").trim();

      var questions;
      try {
        questions = JSON.parse(rawJson);
        if (!Array.isArray(questions)) questions = questions[typeKey] || [];
      } catch(e) {
        return { error: "Could not parse AI response for " + typeLabel + ". Raw: " + rawJson.slice(0,200) };
      }

      var qRows = questions.map(function(q) {
        return [quizKey, quizName, typeKey, q.id || "", JSON.stringify(q)];
      });
      if (qRows.length > 0) {
        qSheet.getRange(qSheet.getLastRow()+1, 1, qRows.length, 5).setValues(qRows);
      }
      totalCounts[typeKey] = questions.length;
    }

    var bank = totalCounts; // for return value below

    // Save to QuizRegistry
    regSheet.appendRow([quizKey, quizName, description, "AI-generated", new Date(), email]);

    return {
      success:  true,
      quizKey:  quizKey,
      quizName: quizName,
      counts:   totalCounts
    };

  } catch(e) {
    return { error: "generateQuizWithAI error: "+e.message };
  }
}


/**************************************************************
 * BUILD QUIZ PROMPT
 **************************************************************/
function buildQuizTypePrompt_(quizName, description, quizKey, typeKey, typeLabel) {
  var typeInstructions = {
    fitb:  'Each item: { "id": "' + quizKey + '_f01", "answer": "key term", "before": "text before blank", "after": "text after blank" }\nThe before+after must form a complete meaningful sentence with the blank in the middle. The answer should be a key term from the topic.',
    match: 'Each item: { "id": "' + quizKey + '_m01", "term": "keyword", "definition": "clear definition" }\nTerms should be key vocabulary. Definitions should be exam-appropriate and distinct from each other.',
    mc:    'Each item: { "id": "' + quizKey + '_mc01", "question": "question text", "options": [{"l":"A","t":"..."},{"l":"B","t":"..."},{"l":"C","t":"..."},{"l":"D","t":"..."}], "answer": "A" }\nOne correct answer, three plausible distractors. No "all of the above".',
    tf:    'Each item: { "id": "' + quizKey + '_t01", "statement": "statement text", "answer": true }\nMix of true and false. Avoid trick questions. answer must be a boolean true or false (not a string).'
  };

  return "Generate exactly 15 " + typeLabel + " questions for a UK school revision quiz.\n\n"
    + "Topic: " + quizName + "\n"
    + "Description: " + description + "\n\n"
    + "Return ONLY a valid JSON array of 20 question objects. No explanation, no markdown, no preamble.\n\n"
    + "Format for each item:\n" + typeInstructions[typeKey] + "\n\n"
    + "Number IDs 01 through 15. Cover the topic thoroughly. "
    + "Questions should be appropriate for UK students aged 14-18. "
    + "Return ONLY the JSON array, nothing else.";
}

function buildQuizPrompt_(quizName, description, quizKey) {
  return 'Generate a complete quiz question bank for a school revision quiz.\n\n'
    + 'Quiz name: ' + quizName + '\n'
    + 'Quiz key: ' + quizKey + '\n'
    + 'Topic/description: ' + description + '\n\n'
    + 'Generate EXACTLY 20 questions for each of the 4 activity types below.\n'
    + 'Return ONLY valid JSON with no explanation, no markdown fences, no preamble.\n\n'
    + 'Required JSON structure:\n'
    + '{\n'
    + '  "fitb": [\n'
    + '    { "id": "' + quizKey + '_f01", "answer": "word or phrase", "before": "text before blank", "after": "text after blank" }\n'
    + '  ],\n'
    + '  "match": [\n'
    + '    { "id": "' + quizKey + '_m01", "term": "keyword", "definition": "full definition" }\n'
    + '  ],\n'
    + '  "mc": [\n'
    + '    { "id": "' + quizKey + '_mc01", "question": "question text", "options": [{"l":"A","t":"option text"},{"l":"B","t":"option text"},{"l":"C","t":"option text"},{"l":"D","t":"option text"}], "answer": "A" }\n'
    + '  ],\n'
    + '  "tf": [\n'
    + '    { "id": "' + quizKey + '_t01", "statement": "statement text", "answer": true }\n'
    + '  ]\n'
    + '}\n\n'
    + 'Rules:\n'
    + '- fitb: the blank should be a key term; before+after form a complete sentence with the blank in the middle\n'
    + '- match: terms should be key vocabulary; definitions should be clear and exam-appropriate\n'
    + '- mc: 4 options (A-D), one correct answer, plausible distractors, no "all of the above"\n'
    + '- tf: mix of true and false statements, avoid trick questions\n'
    + '- All questions must be appropriate for UK school students aged 14-18\n'
    + '- Questions must cover the topic thoroughly and vary in difficulty\n'
    + '- IDs must follow the pattern shown (key_f01, key_m01 etc.) numbered 01-20\n'
    + '- Return ONLY the JSON object, nothing else';
}


/**************************************************************
 * GET DASHBOARD SETUP DATA
 * Returns everything the dashboard AI/class section needs
 **************************************************************/
function getDashboardSetupData(callerEmail) {
  try {
    var email = (callerEmail||"").toLowerCase().trim();
    if (!isTeacher_(email)) return { error: "Access denied." };

    var allQuizzes     = getAllQuizzes();
    var classAssign    = getClassAssignments();
    var hardcodedClasses = CONFIG.CLASSES;

    // Build full class list with their quiz assignments
    var allClasses = [];

    // Hardcoded classes — get assignments from getClassQuizMap
    var hwMap = getClassQuizMap();
    hardcodedClasses.forEach(function(label) {
      var allowedNames = hwMap[label] || [];
      allClasses.push({
        label:     label,
        source:    "config",
        quizKeys:  allowedNames.map(function(name) {
          var q = allQuizzes.find(function(q){ return q.name === name; });
          return q ? q.key : name;
        })
      });
    });

    // Sheet-based classes
    Object.keys(classAssign).forEach(function(label) {
      if (!allClasses.some(function(c){ return c.label === label; })) {
        allClasses.push({ label: label, source: "sheet", quizKeys: classAssign[label] });
      }
    });

    return {
      quizzes: allQuizzes.map(function(q){ return { key:q.key, name:q.name, desc:q.desc||"" }; }),
      classes: allClasses
    };
  } catch(e) {
    return { error: "getDashboardSetupData error: "+e.message };
  }
}


/**************************************************************
 * AI CLASS ANALYSIS
 * Analyses student results for a class+quiz and returns
 * a plain-English report identifying strong/weak topics.
 **************************************************************/
function getAIAnalysis(classLabel, quizName, callerEmail) {
  try {
    var email = (callerEmail || "").toLowerCase().trim();
    if (!isTeacher_(email)) return { error: "Access denied." };

    // Get API key from Config sheet
    var apiKey = getConfigValue_("anthropic_api_key");
    if (!apiKey) return { error: "No API key found. Please add it in the Settings section of the dashboard." };

    // ── Get score data for this class + quiz 
    var ss         = SpreadsheetApp.openById(CONFIG.SHEET_ID);
    var scoreSheet = ss.getSheetByName(CONFIG.SHEET_NAME);
    if (!scoreSheet || scoreSheet.getLastRow() < 2) return { error: "No score data found." };

    var numCols = Math.min(scoreSheet.getLastColumn(), 10);
    var rows    = scoreSheet.getRange(2, 1, scoreSheet.getLastRow()-1, numCols).getValues();

    // Filter to this class + quiz, latest attempts only
    var activityMap = {}; // { email: { activity: { correct, total } } }
    rows.forEach(function(r) {
      var rowEmail  = String(r[2] || "").toLowerCase().trim();
      var rowClass  = String(r[3] || "");
      var rowQuiz   = String(r[4] || "");
      var rowAct    = String(r[5] || "");
      var rowStatus = String(r[9] || "");
      if (rowClass !== classLabel || rowQuiz !== quizName) return;
      if (rowStatus !== "LATEST" && rowStatus !== "Yes") return;
      if (rowAct === "FINAL SUBMISSION") return;

      if (!activityMap[rowEmail]) activityMap[rowEmail] = {};
      activityMap[rowEmail][rowAct] = {
        correct: Number(r[6]) || 0,
        total:   Number(r[7]) || 0,
        pct:     Number(r[8]) || 0
      };
    });

    var students = Object.keys(activityMap);
    if (students.length < 2) return { error: "Not enough data — at least 2 students need to have attempted this quiz." };

    // ── Get per-question data from StudentProgress sheet 
    var progressSheet = ss.getSheetByName(CONFIG.PROGRESS_SHEET);
    var questionStats = {}; // { questionId: { correct: N, total: N, text: "" } }

    if (progressSheet && progressSheet.getLastRow() > 1) {
      var pRows = progressSheet.getRange(2, 1, progressSheet.getLastRow()-1, 6).getValues();

      // Find quiz key for this quiz name
      var quizKey = "";
      CONFIG.QUIZZES.forEach(function(q) { if (q.name === quizName) quizKey = q.key; });

      pRows.forEach(function(r) {
        var rowEmail = String(r[1] || "").toLowerCase().trim();
        var rowQuiz  = String(r[2] || "");
        var rowQId   = String(r[4] || "");
        var rowOk    = r[5];
        if (rowQuiz !== quizKey || !rowQId) return;
        if (!students.some(function(s){ return s === rowEmail; })) return;

        if (!questionStats[rowQId]) questionStats[rowQId] = { correct: 0, total: 0 };
        questionStats[rowQId].total++;
        if (rowOk) questionStats[rowQId].correct++;
      });
    }

    // ── Build activity summary 
    var activities = ["Fill in the Blanks", "Match Keywords", "Multiple Choice", "True or False"];
    var actSummary = [];
    activities.forEach(function(act) {
      var scores = students.map(function(s) {
        return activityMap[s][act] ? activityMap[s][act].pct : null;
      }).filter(function(p){ return p !== null; });

      if (!scores.length) return;
      var avg = Math.round(scores.reduce(function(a,b){return a+b;},0) / scores.length);
      actSummary.push(act + ": " + avg + "% average (" + scores.length + " students)");
    });

    // ── Build question summary (worst performing) 
    var qSummary = [];
    Object.keys(questionStats).forEach(function(qId) {
      var s   = questionStats[qId];
      var pct = s.total > 0 ? Math.round((s.correct / s.total) * 100) : 0;
      qSummary.push({ id: qId, pct: pct, correct: s.correct, total: s.total });
    });
    qSummary.sort(function(a,b){ return a.pct - b.pct; });

    // Get question text for worst 10 questions
    // Try to load from sheet-based questions first, then .gs banks
    var questionTexts = {};
    var sheetBank = getSheetQuestions_(
      CONFIG.QUIZZES.find(function(q){ return q.name === quizName; }) ?
      CONFIG.QUIZZES.find(function(q){ return q.name === quizName; }).key : ""
    );
    if (sheetBank) {
      ["fitb","match","mc","tf"].forEach(function(type) {
        (sheetBank[type] || []).forEach(function(q) {
          if (type === "fitb")  questionTexts[q.id] = (q.before || "") + "___" + (q.after || "");
          if (type === "match") questionTexts[q.id] = q.term + ": " + q.definition;
          if (type === "mc")    questionTexts[q.id] = q.question;
          if (type === "tf")    questionTexts[q.id] = q.statement;
        });
      });
    } else {
      // Try hardcoded .gs bank
      var quiz = CONFIG.QUIZZES.find(function(q){ return q.name === quizName; });
      if (quiz && quiz.qFunc && this[quiz.qFunc]) {
        var bank = this[quiz.qFunc]();
        ["fitb","match","mc","tf"].forEach(function(type) {
          (bank[type] || []).forEach(function(q) {
            if (type === "fitb")  questionTexts[q.id] = (q.before || "") + "___" + (q.after || "");
            if (type === "match") questionTexts[q.id] = q.term + ": " + q.definition;
            if (type === "mc")    questionTexts[q.id] = q.question;
            if (type === "tf")    questionTexts[q.id] = q.statement;
          });
        });
      }
    }

    var worstQs = qSummary.slice(0, 10).map(function(q) {
      var text = questionTexts[q.id] || q.id;
      return "- " + text.slice(0, 120) + (text.length > 120 ? "..." : "") +
             " (" + q.correct + "/" + q.total + " correct, " + q.pct + "%)";
    }).join("\n");

    var bestQs = qSummary.slice(-5).reverse().map(function(q) {
      var text = questionTexts[q.id] || q.id;
      return "- " + text.slice(0, 100) + " (" + q.pct + "%)";
    }).join("\n");

    // ── Build below-average count 
    var allPcts = [];
    students.forEach(function(s) {
      var pcts = activities.map(function(a){
        return activityMap[s][a] ? activityMap[s][a].pct : null;
      }).filter(function(p){ return p !== null; });
      if (pcts.length) allPcts.push(pcts.reduce(function(a,b){return a+b;},0)/pcts.length);
    });
    var classAvg = allPcts.length ? Math.round(allPcts.reduce(function(a,b){return a+b;},0)/allPcts.length) : 0;
    var belowAvg = allPcts.filter(function(p){ return p < classAvg * 0.7; }).length;

    // ── Build prompt 
    var prompt = "You are an experienced UK secondary school teacher analysing student quiz results.\n\n"
      + "Class: " + classLabel + "\n"
      + "Quiz: " + quizName + "\n"
      + "Number of students: " + students.length + "\n"
      + "Class average: " + classAvg + "%\n"
      + "Students significantly below average: " + belowAvg + "\n\n"
      + "ACTIVITY AVERAGES:\n" + actSummary.join("\n") + "\n\n"
      + (worstQs ? "QUESTIONS STUDENTS STRUGGLED WITH MOST:\n" + worstQs + "\n\n" : "")
      + (bestQs  ? "QUESTIONS STUDENTS ANSWERED WELL:\n" + bestQs + "\n\n" : "")
      + "Write a concise teacher analysis report with these exact sections:\n"
      + "## Overall Performance\n"
      + "## Strongest Areas\n"
      + "## Areas Needing Work\n"
      + "## Specific Topics to Revisit\n"
      + "(Based on the question content above, identify the specific topics/concepts students struggled with)\n"
      + "## Students to Monitor\n"
      + "## Recommended Next Steps\n\n"
      + "Keep each section to 2-4 sentences. Be specific about topics where possible. "
      + "Write for a teacher audience. Do not mention student names or emails.";

        // ── Call Anthropic API 
    var response = UrlFetchApp.fetch("https://api.anthropic.com/v1/messages", {
      method: "post",
      headers: {
        "Content-Type":      "application/json",
        "x-api-key":         apiKey,
        "anthropic-version": "2023-06-01"
      },
      payload: JSON.stringify({
        model:      "claude-sonnet-4-6",
        max_tokens: 1200,
        messages:   [{ role: "user", content: prompt }]
      }),
      muteHttpExceptions: true
    });

    var code = response.getResponseCode();
    var text = response.getContentText();
    if (code !== 200) return { error: "API error " + code + ": " + text.slice(0, 200) };

    var parsed  = JSON.parse(text);
    var report  = parsed.content[0].text;

    return {
      success:    true,
      report:     report,
      students:   students.length,
      classAvg:   classAvg,
      belowAvg:   belowAvg
    };

  } catch(e) {
    return { error: "getAIAnalysis error: " + e.message };
  }
}

/**************************************************************
 * RENAME QUIZ
 * Updates quiz name in QuizRegistry and Questions sheets.
 * Only AI-generated (sheet-based) quizzes can be renamed.
 **************************************************************/
function renameQuiz(quizKey, newName, callerEmail) {
  try {
    var email = (callerEmail || "").toLowerCase().trim();
    if (!isTeacher_(email)) return { error: "Access denied." };
    if (!newName || !newName.trim()) return { error: "New name cannot be empty." };
    newName = newName.trim();

    var ss       = SpreadsheetApp.openById(CONFIG.SHEET_ID);
    var regSheet = getQuizRegistrySheet_(ss);
    if (!regSheet || regSheet.getLastRow() < 2) return { error: "Quiz not found." };

    var rows = regSheet.getRange(2, 1, regSheet.getLastRow()-1, 2).getValues();
    var found = false;
    for (var i = 0; i < rows.length; i++) {
      if (String(rows[i][0]).trim() === quizKey) {
        regSheet.getRange(i+2, 2).setValue(newName);
        found = true;
        break;
      }
    }
    if (!found) return { error: "Quiz key not found in registry: " + quizKey };

    // Also update quiz name in Questions sheet
    var qSheet = ss.getSheetByName(CONFIG.QUESTIONS_SHEET);
    if (qSheet && qSheet.getLastRow() > 1) {
      var qRows = qSheet.getRange(2, 1, qSheet.getLastRow()-1, 2).getValues();
      qRows.forEach(function(r, i) {
        if (String(r[0]).trim() === quizKey) {
          qSheet.getRange(i+2, 2).setValue(newName);
        }
      });
    }

    return { success: true, newName: newName };
  } catch(e) {
    return { error: "renameQuiz error: " + e.message };
  }
}


/**************************************************************
 * DELETE QUIZ
 * Removes quiz from QuizRegistry and all its questions
 * from the Questions sheet.
 **************************************************************/
function deleteQuiz(quizKey, callerEmail) {
  try {
    var email = (callerEmail || "").toLowerCase().trim();
    if (!isTeacher_(email)) return { error: "Access denied." };

    var ss = SpreadsheetApp.openById(CONFIG.SHEET_ID);

    // Remove from QuizRegistry
    var regSheet = getQuizRegistrySheet_(ss);
    if (regSheet && regSheet.getLastRow() > 1) {
      var rows = regSheet.getRange(2, 1, regSheet.getLastRow()-1, 1).getValues();
      for (var i = rows.length - 1; i >= 0; i--) {
        if (String(rows[i][0]).trim() === quizKey) {
          regSheet.deleteRow(i + 2);
        }
      }
    }

    // Remove all questions for this quiz from Questions sheet
    var qSheet = ss.getSheetByName(CONFIG.QUESTIONS_SHEET);
    if (qSheet && qSheet.getLastRow() > 1) {
      var qRows = qSheet.getRange(2, 1, qSheet.getLastRow()-1, 1).getValues();
      for (var j = qRows.length - 1; j >= 0; j--) {
        if (String(qRows[j][0]).trim() === quizKey) {
          qSheet.deleteRow(j + 2);
        }
      }
    }

    return { success: true, deleted: quizKey };
  } catch(e) {
    return { error: "deleteQuiz error: " + e.message };
  }
}


/**************************************************************
 * GET QUIZ LIST (for dashboard management)
 **************************************************************/
function getQuizList(callerEmail) {
  try {
    var email = (callerEmail || "").toLowerCase().trim();
    if (!isTeacher_(email)) return { error: "Access denied." };

    var ss       = SpreadsheetApp.openById(CONFIG.SHEET_ID);
    var regSheet = getQuizRegistrySheet_(ss);
    var aiQuizzes = [];

    if (regSheet && regSheet.getLastRow() > 1) {
      var rows = regSheet.getRange(2, 1, regSheet.getLastRow()-1, 4).getValues();
      rows.forEach(function(r) {
        if (r[0]) aiQuizzes.push({
          key:    String(r[0]).trim(),
          name:   String(r[1]).trim(),
          desc:   String(r[2]).trim(),
          source: String(r[3]).trim()
        });
      });
    }

    return { quizzes: aiQuizzes };
  } catch(e) {
    return { error: "getQuizList_ error: " + e.message };
  }
}

/**************************************************************
 * GET DASHBOARD INIT DATA
 * Called via google.script.run after page load.
 * Returns quizzes and classes without template injection.
 **************************************************************/
function getDashboardInitData(callerEmail) {
  try {
    var email = (callerEmail || "").toLowerCase().trim();
    if (!isTeacher_(email)) return { error: "Access denied for: " + email };
    return {
      quizzes: CONFIG.QUIZZES.map(function(q) {
        return { key: q.key, name: q.name, desc: q.desc || "" };
      }),
      classes: CONFIG.CLASSES
    };
  } catch(e) {
    return { error: "getDashboardInitData error: " + e.message };
  }
}


/**************************************************************
 * GET STUDENT COUNT FOR CLASS
 * Returns number of unique students seen in Scores sheet for a class.
 **************************************************************/
function getStudentCountForClass(className, callerEmail) {
  try {
    var email = (callerEmail || "").toLowerCase().trim();
    if (!isTeacher_(email)) return { error: "Access denied." };

    var ss    = SpreadsheetApp.openById(CONFIG.SHEET_ID);
    var sheet = ss.getSheetByName(CONFIG.SHEET_NAME);
    if (!sheet || sheet.getLastRow() < 2) return { count: 0 };

    var rows  = sheet.getRange(2, 1, sheet.getLastRow()-1, 4).getValues();
    var seen  = {};
    rows.forEach(function(r) {
      if (String(r[3]).trim() === className && r[2]) seen[String(r[2]).toLowerCase()] = true;
    });
    return { count: Object.keys(seen).length };
  } catch(e) {
    return { count: 0, error: e.message };
  }
}


/**************************************************************
 * GET HOMEWORK SUBMISSIONS
 * Returns per-student submission status and scores for a
 * given class and quiz, for the homework results panel.
 **************************************************************/
function getHomeworkSubmissions(className, quizName, callerEmail, startedAt) {
  try {
    var email = (callerEmail || "").toLowerCase().trim();
    if (!isTeacher_(email)) return { error: "Access denied." };

    var ss         = SpreadsheetApp.openById(CONFIG.SHEET_ID);
    var scoreSheet = ss.getSheetByName(CONFIG.SHEET_NAME);
    if (!scoreSheet || scoreSheet.getLastRow() < 2) return { students: [] };

    var numCols = Math.min(scoreSheet.getLastColumn(), 10);
    var rows    = scoreSheet.getRange(2, 1, scoreSheet.getLastRow()-1, numCols).getValues();

    // Find quiz key for this quiz name
    var quizKey = "";
    CONFIG.QUIZZES.forEach(function(q) { if (q.name === quizName) quizKey = q.key; });

    // Also check QuizRegistry sheet for AI-generated quizzes
    if (!quizKey) {
      var regSheet = ss.getSheetByName(CONFIG.QUIZ_REG_SHEET);
      if (regSheet && regSheet.getLastRow() > 1) {
        var regRows = regSheet.getRange(2,1,regSheet.getLastRow()-1,2).getValues();
        regRows.forEach(function(r) {
          if (String(r[1]).trim() === quizName) quizKey = String(r[0]).trim();
        });
      }
    }

    // Collect per-student per-activity scores
    var studentMap = {}; // email -> { name, activities: {actName: {correct,total,pct}} }
    var ACTIVITIES = ["Fill in the Blanks", "Match Keywords", "Multiple Choice", "True or False"];

    rows.forEach(function(r) {
      var rowEmail  = String(r[2] || "").toLowerCase().trim();
      var rowClass  = String(r[3] || "");
      var rowQuiz   = String(r[4] || "");
      var rowAct    = String(r[5] || "");
      var rowStatus = String(r[9] || "");

      if (rowClass !== className) return;
      if (rowQuiz  !== quizName)  return;
      if (rowAct   === "FINAL SUBMISSION") return;
      if (rowStatus !== "LATEST" && rowStatus !== "Yes") return;
      // Filter by startedAt if provided
      if (startedAt) {
        var rowTs = r[0] ? new Date(r[0]) : null;
        if (rowTs && rowTs < new Date(startedAt)) return;
      }

      var name = rowEmail.split("@")[0];
      if (!studentMap[rowEmail]) {
        studentMap[rowEmail] = { name: name, email: rowEmail, submitted: false, activities: {} };
      }

      studentMap[rowEmail].activities[rowAct] = {
        correct: Number(r[6]) || 0,
        total:   Number(r[7]) || 0,
        pct:     Math.round(Number(r[8]) || 0)
      };
    });

    // Check final submissions
    rows.forEach(function(r) {
      var rowEmail  = String(r[2] || "").toLowerCase().trim();
      var rowClass  = String(r[3] || "");
      var rowQuiz   = String(r[4] || "");
      var rowAct    = String(r[5] || "");
      if (rowClass === className && rowQuiz === quizName && rowAct === "FINAL SUBMISSION") {
        if (startedAt) {
          var rowTs = r[0] ? new Date(r[0]) : null;
          if (rowTs && rowTs < new Date(startedAt)) return;
        }
        if (studentMap[rowEmail]) studentMap[rowEmail].submitted = true;
      }
    });

    // Build class-level activity averages
    var activityAverages = {};
    ACTIVITIES.forEach(function(act) {
      var scores = [];
      Object.values(studentMap).forEach(function(s) {
        if (s.activities[act]) scores.push(s.activities[act].pct);
      });
      activityAverages[act] = scores.length
        ? Math.round(scores.reduce(function(a,b){return a+b;},0) / scores.length)
        : null;
    });

    return {
      students:         Object.values(studentMap),
      activityAverages: activityAverages,
      activities:       ACTIVITIES,
      quizName:         quizName,
      className:        className
    };

  } catch(e) {
    return { error: "getHomeworkSubmissions error: " + e.message };
  }
}


/**************************************************************
 * ASSIGNMENTS SHEET
 **************************************************************/
var ASSIGNMENTS_SHEET = "Assignments";
var ASSIGNMENT_HEADERS = ["AssignmentID","SetBy","Class","QuizName","QuizKey","StartedAt","Message","StudentsEmailed","Status"];

function getAssignmentsSheet_(ss) {
  var sheet = ss.getSheetByName(ASSIGNMENTS_SHEET);
  if (!sheet) {
    sheet = ss.insertSheet(ASSIGNMENTS_SHEET);
    sheet.appendRow(ASSIGNMENT_HEADERS);
    sheet.getRange(1,1,1,ASSIGNMENT_HEADERS.length)
      .setBackground("#14532d").setFontColor("#fff").setFontWeight("bold");
    sheet.setFrozenRows(1);
  }
  return sheet;
}


/**************************************************************
 * START ASSIGNMENT
 * Sets an in-lesson assignment, emails students, returns quiz URL
 **************************************************************/
function startAssignment(payload, callerEmail) {
  try {
    var email    = (callerEmail || "").toLowerCase().trim();
    if (!isTeacher_(email)) return { error: "Access denied." };

    var cls      = payload.className;
    var quizName = payload.quizName;
    var message  = payload.message || "";

    // Find quiz key
    var quizKey = "";
    CONFIG.QUIZZES.forEach(function(q) { if (q.name === quizName) quizKey = q.key; });
    if (!quizKey) {
      var ss2 = SpreadsheetApp.openById(CONFIG.SHEET_ID);
      var reg = getQuizRegistrySheet_(ss2);
      if (reg.getLastRow() > 1) {
        reg.getRange(2,1,reg.getLastRow()-1,2).getValues().forEach(function(r) {
          if (String(r[1]).trim() === quizName) quizKey = String(r[0]).trim();
        });
      }
    }
    if (!quizKey) return { error: "Could not find quiz key for: " + quizName };

    var ss         = SpreadsheetApp.openById(CONFIG.SHEET_ID);
    var sheet      = getAssignmentsSheet_(ss);
    var assignId   = "ASSIGN_" + new Date().getTime();
    var baseUrl    = ScriptApp.getService().getUrl();
    var quizUrl    = baseUrl + "?confirmed=1&quiz=" + encodeURIComponent(quizKey);

    // Email students
    var students   = getStudentsForClass_(cls);
    var sent       = 0;

    var intro = message ? "<p>" + message + "</p>" : "<p>Your teacher has started an in-lesson assignment. Please complete it now.</p>";
    var emailBody = [
      '<!DOCTYPE html><html><head><meta charset="UTF-8"></head>',
      '<body style="margin:0;padding:0;background:#F1F5F9;font-family:Arial,sans-serif;">',
      '<table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 16px;">',
      '<tr><td align="center">',
      '<table width="580" cellpadding="0" cellspacing="0" style="max-width:580px;background:#fff;border-radius:20px;overflow:hidden;box-shadow:0 4px 24px rgba(11,18,43,.12);">',
      '<tr><td style="background:linear-gradient(90deg,#2563EB,#7C3AED,#EC4899,#F97316);height:4px;font-size:0;"> </td></tr>',
      '<tr><td style="background:#0B122B;padding:28px 32px;">',
      '<table width="100%" cellpadding="0" cellspacing="0"><tr>',
      '<td><img src="data:image/png;base64,/9j/4AAQSkZJRgABAgAAAQABAAD/wAARCAEYAxADACIAAREBAhEB/9sAQwAIBgYHBgUIBwcHCQkICgwUDQwLCwwZEhMPFB0aHx4dGhwcICQuJyAiLCMcHCg3KSwwMTQ0NB8nOT04MjwuMzQy/9sAQwEJCQkMCwwYDQ0YMiEcITIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIy/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMAAAERAhEAPwD3+iiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKyfEurzaB4fu9Uhs/thtl3tD5mwlc8kHB6Dnp2rWqO4giuraW3mQPFKhR1PdSMEflVQaUk2rrsJ7aHkB+OrZ48PL/AOBn/wBhR/wvKU9NBj/8Cz/8RXlmuaVJomt3umS5320zR5I+8AeD+Iwfxqktfc08nwE4qUYXT83/AJnjTxdeLtf8j2AfG+c/8wGL/wACj/8AE1Ivxtm76FH/AOBR/wDia8gU04mtlkeBf/Lv8Zf5mTxtf+b8F/kewD42N30JP/Av/wCwpjfG6QdNCj/G7P8A8RXkW6kzQ8jwH8n4v/MPruI/m/BHrf8Awu+f/oBRf+BR/wDiaP8Ahd8//QBi/wDAs/8AxFeSU0ml/YmB/wCff4y/zD67X/m/Bf5HrjfHGcdNBi/8Cz/8RUZ+Odz/ANACH/wKP/xFeSGmGpeS4H/n3+Mv8y1jK3f8j19PjpNuG/w/GR3xdkf+yVp2Xxw0mRsX2lXluPWJ1lH/ALKa8LJppNZzyPBSVlG3o3+ty1jK173PqjQ/HHhzxCyx6fqcTTt0gkzHJ/3y2M/hmuhr41DEHPcdK77wl8WNY8PulvqDPqWnDgpI372Mf7LHr9D+leRiuH5xXNh3fye/37fkddPGp6TVj6MorO0TXNP8RaXFqOmXAmt5OPRkburDsR6Vo187KLi3GSs0d24UUUUgCiiigAqOe4htYWmuJo4YlxueRgqjJwMk+9SVzPxBJHgi/wAf3of/AEalNK7A6aiiikAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAeJfGvw+0Op2mvQxfup08idgOjr90n6rx/wABrygcV9carpdprWmXGnX0fmW867XXv7EehBwR9K+dPGHgDVvCs7yNG9zpxJ8u7jXIA9HA+6f0PY19jkWYwlSWHm/eW3mv8127fM8rG0Gpe0WzOVBp2aiGfrTxmvpFK55rQ+ikApaokSmk080w0mNDTTTSnPpTT9KhloaaaaUmmE1DLQE000tITUNmiR0Pg/xjf+D9WW7tWL27kC5ti2FmUfyYc4Pb6Eivp7RdZsvEGkW+p6fL5ltOuRngqe6kdiDwa+PTXpnwb8WtpPiD+w7mU/YtQbEYJ4SfsR/vAbfrtrws4y+NaDrQXvL8V/mun3drduGquL5XsfQtFFFfHnohRRRQAVzHxCOPA+oH/ah/9GpXT1zHxD/5EbUfrF/6NSnHdCZ09FFFIYUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFIQGUqwBBGCD3paKAOX1L4d+FNUkaWbR4Y5W6vbkxH8lIH6Vmj4R+Ex/y73X/AIEtXdUV2RzHFxVlUf3mLoUnvFHDH4SeFP8Anhdf+BDU3/hUXhT/AJ43f/gS1d3RV/2pjP8An4xfVaP8pwn/AAqHwp/zxu//AAJak/4VD4U/543f/gS1d5RR/amM/wCfjD6rR/lOC/4U/wCE/wDnjef+BLUh+D3hI/8ALG8/8CWrvqKP7Txn/Pxh9Wpfynnk3wY8JyLhft8R9UuMn9Qa4TxV8G9S0i2e80ec6lAgy0WzbMo9gOG/DB9q9+orWjnOLpyu5XXZ/wBXFLC0mtFY+MSCp5FNJr1f40+FotN1KDXbSIJDfMUuAowBNjO7/gQB/FSe9eTmvr8LiY4miqsev4M8+dNwlysaaEkkilWSJikikMrDqCOhoNNzWpSR9e+FdZHiHwrpuq/xXECtIMYw44Yf99A1sV5h8C7/AO1eCbi1LEta3rqB6KwVh+pavT6+BxtH2OInBbX/AAeqPTpu8UwooorlLCuZ+IP/ACI+ofWL/wBGpXTVzHxC/wCRH1D6xf8Ao1Ka3BnT0UUUgCiiigDP17UJNJ8O6nqUSK8lpaSzqj9GKIWAPtxXgv8Aw0VreP8AkCad/wB/Hr23xsceAvEZ/wCoXc/+imr4oycVtSjGV7kybWx7Qf2i9d7aHpv/AH8kpB+0Xr3/AEA9N/77krzTR/CPiHX7NrvStHvLy3VzGZIUyAwAJH6j861B8MvGhH/Itah/3wP8a19lAnmZ3X/DRWuf9ATTv+/j1dsf2jp1YDUPDkTr3a3uipH4MvP515u3wz8aAf8AItah+CD/ABrn9U0XVdGmEWqadd2TnotxCyZ+mRzQ6cOgczPrPwl8UPDHjFlgsrs298R/x6XQ2SH/AHezfgSfauyr4Pjd4nV0Yq6kFWBwVI6EHsa+m/g18R5vFdjJo2rS79WskDLKetxF03H/AGgcA+uQfWsp0nHVFKVz1WiiisSgooooAKKKxvFfiCHwt4X1DWZ8EW0RZEP8bnhV/FiBQB5l8QPjXdeF/FM+j6RYWd2lsqiaSZm4kPJUYPYEfjmubtv2jNZ+0R/atE0/yNw8zy3cNtzzjJ64rx+8upr68mu7mVpbieRpZXY5LMxySfxNVsGur2KsZ85922t1BfWcF3bSCW3njWWKRejKwyCPqDU1eSfAPxKdS8JTaHcODcaW/wC7yeTC5JH5HcPpivW65pLldi07hRRRSGFFFFAHlHxL+K+o+B/EkOl2mnWlyklos5eZ2BBLOMcdvlFcUf2i9d7aJpv/AH3JWd+0GT/wsW2HppsX/ocleX2lrcX15DaW0TS3E7iOONRy7E4AH410wpxcVciUmmewj9ovXe+iab/33JR/w0ZrY/5genf9/Hrhv+FZ+NP+ha1D/v2P8aa3wy8agE/8IzqH4IP8abpwFzM9Lsf2j5c4v/DaMP71vd4x+DL/AFrvvDnxi8IeIZEg+2tp9y2AIr5RHk+zZK/qDXy9qXhzW9FwdU0i+slPRriBkB/EjFZpHHPSn7CLWgc7R94AggEEEHoRS18p/Dv4s6n4PuIrO/klvtEJCtAzbngHrGT/AOg9D7da+otO1Gz1fTrfUNPuEuLS4QPFKh4YH+X0PIrnnBx3LTTLVFFFQMKKKKACio5p4raJpZ5FjjXqzHAFc1e+ObCBittDLckfxfcX8zz+lZVa1Okr1HY1pUKlZ2pxbOporgJPiFdBjs0+EL6GQk/yqxa/ESIsBd2DqO7ROG/Q4rmjmWFk7Kf4P/I7HlOMSvyfiv8AM7eiqOm6xYatGWs7hZCBlkPDL9QeavV2xkpK8XdHBOEoPlkrMKKKoazqY0fSpr9reSdIQCyR4zjPJ59KYoxcmordl+iuDHxT04/8w68/NP8AGt3w74ss/Eck8cEUsMkIDFZMfMD3GD/nIp2Z01MDiacXKcGkjfooopHKFFFMmmjt4JJ5WCRRqXdj2AGSaAH0V5l/wurR+o0rUCD0Pyf/ABVbXhn4i2finVhp9ppt5GRG0jySbdqAeuD3JArqlgcTFOUoNJeRfs5b2OzooorlICiiuZ17x94e8PSNDc3hmuVOGgth5jqffsPoSKuFOdSXLBXfkB01FeQXvxvKnFlofH96e4wT+AH9aqQ/HG/8wedodsyZ5CXDA/qpr0o5Jj5K6p/iv8zOdaEPiZ7VRXnuj/F/QdQKpfRXGnyHu48yMf8AAl5/Su9trq3vLdLi1njmhcZWSNgyn6EVw18LWw7tVi16/p3HCpCavF3JaKKKwLCiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKAPOvjYiN8PWZvvJdxFfrkj+RNfOGa9t+OniCF4rHw9DIGlV/tVwAc7eCEB9zknHsPWvEjX2GRwlHCXfVt/kv0ODEtOpYM0w0pphavVuRFHun7P27+zde/u/aIsfXaf/AK1ey15b8B7MQ+Cru7IIa5vXwfVVVVH67q9Sr4vNmnjJ28vyR30/hQUUUV5xYVzHxC/5EfUfrF/6NSunrmfiD/yI+o/WL/0alNbgzpqKKKQBRRRQBg+N/wDkQfEf/YLuf/RTV8VhcivtXxt/yIXiL/sGXP8A6KaviteK6aHUifQ+mP2ehj4eXf8A2E5f/QI69Zryj9nw5+Ht1/2Epf8A0COvV6yq/Gxx2Cqmp6XYazp8thqVpFdWsow8Uq5B9/Y+45FW6KzKPjX4heFP+EO8ZXmkxMz2oxLbO/UxtyAfUg5GfapPhhqMulfEjQbiNseZdLbv6FZPkP8A6Fn8K6b48apb3/xE8iEhjY2cdvIQc/PlnI/AOK43wRA13450C3T7zahByB0AcEn8ga7FeUfeMno9D7SooorjNQooooAK8C/aG8UeZNYeF7eT5U/0u6x68iNfy3H8RXut/ewabp9zfXThLe3iaWRj2VRk/wAq+K/EmuT+I/EN/rFyT5t3MZNpOdi9FX6BQB+Fa0Yc0iZOyK2i6Vda5rdnpVopNxdzLEntk8k+wGT+FdP8UPBqeCvF72dsrjTp41mtGdtxIxhgT6hgfwIrt/2evDf2vWL7xJPH+7s1+zW5I/5aMMsR9FwP+B13fxv8LnX/AAM19BHuu9KY3C4GSYzxIPyw3/Aa1dTlnZE8ulzwb4a+Kj4T8b2OoSOVtJG+z3XPHlvwSfocN+FfYtfB5UZx2r60+EHiY+JPAFp50m+7sP8ARJ8nk7QNrH6qRz3INTXi/iHB9DvKKKK5ywooooA+Yf2gc/8ACxof+wdF/wChyVxfgP8A5KF4cH/UTt//AEYK7f8AaBx/wsS3/wCwbF/6HJXE+Ax/xcLw5/2Erf8A9GCu2l8CMZ7n2jRRRXEbDZI0mjaORFeNhhlYZBHoRXjXxJ+Ctpf2s2reFbdbe+UF5LFOI5h32D+FvYcH2r2eiqjJx2E1c+DXjeN2VlZWU4IYYIPpXr/wI8aS6Xr3/CM3chax1Alrfcf9VMBnA9mA/MD1NV/jv4aj0bxjFqlvHst9VjMjgDjzlID/AJgqfqTXmWn3sunX9vfW7lJ7aVZo2HUMpyP1FdSSnG5nezPuiiqum3sep6XaX8QxHcwpMgPoygj+dWq4zUKqalqMGl2Ml3cH5F6AdWPYCrdec+MNTN9qptEb9zanbj1fufw6fnXLjcSsNRdTr09TqwWGeJrKn06+hkarrd5rFyZbh8ID8kQPyoP8feqcYaVwiKzO3AVRkmpbWwmvruO2gXdJI2B/ifbvXqOj6FZ6NbhIUDTEfPMw+Zj/AEHtXy2Gw1fH1XKT9W/6/DY+pxGJoYCmoxXol/X47nmx8Oaw67l024x7rj+dULmwu7Jwt1bSwk9BIhGfp617XUVxbQ3cLQ3ESSxt1VxkV6/9iqK0nr6HnQz9396GnqeLxTyWsyzQyNHKhyrqcEV6T4W8UR63Ebecql9EMsBwJB/eH9RXEeLtBbQ75WiJaznyYiTypHVT/T/61c/aahPpt/De2zlZoW3D39QfYjiqw3tMPPlfzPUrYSlmOHU4bvZ/o/1Pe6ZNFHcQSQyqHjkUo6nuCMEVDp97FqOn295Cf3cyB19s9qs17R8XKLhJxkrNHz/rWnvo+sXWntk+S5Ckj7y9VP4jFWfCerNo/iS1unbELN5Uvpsbgn8Dg/hXYfFHSB5dtrMacr+4mI9Dyp/PI/EV5iZPyrqpx5kfcYXERxeETnrdWf6/fv8AM+laK5vwNrP9s+F7Z3fdPB+4lz1yvQ/iMH866SueUXFtM+JrUnSqOm+gVw3xU1r+zPCjWcbYm1BvJHsg5Y/lgfjXc188fEzxB/bHjO4jifdbWI+zx+hYffP58fhXbluH9viYxey1fy/4IqavI5MrXt/wj0H7B4ek1WVf3183yZ7RrkD8zk/lXjWj2EutaxZ6ZDxJcyiPd/dB6n8Bk/hX1Ha20VlZwWsC7YoY1jQeigYH6CvezzEezoqlHeX5I2rS0sTUhIVSzEAAZJPalrzn4t+JZNM0WPSLSUpc34PmMpwVhHB/76PH0zXy9CjOvUVKG7OY5fx38UJtQnm0rQpmhslyktynDTeu09l9xyfpXmpbI4pnkn6V6l8PPhpHqdtHrGuITavzb2uceYP7zf7PoO/Xp1+5hTwuWUOZ6d31b/rp0+9jkjzWz03UNUk2WFjc3TDqIYmf+Qq5ceFtfs4jLc6LfxRjq7W7YH44r6jgt4bWBILeGOGFBhY41Cqo9gOlSV5j4mSfu0tPX/gHNVoe0VrnyKCR1FbnhzxZqnhm887T5z5ZIMlu5zHJ9R6+45r23xj8PNN8TwSTwIlpqYBKTouFkPpIB1Hv1Hv0r59vbC5069ms7uFobiFykiN2I/z1r18Lj8NmVJwa16xf9a69fy0PHr0KmHlzJ/M+mfC/iex8VaSt9Zkq4O2aBj80Teh9R6Hv+Yrar5r8D+IZfDXiSC6LkWkpEVynYoe+PUda+kwQwBBBB5BHevks3y/6nW934Zbfqvkerg8R7aGu6FoooryjrCiiigAooooAKKKKACiiigAoopAwJIBBIODg9DQAtFFFABRRRQAUUV4n8c9R8VWH2dILh4fD84CFrbKsZO6yN1wewGAefStsPRdeoqcXa4N2PV7nxPoFlKYrrXNMgkU4KS3cakfgTUI8Y+Fz08SaOf8At+i/+Kr45QVYTivajkV/+Xn4f8ExlV5eh9gf8Jd4aP8AzMWk/wDgbH/8VR/wl3hr/oYdJ/8AA2P/AOKr5EBp3WtP9Xv+nn4f8ExeLt0/E+tZ/Gnhe3iMkniHTNo/uXSOfyBJrgfFvxqsra3e28NRm6uTkfapkKxp7gHlj9cD614UOKGOa6KGQUYu9WTl+H+f5oyljJPSKsOurq4vbqW6upnmuJmLySucszHqTUBNKaaa9tLlXKtkZK7d2NJpm0k7VBZjwAOpNKxr0P4PeD38Q+J01S5i/wCJdpjiRiw4kl6ovvj7x+g9a561WFKDnPZHRCNz3jwToZ8OeDNL0thiWGAGXjH7xvmb9SRW/RRXwlWo6k3N7t3O1KysFFFFZjCuZ+IP/Ikah9Yv/RqV01cx8Qv+RH1D6xf+jUprcGdPRRRSAKKKKAMLxt/yIXiL/sF3P/opq+Kegr7W8bf8iF4i/wCwZc/+imr4rPIrpw6vczn0Pa/g/wDEnw14R8H3GnazdzQ3L3rzKqQO42lUAOQPVTXoQ+OHgQ/8xOf/AMBJf/ia+UOPUfnSD/eH505U03dgpWR9YN8cPAiqSNSuG9haSc/pXHeKf2hbb7I8HhewmM7Aj7VeKFWP3VATuP1wPY14GPrToYJLmeOCFC8sjBEVerMTgAUewW4c4tzczX11Lc3ErzTzOZJJHOWdickk9yTXr3wC8HTXviCTxPcx7bOxDR25Yf6yVhgkeyqT+LD0NP8ABvwD1S9lju/E8osLXr9liYNM/sSOEH5n2FfQmn6faaVp8FhYW6W9rAgSOJBgKP8APfvU1KitZDSfUs0UUVzlhRRSEhVLMQABkk9qAPIfj94p/szwzb6Bbvi41Jt02OohQ5P5tgfQGvmsB3cBFLMxwFHUn0rrfiN4mPizxvf6krE2qt5FqOwiTgH8Tlv+BVB4DvNF03xhYahrzSfYbRvO2xx7y7r9wY9M4P4V1wg1C5m3dn1P8P8AwyvhLwTp2lFQLhY/MuT6yty35E4+gFdHLFHPC8MqB45FKsrDIYHgg15sfjx4JH/La/8A/AU0n/C+fBP/AD1v/wDwFP8AjXM1Ju9iz538a+H5PCni3UdGcHbBLmFj/FE3KH8iPxBrsPgb4p/sTxyumzS7bTVV8gg9BKMmM/UnK/8AAqT4v+K/DHjO80/UtFe5+2xI0M4lgKBk6qc+oJb8/avNInkgmSWJykqMHR16qQcgj8a6VeUdSNmfeNFYPgvxFH4q8IabrCkeZPEBMo/hlXhx/wB9A49sVvVytWdjQKKKKQHzH+0EMfES2PrpsX/oclcV4C/5KH4c/wCwlb/+jBXbftBNn4iWw9NNiH/kSSuI8B8fETw5/wBhK3/9GCuyl8CMpbn2lRRRXGahRRRQB49+0TaJJ4O0u7P+sh1ARr9Gjcn/ANBFfNwXNe//ALRmrotpomjK/wA7yPdSL6ADap/Es35V4CHwCfSuqjbl1Mpbn2J8L5Wm+GXh5nJJFoq5PoMgfoK62ue8CWB0zwDoNo2d6WMRYEYwxUMR+ZNdDXNLdmqI7iUQW0sp6Ihb8hmvGi7vI0jnLOSxPuea9e1TP9k3mOvkP/6Ca8iyCor57Pm7U16/ofQZCleo/T9TofCWoadp93cXN9OInCBI8oT1PJ4HHQfnXW/8JdoX/P8Ar/37f/CvLxDLICY43cDrtUnFJ9muB/y7zf8Afs/4V5+DzKph4ezil+P+Z6WJyuniZ+0nJ/h/keonxboQ/wCX9f8Av2/+FRt4z8Pp97UQP+2T/wDxNeXNDcD/AJYTf9+z/hVeW3uHH/HtP/36b/CvVpZnVn0X9fMyjw/Qe8n+H+R3Pi/xJoGseHpre3vxJcoyyRL5bjLA+49Ca80wW5qw1jdZ/wCPWf8A79N/hSC1uQP+PW4/79N/hXZGTqPmkexgsFDB03Cm203fU9U+HNw03hfymbPkTugHoDhv/ZjXXVxHwzilj0q+82KSPNwMb1K5+UetdvXbHY+MzeChjZpeT+9JlLV9Nj1fSLrT5fuTxlc+h7H8Dg/hXzxc20tpcy2867ZYnKOp7EHBr6Urx74paV9h1yLUY1xFep82P+ei8H8xj8jXbg5e/wAr6m2UYn2c3Sez/Nf8APhjrH2HX306RgIr1cLk9JFyR+YyPyr2GvmKG8mtLmK5gYrNC4kQjsQcivpHSdRi1bSLTUISNlxEr49CRyPwORWuPo8rU1syc1p/vFVXX+v69Cn4q1keH/DN9qWR5kUZ8oHu54UfmRXy+2+Ri7ks7HLE9yepr1v4za1uex0SJxhf9JnAP1CA/wDjx/KvKY1Z5EjjUu7sFVR1JPAFe3kWH5aLqv7X5L/g3OKjG0bnp/wZ8P77u716ZPliH2e3yP4jyxH0GB+Jr2SsnwzoyaB4cstNUDdFGPMI/ic8sfzJrWrw8yxP1jESktlovRf1cxnLmdwr5x+JOqnUPHeokE7LdhboCem0c/8Aj2a+jq+XPFqE+M9cz/z/AM//AKGa7eH4p4pt9Iv80KO4nhfT/wC3fE+naYwJSeYCTb12D5m/QGvqJEWNFRFCooAVVGAB6Cvnn4WIqfELTyeuyUD6+W3/ANevoituIqrdWFNbJX+92/QJbhRRRXzpIV4/8Z9JjiuNP1iNAGlBt5iB1I5Un3xuH4CvYK83+NMqL4Rs4yRve+UqPUBHz/MV6OU1ZUsZTcert8noc+KgpUZJniAfmvpbwLfvqXgjSbmQ5fyPLJ9ShKf+y18zgZNfRXwvjMfw+03P8RlYf9/Gr6XiRXwsW/5l+TPMy3Sq/T/I6+iiiviT2wooooAKKKKACiiigAooooAK4TVdbuNG8ZXEkeXhYRiWLPDDaP1967uvNPFoA8S3J9k/9BFeTnFSdKjGcHZqS/JnqZTTjUrShNXTT/NHodleQX9qlzbvvjcceo9j71YryzRtfm0W63qC8Dn95Fnr7j3r0yzvIL+1jubaQPE4yCP5fWtsBj4YuHaS3X6ry/Izx2AnhZX3i9n+j8/z/KeiiivQPPCqeqaXZ61pdzpuoQLNa3CFJEbuPX2IPIPYgGuT8UeM5bG/W001kLQPmZ2GQxH8H+JrptE1q213T1urc4P3ZIyeY29D/j3rKGIg6nJF6r+vwOqeCrQoqvKPuv8Ar8en/DX+XPHPgm88E64bSbdLZzZa1uccSL6H/aHGR9D0Nc2lfX/ijwxp/i3RJdM1BPlb5o5VHzRP2Zff+Y4r5b8R+GdQ8K6zLpmoR4kTlJFHyyp2dfY/ocjtX2uV476zHkl8S/Hz/wAzyq65dTJFPFIBS17KRwyYUhNKaaTTbJSEJphNDNzj1rv/AAj8Jde8SNHcXkTaZpx5Ms64kcf7CHn8TgfWsKtWFOLlN2R0Qi3scz4V8Kaj4v1lNP09MDhpp2HyQp/eP9B3r6r8P6DY+GtEttK0+PZBCvJP3nbuzHuSef8A61M8PeG9L8L6YthpVsIohy7E5eRv7zHuf8jArWr5HMsxeJfJT+Bfj/XT+rd9OHLqwoooryjQKKKKACuZ+IP/ACI+ofWL/wBGpXTVzPxB/wCRI1D6xf8Ao1Ka3BnTUUUUgCiiigDB8b/8iD4j/wCwXc/+imr4oBNfbHjb/kQvEX/YLuf/AEU1fFQArooJtOxEz6L+AWkaZqHgO7mvdOs7iVdSkQPNArsB5cZxkjpya9T/AOEb0L/oC6d/4Cp/hXnP7PIx8Pr3/sJyf+i4q9aqKjaluOK0PB/jf8OoorQeKNEs44khUJfQQIFAXtIAPTofbB7GvA8mvvKWKOaJ4pUWSN1KujDIYHqCO4r5L+KHw/fwR4hP2cM2lXhMlo/XZ6xk+o/UEe9XSm37rFJW1PZPg18Qx4p0UaPqU2dYsUA3N1uIhgB/dh0b8D349Sr4d0bWLzQNXttU0+Yw3ds++Nh+oPqCMgjuCa+wfBfi2y8Z+G7fVbMhXI2XEOeYZQPmU/zB7gipq0+V3Q4yudDRRRWJQV5/8Y/FH/CN+ArmOF9t5qP+iQ46gMPnb8Fz+JFegV8sfGrxWPEPjaSygl3WWlA26YPBk/5aN+YC/wDAaunHmlYUnZHmhOeKBx/EPzrqvh74WPi7xpYaawJtg3nXRHaJeT9M8L9Wr6+Gm2AAAsrYADAAiX/CumpU5dDNRufC+R/eH50uM9x+dfdH9nWP/Pnb/wDfpf8ACl+wWf8Az6Qf9+x/hWft/IrkPhX8RThxzX3R9gs/+fSD/v2P8K+cPjx4YXSPFUGsW0Kpa6nH8wRQAsyAA8D1Xafc5q6da7sTKNlc1v2fPE/k39/4auHO24H2q2BPAdRh1HuRg/8AATX0DXw7oetXOga7Zaran99aTLKBn7wB5X6EZH419r6XqVtrGlWupWb77a6iWWNv9lhkZ96zrxtK6Kg9C3RRRWBZ8xftAjHxGtz66bEf/H5K4zwGAfiF4c/7CVv/AOjBXdftDAf8J/Yn/qFx/wDo2WvOfCuoQaT4w0bULtylta30M0rAEkIrgk4HJ4FdtJ+4jKe59uUV54Pjf4CP/MWm/wDAOX/4mlb42eBACRqszewtJf8A4muTll2NbnoVUdY1ex0HSrjUtSuFgtYF3O7foB6k9AO9eWaz+0LoFtAw0jTb29nwcGYCGMfjyf0rxPxh4/13xrdLJqtwBBGcxWkI2xR++O59zk1Uabe4nJIj8beJp/GPim71iYMiyHZBETny4h91fr3PuTS+BPDM3ivxlp+lIpMLSCS4YfwxLyx/Lj6kVh2lvcX13Fa20Mk9xMwSOKNdzOx6ADvX1b8K/h4vgjRXlvAj6xeAG4YYIiUdI1Pt3Pc/QV0TcYxsjNXbO+VQqhVAAAwAO1LRRXGajJY1mieN/uupU/Q14zNBJa3MtvICHicofwOK9prg/G2kGG6GpxL+7lwsuOzdj+I/Ue9ePnOGdWkqkfs/kz2clxCp1XTltL81t+ozwPfLb6jLaOQBcKNv+8uePyJ/Ku/rxL7S8EiyROUdCGVlPII6Gu80Px3aXMSw6oRbzjjzcfI/v/s/yrHKcXGMPYzdu3+R1Ztl9Scvb01fv/mdjRVeO+tJU3x3UDr6rICKp3/iPSNNiZ7m/hBH8CNvY/gOa94+djFydktTUorx/wAT/EG81Qm304SWdoDywbEkn1I6D2H51veC/H4v3h0vVji6YhIbjtKewb/a9+/8xa7HqTybFwoe3cfl1t3t/T8j0Kiiig8oK53xtoZ1/wAMXNvGu65i/fQAdSy9vxGR+NdFRVRk4yUl0KhNwkpLdHy0TXrXwq1+P+x73TbmYKLLNwhY9Ijy34A8/wDAq4Lx5pH9heLbu3RNtvMfPh4wNrdQPocj8K5+C+ubTzTbzPF50TQybTjcjdVPsa+qlh44vDe711Xr/Wh7OIlGtS066kviPWX13X73UnzieQlAT91Bwo/AAV0fwq0E6v4uS9kUm204ecx7GQ8IP5n/AIDXGFQea+hPhv4eGgeE4PMTF1ef6RN6jI+VfwGPxJrox1VYPCWh2sv69NTgqPkjZHX0UUV8WcYV88fFHTv7L8cXTBCI7xVuUPqTw3/jwP519D1wnxR8Iy+JdBW5sYy+o2OXjRRzIh+8g9TwCPcY716eUYmOHxSc3ZPR/wBethp2PC9H1iTRtastSiG5raZZNv8AeA6j8RkV9TaffW+p6fb31pIJLedBIjDuD/WvkdVy1d54E8e3PhNja3Cvc6W7bmiB+aMnqyZ/Ud/avpc5y6WJpqdL4o/iv62FJpbn0LRXP6Z448NatEHttXtlbAzHO/lOPbDYz+Gat3XifQbOEy3GsWKKP+m6k/gAcmvipU5wlySVn26iurXNWvCvjBr8epa/Bplu+6LT1bzCOnmt1H4AAfUmtnxd8XY3hksvDYclgVa9dduP9xTzn3P5V5IzGRizEsSckk5JNfT5JlNWNRYisuW2ye/a9v677Hl47FxcfZw1EjVmYKqlmJwAO5r6k8Oab/Y/hvTtPIw0ECq/+9jLfrmvHvhb4PfVtXTWbpCLGzfMeRxLKOg+g6n3wPWvdaOJMWny4ZPbV/p+v4BltJ61H6BRRRXyp6oUUUUAFFFFABRRRQAUUUUAFeZ+L2/4qS5Hsn/oIr0yvMfF4z4muT7J/wCgivGzz/dl6r8mevkv+8v0f5owSM1s+Htcl0S553Pauf3kY/8AQh7/AM6yCcVGz8V8zh5TpzU4OzR9TUpRqwcJq6Z7TbXMN3bx3FvIskUgyrL3rl/Gvij+yLb7DZyf6dMvLDrEvr9T2/OuN0bxNe6E8ghxLC4JMT9N2OGHp2z61i3NxLdXElxcSGSaRtzse5r6d5i50rRVpP8Aq/8AX/D+Lh8i5cReo7wWvm/L/Pv+UO4t1rT0HXJ9B1AXMPzIflliJ4df8fQ1ks2OlQvJgVGGpNNNH0tSjGrBwkrp9D37TtQttVsY7y0k3xSDj1B7g+hFYPjrwZbeM9ENs5WK9hy1rOR9xvQ/7JwM/ge1eb+E/FU+gaoq4eaznYLLCvJJ6BlH97279K9wByAfWveo1J05KpF2aPhc0y2WDnyvWMtn+j80fHOpabd6RqM+n38DQXUDbZI27H+oPUHuKqV9KfEr4fJ4u0/7ZYqiaxbr+7J4E69fLY/yPY+xr5tmhlgmeGaN45Y2KujrhlYcEEdjX3GAx0cXS5vtLf8ArsfM1aThK3QYaaaU00muxslI6XwJ4li8KeKINQubWO4tj8koaMM6KT99CejD9RkV9VWd3b39nDd2kyTW8yB45EOQynoa+Li2K9K+FXxIHhu8Gi6rL/xKbh/kkY/8e0h7/wC6e/oefWvFzfAuvBVKfxLp3X+f5/cddCfK7M+jaKQEMAQQQeQR3pa+SOwKKKKACiiigArmfiB/yJGofWL/ANGpXTVzPxA/5EjUPrF/6NSmtwZ01FFFIAooooAwfG//ACIPiP8A7Bdz/wCimr4pVvcfnX3jNDFcQyQzRpJFIpR0dQVZSMEEHqDWR/wh3hf/AKFvR/8AwBi/+JrWnPluTJXPP/2eDn4e3h/6icn/AKLir1qqthpthpcBg0+ytrOEsXMdvEsalj3wABngflVqonLmdxpWQVh+L/C9n4w8N3Oj3nyiQbopQMmKQfdcfT9QSO9blFTsM+G9b0W+8P6zdaVqMRiu7Z9rqeh9GHqCMEH0NdN8MvHE3gfxKtxK7NplziO8hU5yvZwP7y5z7jI719W32gaNqc4nv9IsLuYLt8ye2SRsemSM4quPCPhodPD2k/8AgFH/APE1v7SLXvEcr6Grb3EN3bRXNvIssMqCSORTkMpGQR7EVJUVta29lbJb2sEUECDCRRIFVR7AcCpawLOc8d+JE8KeDdR1XcomSMpbg/xStwv155+gNfGMm53Lu+5mOWYnkk9TX3Re6fZalCIb+zt7qINuCTxK6g9M4I68n86z/wDhEfDR/wCZd0n/AMAo/wD4mtac1FakyTZ5v8APC/8AZ3hq58QXCYn1JtkORyIUOM/8CbP5CvYajgt4bW3jt7eGOGGNQqRxqFVR6ADgCpKiUuZ3GlZBRRRUjCuM+Kfhc+K/AV9axJuvLcfarb1LoCdv4ruX8RXZ0U07O4HwYEJAORzX0l+z94i+2eGLrQJpMzafJ5kIJ/5ZOc4H0bd/30K9IPhHw0SSfDukknkn7FH/APE1asdD0jS5mm0/SrG0lZdpe3t0jYr1xkAccD8q1lOLViEmmX6KKKxLPmb9oSQH4hWa5Hy6ZGP/ACJKf615NjPcV9w33h/RdUuPP1DSLC7mChfMuLZJGwOgyQTjk1W/4Q/wwP8AmXNI/wDAGL/4muiFVRjZkOLbPifBHcUob3Ffa/8Awh3hj/oXNI/8AYv/AImk/wCEN8L/APQt6P8A+AMX/wATT9tFbC5GfFscTzuEiRpHPRUG4n8BXa+HvhB4v8QsjLpzWFs2CZ77MYx6hfvH8se9fV1nplhpwxZWNtbAjGIIlTj8BVqlKvfZDUDhfAPwt0XwMguYyb3VWXa95KuNoPUIv8I/Mn17V3VFFYNt7lhRRRSAKjngiuYHgmQPE42sp6EVJRSaTVmNNp3R5jr3gy8sJXms1e5tOvyjLp9R3+orl2G3I7jrXu1UL3RNM1E5u7KGRv723DfmOa8qeVxTvSdvI+hwueuMVGur+a3+48OkcZPA/KoC46V69L8PdAlct5U6Z/hWZsD86fb+AfDkBybEzH1llZv0zit6WFlDc9H+3sIo31+7/gnkVnpt3q1wLext3uJT2QcD3J6AfWvUPB/gSHQmW/vik2oEfKBykP09T7/l79bbWtvZwiG1gjhiHRI1Cj8hU1d0bxR5eOz2pWi6VFcsX97/AMv61CiiimeAFFFFAHnnxc0L7f4ei1SJf31g+XwOTG2AfyOD+deI819W3EEV1bS286CSGVCjo3RlIwQfwrnf+FeeE/8AoCW/5t/jXt5dmcMPT9nVTfa39I6aVfljys8V8EaH/wAJD4rtLRl3QRnzp/TYvY/U4H419IVk6R4Y0XQZpZtL06G2klUK7JnJA5xya1q58zx0cXOLhflS6/j+hnVnzvQKKKK8wyCiiigDzHxz8LY9Uml1XQVSK9clprYkKkp/vKeit69j7d/Gb21utPumtby3lt51ODHKpU/rX1pVPUdK0/V4PI1GyguouyzRhsfTPSvfy/PJ0IqnWXNFfev8/wCtSJRuj5OIB6j86BgdAB9BX0NefCbwldNlLOa29oLhgPyJNQQ/B7wpE4ZkvZQP4XuTj9MV7UeIMG43u15W/pHn1sJUk9DwRAXYKASScAAcmvQ/CPwt1HVpY7vV1exsODsYYllHsP4R7nn0FevaT4U0HQ23abpdvBJ/z027n/76OT+tbFcGL4kurYaNn3f+Wv8AXQVLLbO9R/cQWdnb6fZxWlpCkNvEu1I0GABU9FFfLSk5Nyk7tnppJKyCiiikMKKKKACiiigAooooAKKKKACvOvGdtNDrb3DoRDMq7H7EgAEfWvRarX9hb6lZva3Kbo3Hbqp7Eehrjx+E+tUeROz3R2YHFfVqym1dbM8bdhmq7sa0tZ0e50a/a3n+ZTzHIBw6+v19RWa/FfKwoyhJxkrNH3FGcJxU4O6ZCx9aidqdIwqs74r1aFK51JCO2KqyyD1qR3BHWu78A+DRdyR63qMeYVObaJh98/3z7Dt69fr7VCkkrsmviaeGpurVei/qyNHwB4L+xKms6nEftTDNvCw/1QP8R/2j+n16ehUUV0N3PgMdjqmMq+0n8l2QV5X8Vvh3/bFvLr+kQj+0IkzcwqOZ0A+8P9sD8xx1Az6pRW2HxFTD1FUpvX8/JnBKKkrM+Ki1MLV6/wDFz4b/AGB5vEujQn7K5LXtug/1TH/lov8AsnuOx56Hjx019vh8TDE01Uh/w3kcLpuLsxCaYRmnE0wtVNlxR7t8GviKbhIvC2sXH7xF22E0h5YD/lkT6gfd9hj0z7VXw6srxSLIjsjqQVZTggjoQa+m/hR8RY/F2lDTtQlA1q0T95nj7QnQSD36Aj1578fNZrgkpOtT26r9f8/6t0welmej0UUV4hoFFFFABXNfED/kSdQ+sX/o1K6WuZ+IP/Ij6h9Yv/RqU1uDOmooopAFFFFABRUN3d29haS3V1KsMES7nkY4Cj1NNsb+01OzjvLG4juLeTOySNsqcHB5+oNOztcCxRUVxcw2ltJcXMqRQxqWeRzgKB3Jptle2uo2kd3Zzxz28gJSSNsq3OOD9RSt1AnoqK5ureytnubqaOGCMZeSRgqqPcmqr6zp6aNJq4uVksEjaUzR/OCo6kY69KaTYF+iqelapaazpsOoWLl7abOxipUnBIPB56g1colFxbjJWaEmmroKKKKQwooooAKKKKACiiigAooqpbala3d3PbQyFpYDiQFSMfjSckrXe41Fu9lsW6KKKYgooooAKKKKACiiigAooooAKKqtqVomopYNNi6ddyx7TyME9cY7GrVJSTvZ7DcWrXW4UUUUxBRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRVHWNYs9C0yXUL+Ro7aMgMyoWPJwOB7mrFndRX1lBdwMWhnjWWMkYJVhkcfQ1XJLl57abXAmoooqQCiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKAKOraVb6xYtbXAx3Rx1RvUV5BrVhcaPfPaXS4ccqw6OvYj2r22sjxFoFv4h01raXCTL80M2MlG/wAD3H/1q5MThVV95bnrZVmP1WfJU+B/h5/5nh7y571CzZqfU9NutKvpbO8jMc0Z5HYjsQe4Na/hDwpP4jvS8m6PToW/fS9Nx/uL7+voPwpUKNlqfcTq0qdL2spe7a9/6/DuXPBXgxtduRfXykabE33f+e7Dt/ujufw9cexKqogRFCqowABgAUyCCK1t44II1jijUKiKMAAVJXb0sfCZnmU8bU7RWy/V+YUUUUjzAooooAa6JLG0ciq6MCrKwyCD1BFfM/xU+Hr+EtROoafGx0W5f5O/2dz/AAH2/un8O2T9NVW1DT7TVtPnsL+BLi1nQpJE44YH+X16iuzBYyWFqcy2e6JnFSR8T5phNdb8QPA934J1w27b5bCbLWlwR99f7p/2h3/A9649jX1kakakFOLumZKIjGrek6reaJqttqWnzGG6t3DxuPX0I7gjgjuDVImoycVjUaaszVI+x/AnjSz8b+H0v7fbHcxkJdW+eYnx/wCgnqD/AFBrp6+MPBnjC/8ABniGHVLNmdPuXFvnCzR91Pv3B7Gvr/Q9bsPEWj22q6bMJbW4Xcp7qe6kdiDwRXzGLoKlO8dmM0KKKK5BhXM/EH/kSNQ+sX/o1K6auZ+IP/Ikah9Yf/RqU1uDOmooopAFFFFAEVzbxXdrNbTLuimRo3X1UjBFec/Cq4k0251rwtck+ZYzl4we652tj2yFP/Aq9LrzTxMqeGfijo+uj5LfUR9nuD2zwuT+BQ/8Br0sv/eRqYb+daf4o6r79V8zmxPuuNXs9fR6F74sai8PhmHSoMmfU51hCjqVBBP67R+NVPhNcz2dtq3hu8wLjTrlsLnPBJBx7bgT/wACpZseJvi/HGDvtNEi3Njp5g5/PcR/3xS6ko8N/Fux1DOy11mPyZDjA8zAH8wh/E120YRWE+qNe9OLnt1XwpesU/vOecn7V1ukWl/nf0bF+LF9PLp+neHrLJudTuFUqP7oIxn/AIER/wB8mt/xHZRaZ8ONQsYR+7t9PaJeMZAXGawLBR4j+L17eHL2uixeSmRwJORj8zIfwFdN43bZ4H1pvS0f+VctZ+yoUcOuvvv56L8PzNoe9OdTtovlv+Jx3hTxvp2heB9KtPJub29CSM1vapuZB5jYLeldX4Z8caT4nle3t/Ot7yMbmt512tjuR2P86z/hVZ28HgOzuYo1Wa6Z3mfHLEOyj8gKyfEcMVl8YPD09uoikuU/eleN/wB5cn8OK3r0cPWxdWkk+a8mndWuru1rbdL38/IiE6lOjGbtbTQ9B1HUbPSbCW+v7hLe2iGXkc8D/E+1cR/wtzSWYzR6Xqz2AODdrb/J9evSsr4uXTS6x4e0uaOeWwabz54YBl5cMBgDucZx9a3B8QrCK2FunhTxEsAXYIxpwCBemMbsYrOhgF9XjWlCU3K9lHolpduz1vsjSdf944JpW7/odbpWrWOt6fHf6dcJPbydGXse4I7H2rMfxlpUOualpVw0sD6dALieaRQI9p29DnJPzjjFcZ8LzNB4m8QW9vYXlnpM5FxbxXMJTYdxGOeM4Pr2FVLjRYPEXxu1G1uMtaQxxzTR5x5gWNAFPtuI/KrWV01iJ05tqKhzK61W267rZrS7XQiWKlyRcUm72/4Y7rwz400/xXc3kVhDcKlsFJklUKHznoM57d6h1rx9pWk6g2nQxXWo36fegs495Q+hPY/nWzqcg0nw9fTWcUcf2a2kkjRVAUFVJHH4V5b8PfElpoWizSyaLrF7eXM7NNdW1r5gb0G7I+v1NYUMLSrupUpxk4xtZLWTv5pabO+nkXUqyhyxk1d9eiO58P8Aj7SNevjp224sdRH/AC63cexm78djx2611VeL+O9bfxDLpl7pPh/XLfU7Kbcs8tkVO3qBlSScHB/E+teywu0kEbuu12UFl9DjpU43BqjThVUXHmurS3TXyV00+xVGtzycW07dUPrmtCAHibWf9/8Aqa6WuW0An/hK9a9N39a8HFu0qX+L9GenhVeNT/D+qN7UNTtNLt/Ou5Qik4UAZLH2FZg8WWSshuLa9t4n+7LLCQprJ1S+WPxsrXFvPcx2sYMccKbiDjOcfU/yq5feIre9sprWTRtWKyoV5tuM9u/rWEsbzTnGM4x5XbXdv71ZfedEMFaEJShKXNr7uyX3O7+46ZHSRFdGDIwyGU5BFYVz4ts4biWCG2u7h4mKv5cRwCOvWo/BrXEWgNHeJJF5MjBfNUrhcA9+2SaIvEc968n9kaTJcRK3MrMEBNV9dVShCpF8rl3Tb+SW+pP1J0686couSj2aS8rt3toXNL8R2WqTeQglin/55yrgn1xVvVNTg0myN1cLI0YYKQgyea5DVr64k1rS5Z9MeznWZQXJyJBkcZx2/rWx43/5FuT/AK6J/OppY2UoVdm4K97NX07PXoVUwUYzpbpTdrXTtr3WnUsXninT7PylPmSSyoriNFGVB6Z54q5qmr2+krC1wsjCV9i7ADg++SKqeGtJh0/S4ZditczIJJJCMk5HTPoKzfHIDW9gp6NMR+lU8TWjhXXla9k0tfx1/wCG8yFh6MsSqEW7Xs3p+H9a+RaufGNjC7eTb3NxGhw0safJ+BPWtbTdTtdVtftFq5Zc4ZSMMp9CKsRQRQQLBFGqxKu0IBwBXM+GkWDxBrNvENsSvwo6D5jitHOvTnD2jTUnbRbO1++v4EKnQqU5ezTTir6ta622tp97NSe501PEttbvbk6g8ZZJQvAXDd8+x/Op9U1e30lInuEkYSNtGwA4Pvkise+H/FwdNP8A07N/KSofHn/HnZD1mI/Spq13Sp1ZxS91/fonr946dBValKDb95fdq1p9xdufF1jBI6xRXFwiHDyxJ8g/E9a1NN1S11a28+1fcAcMpGGU+4qeC2htrZLeJAsSLtC44xXMeG4ltvE2sW8Q2xA8IOg+bj+dOVSvTnD2lmpO1ktnbvfXzCNKhUhP2d7xV7t6NX10tp5b+pvapq9npEAlu5CN3CooyzfQVmW/i+zkdRPbXVtGxwsskfy/iarGGK98eyrc/OsEIaJG5GcKf/Zia6eaGOeF4pUDxuMMrDgiiNWtWnP2bSUXbVXu+vVWQSpUaMIe0Tbkr6O1l06O7Kdhq1vqNxdQwB82zbWYgYbk8jB5HFX65HwYiQ3+tQRNujilVFPqAXA/lXXVvhqsqtPmkrO7/BtGGIpxp1OWLurL8UmNkkjhieWV1SNFLM7HAUDqSewrhZfivopmcWNjqd/BE2JLi2t8oPcEnn9Kb8YLua28D+XE5QXNykMmO64Zsfmoqto3jXTdA0W00628L+I1SGNQdmn8M2OW+9zk85r2MNhFOi6ri5a2svS93ozOMVa52OgeI9M8TWJu9Mn8xVO2RGG14z6MO38qg0/xXYaj4kvtBWK5hvbMEsJkCq4yOVIJyOQe3BrgfDN5JN8WXvNN0jUbDTb+BhOlzamMbwu7PcDkevc+taXjuBvD3i/RfGFuMRiQW17gdVIOD/3yWH4CrlgIxrKk7rmjdX3T6J/NW+4bgr27noV7dw2FjPeXDbYYI2kc+gAyao+Hdft/EukpqVpBcw27uyp9oQKWxwSACeM5H4GuW+J+pSyaTY6Dp7B7rWJljXac/uwQSfoSV59M1N4z/wCKU+GElnYFl2RR2quOCAxAZvqRn865oYbmpRf2pOy/V/e0vvEo6eo7UvihoVleyWdnHd6nPGcP9ji3qD3+bv8AhmtHw5460bxNM1taySwXigk21wmx+OuOx/nS+BNFtNG8I6ettGoe4gSeaQDl2Zc8+wzgVy/xZsY9Oi07xPZ4g1G3ukQyIMFxgkZ9cbcfQkVuqOGlW+rq972v0vttba/mNKLfKb/xNAPw91TPbyj/AORUqzYapHonw903UJ4J5ooNPgZ1gUFsbFycEjpWZ8TLov8ADK9mAx5qwnHpl1Nb3h2KO58F6VDKoeOXToVdT0IMYBFK1sD738/6C+x8y3o+q22t6Tb6lZlvInXcocYYc4IPuCCKo694psfD1zYW1xFcz3F9J5cMVugZieBzkjjJFcl8ObmTRNc1rwdeMfMtpTPa7v44z1x+BU/iafpRHi34oXupnD2Gir9ngIIIaTkZHrzuP4LSeEhGvJSb5Eua/Vrp+LS9R8qUvI7fWda0/QNNe/1K4WC3TjJ5LHsAO5rj1+Lej5Esul6vFYtgC7e2+T69elY3j+8hn+ImkWl/bXN1p9pGJmtbePzGlY7j93jP3VB9ga3rnx5p13ZyWlx4U8RSW8iFGjbTvlK9Mfeq6WEXsozcJTcu3RbdnqCirao7KyvbXUrKK8s50ntpl3RyIchhXN6x4/03TNSk022tb3U7yH/Wx2UW8R+xPr7Vg/CCO9s7HWLGe2uoLSO5ElstzEUbDA56/wC6v4k+tZ6S+IPhz4g1if8AsSTU9IvpzObiHJZASSMkA4xuwQRjjg0/qEY4mdHeyTSuk3e2mvWz19AcEpNHc+HfGWm+JLiW1t47q3vIk3yW9zCUYDIGfTqRXQ1y3hjxroPiq6f7DmLUFjG+KaMLJtB6A9wCfXvXU1xYiChPlUXHyf8AwyIkFFFFYCCiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKAMPxJ4XsvElvGlwWimjOUmQDcB3HuD/AD5rTsLC20yxis7SIRwRLhVH8z6mrNFBs8RVdJUXL3U72/r+t+4UUUUGIUUUUAFFFFABRRRQBj+J/Ddh4s0G40nUEzHIMpIB80Tjo6+4/UEjoa8pP7Otqf8AmZZ//ARf/iq9uoropYqtRi4wlZCsjxD/AIZztP8AoZZ//ARf/iqQ/s42h/5maf8A8BF/+Kr3CireOrveX5BY8N/4ZvtQf+Rnn/8AANf/AIqu38AfDu48BS3KReIJb2yuBl7WS3CgP2cHccHHB9ePQV3dFZSxFSSs2FgooorEYVzPxA/5EjUPrF/6NSumrG8V6Vca34au9PtTGJpSm0yEheHVjkgHsDTW4M2aKKKQBRRRQAVx3xN0STWvBs/2dHe6s3W5iVFyxK8EDHPQn8hXY0VrQqyo1Y1Y7xaf3EzipxcX1PPvhPpV5baLe6pqUcq32oXLM/nIVcqpPJB55JY1Z+Kej3Gp+Exc2UbveWE6TxiJSzkZwQAPqD/wGu4orqnjnLFrFRjazVkuy6fcjJUEqXs799Tifhdo0+meFDc3sbpe38zXEokUhwM4AIP0J/4FWz40t5brwXq8EEbyyvauFRFLMxx0AHWt2iscRiXWrus1bXbslsvkioUlCnyI5b4c209n4B0u3uYZIZkEm6ORSrL+8Y8g1j+KbC7n+J/hm6itZ5II1+eRIyVXDHqRwOteg0VrHG8uLlieXdydr/zX6+VyZUeakqd+34HIePPC93rtpZ32lOE1bTpfNt8kDf0JXJ75AIzxx75rLHxNu7aAQ3/hTVU1EDDRRxnYzexPOD9D+Neh0UU8XB0lRrQ5lG9rOzV91s9Pl8wlSfM5wdm9+pzfg2/8SalYXF14isIrIvLm2hUEOE/2gent39hXPaJYXSfGrXrx7adLZrQBJWjIRjiLgHGD0P5V6LRTpY2NKdSUIWU4uNr7Xt3vfb5+QToucYpvZpkc8EdzbyQTIHilQo6nuCMEV5Zpk+vfDK4udOn0u41TQ3kMkFxbLlkz6/1BxzyDXq9FZ4bFKipQnHmhLdbbbNPo0VVpc9mnZo8/tPGHiTxHqtpHomgy2lgkgN1cX67Qyd1X357ZPToM16BRRUV6lKdlShyped2/Xp9yQ6cZK/M7hXOaLbzR+JNXkeGRUdvldlIDc9j3ro6K4atL2ji7/C7/AIP/ADOqlV9mpK26t+K/yOb1vT7221WLW9Nj86VV2Sw92Ht+H9KYfFlxKmy10W8a5PAV1woP1/8A1V09FYvDTjOUqM+Xm3Vr691t+ptHE03CMasObl21tp2f9IoRRXt3ojQ34jjupYmR/LOQCQRXO6Tqlx4ftjp99plySjEq8S7g2f8APWuxoqqmHlJwlCVnHur3v327dLE08RFKcZR0l2drW7b9+tziNT/tXV9T026fT5obZJhsTaWYDIJZsDgdK2fGEEtx4fkjhiklcuvyopY9fQVvUVlDByXtHKd3NW220aNZY2N6fLCyg7776p/oV7FWTT7ZWBVhEoIIwQcCuf8AGdrcXKaeIIJZSsxLeWhbHHfFdRRW1XDe0w/sL9LXMaWI9niFWt1vYK5zRLaeLxHq8skEqRyP8jshAbk9D3ro6K0q0vaOLvs7/g1+pnSq+zUlbdW/FP8AQ528glbxzYTLE5jW3IZwp2jh+p/EUzxhaz3VvZiCCWUrNkiNC2BjqcV0tFZVMNzwqRv8f4aJfoaU8TyTpzt8P46t/qFczosEyeKtXkeGRY2PyuykA89j3rpqK0rUfaOLvbld/wAyKNb2akrX5lb8jA1zQ7i6u4tR02YQ30XHPRx/k496hA8U3qi2mW3s0PD3EZy+O+Bk8/54q9q2k3V5cR3VlqMtrPGmwL1RhnPI/wD19BWfPpPiW8iMFxq8CRNwxiTDEfkK4a0XCrLlU1f+W1n567Pp02udtFqdKKk4O3817ry03XXruVvA8UcVzq6wsWhWRVRj/EAX5rsKoaRpUGj2K20GW53O56sfWr9dWCpOlQUJKz107Xbdvkc2Nqxq13OLutNe9klf5nP+M/DS+K/Dc+m+aIpsiSFz0DjOM+xyR+Nclp3jvWfD1hFpniHw3qUl3bqI1nt49yygcA56Z9wTmvTaK9SjiIxg6VSPNG997NP11+4509LM5XwnrPiPXLu7u9T0ldO0wqBaxy5ExOeSfbHsO2M81reI9HTXvD97pzgZmjOwn+Fxyp/MCtSis51IufPTjy226/mJvW6PKfh5pmr6rr0eqa7bTwjSLVbO1WeIoS3IzyOcDPPuK9C8R6LF4i0C80uZtgnTCvjOxgcqfwIFalFa4nFurVVSK5bbeXX89Ryk27nlWjeKfEHgmzTRfEGg3t1Fb/Jb3VsN4ZB0GehAGMcggcEUXNrrnxM1ey+16dPpfh60kErLPw859h69vQAnkmvVaK1eNhz+1jTtPvfS/e3f5lc6ve2pxvxQtZ7n4f31vaW8k0haLbHChY4DjoBW94ajeLwro8cisjpZQqysMEEIMgitSiuf6xeh7G3W9/lYnm92x5t8SNL1Ky1XTfFGhQSvfRK9tKIYy5KspwSAM8ZYZ9xXQ/D/AMPnw74StYJVIu5/9IuNwwQ7dj9BgfUGuooq3i5PD+wt8/LdL73cOb3bHDeO/DuqXF/p/iTQPn1PT+DD/wA9Y+Tgep5YY7hj3qifipOIvI/4RPV/7S+75Hlnbv8ATOM9favR6KIYinyKFWHNbazs/TZ3QKStZowvC11r95of2jX7OC1vndmSFGxhDyobrg9u/GM85rmo/HfiDRZJIPE3he6yHOy409fMjKk8D8B3z+Ar0KipjVo88nKno+ib09Hr+KfyC6vseY+HbO88RfEj/hKk0mbTdPigKAzpsadiCucd+vX2HNenUUUsRX9s42VlFWWt9PUJO4UUUVzkhRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQB//2Q==" alt="RADevo" height="40" style="display:block;"></td>',
      '<td align="right"><span style="background:#F97316;color:#fff;padding:4px 14px;border-radius:20px;font-size:11px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;">&#9889; Live Assignment</span></td>',
      '</tr></table></td></tr>',
      '<tr><td style="background:#F8F9FF;padding:12px 32px;border-bottom:1px solid #E5E9F5;">',
      '<span style="font-size:12px;font-weight:600;color:#6B7280;">' + cls + '</span></td></tr>',
      '<tr><td style="padding:32px 32px 24px;">',
      '<p style="margin:0 0 16px;font-size:15px;color:#374151;line-height:1.6;">Your teacher has started an in-lesson assignment. Please complete it now.</p>',
      (message ? '<div style="background:#F8F9FF;border-left:3px solid #7C3AED;border-radius:0 8px 8px 0;padding:12px 16px;font-size:14px;color:#374151;font-style:italic;margin-bottom:16px;">' + message + '</div>' : ''),
      '</td></tr>',
      '<tr><td style="padding:0 32px 28px;">',
      '<table width="100%" cellpadding="0" cellspacing="0" style="background:#F8F9FF;border:1px solid #E5E9F5;border-radius:14px;overflow:hidden;">',
      '<tr><td style="background:#F97316;padding:3px;font-size:0;"> </td></tr>',
      '<tr><td style="padding:20px 24px;">',
      '<span style="font-size:11px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:#6B7280;">Quiz</span><br>',
      '<span style="font-size:17px;font-weight:700;color:#0B122B;">' + quizName + '</span>',
      '</td></tr></table></td></tr>',
      '<tr><td style="padding:0 32px 32px;">',
      '<table cellpadding="0" cellspacing="0"><tr>',
      '<td style="background:linear-gradient(135deg,#F97316,#EC4899);border-radius:12px;">',
      '<a href="' + quizUrl + '" style="display:inline-block;padding:14px 32px;color:#fff;font-size:15px;font-weight:700;text-decoration:none;">Start Assignment &rarr;</a>',
      '</td></tr></table></td></tr>',
      '<tr><td style="background:#F8F9FF;border-top:1px solid #E5E9F5;padding:20px 32px;">',
      '<p style="margin:0;font-size:12px;color:#9CA3AF;">Set by ' + email + ' via RADevo. Sign in with your school Google account when prompted.</p>',
      '</td></tr>',
      '<tr><td style="background:linear-gradient(90deg,#F97316,#EC4899,#7C3AED,#2563EB);height:3px;font-size:0;"> </td></tr>',
      '</table></td></tr></table></body></html>'
    ].join('');

    students.forEach(function(studentEmail) {
      try {
        MailApp.sendEmail({
          to:       studentEmail,
          from:     email,
          subject:  "In-Lesson Assignment: " + quizName + " (" + cls + ")",
          htmlBody: emailBody
        });
        sent++;
      } catch(e) { console.log("Email failed for " + studentEmail + ": " + e.message); }
    });

    // Save to Assignments sheet
    sheet.appendRow([assignId, email, cls, quizName, quizKey, new Date(), message, sent, "Active"]);

    var startedAt = new Date().toISOString();
    return {
      success:    true,
      assignId:   assignId,
      quizUrl:    quizUrl,
      quizKey:    quizKey,
      quizName:   quizName,
      className:  cls,
      startedAt:  startedAt,
      sent:       sent,
      total:      students.length
    };

  } catch(e) {
    return { error: "startAssignment error: " + e.message };
  }
}


/**************************************************************
 * GET ASSIGNMENT LIST
 **************************************************************/
function getAssignmentList(callerEmail) {
  try {
    var email = (callerEmail || "").toLowerCase().trim();
    if (!isTeacher_(email)) return { error: "Access denied." };

    var ss    = SpreadsheetApp.openById(CONFIG.SHEET_ID);
    var sheet = getAssignmentsSheet_(ss);
    if (sheet.getLastRow() < 2) return { assignments: [] };

    // Read assignments first to get start times for filtering
    var assignRows = sheet.getRange(2,1,sheet.getLastRow()-1,ASSIGNMENT_HEADERS.length).getValues();

    // Build map of startedAt per assignmentId (class+quiz+startTime)
    // Key: className|quizName|startedAt_iso
    var assignStartMap = {}; // key: cls|quiz -> array of start times
    assignRows.forEach(function(r) {
      var cls  = String(r[2]||"");
      var quiz = String(r[3]||"");
      var t    = r[5] ? new Date(r[5]) : null;
      var key  = cls + "|" + quiz;
      if (!assignStartMap[key]) assignStartMap[key] = [];
      if (t) assignStartMap[key].push(t);
    });

    // Read scores for submission counts — only count after assignment started
    var scoreSheet = ss.getSheetByName(CONFIG.SHEET_NAME);
    var submittedMap = {}; // key: cls|quiz|startedAt_index -> Set of emails
    if (scoreSheet && scoreSheet.getLastRow() > 1) {
      var numCols = Math.min(scoreSheet.getLastColumn(), 10);
      var sRows   = scoreSheet.getRange(2,1,scoreSheet.getLastRow()-1,numCols).getValues();
      sRows.forEach(function(r) {
        var rowEmail = String(r[2]||"").toLowerCase().trim();
        var rowClass = String(r[3]||"");
        var rowQuiz  = String(r[4]||"");
        var rowAct   = String(r[5]||"");
        var rowTs    = r[0] ? new Date(r[0]) : null;
        if (rowAct !== "FINAL SUBMISSION") return;
        var key      = rowClass + "|" + rowQuiz;
        var starts   = assignStartMap[key] || [];
        // Add to each assignment's submitted map if submission is after that start
        starts.forEach(function(startT, idx) {
          if (!rowTs || rowTs >= startT) {
            var mapKey = key + "|" + idx;
            if (!submittedMap[mapKey]) submittedMap[mapKey] = {};
            submittedMap[mapKey][rowEmail] = true;
          }
        });
      });
    }

    var assignments = assignRows.reverse().map(function(r, revIdx) {
      var cls      = String(r[2]||"");
      var quizName = String(r[3]||"");
      var startedAt = r[5] ? new Date(r[5]) : null;
      var key      = cls + "|" + quizName;
      var starts   = assignStartMap[key] || [];
      // Find original index (before reverse)
      var origIdx  = starts.length - 1 - revIdx;
      if (origIdx < 0) origIdx = 0;
      var mapKey   = key + "|" + origIdx;
      var submitted = submittedMap[mapKey] ? Object.keys(submittedMap[mapKey]).length : 0;
      return {
        id:        String(r[0]||""),
        setBy:     String(r[1]||""),
        className: cls,
        quizName:  quizName,
        quizKey:   String(r[4]||""),
        startedAt: r[5] ? new Date(r[5]).toISOString() : "",
        message:   String(r[6]||""),
        emailed:   Number(r[7])||0,
        status:    String(r[8]||""),
        submitted: submitted
      };
    });

    return { assignments: assignments };
  } catch(e) {
    return { error: "getAssignmentList error: " + e.message };
  }
}


/**************************************************************
 * GET LIVE ASSIGNMENT PROGRESS
 * Returns per-student progress for a live assignment
 **************************************************************/
function getLiveAssignmentProgress(className, quizName, callerEmail, startedAt) {
  try {
    var email = (callerEmail||"").toLowerCase().trim();
    if (!isTeacher_(email)) return { error: "Access denied." };

    var ss         = SpreadsheetApp.openById(CONFIG.SHEET_ID);
    var scoreSheet = ss.getSheetByName(CONFIG.SHEET_NAME);
    var students   = getStudentsForClass_(className);

    if (!scoreSheet || scoreSheet.getLastRow() < 2) {
      return { students: students.map(function(e){ return { email:e, name:e.split("@")[0], status:"not_started", activities:{} }; }) };
    }

    var numCols = Math.min(scoreSheet.getLastColumn(), 10);
    var rows    = scoreSheet.getRange(2,1,scoreSheet.getLastRow()-1,numCols).getValues();
    var ACTIVITIES = ["Fill in the Blanks","Match Keywords","Multiple Choice","True or False"];

    var studentMap = {};
    students.forEach(function(e) {
      studentMap[e.toLowerCase()] = { email:e, name:e.split("@")[0], status:"not_started", activities:{}, submitted:false };
    });

    rows.forEach(function(r) {
      var rowEmail  = String(r[2]||"").toLowerCase().trim();
      var rowClass  = String(r[3]||"");
      var rowQuiz   = String(r[4]||"");
      var rowAct    = String(r[5]||"");
      var rowStatus = String(r[9]||"");
      if (rowClass !== className || rowQuiz !== quizName) return;
      if (!studentMap[rowEmail]) return;
      // Only count activity after assignment was started
      if (startedAt) {
        var ts = r[0] ? new Date(r[0]) : null;
        if (ts && ts < new Date(startedAt)) return;
      }

      if (rowAct === "FINAL SUBMISSION") {
        studentMap[rowEmail].status    = "submitted";
        studentMap[rowEmail].submitted = true;
      } else if (rowStatus === "LATEST" || rowStatus === "Yes") {
        if (studentMap[rowEmail].status !== "submitted") studentMap[rowEmail].status = "in_progress";
        studentMap[rowEmail].activities[rowAct] = {
          correct: Number(r[6])||0,
          total:   Number(r[7])||0,
          pct:     Math.round(Number(r[8])||0)
        };
      }
    });

    return { students: Object.values(studentMap), activities: ACTIVITIES };
  } catch(e) {
    return { error: "getLiveAssignmentProgress error: " + e.message };
  }
}

/**************************************************************
 * GENERATE QR CODE
 * Fetches QR code image via UrlFetchApp (bypasses iframe sandbox)
 * and returns it as a base64 data URL for display.
 **************************************************************/
function generateQRCode(url, size) {
  try {
    size = size || 200;
    var apiUrl = "https://api.qrserver.com/v1/create-qr-code/?size="
      + size + "x" + size + "&data=" + encodeURIComponent(url) + "&format=png";
    var response = UrlFetchApp.fetch(apiUrl, { muteHttpExceptions: true });
    if (response.getResponseCode() !== 200) return null;
    var bytes   = response.getContent();
    var base64  = Utilities.base64Encode(bytes);
    return "data:image/png;base64," + base64;
  } catch(e) {
    console.log("generateQRCode error: " + e.message);
    return null;
  }
}


/**************************************************************
 * GENERATE QR CODE AS HTML TABLE
 * Pure server-side QR generation — no external dependencies.
 * Returns an HTML table of black/white cells that renders inline.
 **************************************************************/
function generateQRCodeHTML(url, size) {
  try {
    size = size || 200;
    // Use goqr.me API which is reliable with Apps Script
    // Use quickchart.io — reliably returns proper PNG QR codes from Apps Script
    var apiUrl = "https://quickchart.io/qr"
      + "?text=" + encodeURIComponent(url)
      + "&size=" + size
      + "&format=png"
      + "&ecLevel=M";

    // quickchart.io reliably returns proper PNG QR codes
    var response = UrlFetchApp.fetch(apiUrl, { muteHttpExceptions: true });
    var bytes    = response.getContent();

    if (response.getResponseCode() !== 200 || bytes.length < 500) {
      return null;
    }

    var b64     = Utilities.base64Encode(bytes);
    var dataUrl = "data:image/png;base64," + b64;
    return '<div style="text-align:center">'
      + '<img src="' + dataUrl + '" width="' + size + '" height="' + size
      + '" style="border-radius:8px;display:block;margin:0 auto" alt="QR Code">'
      + '</div>';

  } catch(e) {
    console.log("generateQRCodeHTML error: " + e.message);
    return null;
  }
}


/**************************************************************
 * GENERATE QR CODE AS BASE64
 * Returns raw base64 PNG string (no data: prefix).
 * Client converts to Blob URL to bypass iframe data: restriction.
 **************************************************************/
function generateQRBase64(url, size) {
  try {
    size = size || 200;
    var apiUrl = "https://quickchart.io/qr"
      + "?text=" + encodeURIComponent(url)
      + "&size=" + size
      + "&format=png"
      + "&ecLevel=M";
    var response = UrlFetchApp.fetch(apiUrl, { muteHttpExceptions: true });
    var bytes    = response.getContent();
    if (response.getResponseCode() !== 200 || bytes.length < 500) return null;
    return Utilities.base64Encode(bytes);
  } catch(e) {
    console.log("generateQRBase64 error: " + e.message);
    return null;
  }
}


/**************************************************************
 * GENERATE QR CODE AS HTML TABLE
 * Pure server-side QR generation using a simple encoding.
 * Returns an HTML table of black/white cells — no images needed.
 * Based on QR Code Model 1 for short URLs.
 **************************************************************/
function generateQRTable(url, cellSize) {
  try {
    cellSize = cellSize || 4;
    // Use quickchart.io SVG format — SVG renders inline in innerHTML
    var apiUrl = "https://quickchart.io/qr"
      + "?text=" + encodeURIComponent(url)
      + "&format=svg"
      + "&ecLevel=M"
      + "&size=200";

    var response = UrlFetchApp.fetch(apiUrl, { muteHttpExceptions: true });
    if (response.getResponseCode() !== 200) return null;

    var svg = response.getContentText();
    if (!svg || svg.indexOf('<svg') === -1) return null;

    // Make SVG responsive and styled
    svg = svg.replace('<svg ', '<svg style="display:block;margin:0 auto;max-width:200px;height:auto;border-radius:8px;" ');
    return '<div style="text-align:center">' + svg + '</div>';

  } catch(e) {
    console.log("generateQRTable error: " + e.message);
    return null;
  }
}


/**************************************************************
 * GENERATE QR CODE AS HTML TABLE OF CELLS
 * Pure server-side implementation — no external libraries.
 * Fetches the QR matrix from quickchart and converts to HTML.
 **************************************************************/
function generateQRCells(url) {
  try {
    // Get QR as SVG — uses path stroke format: "M1 1.5h7" means row 1, cols 1-7
    var apiUrl = "https://quickchart.io/qr?text=" + encodeURIComponent(url) + "&format=svg&size=200&margin=1";
    var svg    = UrlFetchApp.fetch(apiUrl).getContentText();

    // Extract viewBox dimensions
    var vbMatch = svg.match(/viewBox="0 0 (\d+) (\d+)"/);
    if (!vbMatch) return null;
    var vbSize = parseInt(vbMatch[1]); // e.g. 51

    // Parse black path strokes: each "Mx y.5h..." means a horizontal run of black cells
    // Format: M{x} {row+0.5}h{width} draws a horizontal stroke 1px tall
    var cells = [];
    var pathMatch = svg.match(/stroke="#000000"[^>]*d="([^"]+)"/);
    if (!pathMatch) {
      // Try alternate: path with fill=#000
      pathMatch = svg.match(/fill="#000000"[^>]*d="([^"]+)"/);
    }

    if (pathMatch) {
      var d = pathMatch[1];
      // The SVG path format is: M{x} {y}h{w}m{dx} {dy}h{w}m{dx} {dy}h{w}...
      // First M is absolute, subsequent m commands are relative
      var curX = 0, curY = 0;
      // Split on M/m commands
      var parts = d.split(/(?=[Mm])/);
      parts.forEach(function(part) {
        if (!part) return;
        var isAbs = part[0] === 'M';
        part = part.slice(1).trim();
        // Each part may have multiple h segments separated by m
        // Format: "{x} {y}h{w}m{dx} {dy}h{w}..."
        var segs = part.split(/m/i);
        segs.forEach(function(seg, si) {
          seg = seg.trim();
          if (!seg) return;
          var hIdx = seg.indexOf('h');
          if (hIdx === -1) return;
          var coords = seg.slice(0, hIdx).trim().split(/\s+/);
          var w = parseFloat(seg.slice(hIdx + 1));
          if (coords.length < 2 || isNaN(w)) return;
          var dx = parseFloat(coords[0]);
          var dy = parseFloat(coords[1]);
          if (si === 0) {
            // First segment: coords are absolute (M) or absolute offset
            if (isAbs) { curX = dx; curY = dy; }
            else        { curX += dx; curY += dy; }
          } else {
            curX += dx; curY += dy;
          }
          cells.push({ x: curX, y: Math.floor(curY), w: w, h: 1 });
          curX += w; // advance X after drawing
        });
      });
    }

    if (!cells.length) return null;

    // Scale to ~280px
    var outputSize = 280;
    var scale = outputSize / vbSize;
    var cellPx = Math.max(1, Math.round(scale));

    var html = '<div style="display:inline-block;background:#fff;padding:10px;border-radius:8px;line-height:0;">'
      + '<div style="position:relative;width:' + Math.round(vbSize * scale) + 'px;height:' + Math.round(vbSize * scale) + 'px;">';

    cells.forEach(function(c) {
      html += '<div style="position:absolute;'
        + 'left:' + Math.round(c.x * scale) + 'px;'
        + 'top:'  + Math.round(c.y * scale) + 'px;'
        + 'width:' + Math.round(c.w * scale) + 'px;'
        + 'height:' + Math.round(1 * scale) + 'px;'
        + 'background:#000"></div>';
    });

    html += '</div></div>';
    return html;

  } catch(e) {
    console.log("generateQRCells error: " + e.message);
    return null;
  }
}


function debugQRSVG() {
  var url = ScriptApp.getService().getUrl() + "?confirmed=1&quiz=cyber";
  var apiUrl = "https://quickchart.io/qr?text=" + encodeURIComponent(url) + "&format=svg&size=200&margin=1";
  var svg = UrlFetchApp.fetch(apiUrl).getContentText();
  console.log("SVG length:", svg.length);
  console.log("First 500:", svg.slice(0, 500));
  console.log("Has rect:", svg.indexOf('<rect') > -1);
  console.log("Has path:", svg.indexOf('<path') > -1);
}


/**************************************************************
 * STOP ASSIGNMENT
 * Marks an assignment as Stopped in the Assignments sheet.
 **************************************************************/
function stopAssignment(className, quizName, callerEmail) {
  try {
    var email = (callerEmail||"").toLowerCase().trim();
    if (!isTeacher_(email)) return { error: "Access denied." };

    var ss    = SpreadsheetApp.openById(CONFIG.SHEET_ID);
    var sheet = getAssignmentsSheet_(ss);
    if (sheet.getLastRow() < 2) return { error: "No assignments found." };

    var rows = sheet.getRange(2, 1, sheet.getLastRow()-1, ASSIGNMENT_HEADERS.length).getValues();
    // Find the most recent active assignment for this class+quiz
    for (var i = rows.length - 1; i >= 0; i--) {
      if (String(rows[i][2]) === className && String(rows[i][3]) === quizName && String(rows[i][8]) === "Active") {
        sheet.getRange(i + 2, 9).setValue("Stopped");
        return { success: true };
      }
    }
    return { error: "No active assignment found." };
  } catch(e) {
    return { error: "stopAssignment error: " + e.message };
  }
}


/**************************************************************
 * GET STUDENT CLASS FROM SCORES SHEET
 * Looks up the most recent class a student has scored in.
 **************************************************************/
function getStudentClass(callerEmail) {
  try {
    var email = (callerEmail || "").toLowerCase().trim();
    var ss    = SpreadsheetApp.openById(CONFIG.SHEET_ID);
    var sheet = ss.getSheetByName(CONFIG.SHEET_NAME);
    if (!sheet || sheet.getLastRow() < 2) return { className: null };

    var rows = sheet.getRange(2, 1, sheet.getLastRow()-1, 4).getValues();
    // Find most recent row for this student
    for (var i = rows.length - 1; i >= 0; i--) {
      if (String(rows[i][2]).toLowerCase().trim() === email && rows[i][3]) {
        return { className: String(rows[i][3]) };
      }
    }
    return { className: null };
  } catch(e) {
    return { className: null, error: e.message };
  }
}


/**************************************************************
 * GET PENDING WORK FOR STUDENT
 * Returns active homework and assignments for the student's class.
 **************************************************************/
function getPendingWork(callerEmail) {
  try {
    var email = (callerEmail || "").toLowerCase().trim();
    var ss    = SpreadsheetApp.openById(CONFIG.SHEET_ID);

    // Get student's class
    var classResult = getStudentClass(callerEmail);
    var className   = classResult.className;
    if (!className) return { items: [] };

    var items = [];
    var now   = new Date();

    // ── Homework 
    var hwSheet = getHomeworkSheet_(ss);
    if (hwSheet && hwSheet.getLastRow() > 1) {
      var hwRows = hwSheet.getRange(2, 1, hwSheet.getLastRow()-1, HOMEWORK_HEADERS.length).getValues();
      hwRows.forEach(function(r) {
        var hwClass  = String(r[2] || "");
        var status   = String(r[9] || "");
        var dueDate  = r[5] ? new Date(r[5]) : null;
        if (hwClass !== className) return;
        if (status !== "Active") return;
        if (dueDate && dueDate < now) return; // past due

        items.push({
          type:      "homework",
          quizName:  String(r[3] || ""),
          quizKey:   String(r[4] || ""),
          dueDate:   dueDate ? dueDate.toISOString() : null,
          setBy:     String(r[1] || ""),
          message:   String(r[6] || ""),
          className: hwClass
        });
      });
    }

    // ── Assignments 
    var assignSheet = ss.getSheetByName(ASSIGNMENTS_SHEET);
    if (assignSheet && assignSheet.getLastRow() > 1) {
      var assignRows = assignSheet.getRange(2, 1, assignSheet.getLastRow()-1, ASSIGNMENT_HEADERS.length).getValues();
      assignRows.forEach(function(r) {
        var aClass    = String(r[2] || "");
        var status    = String(r[8] || "");
        var startedAt = r[5] ? new Date(r[5]) : null;
        if (aClass !== className) return;
        if (status !== "Active") return;
        // Only show assignments started within last 4 hours
        if (!startedAt || (now - startedAt) > 4 * 60 * 60 * 1000) return;

        items.push({
          type:      "assignment",
          quizName:  String(r[3] || ""),
          quizKey:   String(r[4] || ""),
          startedAt: startedAt.toISOString(),
          setBy:     String(r[1] || ""),
          message:   String(r[6] || ""),
          className: aClass
        });
      });
    }

    // Sort: assignments first (live now), then homework by due date
    items.sort(function(a, b) {
      if (a.type === "assignment" && b.type !== "assignment") return -1;
      if (b.type === "assignment" && a.type !== "assignment") return 1;
      if (a.dueDate && b.dueDate) return new Date(a.dueDate) - new Date(b.dueDate);
      return 0;
    });

    var baseUrl = ScriptApp.getService().getUrl();
    items.forEach(function(item) {
      item.quizUrl = baseUrl + "?confirmed=1&quiz=" + encodeURIComponent(item.quizKey);
    });

    return { items: items, className: className };
  } catch(e) {
    return { items: [], error: e.message };
  }
}
/***********************************************************
 * CONFIG
 **************************************************************/

/**************************************************************
 * GET STUDENT HOMEWORK
 * Returns all homework set for the student's class,
 * with submission status for each item.
 **************************************************************/
function getStudentHomework(callerEmail) {
  try {
    var email     = (callerEmail||"").toLowerCase().trim();
    var classRes  = getStudentClass(email);
    var className = classRes.className;
    if (!className) return { items: [], className: null };

    var ss      = SpreadsheetApp.openById(CONFIG.SHEET_ID);
    var hwSheet = getHomeworkSheet_(ss);
    var now     = new Date();

    if (!hwSheet || hwSheet.getLastRow() < 2) return { items: [], className: className };

    // Get student's submitted quizzes with timestamps
    var scoreSheet = ss.getSheetByName(CONFIG.SHEET_NAME);
    var submitted  = {}; // quizName -> { submitted:bool, activities:{} }
    if (scoreSheet && scoreSheet.getLastRow() > 1) {
      var sRows = scoreSheet.getRange(2,1,scoreSheet.getLastRow()-1,10).getValues();
      sRows.forEach(function(r) {
        var rowEmail = String(r[2]||"").toLowerCase().trim();
        var rowClass = String(r[3]||"");
        var rowQuiz  = String(r[4]||"");
        var rowAct   = String(r[5]||"");
        if (rowEmail !== email || rowClass !== className) return;
        if (!submitted[rowQuiz]) submitted[rowQuiz] = { submitted:false, activities:{} };
        if (rowAct === "FINAL SUBMISSION") {
          submitted[rowQuiz].submitted = true;
        } else if (r[9] === "LATEST" || r[9] === "Yes") {
          submitted[rowQuiz].activities[rowAct] = {
            correct: Number(r[6])||0, total: Number(r[7])||0, pct: Math.round(Number(r[8])||0)
          };
        }
      });
    }

    var hwRows = hwSheet.getRange(2,1,hwSheet.getLastRow()-1,HOMEWORK_HEADERS.length).getValues();
    var items  = [];
    hwRows.forEach(function(r) {
      if (String(r[2]||"") !== className) return;
      if (String(r[9]||"") !== "Active") return;
      var dueDate  = r[5] ? new Date(r[5]) : null;
      var quizName = String(r[3]||"");
      var quizKey  = String(r[4]||"");
      var sub      = submitted[quizName] || { submitted:false, activities:{} };

      // Status
      var status = "upcoming";
      if (sub.submitted) { status = "submitted"; }
      else if (dueDate) {
        var diff = (dueDate - now) / (1000*60*60*24);
        if (diff < 0)  status = "overdue";
        else if (diff < 1) status = "due_today";
        else if (diff < 2) status = "due_tomorrow";
      }

      var baseUrl = ScriptApp.getService().getUrl();
      items.push({
        quizName:   quizName,
        quizKey:    quizKey,
        quizUrl:    baseUrl + "?confirmed=1&quiz=" + encodeURIComponent(quizKey),
        dueDate:    dueDate ? dueDate.toISOString() : null,
        setBy:      String(r[1]||""),
        message:    String(r[6]||""),
        status:     status,
        submitted:  sub.submitted,
        activities: sub.activities
      });
    });

    // Sort: overdue first, then by due date
    var order = { overdue:0, due_today:1, due_tomorrow:2, upcoming:3, submitted:4 };
    items.sort(function(a,b){
      return (order[a.status]||3) - (order[b.status]||3) ||
        (a.dueDate && b.dueDate ? new Date(a.dueDate) - new Date(b.dueDate) : 0);
    });

    return { items: items, className: className };
  } catch(e) {
    return { items: [], error: e.message };
  }
}


/**************************************************************
 * GET STUDENT ASSIGNMENTS
 * Returns all assignments set for the student's class.
 **************************************************************/
function getStudentAssignments(callerEmail) {
  try {
    var email     = (callerEmail||"").toLowerCase().trim();
    var classRes  = getStudentClass(email);
    var className = classRes.className;
    if (!className) return { items: [], className: null };

    var ss          = SpreadsheetApp.openById(CONFIG.SHEET_ID);
    var assignSheet = ss.getSheetByName(ASSIGNMENTS_SHEET);
    var now         = new Date();

    if (!assignSheet || assignSheet.getLastRow() < 2) return { items: [], className: className };

    // Get submitted quizzes with timestamps
    var scoreSheet = ss.getSheetByName(CONFIG.SHEET_NAME);
    var submitted  = {};
    if (scoreSheet && scoreSheet.getLastRow() > 1) {
      var sRows = scoreSheet.getRange(2,1,scoreSheet.getLastRow()-1,10).getValues();
      sRows.forEach(function(r) {
        var rowEmail  = String(r[2]||"").toLowerCase().trim();
        var rowClass  = String(r[3]||"");
        var rowQuiz   = String(r[4]||"");
        var rowAct    = String(r[5]||"");
        var rowTs     = r[0] ? new Date(r[0]) : null;
        if (rowEmail !== email || rowClass !== className) return;
        if (!submitted[rowQuiz]) submitted[rowQuiz] = { submitted:false, activities:{}, ts: null };
        if (rowAct === "FINAL SUBMISSION") {
          submitted[rowQuiz].submitted = true;
          submitted[rowQuiz].ts = rowTs;
        } else if (r[9] === "LATEST" || r[9] === "Yes") {
          submitted[rowQuiz].activities[rowAct] = {
            correct: Number(r[6])||0, total: Number(r[7])||0, pct: Math.round(Number(r[8])||0)
          };
        }
      });
    }

    var rows  = assignSheet.getRange(2,1,assignSheet.getLastRow()-1,ASSIGNMENT_HEADERS.length).getValues();
    var items = [];
    var baseUrl = ScriptApp.getService().getUrl();

    rows.reverse().forEach(function(r) {
      if (String(r[2]||"") !== className) return;
      var quizName  = String(r[3]||"");
      var quizKey   = String(r[4]||"");
      var startedAt = r[5] ? new Date(r[5]) : null;
      var status    = String(r[8]||"");
      var sub       = submitted[quizName] || { submitted:false, activities:{} };

      // Is it live? Active + started within 4 hours
      var isLive = status === "Active" && startedAt && (now - startedAt) < 4*60*60*1000;

      // Filter sub by startedAt
      var subAfterStart = sub.submitted && sub.ts && startedAt && sub.ts >= startedAt;

      items.push({
        quizName:   quizName,
        quizKey:    quizKey,
        quizUrl:    baseUrl + "?confirmed=1&quiz=" + encodeURIComponent(quizKey),
        startedAt:  startedAt ? startedAt.toISOString() : null,
        setBy:      String(r[1]||""),
        message:    String(r[6]||""),
        status:     isLive ? "live" : (status === "Stopped" ? "stopped" : "completed"),
        submitted:  subAfterStart,
        activities: subAfterStart ? sub.activities : {}
      });
    });

    return { items: items, className: className };
  } catch(e) {
    return { items: [], error: e.message };
  }
}


/**************************************************************
 * SERVE STUDENT DASHBOARD ROUTE
 **************************************************************/
function isStudentDashboardRoute_(e) {
  return e.parameter.confirmed === "1"
    && !e.parameter.quiz
    && !e.parameter.view
    && e.parameter.go !== "portal";
}


// ═══════════════════════════════════════════════════════════
//  STUDENT PROFILES, STREAKS, BADGES, LEADERBOARD, STATS
// ═══════════════════════════════════════════════════════════

var PROFILE_SHEET   = "StudentProfiles";
var PROFILE_HEADERS = ["Email","DisplayName","AvatarId","Streak","LastActivity","BestStreak","CreatedAt"];

function getProfileSheet_(ss) {
  var s = ss.getSheetByName(PROFILE_SHEET);
  if (!s) {
    s = ss.insertSheet(PROFILE_SHEET);
    s.appendRow(PROFILE_HEADERS);
    s.getRange(1,1,1,PROFILE_HEADERS.length).setBackground("#0B122B").setFontColor("#fff").setFontWeight("bold");
    s.setFrozenRows(1);
  }
  return s;
}

function getProfileRow_(sheet, email) {
  if (sheet.getLastRow() < 2) return null;
  var data = sheet.getRange(2,1,sheet.getLastRow()-1,PROFILE_HEADERS.length).getValues();
  for (var i=0; i<data.length; i++) {
    if (String(data[i][0]).toLowerCase().trim() === email) return { row: i+2, data: data[i] };
  }
  return null;
}

/**************************************************************
 * GET STUDENT PROFILE
 **************************************************************/
function getStudentProfile(callerEmail) {
  try {
    var email = (callerEmail||"").toLowerCase().trim();
    var ss    = SpreadsheetApp.openById(CONFIG.SHEET_ID);
    var sheet = getProfileSheet_(ss);
    var found = getProfileRow_(sheet, email);

    if (!found) return { exists: false };

    var d = found.data;
    return {
      exists:       true,
      displayName:  String(d[1]||""),
      avatarId:     Number(d[2]||1),
      streak:       Number(d[3]||0),
      lastActivity: d[4] ? new Date(d[4]).toISOString() : null,
      bestStreak:   Number(d[5]||0),
      createdAt:    d[6] ? new Date(d[6]).toISOString() : null
    };
  } catch(e) { return { exists:false, error:e.message }; }
}

/**************************************************************
 * SAVE STUDENT PROFILE
 **************************************************************/
function saveStudentProfile(callerEmail, displayName, avatarId) {
  try {
    var email = (callerEmail||"").toLowerCase().trim();
    var ss    = SpreadsheetApp.openById(CONFIG.SHEET_ID);
    var sheet = getProfileSheet_(ss);
    var found = getProfileRow_(sheet, email);
    var now   = new Date();

    if (found) {
      sheet.getRange(found.row, 2).setValue(displayName);
      sheet.getRange(found.row, 3).setValue(avatarId);
    } else {
      sheet.appendRow([email, displayName, avatarId, 0, "", 0, now]);
    }
    return { success: true };
  } catch(e) { return { error: e.message }; }
}

/**************************************************************
 * UPDATE STREAK (called on quiz final submission)
 **************************************************************/
function updateStudentStreak(callerEmail) {
  try {
    var email = (callerEmail||"").toLowerCase().trim();
    var ss    = SpreadsheetApp.openById(CONFIG.SHEET_ID);
    var sheet = getProfileSheet_(ss);
    var found = getProfileRow_(sheet, email);
    var now   = new Date();
    now.setHours(0,0,0,0);

    if (!found) {
      sheet.appendRow([email, email.split("@")[0], 1, 1, now, 1, new Date()]);
      return { streak: 1 };
    }

    var last = found.data[4] ? new Date(found.data[4]) : null;
    if (last) last.setHours(0,0,0,0);

    var streak = Number(found.data[3]||0);
    var best   = Number(found.data[5]||0);

    if (last) {
      var diff = Math.round((now - last) / 86400000);
      if (diff === 0)      { /* same day, no change */ }
      else if (diff === 1) { streak++; }
      else                 { streak = 1; }
    } else { streak = 1; }

    if (streak > best) best = streak;
    sheet.getRange(found.row, 4).setValue(streak);
    sheet.getRange(found.row, 5).setValue(now);
    sheet.getRange(found.row, 6).setValue(best);
    return { streak: streak, bestStreak: best };
  } catch(e) { return { error: e.message }; }
}

/**************************************************************
 * GET STUDENT STATS
 * Personal bests, progress over time, class comparison
 **************************************************************/
function getStudentStats(callerEmail) {
  try {
    var email = (callerEmail||"").toLowerCase().trim();
    var ss    = SpreadsheetApp.openById(CONFIG.SHEET_ID);
    var classRes = getStudentClass(email);
    var className = classRes.className;

    var scoreSheet = ss.getSheetByName(CONFIG.SHEET_NAME);
    if (!scoreSheet || scoreSheet.getLastRow() < 2) return { pbs:{}, progress:[], comparison:{} };

    var numCols = Math.min(scoreSheet.getLastColumn(), 10);
    var rows    = scoreSheet.getRange(2,1,scoreSheet.getLastRow()-1,numCols).getValues();

    var ACTIVITIES = ["Fill in the Blanks","Match Keywords","Multiple Choice","True or False"];
    var pbs        = {};   // quizName -> { actName -> {correct,total,pct} }
    var progress   = [];   // [{date, quizName, avgPct}]
    var classScores = {};  // actName -> [pcts] for class
    var myScores    = {};  // actName -> [pcts] for student

    rows.forEach(function(r) {
      var rowEmail  = String(r[2]||"").toLowerCase().trim();
      var rowClass  = String(r[3]||"");
      var rowQuiz   = String(r[4]||"");
      var rowAct    = String(r[5]||"");
      var rowTs     = r[0] ? new Date(r[0]) : null;
      var pct       = Math.round(Number(r[8])||0);
      var correct   = Number(r[6])||0;
      var total     = Number(r[7])||0;
      var status    = String(r[9]||"");

      if (rowAct === "FINAL SUBMISSION" || rowClass !== className) return;
      if (status !== "LATEST" && status !== "Yes") return;

      // Class comparison
      if (!classScores[rowAct]) classScores[rowAct] = [];
      classScores[rowAct].push(pct);

      if (rowEmail !== email) return;

      // Personal bests
      if (!pbs[rowQuiz]) pbs[rowQuiz] = {};
      if (!pbs[rowQuiz][rowAct] || pct > pbs[rowQuiz][rowAct].pct) {
        pbs[rowQuiz][rowAct] = { correct:correct, total:total, pct:pct };
      }

      // My scores for comparison
      if (!myScores[rowAct]) myScores[rowAct] = [];
      myScores[rowAct].push(pct);
    });

    // Progress over time — final submissions for this student
    var submissions = [];
    rows.forEach(function(r) {
      var rowEmail = String(r[2]||"").toLowerCase().trim();
      var rowAct   = String(r[5]||"");
      var rowQuiz  = String(r[4]||"");
      var rowTs    = r[0] ? new Date(r[0]) : null;
      if (rowEmail !== email || rowAct !== "FINAL SUBMISSION" || !rowTs) return;
      submissions.push({ date: rowTs, quizName: rowQuiz });
    });

    // Build progress — get avg per-activity score near each submission date
    submissions.sort(function(a,b){ return a.date - b.date; });
    submissions.forEach(function(sub) {
      // Find all activity scores for this quiz
      var actScores = [];
      rows.forEach(function(r) {
        var rowEmail = String(r[2]||"").toLowerCase().trim();
        var rowQuiz  = String(r[4]||"");
        var rowAct   = String(r[5]||"");
        var status   = String(r[9]||"");
        if (rowEmail !== email || rowQuiz !== sub.quizName) return;
        if (rowAct === "FINAL SUBMISSION") return;
        if (status !== "LATEST" && status !== "Yes") return;
        actScores.push(Math.round(Number(r[8])||0));
      });
      if (!actScores.length) return;
      var avg = Math.round(actScores.reduce(function(a,b){return a+b;},0)/actScores.length);
      progress.push({
        date:     sub.date.toLocaleDateString("en-GB",{day:"2-digit",month:"short"}),
        quizName: sub.quizName,
        avgPct:   avg
      });
    });

    // Class comparison averages
    var comparison = {};
    ACTIVITIES.forEach(function(act) {
      var clsArr = classScores[act] || [];
      var myArr  = myScores[act]    || [];
      comparison[act] = {
        mine:  myArr.length  ? Math.round(myArr.reduce(function(a,b){return a+b;},0)/myArr.length)  : null,
        class: clsArr.length ? Math.round(clsArr.reduce(function(a,b){return a+b;},0)/clsArr.length): null
      };
    });

    return { pbs: pbs, progress: progress, comparison: comparison, className: className };
  } catch(e) { return { pbs:{}, progress:[], comparison:{}, error:e.message }; }
}

/**************************************************************
 * GET CLASS LEADERBOARD
 **************************************************************/
function getClassLeaderboard(callerEmail) {
  try {
    var email     = (callerEmail||"").toLowerCase().trim();
    var classRes  = getStudentClass(email);
    var className = classRes.className;
    if (!className) return { entries:[], myRankTotal:null, myRankAvg:null };

    var ss         = SpreadsheetApp.openById(CONFIG.SHEET_ID);
    var scoreSheet = ss.getSheetByName(CONFIG.SHEET_NAME);
    var profSheet  = getProfileSheet_(ss);

    // Load display names
    var nameMap = {};
    if (profSheet.getLastRow() > 1) {
      profSheet.getRange(2,1,profSheet.getLastRow()-1,3).getValues().forEach(function(r){
        nameMap[String(r[0]).toLowerCase().trim()] = { name: String(r[1]||""), avatar: Number(r[2]||1) };
      });
    }

    if (!scoreSheet || scoreSheet.getLastRow() < 2) return { entries:[], myRankTotal:null, myRankAvg:null };

    var numCols = Math.min(scoreSheet.getLastColumn(), 10);
    var rows    = scoreSheet.getRange(2,1,scoreSheet.getLastRow()-1,numCols).getValues();

    // Aggregate per student: total correct, total possible, quiz count
    var students = {};
    rows.forEach(function(r) {
      var rowEmail = String(r[2]||"").toLowerCase().trim();
      var rowClass = String(r[3]||"");
      var rowAct   = String(r[5]||"");
      var status   = String(r[9]||"");
      if (rowClass !== className || rowAct === "FINAL SUBMISSION") return;
      if (status !== "LATEST" && status !== "Yes") return;

      if (!students[rowEmail]) students[rowEmail] = { correct:0, total:0, quizzes:{} };
      students[rowEmail].correct += Number(r[6])||0;
      students[rowEmail].total   += Number(r[7])||0;
      students[rowEmail].quizzes[String(r[4]||"")] = true;
    });

    // Build entries
    var entries = Object.keys(students).map(function(e) {
      var s    = students[e];
      var prof = nameMap[e] || {};
      var avg  = s.total > 0 ? Math.round(s.correct/s.total*100) : 0;
      return {
        email:       e,
        displayName: prof.name || e.split("@")[0],
        avatarId:    prof.avatar || 1,
        totalScore:  s.correct,
        avgPct:      avg,
        quizCount:   Object.keys(s.quizzes).length,
        isMe:        e === email
      };
    });

    // Sort by total
    var byTotal = entries.slice().sort(function(a,b){ return b.totalScore - a.totalScore; });
    // Sort by avg
    var byAvg   = entries.slice().sort(function(a,b){ return b.avgPct - a.avgPct; });

    // Add ranks
    byTotal.forEach(function(e,i){ e.rankTotal = i+1; });
    byAvg.forEach(function(e,i){   e.rankAvg   = i+1; });

    // Find my ranks
    var myTotal = byTotal.find(function(e){ return e.isMe; });
    var myAvg   = byAvg.find(function(e){   return e.isMe; });

    return {
      byTotal:    byTotal.slice(0,10),
      byAvg:      byAvg.slice(0,10),
      myRankTotal: myTotal ? myTotal.rankTotal : null,
      myRankAvg:   myAvg   ? myAvg.rankAvg     : null,
      totalStudents: entries.length,
      className:  className
    };
  } catch(e) { return { entries:[], error:e.message }; }
}

/**************************************************************
 * COMPUTE BADGES
 * Derived from scores + profile — no extra sheet needed
 **************************************************************/
function getStudentBadges(callerEmail) {
  try {
    var email    = (callerEmail||"").toLowerCase().trim();
    var ss       = SpreadsheetApp.openById(CONFIG.SHEET_ID);
    var profSheet = getProfileSheet_(ss);
    var scoreSheet = ss.getSheetByName(CONFIG.SHEET_NAME);

    var profile = getStudentProfile(email);
    var streak  = profile.streak || 0;
    var best    = profile.bestStreak || 0;

    var submissions = 0, perfectActs = 0, quizzes = {}, earlyHw = false, lateNight = false;
    var aboveAvgRun = 0, maxAboveAvgRun = 0;
    var scholar = {}; // quizName -> set of activities

    if (scoreSheet && scoreSheet.getLastRow() > 1) {
      var numCols = Math.min(scoreSheet.getLastColumn(), 10);
      var rows    = scoreSheet.getRange(2,1,scoreSheet.getLastRow()-1,numCols).getValues();

      // Class avgs for "big brain"
      var classRes  = getStudentClass(email);
      var className = classRes.className || "";
      var classActs = {};
      rows.forEach(function(r){
        var rc = String(r[3]||""); var ra = String(r[5]||""); var s = String(r[9]||"");
        if (rc !== className || ra === "FINAL SUBMISSION") return;
        if (s !== "LATEST" && s !== "Yes") return;
        if (!classActs[ra]) classActs[ra] = [];
        classActs[ra].push(Math.round(Number(r[8])||0));
      });
      var classAvgs = {};
      Object.keys(classActs).forEach(function(a){
        var arr = classActs[a];
        classAvgs[a] = Math.round(arr.reduce(function(x,y){return x+y;},0)/arr.length);
      });

      rows.forEach(function(r) {
        var rowEmail = String(r[2]||"").toLowerCase().trim();
        var rowAct   = String(r[5]||"");
        var rowPct   = Math.round(Number(r[8])||0);
        var rowTs    = r[0] ? new Date(r[0]) : null;
        var status   = String(r[9]||"");
        var rowQuiz  = String(r[4]||"");
        if (rowEmail !== email) return;

        if (rowAct === "FINAL SUBMISSION") {
          submissions++;
          quizzes[rowQuiz] = true;
          if (rowTs && rowTs.getHours() >= 21) lateNight = true;
        }
        if (status !== "LATEST" && status !== "Yes") return;
        if (rowAct === "FINAL SUBMISSION") return;
        if (rowPct === 100) perfectActs++;

        // Scholar: track activities per quiz
        if (!scholar[rowQuiz]) scholar[rowQuiz] = {};
        scholar[rowQuiz][rowAct] = true;

        // Big brain: above class avg
        var avg = classAvgs[rowAct];
        if (avg !== undefined && rowPct > avg) { aboveAvgRun++; maxAboveAvgRun = Math.max(maxAboveAvgRun, aboveAvgRun); }
        else aboveAvgRun = 0;
      });
    }

    // Scholar: any quiz with all 4 activities done
    var scholarDone = Object.values(scholar).some(function(acts){ return Object.keys(acts).length >= 4; });

    // Check leaderboard rank for Champion
    var lb = getClassLeaderboard(email);
    var isChampion = lb.myRankTotal === 1 || lb.myRankAvg === 1;

    var BADGE_DEFS = [
      { id:"first_launch",  icon:"🚀", name:"First Launch",   desc:"Complete your first quiz",            earned: submissions >= 1 },
      { id:"sharpshooter",  icon:"🎯", name:"Sharpshooter",   desc:"Score 100% on any activity",          earned: perfectActs >= 1 },
      { id:"on_fire",       icon:"🔥", name:"On Fire",         desc:"3-day streak",                        earned: best >= 3 },
      { id:"energised",     icon:"⚡", name:"Energised",       desc:"7-day streak",                        earned: best >= 7 },
      { id:"diamond",       icon:"💎", name:"Diamond",         desc:"30-day streak",                       earned: best >= 30 },
      { id:"bookworm",      icon:"📚", name:"Bookworm",        desc:"Complete 10 quizzes",                 earned: Object.keys(quizzes).length >= 10 },
      { id:"champion",      icon:"🏆", name:"Champion",        desc:"Reach #1 on class leaderboard",       earned: isChampion },
      { id:"night_owl",     icon:"🌙", name:"Night Owl",       desc:"Complete a quiz after 9pm",           earned: lateNight },
      { id:"big_brain",     icon:"🧠", name:"Big Brain",       desc:"Beat class average 5 times in a row", earned: maxAboveAvgRun >= 5 },
      { id:"scholar",       icon:"🎓", name:"Scholar",         desc:"Complete all 4 activities in a quiz", earned: scholarDone },
    ];

    return { badges: BADGE_DEFS, streak: streak, bestStreak: best };
  } catch(e) { return { badges:[], error:e.message }; }
}
