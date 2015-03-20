# identity-generator

Generate random identity objects including a valid name, address, etc.

## Features

- Generates a single random identity or multiple identities in an array.
- Includes first and last names, email address, phone number, street, city, state, zip code, date of birth, sex, company, and department.
- Email address is based off of name.
- First name matches sex.
- All names, streets, and cities are commonly found throughout Germany.
- States are weighted on population, so more populous states appear more often.
- Zip codes are loosely based on state.
- Date of birth will be between 18 and 60.
- No dependencies.

Please note that city names are not checked whether they actually appear in the state, so e.g. "Dresden" could be placed in "Berlin". This would be an improvement, but the purpose of this project is mainly to create a set of realistic test data.

This is a fork of the original project from [Travis Horn](https://github.com/travishorn/fake-identity). It has been modified regarding the generated data so it creates data you'd find for German identities.

## Data structure

A typical generated JSON item looks like this:

    { id: 1,
      se: 'male',
      fn: 'Klaus',
      ln: 'Meier',
      ma: 'kmeier@mail.de',
      ph: '070977121565',
      st: 'Robert-Schumann-Platz',
      hn: 24,
      ci: 'Meppen',
      sa: 'BE',
      zi: '13013',
      bi: Mon Mar 02 1981 00:00:00 GMT+0100 (Mitteleuropäische Zeit)
    }

Identifiers have been kept compact to limit file size since this is mainly imtended to be used with bigger amounts of data.

Currently there are approx. 1200 male first names, 1600 female first names, 3400 last names, 7200 streets and 13500 cities with zip included which minifies the risk of creating any duplicates. Each entry also gets its own (unique) ID.

## Setup

You can run everything via node.js. So checkout the project and generate an item like this:

`node generate-identities.js`

A single dataset will be created. To have more, add a number as parameter:

`node generate-identities.js 12`

To save it into a file in the /data subdirectory just add a file name:

`node generate-identities.js 10000 foo.json`

That is all for now.

## Data source

Almost all of the source data has been taken from a PHP script created by Uwe Hölzel:

[http://deruwe.de/2009/11/adressgenerator.html](http://deruwe.de/2009/11/adressgenerator.html)

## Original license

The MIT License (MIT)
Copyright © 2014 Travis Horn

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the “Software”), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.