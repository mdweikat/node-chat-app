const fs = require('fs');
const dotenv = require('dotenv');

// import env variables.
dotenv.config()

if (process.env.NODE_ENV !== 'production') {
  const envConfig = dotenv.parse(fs.readFileSync('.env.test'))
  for (var k in envConfig) {
    process.env[k] = envConfig[k]
  }
}
