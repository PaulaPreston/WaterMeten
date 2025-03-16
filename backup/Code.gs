const POOL_CONFIG = {
  measurements: {
    meting1: {
      title: 'Meting 1',
      nextPage: 'meting2',
      pools: [
        { id: 'Bad1', name: 'Bad 1', type: 'recreatiebad' },
        { id: 'Bad2', name: 'Bad 2', type: 'recreatiebad' }
      ],
      columns: {
        start: 5,
        poolFields: 5
      },
      saveFunction: 'appendMeasurements'
    },
    meting2: {
      title: 'Meting 2',
      nextPage: 'meting3',
      pools: [
        { id: 'Whirlpool1', name: 'Whirlpool 1', type: 'whirlpool' },
        { id: 'Whirlpool2', name: 'Whirlpool 2', type: 'whirlpool' },
        { id: 'PeuterbadHoog', name: 'Peuterbad hoog', type: 'peuterbad' },
        { id: 'PeuterbadLaag', name: 'Peuterbad laag', type: 'peuterbad' },
        { id: 'Koudwaterbad2', name: 'Koud waterbad 2', type: 'koudwaterbad' }
      ],
      columns: {
        start: 15,
        poolFields: 5
      },
      saveFunction: 'appendMeasurements2'
    },
    meting3: {
      title: 'Meting 3',
      nextPage: 'index',
      pools: [
        { id: 'Whirlpool3', name: 'Whirlpool 3', type: 'whirlpool' },
        { id: 'Whirlpool4', name: 'Whirlpool 4', type: 'whirlpool' },
        { id: 'Koudwaterbad1', name: 'Koud waterbad 1', type: 'koudwaterbad' },
        { id: 'Whirlpool5', name: 'Whirlpool 5', type: 'whirlpool' },
        { id: 'Whirlpool6', name: 'Whirlpool 6', type: 'whirlpool' },
        { id: 'Whirlpool7', name: 'Whirlpool 7', type: 'whirlpool' }
      ],
      columns: {
        start: 40,
        poolFields: 5
      },
      saveFunction: 'appendMeasurements3'
    }
  },
  tempRanges: {
    whirlpool: { min: 30, max: 35 },
    koudwaterbad: { min: 15, max: 23 },
    peuterbad: { min: 28, max: 33 },
    recreatiebad: { min: 28, max: 33 }
  }
};

function getPoolConfig() {
  return POOL_CONFIG;
}

function getMeasurementConfig(measurementId) {
  Logger.log('Getting config for:', measurementId); // Add logging
  
  const config = POOL_CONFIG.measurements[measurementId];
  if (!config) {
    Logger.log('Config not found for:', measurementId); // Add logging
    throw new Error(`Invalid measurement ID: ${measurementId}`);
  }
  
  const result = {
    ...config,
    tempRanges: POOL_CONFIG.tempRanges,
    measurementId: measurementId
  };
  
  Logger.log('Returning config:', result); // Add logging
  return result;
}

function doGet(e) {
  if (!e || !e.parameter) {
    return HtmlService.createHtmlOutput("Invalid request");
  }

  const measurement = e.parameter.measurement;
  
  if (measurement) {
    if (POOL_CONFIG.measurements[measurement]) {
      // Create template with measurement ID embedded
      const template = HtmlService.createTemplateFromFile('meting');
      template.measurementId = measurement;
      return template.evaluate()
        .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
    } else {
      return HtmlService.createHtmlOutput(`Invalid measurement ID: ${measurement}`);
    }
  }

  const page = e.parameter.page || "index";
  return HtmlService.createHtmlOutputFromFile(page)
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function saveMeasurement(data) {
  try {
    const sheet = SpreadsheetApp.openById("1zKO-Z3GFs4mA-p8zbI1TmXCBes7dnGuN2EnuuxxQxRs").getActiveSheet();
    sheet.appendRow(data);
    return "Meting succesvol opgeslagen!";
  } catch (error) {
    Logger.log(error);
    return "Fout bij opslaan van meting: " + error.toString();
  }
}

function getScriptURL() {
  return ScriptApp.getService().getUrl();
}

function appendMeasurements(measurements) {
  try {
    const sheet = SpreadsheetApp.openById("1zKO-Z3GFs4mA-p8zbI1TmXCBes7dnGuN2EnuuxxQxRs").getActiveSheet();
    const lastRow = sheet.getLastRow();
    
    // Get the last row that was just added by saveMeasurement
    const range = sheet.getRange(lastRow, 5, 1, 10);
    const values = [
      [
        measurements.bad1.doorzicht,
        measurements.bad1.temperatuur,
        measurements.bad1.ph,
        measurements.bad1.vrijChloor,
        measurements.bad1.totaalChloor,
        measurements.bad2.doorzicht,
        measurements.bad2.temperatuur,
        measurements.bad2.ph,
        measurements.bad2.vrijChloor,
        measurements.bad2.totaalChloor
      ]
    ];
    
    range.setValues(values);
    return "Metingen succesvol opgeslagen!";
  } catch (error) {
    Logger.log(error);
    return "Fout bij opslaan van metingen: " + error.toString();
  }
}

function appendMeasurements2(measurements) {
  try {
    const sheet = SpreadsheetApp.openById("1zKO-Z3GFs4mA-p8zbI1TmXCBes7dnGuN2EnuuxxQxRs").getActiveSheet();
    const lastRow = sheet.getLastRow();
    
    // Get the last row and append the new measurements starting from column 15
    const range = sheet.getRange(lastRow, 15, 1, 25);
    const values = [
      [
        measurements.whirlpool1.doorzicht,
        measurements.whirlpool1.temperatuur,
        measurements.whirlpool1.ph,
        measurements.whirlpool1.vrijChloor,
        measurements.whirlpool1.totaalChloor,
        measurements.whirlpool2.doorzicht,
        measurements.whirlpool2.temperatuur,
        measurements.whirlpool2.ph,
        measurements.whirlpool2.vrijChloor,
        measurements.whirlpool2.totaalChloor,
        measurements.peuterbadHoog.doorzicht,
        measurements.peuterbadHoog.temperatuur,
        measurements.peuterbadHoog.ph,
        measurements.peuterbadHoog.vrijChloor,
        measurements.peuterbadHoog.totaalChloor,
        measurements.peuterbadLaag.doorzicht,
        measurements.peuterbadLaag.temperatuur,
        measurements.peuterbadLaag.ph,
        measurements.peuterbadLaag.vrijChloor,
        measurements.peuterbadLaag.totaalChloor,
        measurements.koudwaterbad2.doorzicht,
        measurements.koudwaterbad2.temperatuur,
        measurements.koudwaterbad2.ph,
        measurements.koudwaterbad2.vrijChloor,
        measurements.koudwaterbad2.totaalChloor
      ]
    ];
    
    range.setValues(values);
    return "Metingen succesvol opgeslagen!";
  } catch (error) {
    Logger.log(error);
    return "Fout bij opslaan van metingen: " + error.toString();
  }
}

function appendMeasurements3(measurements) {
  try {
    const sheet = SpreadsheetApp.openById("1zKO-Z3GFs4mA-p8zbI1TmXCBes7dnGuN2EnuuxxQxRs").getActiveSheet();
    const lastRow = sheet.getLastRow();
    
    // Get the last row and append the new measurements starting from column 40
    const range = sheet.getRange(lastRow, 40, 1, 30);
    const values = [
      [
        measurements.whirlpool3.doorzicht,
        measurements.whirlpool3.temperatuur,
        measurements.whirlpool3.ph,
        measurements.whirlpool3.vrijChloor,
        measurements.whirlpool3.totaalChloor,
        measurements.whirlpool4.doorzicht,
        measurements.whirlpool4.temperatuur,
        measurements.whirlpool4.ph,
        measurements.whirlpool4.vrijChloor,
        measurements.whirlpool4.totaalChloor,
        measurements.koudwaterbad1.doorzicht,
        measurements.koudwaterbad1.temperatuur,
        measurements.koudwaterbad1.ph,
        measurements.koudwaterbad1.vrijChloor,
        measurements.koudwaterbad1.totaalChloor,
        measurements.whirlpool5.doorzicht,
        measurements.whirlpool5.temperatuur,
        measurements.whirlpool5.ph,
        measurements.whirlpool5.vrijChloor,
        measurements.whirlpool5.totaalChloor,
        measurements.whirlpool6.doorzicht,
        measurements.whirlpool6.temperatuur,
        measurements.whirlpool6.ph,
        measurements.whirlpool6.vrijChloor,
        measurements.whirlpool6.totaalChloor,
        measurements.whirlpool7.doorzicht,
        measurements.whirlpool7.temperatuur,
        measurements.whirlpool7.ph,
        measurements.whirlpool7.vrijChloor,
        measurements.whirlpool7.totaalChloor
      ]
    ];
    
    range.setValues(values);
    return "Metingen succesvol opgeslagen!";
  } catch (error) {
    Logger.log(error);
    return "Fout bij opslaan van metingen: " + error.toString();
  }
}

function doClose(e) {
  // Handle the navigation after the dialog closes
  if (e && e.parameter && e.parameter.redirectTo) {
    return HtmlService.createHtmlOutput(
      `<script>window.top.location.href = '${e.parameter.redirectTo}';</script>`
    );
  }
  return HtmlService.createHtmlOutput('');
}

function navigateToPage(nextPage) {
  const url = ScriptApp.getService().getUrl();
  const nextUrl = nextPage.startsWith('meting') 
    ? `${url}?measurement=${nextPage}`
    : `${url}?page=${nextPage}`;
  return { url: nextUrl };
}