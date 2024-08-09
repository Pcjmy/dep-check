#!/usr/bin/env node
const fs = require("fs"); 

// Read users.json file 
fs.readFile("package.json", function(err, data) { 
    
    // Check for errors 
    if (err) throw err; 

    // Converting to JSON 
    const pkg = JSON.parse(data); 
    console.log(pkg?.dependencies); // Print users 
}); 

console.log('welcome dep-check');
