function importDataFromJSON() {
  const MAX_RETRIES = 3;
  const TIMEOUT_MS = 30000;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const options = {
        'method': 'get',
        'headers': {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        'muteHttpExceptions': true,
        'timeout': TIMEOUT_MS
      };
      
      const url = 'https://legendary-space-succotash-97w79xjj76wrfw95-3000.app.github.dev/getData';
      
      const response = UrlFetchApp.fetch(url, options);
      Logger.log('Response Code: ' + response.getResponseCode());
      Logger.log('Response Text: ' + response.getContentText());

      // Validate response
      if (response.getResponseCode() !== 200) {
        throw new Error(`Server returned status code ${response.getResponseCode()}`);
      }

      const contentType = response.getHeaders()['Content-Type'];
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Invalid content type: Expected JSON but got ' + contentType);
      }

      const responseText = response.getContentText();
      if (!responseText.trim().startsWith('{')) {
        throw new Error('Invalid JSON response format');
      }

      const data = JSON.parse(responseText);
      
      const sheet = SpreadsheetApp.openById("1zKO-Z3GFs4mA-p8zbI1TmXCBes7dnGuN2EnuuxxQxRs").getActiveSheet();
      sheet.clear();
      sheet.getRange(1, 1, 1, 4).setValues([['Datum', 'Tijd', 'Meting', 'Bezoekers']]);
      
      if (data.measurements && data.measurements.length > 0) {
        sheet.getRange(2, 1, data.measurements.length, 4).setValues(data.measurements);
      }
      
      sheet.getRange(1, 6).setValue('Last Import:');
      sheet.getRange(1, 7).setValue(new Date());

      // If successful, break the retry loop
      break;

    } catch (error) {
      Logger.log(`Attempt ${attempt} failed: ${error.toString()}`);
      if (attempt === MAX_RETRIES) {
        throw new Error(`Import failed after ${MAX_RETRIES} attempts: ${error.message}`);
      }
      // Wait before retrying
      Utilities.sleep(1000 * attempt);
    }
  }
}

function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('Data Import')
    .addItem('Import JSON Data', 'importDataFromJSON')
    .addToUi();
}