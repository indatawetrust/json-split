#! /usr/bin/env node

const StreamArray = require("stream-json/utils/StreamArray"),
      stream = StreamArray.make(),
      fs = require('fs'),
      argv = require('yargs').argv,
      json = require('jsonfile'),
      path = require('path')

if (!argv.json || !fs.existsSync(argv.json)) process.exit()

let limit = 1,
    size = argv.size || 10000,
    datas = [],
    step = 1,
    name = path.basename(argv.json, '.json')

stream.output.on("data", ({value}) => {
  limit++

  datas.push(value)
  
  if (limit > size) {
    limit = 1
    
    json.writeFileSync(`${name}.${step}.json`, datas)

    console.log(`${name}.${step}.json was created.`)
    
    step++

    datas = []
  }
})

stream.output.on("end", () => {
  if (limit > 0) {
    json.writeFileSync(`${name}.${step}.json`, datas)

    console.log(`${name}.${step}.json was created.`)
  }

  console.log(`\n${argv.json} was divided into ${step} files.`);
})

fs.createReadStream(path.join(process.cwd(), argv.json)).pipe(stream.input)
