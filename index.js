const fs = require("fs");
const csv = require("csv-parser");
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

// Specify the path to your CSV file
const csvFilePath = "Subscribers.csv";

// Create an array to store the parsed data
const data = [];
// Create an array to store the values of the 3rd column
const thirdColumnValues = [];

//Name
const names = [];

//email
const emails = [];

//org
const org = [];

// Read the CSV file and parse its content
fs.createReadStream(csvFilePath)
  .pipe(csv())
  .on("data", (row) => {
    // Process each row of data
    data.push(row);
    const column3Value = row.details;

    // Store the value in the array
    thirdColumnValues.push(column3Value);
  })
  .on("end", () => {
    // The 'end' event is emitted when the CSV parsing is complete
    // console.log('CSV parsing complete');

    // // Display the parsed data
    // console.log(data);
    // console.log(thirdColumnValues)
    thirdColumnValues.forEach((value, index) => {
      if ((index + 1) % 3 === 1) {
        names.push(value);
      } else if ((index + 1) % 3 === 2) {
        emails.push(value);
      } else {
        org.push(value);
      }

      //console.log(`Row ${index + 1}: ${value}`);
    });
    // console.log(`${names[0]} ${emails[0]} ${org[0]}`);
    // Combine arrays into an array of objects
    const data = names.map((name, index) => ({ name, email: emails[index], org: org[index] }));

    // Specify the CSV file path
    const csvFilePath = 'outputContacts.csv';

    // Create a CSV writer with headers
    const csvWriter = createCsvWriter({
      path: csvFilePath,
      header: [
        { id: 'name', title: 'Name' },
        { id: 'email', title: 'Email' },
        { id: 'org', title: 'Organization' },
      ],
    });

    // Write the data to the CSV file
    csvWriter.writeRecords(data)
      .then(() => console.log('CSV file written successfully'))
      .catch((err) => console.error('Error writing CSV file:', err));
  })
  .on("error", (error) => {
    // Handle any errors that occur during parsing
    console.error("Error:", error.message);
  });
