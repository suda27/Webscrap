const fs = require('fs');
const csv = require('csv-parser');
const csvW= require('fast-csv');
const _ = require('lodash');

const inputFile = 'VimalArticles9472.csv'; // Replace with the path to your CSV file
const outputFile = 'vimalArticles.csv'; 
const data = [];

// Read CSV file
fs.createReadStream(inputFile)
  .pipe(csv())
  .on('data', (row) => {
    data.push(row);
  })
  .on('end', () => {
    // Group by 'article-link' and aggregate 'article-link-href'
    const groupedData = _.groupBy(data, 'Article-Links');
    const result = _.mapValues(groupedData, (group) => ({
      'Article-Link': group[0]['Article-Links'],
      'Article-Gist': group[0]['gist'],
      'Article-Content': group.map(item => item['Articles-Content']).join('  ')
    }));

    // Convert the result object to an array
    const resultArray = Object.values(result);

    // Display the result
    // console.log(resultArray);
     // Write the result to a new CSV file
     csvW.writeToPath(outputFile, resultArray, { headers: true })
      .on('finish', () => console.log(`Result written to ${outputFile}`))
      .on('error', (err) => console.error(err));
  
  });
