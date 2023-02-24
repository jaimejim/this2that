# this2that

This is a Node.js command-line tool that uses the OpenAI API to translate input data from one format to another. The intention is to test the ability OpenAI has to do automatic data translations. [You can check the results below](#outcome)

## Installation

1. Clone the repository.
2. Run `npm install` to install the required dependencies.
3. Create a `.env` file in the root directory and set the `OPENAI_API_KEY`, `MODEL`, `MAXTOKENS`, and `TEMPERATURE` environment variables.

## Usage

The tool can be invoked with the following command:

```sh
node this2that.js [options]
```

It comes with 3 correct files that you can test on `input.json`,`input.xml`, `input.cbor`,`input.yaml`. Make sure to **not overwritten** them.

### Options

- `-i`, `--input` : path to the input file (default: `./input.json`)
- `-o`, `--output` : path to the output file (default: `./output.cbor`)
- `--help` : display help message

### Example

```sh
node this2that.js --input input.json --output output.xml
```

This will translate the input file `input.json` into `output.xml`.

## Dependencies

- `openai`: The OpenAI API client library.
- `fs`: A built-in Node.js module for working with the file system.
- `path`: A built-in Node.js module for working with file paths.
- `dotenv`: A library for loading environment variables from a `.env` file.
- `minimist`: A library for parsing command-line arguments.

## Outcome

The summary as of 24th of February 2022 is that the results are mixed.

In many cases the generated output is correct but in others it is not and there is no way to be 100% certain (other than testing with an actual translation library). OpenAI consistently generates valid and correct XML/JSON/YAML that matches that of the ones I verified and expect (`input.xml`, `input.json`, `input.yaml`). However it sometimes generates invalid CBOR data.

Prompt engineering seems not to improve the results, other than the usual data cleaning to prevent other GPT output being generated. The `temperature` is set to the minimum to force a more deterministic outcome.

You can see the generated outputs in `/output` folder.

Note: A previous version showed minor differences due to lack of newline trimming, that is now solved.

```
❯ diff output/output.yaml input.yaml
```