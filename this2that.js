// written by Jaime

const { Configuration, OpenAIApi } = require('openai')
const fs = require('fs')
const path = require('path');
require('dotenv').config()
const logger = require("./logger");
const OPENAI_API_KEY = process.env.OPENAI_API_KEY
const configuration = new Configuration({
  apiKey: OPENAI_API_KEY
})
let cost=0
const openai = new OpenAIApi(configuration)


const argv = require('minimist')(process.argv.slice(2), {
    string: ['i', 'o'],
    alias: {
      i: 'input',
      o: 'output'
    },
    default: {
      i: './input.json',
      o: './output.cbor'
    },
  });
  
  const inputPath = argv.i;
  const outputPath = argv.o;

  if (argv.help) {
    console.log(`
    Usage:
      node this2that.js [options]
  
    Options:
      -i, --input     path to input file (default: ${inputPath})
      -o, --output    path to output file (default: ${outputPath})
      --help          display this help message
  
    `);
    process.exit(0);
  }

  function getFileExtension(filename) {
    return path.extname(filename).slice(1);
  }
  const inputExtension = getFileExtension(inputPath)
  const outputExtension = getFileExtension(outputPath)


async function translateInput(inputText) {
    
    const prompt = `You are an universal translator. You will receive data in ${inputExtension} format and MUST translate it into ${outputExtension}. Return only the data with no other text. Here is the input:` 
    logger.info(`🤖 🧠 translating ${inputExtension} data into ${outputExtension}`);
    const response = await openai.createCompletion({
      model: process.env.model,
      prompt: prompt + inputText,
      temperature: 0.1,
      max_tokens: 2500,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    });

  
    logger.debug(
      response.data.usage.total_tokens +
        ' tokens [' +
        response.data.usage.prompt_tokens +
        'p+' +
        response.data.usage.completion_tokens +
        'c]'
    )
    cost += (response.data.usage.total_tokens / 1000) * 0.02
    logger.debug(response.data.choices[0].text);
    logger.info('accumulated cost: ' + Math.round(cost * 1000) / 1000 + ' euros')
    const trimmedText = response.data.choices[0].text.replace(/^\s+|\s+$/g, '');
    return trimmedText;
  }
  async function main () {
    const inputText = fs.readFileSync(inputPath, { encoding: 'utf-8' });

    // testing GPT translation
    const result = await translateInput(inputText)
    logger.info("Writing on " + outputPath)
    const outFile = `${outputPath}`
    fs.writeFileSync(outFile, result)
    logger.info("Writing on " + outputPath)

    // You can use the code below to verify the XML translation.

    // var json2xml = require('json2xml');
    // fs.readFile('input.json', 'utf8', function read (err, data) {
    //   if (err) console.log(err);
    //   fs.writeFile('json2xml-output.xml', json2xml(JSON.parse(data)));
    // });

  }
  
  
main();