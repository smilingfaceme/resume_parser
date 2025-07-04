import { processDateRange } from './dateProcessor';

// Test cases to demonstrate the function
console.log('=== Date Processing Function Tests ===\n');

// Test 1: Both dates with month and year
console.log('Test 1: Both dates with month and year');
console.log('Input: start_date="06/2023", end_date="10/2024"');
console.log('Output:', processDateRange("06/2023", "10/2024"));
console.log('Expected: "Jun 2023 - Oct 2024"\n');

// Test 2: Both dates with full date format
console.log('Test 2: Both dates with full date format');
console.log('Input: start_date="15/06/2023", end_date="20/10/2024"');
console.log('Output:', processDateRange("15/06/2023", "20/10/2024"));
console.log('Expected: "Jun 2023 - Oct 2024"\n');

// Test 3: Both dates with yyyy-mm-dd format
console.log('Test 3: Both dates with yyyy-mm-dd format');
console.log('Input: start_date="2023-06-15", end_date="2024-10-20"');
console.log('Output:', processDateRange("2023-06-15", "2024-10-20"));
console.log('Expected: "Jun 2023 - Oct 2024"\n');

// Test 4: Both dates with yyyy-mm format
console.log('Test 4: Both dates with yyyy-mm format');
console.log('Input: start_date="2023-06", end_date="2024-10"');
console.log('Output:', processDateRange("2023-06", "2024-10"));
console.log('Expected: "Jun 2023 - Oct 2024"\n');

// Test 5: Both dates with only year
console.log('Test 5: Both dates with only year');
console.log('Input: start_date="2023", end_date="2024"');
console.log('Output:', processDateRange("2023", "2024"));
console.log('Expected: "2023 - 2024"\n');

// Test 6: Only end date
console.log('Test 6: Only end date');
console.log('Input: start_date="", end_date="10/2024"');
console.log('Output:', processDateRange("", "10/2024"));
console.log('Expected: "Oct 2024"\n');

// Test 7: Only start date
console.log('Test 7: Only start date');
console.log('Input: start_date="06/2023", end_date=""');
console.log('Output:', processDateRange("06/2023", ""));
console.log('Expected: "Jun 2023"\n');

// Test 8: Only end date with year only
console.log('Test 8: Only end date with year only');
console.log('Input: start_date="", end_date="2024"');
console.log('Output:', processDateRange("", "2024"));
console.log('Expected: "2024"\n');

// Test 9: No dates
console.log('Test 9: No dates');
console.log('Input: start_date="", end_date=""');
console.log('Output:', processDateRange("", ""));
console.log('Expected: ""\n');

// Test 10: Mixed formats
console.log('Test 10: Mixed formats');
console.log('Input: start_date="2023", end_date="10/2024"');
console.log('Output:', processDateRange("2023", "10/2024"));
console.log('Expected: "2023 - Oct 2024"\n');

// Test 11: Undefined inputs
console.log('Test 11: Undefined inputs');
console.log('Input: start_date=undefined, end_date=undefined');
console.log('Output:', processDateRange(undefined, undefined));
console.log('Expected: ""\n');

// Test 12: One undefined, one defined
console.log('Test 12: One undefined, one defined');
console.log('Input: start_date=undefined, end_date="2024"');
console.log('Output:', processDateRange(undefined, "2024"));
console.log('Expected: "2024"\n'); 