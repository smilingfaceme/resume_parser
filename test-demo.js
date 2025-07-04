// Simple demo of the date processing function
function processSingleDate(dateStr) {
  if (!dateStr || dateStr.trim() === "") {
    return "";
  }

  const trimmedDate = dateStr.trim();
  
  // Try to parse different date formats
  let date = null;
  let hasMonth = false;

  // Try dd/mm/yyyy format
  const ddMmYyyyMatch = trimmedDate.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (ddMmYyyyMatch) {
    const [, day, month, year] = ddMmYyyyMatch;
    date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    hasMonth = true;
  }

  // Try yyyy-mm-dd format
  const yyyyMmDdMatch = trimmedDate.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
  if (yyyyMmDdMatch) {
    const [, year, month, day] = yyyyMmDdMatch;
    date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    hasMonth = true;
  }

  // Try mm/yyyy format
  const mmYyyyMatch = trimmedDate.match(/^(\d{1,2})\/(\d{4})$/);
  if (mmYyyyMatch) {
    const [, month, year] = mmYyyyMatch;
    date = new Date(parseInt(year), parseInt(month) - 1, 1);
    hasMonth = true;
  }

  // Try yyyy-mm format
  const yyyyMmMatch = trimmedDate.match(/^(\d{4})-(\d{1,2})$/);
  if (yyyyMmMatch) {
    const [, year, month] = yyyyMmMatch;
    date = new Date(parseInt(year), parseInt(month) - 1, 1);
    hasMonth = true;
  }

  // Try yyyy format only
  const yyyyMatch = trimmedDate.match(/^(\d{4})$/);
  if (yyyyMatch) {
    const [, year] = yyyyMatch;
    date = new Date(parseInt(year), 0, 1);
    hasMonth = false;
  }

  // If no valid format found, return original string
  if (!date || isNaN(date.getTime())) {
    return trimmedDate;
  }

  // Format based on available information
  if (hasMonth) {
    const monthNames = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];
    const monthName = monthNames[date.getMonth()];
    const year = date.getFullYear();
    return `${monthName} ${year}`;
  } else {
    return date.getFullYear().toString();
  }
}

function processDateRange(start_date, end_date) {
  // If both dates are empty or undefined, return empty string
  if (!start_date && !end_date) {
    return "";
  }

  // Process start date
  const startDateInfo = processSingleDate(start_date);
  
  // Process end date
  const endDateInfo = processSingleDate(end_date);

  // If only end date exists
  if (!start_date && end_date) {
    return endDateInfo;
  }

  // If only start date exists
  if (start_date && !end_date) {
    return startDateInfo;
  }

  // If both dates exist, format as range
  if (start_date && end_date) {
    return `${startDateInfo} - ${endDateInfo}`;
  }

  return "";
}

// Test cases
console.log('=== Date Processing Function Tests ===\n');

console.log('Test 1: Both dates with month and year');
console.log('Input: start_date="06/2023", end_date="10/2024"');
console.log('Output:', processDateRange("06/2023", "10/2024"));
console.log('Expected: "Jun 2023 - Oct 2024"\n');

console.log('Test 2: Both dates with full date format');
console.log('Input: start_date="15/06/2023", end_date="20/10/2024"');
console.log('Output:', processDateRange("15/06/2023", "20/10/2024"));
console.log('Expected: "Jun 2023 - Oct 2024"\n');

console.log('Test 3: Both dates with yyyy-mm-dd format');
console.log('Input: start_date="2023-06-15", end_date="2024-10-20"');
console.log('Output:', processDateRange("2023-06-15", "2024-10-20"));
console.log('Expected: "Jun 2023 - Oct 2024"\n');

console.log('Test 4: Both dates with yyyy-mm format');
console.log('Input: start_date="2023-06", end_date="2024-10"');
console.log('Output:', processDateRange("2023-06", "2024-10"));
console.log('Expected: "Jun 2023 - Oct 2024"\n');

console.log('Test 5: Both dates with only year');
console.log('Input: start_date="2023", end_date="2024"');
console.log('Output:', processDateRange("2023", "2024"));
console.log('Expected: "2023 - 2024"\n');

console.log('Test 6: Only end date');
console.log('Input: start_date="", end_date="10/2024"');
console.log('Output:', processDateRange("", "10/2024"));
console.log('Expected: "Oct 2024"\n');

console.log('Test 7: Only start date');
console.log('Input: start_date="06/2023", end_date=""');
console.log('Output:', processDateRange("06/2023", ""));
console.log('Expected: "Jun 2023"\n');

console.log('Test 8: Only end date with year only');
console.log('Input: start_date="", end_date="2024"');
console.log('Output:', processDateRange("", "2024"));
console.log('Expected: "2024"\n');

console.log('Test 9: No dates');
console.log('Input: start_date="", end_date=""');
console.log('Output:', processDateRange("", ""));
console.log('Expected: ""\n');

console.log('Test 10: Mixed formats');
console.log('Input: start_date="2023", end_date="10/2024"');
console.log('Output:', processDateRange("2023", "10/2024"));
console.log('Expected: "2023 - Oct 2024"\n');

console.log('Test 11: Undefined inputs');
console.log('Input: start_date=undefined, end_date=undefined');
console.log('Output:', processDateRange(undefined, undefined));
console.log('Expected: ""\n');

console.log('Test 12: One undefined, one defined');
console.log('Input: start_date=undefined, end_date="2024"');
console.log('Output:', processDateRange(undefined, "2024"));
console.log('Expected: "2024"\n'); 