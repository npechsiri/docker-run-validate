const cypress = require('cypress');
// const { Observable, timer, of } = require('rxjs');
// const { timeInterval, flatMap } = require('rxjs/operators');
const sendMailService = require('./service/sendMailService');

// --- logic code starting from here ---
console.log("running validate-serp-checker.js");

// --- setup area ---
let runCount = 0;
const retryingLimitNumber = 3;
const fromMailAddress = { name: "Nut", address: "nut@pixalione.com" };
const sendToMailAddress = [{ name: "Nut", address: "nut@pixalione.com" }];
// const specFileDir = "./cypress/integration/examples/cypress_api.spec.js";
const specFileDir = "./cypress/integration/validate-serp/setup-new-profile.spec.js";

// --- execution ---

runCypressTest();

// --- function ---

/**
 *  this function is written on basis that container will restart everytime,
 *  so runCount will always reset 
 */
function runCypressTest() {
  // add runCount 1
  runCount++;
  console.log(`> run count ${runCount}`);
  // Cypress Module Api, run(), when using this command you will be in control of the process.
  cypress.run({
    spec: specFileDir,
    config: {
      video: false,
    },
    browser: "chrome",
    headless: true
  }).then((results) => {
    if (results.totalFailed > 0) {
      // failed  happen
      if (runCount < retryingLimitNumber) {
        // run again;
        runCypressTest();
      } else {
        console.log("> sending email to recipient")
        // if re-test fail, send mail;
        let mailBody = `${specFileDir} has failed test case, \n`
        sendMailService.send({ from: fromMailAddress, to: sendToMailAddress, subject: "notification from validate-serp-checker.js ", text: mailBody })
          .then((value) => {
            console.log(value);
          }).finally(() => {
            // exit after send mail.
            process.exit(0);
          }).catch(console.error);
      } // and check re- trying limit number
    } else {
      // every test is fine
      process.exit(0);
    }
  }).catch(async (err) => {
    console.error(err);
    // send mail with error content.
    await sendMailService.send({ from: fromMailAddress, to: sendToMailAddress, subject: "error from validate-serp-checker.js", text: err });
    // exit after run fail
    process.exit(1);
  });


} // end run cypressTest()



// --- rxjs code for interval ---

// const initialDelay = 10 * 1000; // ten sec
// const intervalDelay = 1 * 60 * 60 * 1000; // every hour

// let timerSubscription = timer(3000, 4000)
//   .pipe(
//     timeInterval(),
//     flatMap((value, index) => {
//       return of(index);
//     })
//   ).subscribe(next => {
//     // there is no returned value;
//     console.log(next);
//   });

// for testing rxjs code
// setTimeout(() => {
//   console.log("unsubscibe after quarter a minute");
//   timerSubscription.unsubscribe();
// }, 1000 * 15);


/**
 * result of Cypress structure
 *
 */

// {
//   startedTestsAt: '2020-07-22T08:15:51.945Z',
//   endedTestsAt: '2020-07-22T08:17:15.802Z',
//   totalDuration: 83857,
//   totalSuites: 1,
//   totalTests: 1,
//   totalFailed: 1,
//   totalPassed: 0,
//   totalPending: 0,
//   totalSkipped: 0,
//   runs: [
//     {
//       stats: [Object],
//       reporter: 'spec',
//       reporterStats: [Object],
//       hooks: [Array],
//       tests: [Array],
//       error: null,
//       video: null,
//       screenshots: [Array],
//       spec: [Object],
//       shouldUploadVideo: true
//     }
//   ],
//   browserPath: '',
//   browserName: 'electron',
//   browserVersion: '80.0.3987.165',
//   osName: 'win32',
//   osVersion: '10.0.18362',
//   cypressVersion: '4.10.0',
//   config: {
//     baseUrl: 'https://validate-serp.monetoring.com/',
//     projectId: 'kmzj55',
//     projectRoot: 'D:\\Cypress\\cypress-example',
//     projectName: 'cypress-example',
//     morgan: false,
//     isTextTerminal: true,
//     socketId: 'twz0e',
//     report: true,
//     browsers: [ [Object], [Object], [Object], [Object] ],
//     video: false,
//     port: 49688,
//     hosts: null,
//     userAgent: null,
//     reporter: 'spec',
//     reporterOptions: null,
//     blacklistHosts: null,
//     clientRoute: '/__/',
//     xhrRoute: '/xhrs/',
//     socketIoRoute: '/__socket.io',
//     socketIoCookie: '__socket.io',
//     reporterRoute: '/__cypress/reporter',
//     ignoreTestFiles: '*.hot-update.js',
//     testFiles: '**/*.*',
//     defaultCommandTimeout: 4000,
//     requestTimeout: 5000,
//     responseTimeout: 30000,
//     pageLoadTimeout: 60000,
//     execTimeout: 60000,
//     taskTimeout: 60000,
//     videoCompression: 32,
//     videoUploadOnPasses: true,
//     modifyObstructiveCode: true,
//     chromeWebSecurity: true,
//     waitForAnimations: true,
//     animationDistanceThreshold: 5,
//     numTestsKeptInMemory: 0,
//     watchForFileChanges: false,
//     trashAssetsBeforeRuns: true,
//     autoOpen: false,
//     viewportWidth: 1000,
//     viewportHeight: 660,
//     fileServerFolder: 'D:\\Cypress\\cypress-example',
//     videosFolder: 'D:\\Cypress\\cypress-example\\cypress\\videos',
//     supportFile: 'D:\\Cypress\\cypress-example\\cypress\\support\\index.js',
//     fixturesFolder: 'D:\\Cypress\\cypress-example\\cypress\\fixtures',
//     integrationFolder: 'D:\\Cypress\\cypress-example\\cypress\\integration',
//     screenshotsFolder: 'D:\\Cypress\\cypress-example\\cypress\\screenshots',
//     namespace: '__cypress',
//     pluginsFile: 'D:\\Cypress\\cypress-example\\cypress\\plugins\\index.js',
//     nodeVersion: 'default',
//     configFile: 'cypress.json',
//     firefoxGcInterval: { runMode: 1, openMode: null },
//     javascripts: [],
//     experimentalComponentTesting: false,
//     componentFolder: 'D:\\Cypress\\cypress-example\\cypress\\component',
//     experimentalGetCookiesSameSite: false,
//     experimentalSourceRewriting: false,
//     experimentalShadowDomSupport: false,
//     experimentalFetchPolyfill: false,
//     env: {},
//     cypressEnv: 'production',
//     resolved: {
//       animationDistanceThreshold: [Object],
//       fileServerFolder: [Object],
//       baseUrl: [Object],
//       fixturesFolder: [Object],
//       blacklistHosts: [Object],
//       chromeWebSecurity: [Object],
//       modifyObstructiveCode: [Object],
//       integrationFolder: [Object],
//       env: {},
//       pluginsFile: [Object],
//       hosts: [Object],
//       screenshotsFolder: [Object],
//       numTestsKeptInMemory: [Object],
//       supportFile: [Object],
//       port: [Object],
//       projectId: [Object],
//       videosFolder: [Object],
//       reporter: [Object],
//       reporterOptions: [Object],
//       ignoreTestFiles: [Object],
//       testFiles: [Object],
//       defaultCommandTimeout: [Object],
//       trashAssetsBeforeRuns: [Object],
//       execTimeout: [Object],
//       userAgent: [Object],
//       pageLoadTimeout: [Object],
//       viewportWidth: [Object],
//       requestTimeout: [Object],
//       viewportHeight: [Object],
//       responseTimeout: [Object],
//       video: [Object],
//       taskTimeout: [Object],
//       videoCompression: [Object],
//       videoUploadOnPasses: [Object],
//       watchForFileChanges: [Object],
//       waitForAnimations: [Object],
//       nodeVersion: [Object],
//       firefoxGcInterval: [Object],
//       componentFolder: [Object],
//       browsers: [Object],
//       experimentalGetCookiesSameSite: [Object],
//       experimentalSourceRewriting: [Object],
//       experimentalComponentTesting: [Object],
//       experimentalShadowDomSupport: [Object],
//       experimentalFetchPolyfill: [Object]
//     },
//     parentTestsFolder: 'D:\\Cypress\\cypress-example\\cypress',
//     parentTestsFolderDisplay: 'cypress-example\\cypress',
//     supportFolder: 'D:\\Cypress\\cypress-example\\cypress\\support',
//     integrationExampleName: 'examples',
//     integrationExamplePath: 'D:\\Cypress\\cypress-example\\cypress\\integration\\examples',
//     scaffoldedFiles: [
//       [Object], [Object], [Object],
//       [Object], [Object], [Object],
//       [Object], [Object], [Object],
//       [Object], [Object], [Object],
//       [Object], [Object], [Object],
//       [Object], [Object], [Object],
//       [Object], [Object], [Object],
//       [Object], [Object]
//     ],
//     resolvedNodeVersion: '12.13.0',
//     state: {},
//     proxyUrl: 'http://localhost:49688',
//     browserUrl: 'https://validate-serp.monetoring.com/__/',
//     reporterUrl: 'https://validate-serp.monetoring.com/__cypress/reporter',
//     xhrUrl: '__cypress/xhrs/'
//   }
// }
