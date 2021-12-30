'use strict';

const { Eyes, ClassicRunner, Target, RectangleSize, Configuration, BatchInfo} = require('@applitools/eyes-images')
const fetch = require('node-fetch')
const path = require('path')
const PDFBox = require("pdfbox-simple");
const { report } = require('process');

describe('DemoApp - ClassicRunner', function () {
  beforeAll(() => {
    browser.waitForAngularEnabled(false)
  })
  
  let runner, eyes;

  beforeEach(() => {

    // Initialize the eyes SDK (IMPORTANT: make sure your API key is set in the APPLITOOLS_API_KEY env variable).
    eyes = new Eyes();

    // Initialize the eyes configuration.
    const conf = new Configuration()

    // You can get your api key from the Applitools dashboard
    //conf.setApiKey(process.env.APPLITOOLS_API_KEY)

    // set new batch
    conf.setBatch(new BatchInfo("Protractor - PDF"));

    // set the configuration to eyes
    eyes.setConfiguration(conf)
  });

  it('Smoke Test', async () => {

    const pdfbox = new PDFBox()

    await eyes.open('JS Images', 'images test');

    const pdfFilePath = "/Users/casey/Desktop/PDF_Testing/ProtractorJS_PDF/resources/test1.pdf" //TODO parameterize

    //Rename to your own resources directory
    const dir = "/Users/casey/Desktop/PDF_Testing/ProtractorJS_PDF/" ;
    var pagenum = 1;

    await pdfbox.exec("PDFToImage", "-imageType", "png",  "-outputPrefix", "applitoolsImage", pdfFilePath).catch((err) => {
            console.log(`ERROR: ${err}`)
    })

    var fs = require('fs');
    var files = fs.readdirSync("./");

    for (let index = 0; index < files.length; ++index) {
      const file = files[index];
      if (file.endsWith('.png')) {
          
        await eyes.check("Page " + pagenum, Target.image(path.resolve(dir, 'applitoolsImage' + pagenum + '.png')))
        pagenum++; 
      } 
    }

    await eyes.close(false);
  });

  afterEach(() => {
    eyes.abort();
  });
});
