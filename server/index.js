'use strict'

const http = require('http')
const express = require('express')
const debug = require('debug')('server')
const mongoose = require('mongoose')

mongoose.connect("",  { newUrlParser: true })

mongoose.listen(30001, () => {
    console.log('Listening on 30001...')
})