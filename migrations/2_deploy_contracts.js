const FlightSuretyApp = artifacts.require("FlightSuretyApp");
const FlightSuretyData = artifacts.require("FlightSuretyData");
const fs = require("fs");

module.exports = async function (deployer) {
  const firstAirlineAddress = "0xBB75c601305275F8371B1398FAaeF6f1e104E552";

  const flights = [];

  async function deployContracts() {
    console.log("- deploy contracts ...");
    await deployer.deploy(FlightSuretyData);
    await deployer.deploy(FlightSuretyApp, FlightSuretyData.address);
  }

  async function registerTheFirstAirline() {
    await appContract.registerTheFirstAirline(firstAirlineAddress, "VNAirline");
  }

  function publishConfigJsonFiles() {
    let config = {
      localhost: {
        url: "http://localhost:8545",
        dataAddress: FlightSuretyData.address,
        appAddress: FlightSuretyApp.address,
        firstAirlineAddress: firstAirlineAddress,
        flights: flights,
      },
    };

    fs.writeFileSync(
      __dirname + "/../src/dapp/config.json",
      JSON.stringify(config, null, "\t"),
      "utf-8"
    );
    fs.writeFileSync(
      __dirname + "/../src/server/config.json",
      JSON.stringify(config, null, "\t"),
      "utf-8"
    );
  }

  await deployContracts();

  let dataContract = await FlightSuretyData.deployed();
  let appContract = await FlightSuretyApp.deployed();

  await registerTheFirstAirline();
  publishConfigJsonFiles();
};
