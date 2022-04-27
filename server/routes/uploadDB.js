// Internal use - script to import data from csv file to mongodb

const fs = require('fs')
const csvParser = require("csv-parse")
const mongoose = require('mongoose')
const router = require('express').Router()

// http://localhost:5008/api/uploadDB/goodreads

router.get("/goodreads", (req, res) => {
    const csvData = []
    const books = []

    fs.createReadStream('./import/processed.csv', 'utf8').pipe(csvParser.parse({ delimiter: ',' }))
        .on('data', (row) => {
            csvData.push(row)
        })
        .on('end', () => {
            const labels = csvData[0].slice(0)
            csvData.shift()

            for (const row of csvData) {
                const newBook = {}
                for (let i = 0; i < labels.length; i++) {
                    newBook[labels[i]] = row[i]
                }
                books.push(newBook)
            }

            res.send(JSON.stringify(Object.keys(books[0])))
        })
})

module.exports = router