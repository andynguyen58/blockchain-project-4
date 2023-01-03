import FlightSuretyApp from "../../build/contracts/FlightSuretyApp.json";
import Config from "./config.json";
import Web3 from "web3";
import express from "express";

let config = Config["localhost"];
let web3 = new Web3(
  new Web3.providers.WebsocketProvider(config.url.replace("http", "ws"))
);
web3.eth.defaultAccount = web3.eth.accounts[0];
let flightSuretyApp = new web3.eth.Contract(
  FlightSuretyApp.abi,
  config.appAddress
);

const statusCodeList = [0, 10, 20, 30, 40, 50];

flightSuretyApp.events.OracleRequest(
  {
    fromBlock: 0,
  },
  function (error, event) {
    if (error) console.log(error);
    console.log(event);
  }
);

const TEST_ORACLES_COUNT = 20;

const fee = await flightSuretyApp.REGISTRATION_FEE.call();

// Init 20+ oracle instances:
const initOracles = async () => {
  let oracles = [];

  await web3.eth.getAccounts().then(async (accountList) => {
    for (let a = 1; a < TEST_ORACLES_COUNT; a++) {
      await flightSuretyApp.registerOracle({
        from: accountList[a],
        value: fee,
      });
      let result = await flightSuretyApp.getMyIndexes.call({
        from: accountList[a],
      });

      oracles.push(result);
      console.log(`Oracle: ${result[0]}, ${result[1]}, ${result[2]}`);
    }
  });

  return oracles;
};

const getRandomStatus = () => {
  const randomStatusIndex = Math.floor(Math.random() * 6);
  return statusCodeList[randomStatusIndex];
};

// Update random status:
const updateOracleStatus = (oracles) => {
  flightSuretyApp.events.OracleRequest(
    {
      fromBlock: 0,
    },
    function (error, event) {
      if (error) {
        console.log(error);
      } else {
        const randomStatus = getRandomStatus();
        let eventValue = event.returnValues;

        oracles.forEach((oracle) => {
          oracle.indexes.forEach((i) => {
            flightSuretyApp.methods
              .submitOracleResponse(
                i,
                eventValue.airlineAddress,
                eventValue.flightNumber,
                eventValue.departureTime,
                randomStatus
              )
              .send({ from: oracle.address, gas: 5555555 })
              .then((res) => {
                console.log(`Updated oracle ${i} with status: ${randomStatus}`);
              })
              .catch((error) => {
                console.log(error);
              });
          });
        });
      }
    }
  );
};

(async () => {
  const oracles = await initOracles();

  updateOracleStatus(oracles);
})();

const app = express();
app.get("/api", (req, res) => {
  res.send({
    message: "An API for use with your Dapp!",
  });
});

export default app;
