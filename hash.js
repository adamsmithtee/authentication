const bcrypt = require('bcrypt');
// const {MD5} = require('crypto-js')
const jwt = require('jsonwebtoken')


const id = '100';
const secret = 'password'

const token = jwt.sign(id, secret);
const decodeToken = jwt.verify(token, secret)

console.log(decodeToken)