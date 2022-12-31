import FlightSuretyApp from "../../build/contracts/FlightSuretyApp.json";
import FlightSuretyData from "../../build/contracts/FlightSuretyData.json";

import Config from "./config.json";
import Web3 from "web3";
import moment from "moment";

const USER_TYPES = {
  OWNER: "OWNER",
  AIRLINE: "AIRLINE",
  PASSENGER: "PASSENGER",
};

export default class Contract {
  constructor(network, callback) {
    let config = Config[network];

    this.web3 = new Web3(
      new Web3.providers.WebsocketProvider(config.url.replace("http", "ws"))
    );

    this.appContract = new this.web3.eth.Contract(
      FlightSuretyApp.abi,
      config.appAddress
    );

    this.dataContract = new this.web3.eth.Contract(
      FlightSuretyData.abi,
      config.dataAddress
    );

    this.firstAirlineAddress = config.firstAirlineAddress;
    this.passengerAddress = null;
    this.flights = config.flights;

    this.owner = null;
    this.airlines = [];
    this.passengers = [];
    this.ONE_ETHER = this.web3.utils.toWei("1", "ether");

    this.hFlightStatusCodeDescription = {
      0: "STATUS_CODE_UNKNOWN (0) => Sorry! Credit withdraw NOT authorized!",
      10: "STATUS_CODE_ON_TIME (10) => Sorry! Credit withdraw NOT authorized!",
      20: "STATUS_CODE_LATE_AIRLINE (20) => YEAH! Credit withdraw authorized!",
      30: "STATUS_CODE_LATE_WEATHER (30) => Sorry! Credit withdraw NOT authorized!",
      40: "STATUS_CODE_LATE_TECHNICAL (40) => Sorry! Credit withdraw NOT authorized!",
      50: "STATUS_CODE_LATE_OTHER (50) => Sorry! Credit withdraw NOT authorize!",
    };

    this.userType = null;
    this.activeAddress = null;

    this.initialize(callback);
  }

  async initialize(callback) {
    let self = this;

    try {
      // Request account access
      await window.ethereum.enable();
    } catch (error) {
      // User denied account access...
      console.error("User denied account access");
    }

    await self.web3.eth.getAccounts((error, accts) => {
      self.dataContract.methods
        .authorizeCaller(self.appContract._address)
        .send({ from: accts[0] });

      self.owner = accts[0];
      self.passengerAddress = accts[1];
      self.airlines = accts.slice(2);

      callback();
    });

    const activeAccounts = await ethereum.request({
      method: "eth_requestAccounts",
    });

    this.activeAddress = activeAccounts[0];

    if (activeAccounts[0].toLowerCase() === self.owner.toLowerCase()) {
      self.userType = USER_TYPES.OWNER;
    } else if (
      activeAccounts[0].toLowerCase() === self.passengerAddress.toLowerCase()
    ) {
      self.userType = USER_TYPES.PASSENGER;
    } else {
      self.userType = USER_TYPES.AIRLINE;
    }
  }

  isContractOperational(callback) {
    let self = this;
    self.appContract.methods
      .isOperational()
      .call({ from: self.passengerAddress }, callback);
  }

  getFlightStatusInfo(flightNumber, flightDepartureTime, status) {
    console.log(
      `Flight <${flightDepartureTime} | ${flightNumber}> has ${this.hFlightStatusCodeDescription[status]}`
    );
    return `Flight <${flightDepartureTime} | ${flightNumber}> has ${this.hFlightStatusCodeDescription[status]}`;
  }

  getFlightDescriptionByAddress() {
    const self = this;

    return this.flights.find((flight) => {
      return (
        flight.airlineAddress.toLowerCase() === self.activeAddress.toLowerCase()
      );
    });
  }

  getFlightDescriptionByIdx(flightIdx) {
    if (
      !Number.isInteger(flightIdx) ||
      flightIdx < 0 ||
      flightIdx > this.flights.length - 1
    ) {
      throw new Error("Invalid flight requested");
    }

    let flight = this.flights[flightIdx];
    let flightDepartureTime = moment(flight.departureTime * 1000).format(
      "Do MMM HH:mm"
    );
    return `${flightDepartureTime} | ${flight.origin} -> ${flight.destination} | ${flight.flightNumber}`;
  }

  submitToOracle(index, airline, flight, timestamp, statusCode, callback) {
    this.appContract.methods
      .submitOracleResponse(index, airline, flight, timestamp, statusCode)
      .call({ from: self.passengerAddress }, callback);
  }

  getUserBalance(callback) {
    let self = this;
    let balance = this.web3.eth.getBalance(
      this.passengerAddress,
      function (error, result) {
        if (error) {
          console.log(error);
          callback(error, null);
          return;
        }

        let balanceInWei = result;
        let balanceInEth = self.web3.utils.fromWei(balanceInWei, "ether");

        callback(error, balanceInEth);
      }
    );
  }

  buyFlightInsurance(flightIdx, callback) {
    let self = this;
    console.log({ self });
    let flight = self.flights[parseInt(flightIdx)];

    self.appContract.methods
      .getCredit(
        flight.flightNumber,
        flight.departureTime,
        flight.airlineAddress
      )
      .send({ from: self.passengers[0] }, (error, result) => {
        if (error) {
          console.error(error);
        }
        callback(error, flight);
      });
  }

  requestFlightStatusInfo(flightIdx, callback) {
    let self = this;

    let flight = self.flights[parseInt(flightIdx)];

    self.appContract.methods
      .fetchFlightStatus(
        flight.airlineAddress,
        flight.flightNumber,
        flight.departureTime
      )
      .send({ from: self.passengerAddress }, (error, result) => {
        callback(error, flight);
      });
  }

  requestThisActiveFlightStatusInfo(callback) {
    let self = this;

    let flight = self.flights.find((flight) => {
      return (
        flight.airlineAddress.toLowerCase() === self.activeAddress.toLowerCase()
      );
    });

    self.appContract.methods
      .getFlightStatus(
        flight.flightNumber,
        flight.departureTime,
        flight.airlineAddress
      )
      .call((error, result) => {
        callback(error, result);
      });
  }

  withdrawFlightInsuranceCredit(flightIdx, callback) {
    let self = this;

    let flight = self.flights[parseInt(flightIdx)];

    console.log(
      `Withdraw flight insurance credit for flight = <${self.getFlightDescriptionByIdx(
        parseInt(flightIdx)
      )}> from address=${self.passengerAddress}`
    );

    self.appContract.methods
      .withdrawFlightInsuranceCredit(
        flight.airlineAddress,
        flight.flightNumber,
        flight.departureTime
      )
      .send({ from: self.passengerAddress }, (error, result) => {
        if (error) {
          console.error(error);
        }
        callback(error, flight);
      });
  }

  subscribeToFlightStatusInfoUpdatedEvent(callback) {
    console.log("Subscribe to FlightStatusInfoUpdatedEvent ...");
    this.appContract.events.OracleRequest(callback);
  }
}
