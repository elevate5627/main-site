const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Initialize Supabase client
const supabaseUrl = 'https://zepdugeqrigihcicqysf.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InplcGR1Z2VxcmlnaWhjaWNxeXNmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk4NjU2OTUsImV4cCI6MjA3NTQ0MTY5NX0.cuPk5r8tYgz01T1e9c5fkAWbt_NdTZ92jUSvGJUXPEI';

const supabase = createClient(supabaseUrl, supabaseKey);

// CSV Parser that handles quoted fields
function parseCSV(content) {
  const rows = [];
  let currentRow = [];
  let currentField = '';
  let insideQuotes = false;
  let i = 0;

  while (i < content.length) {
    const char = content[i];
    const nextChar = content[i + 1];

    if (char === '"') {
      if (insideQuotes && nextChar === '"') {
        currentField += '"';
        i += 2;
        continue;
      } else {
        insideQuotes = !insideQuotes;
        i++;
        continue;
      }
    }

    if (!insideQuotes && char === ',') {
      currentRow.push(currentField.trim());
      currentField = '';
      i++;
      continue;
    }

    if (!insideQuotes && (char === '\n' || (char === '\r' && nextChar === '\n'))) {
      currentRow.push(currentField.trim());
      if (currentRow.some(field => field !== '')) {
        rows.push(currentRow);
      }
      currentRow = [];
      currentField = '';
      i += (char === '\r' && nextChar === '\n') ? 2 : 1;
      continue;
    }

    currentField += char;
    i++;
  }

  if (currentField || currentRow.length > 0) {
    currentRow.push(currentField.trim());
    if (currentRow.some(field => field !== '')) {
      rows.push(currentRow);
    }
  }

  return rows;
}

function validateAndCleanRecord(record) {
  // Validate answer_option_number - must be 1, 2, 3, or 4
  if (record.answer_option_number) {
    const answerNum = parseInt(record.answer_option_number);
    if (isNaN(answerNum) || answerNum < 1 || answerNum > 4) {
      return null; // Skip this record
    }
    record.answer_option_number = answerNum;
  }

  // Validate marks - must be a number
  if (record.marks) {
    const marks = parseFloat(record.marks);
    if (isNaN(marks)) {
      record.marks = null;
    } else {
      record.marks = marks;
    }
  }

  // Ensure question_text is not empty
  if (!record.question_text || record.question_text.trim() === '') {
    return null; // Skip records without questions
  }

  return record;
}

async function uploadCSV(filePath, tableName = 'mcq_questions') {
  console.log(`\n📂 Reading file: ${filePath}`);
  
  const content = fs.readFileSync(filePath, 'utf-8');
  const rows = parseCSV(content);
  
  if (rows.length === 0) {
    console.log('❌ No data found in CSV');
    return;
  }

  const headers = rows[0].map(h => h.trim());
  console.log(`📋 Headers:`, headers);
  console.log(`📊 Total rows (including header): ${rows.length}`);

  const dataRows = rows.slice(1);
  const batchSize = 100;
  let successCount = 0;
  let errorCount = 0;
  let skippedCount = 0;

  console.log(`\n🚀 Starting upload in batches of ${batchSize}...`);

  for (let i = 0; i < dataRows.length; i += batchSize) {
    const batch = dataRows.slice(i, i + batchSize);
    const records = batch.map(row => {
      const record = {};
      headers.forEach((header, index) => {
        const value = row[index] || null;
        // Normalize column names - convert to lowercase
        const normalizedHeader = header.toLowerCase();
        record[normalizedHeader] = value === '' ? null : value;
      });
      return record;
    }).map(validateAndCleanRecord).filter(r => r !== null);

    if (records.length === 0) {
      skippedCount += batch.length;
      console.log(`⚠️  Batch ${Math.floor(i / batchSize) + 1}: All ${batch.length} records skipped (invalid data)`);
      continue;
    }

    try {
      const { data, error } = await supabase
        .from(tableName)
        .insert(records);

      if (error) {
        console.error(`❌ Batch ${Math.floor(i / batchSize) + 1} error:`, error.message);
        errorCount += records.length;
        skippedCount += (batch.length - records.length);
      } else {
        successCount += records.length;
        skippedCount += (batch.length - records.length);
        console.log(`✅ Batch ${Math.floor(i / batchSize) + 1}: ${records.length} records inserted (Total: ${successCount}/${dataRows.length})`);
      }
    } catch (err) {
      console.error(`❌ Batch ${Math.floor(i / batchSize) + 1} exception:`, err.message);
      errorCount += records.length;
      skippedCount += (batch.length - records.length);
    }

    await new Promise(resolve => setTimeout(resolve, 100));
  }

  console.log(`\n✨ Upload complete!`);
  console.log(`✅ Success: ${successCount} records`);
  console.log(`⚠️  Skipped: ${skippedCount} records (invalid data)`);
  console.log(`❌ Failed: ${errorCount} records`);
}

async function main() {
  const files = [
    'public/Copy of MCQ format with images - Sheet1.csv',
    'public/mbbs qbank - Sheet1.csv'
  ];

  for (const file of files) {
    const filePath = path.join(__dirname, '..', file);
    
    if (!fs.existsSync(filePath)) {
      console.log(`⚠️ File not found: ${filePath}`);
      continue;
    }

    await uploadCSV(filePath);
  }
}

main().catch(console.error);
