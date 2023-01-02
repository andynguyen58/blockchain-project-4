var FlightSuretyApp = artifacts.require("FlightSuretyApp");
var FlightSuretyData = artifacts.require("FlightSuretyData");
var BigNumber = require("bignumber.js");

var Config = async function (accounts) {
  // These test addresses are useful when you need to add
  // multiple users in test scripts
  let testAddresses = [
    "0x601F7C433e1B33fDC429338300F98B8d27bf2829",
    "0xBB75c601305275F8371B1398FAaeF6f1e104E552",
    "0xB16747D3B1531D1430D0C5fbF32Ceac164b39e01",
  ];

  let owner = accounts[0];
  let firstAirline = accounts[1];

  let flightSuretyData = await FlightSuretyData.new();
  let flightSuretyApp = await FlightSuretyApp.new(flightSuretyData.address);

  return {
    owner: owner,
    firstAirline: firstAirline,
    weiMultiple: new BigNumber(10).pow(18),
    testAddresses: testAddresses,
    flightSuretyData: flightSuretyData,
    flightSuretyApp: flightSuretyApp,
  };
};

module.exports = {
  Config: Config,
};
