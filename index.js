const needle = require('needle')
const fs = require('fs')
const Limiter = require('@xansfer/xansfer-utils').rate_limiter

const key = '38qTTdkDwfmshtCjg7IeahvveWYjp1yeEoNjsnlVsG2D0aiXUr'

let limiter = new Limiter({
  max_concurrent: 50,
  interval_concurrent: 1000
})

let options = {
  headers: {
    'X-Mashape-Key': key
  }
}

let good_stream = fs.createWriteStream('good.txt', { flags:'a' })
let not_good_stream = fs.createWriteStream('not-good.txt', { flags:'a' })

const alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('')

let count = 0
for (let first of alphabet) {
  for (let second of alphabet) {
    for (let third of alphabet) {
      let domain = first + second + '.io'
      let url = 'https://domainr.p.mashape.com/v2/status?mashape-key=' + key + '&domain=' + domain
      limiter.process(needle.get, url, options, (err, res, body) => {
        count ++
        if (body && body.status && body.status[0].summary === 'active') {
          not_good_stream.write(domain + ' ' + body.status[0].summary + '\n')
        } else if (body && body.status && body.status[0].summary === 'inactive') {
          good_stream.write(domain + ' ' + body.status[0].summary + '\n')
        } else if (body && body.status && body.status[0]) {
          good_stream.write(domain + ' ' + body.status[0].summary + '\n')
        } else {
          console.log(body)
        }
      })
    }
  }
}

// stream.end()
