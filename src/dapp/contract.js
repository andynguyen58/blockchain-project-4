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

    this.flights = [
      {
        airlineAddress: config.firstAirlineAddress,
        flightNumber: "EC02689",
        departureTime: 1672695092,
        origin: "MXP",
        destination: "IBZ",
      },
      {
        airlineAddress: config.firstAirlineAddress,
        flightNumber: "U202288",
        departureTime: Math.floor(new Date("02 Aug 2021 16:15:00") / 1000),
        origin: "MXP",
        destination: "LTN",
      },
      {
        airlineAddress: config.firstAirlineAddress,
        flightNumber: "EC02835",
        departureTime: Math.floor(new Date("02 Aug 2021 19:40:00") / 1000),
        origin: "MXP",
        destination: "BRI",
      },
      {
        airlineAddress: config.firstAirlineAddress,
        flightNumber: "EC02689",
        departureTime: Math.floor(new Date("03 Aug 2021 15:00:00") / 1000),
        origin: "MXP",
        destination: "IBZ",
      },
      {
        airlineAddress: config.firstAirlineAddress,
        flightNumber: "U202288",
        departureTime: Math.floor(new Date("03 Aug 2021 16:15:00") / 1000),
        origin: "MXP",
        destination: "LTN",
      },
      {
        airlineAddress: config.firstAirlineAddress,
        flightNumber: "EC02835",
        departureTime: Math.floor(new Date("03 Aug 2021 19:40:00") / 1000),
        origin: "MXP",
        destination: "BRI",
      },
      {
        airlineAddress: config.firstAirlineAddress,
        flightNumber: "EC02689",
        departureTime: Math.floor(new Date("04 Aug 2021 15:00:00") / 1000),
        origin: "MXP",
        destination: "IBZ",
      },
      {
        airlineAddress: config.firstAirlineAddress,
        flightNumber: "U202288",
        departureTime: Math.floor(new Date("04 Aug 2021 16:15:00") / 1000),
        origin: "MXP",
        destination: "LTN",
      },
      {
        airlineAddress: config.firstAirlineAddress,
        flightNumber: "EC02835",
        departureTime: Math.floor(new Date("04 Aug 2021 19:40:00") / 1000),
        origin: "MXP",
        destination: "BRI",
      },
      {
        airlineAddress: config.firstAirlineAddress,
        flightNumber: "EC02689",
        departureTime: Math.floor(new Date("05 Aug 2021 15:00:00") / 1000),
        origin: "MXP",
        destination: "IBZ",
      },
      {
        airlineAddress: config.firstAirlineAddress,
        flightNumber: "U202288",
        departureTime: Math.floor(new Date("05 Aug 2021 16:15:00") / 1000),
        origin: "MXP",
        destination: "LTN",
      },
      {
        airlineAddress: config.firstAirlineAddress,
        flightNumber: "EC02835",
        departureTime: Math.floor(new Date("05 Aug 2021 19:40:00") / 1000),
        origin: "MXP",
        destination: "BRI",
      },
      {
        airlineAddress: config.firstAirlineAddress,
        flightNumber: "EC02689",
        departureTime: Math.floor(new Date("06 Aug 2021 15:00:00") / 1000),
        origin: "MXP",
        destination: "IBZ",
      },
      {
        airlineAddress: config.firstAirlineAddress,
        flightNumber: "U202288",
        departureTime: Math.floor(new Date("06 Aug 2021 16:15:00") / 1000),
        origin: "MXP",
        destination: "LTN",
      },
      {
        airlineAddress: config.firstAirlineAddress,
        flightNumber: "EC02835",
        departureTime: Math.floor(new Date("06 Aug 2021 19:40:00") / 1000),
        origin: "MXP",
        destination: "BRI",
      },
    ];

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

    const activeAccounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });

    self.activeAddress = activeAccounts[0];

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
      .call({ from: this.passengerAddress }, callback);
  }

  async getActiveAddress() {
    const activeAccounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });

    return activeAccounts[0];
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

  buyFlightInsurance(flight, passengerAddress, callback) {
    let self = this;
    let payload = {
      airline: flight.airlineAddress,
      flight: flight.flightNumber,
      timestamp: flight.departureTime,
    };

    self.appContract.methods
      .getCredit(payload.flight, payload.timestamp, payload.airline)
      .send({ from: passengerAddress }, (error, result) => {
        callback(error, result);
      });
  }

  requestFlightStatusInfo(address, callback) {
    let self = this;

    let flight = this.flights.find((flight) => {
      return flight.airlineAddress?.toLowerCase() === address?.toLowerCase();
    });

    if (!flight) return;

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

  requestThisActiveFlightStatusInfo(address, callback) {
    let self = this;

    let flight = this.flights.find((flight) => {
      return flight.airlineAddress?.toLowerCase() === address?.toLowerCase();
    });

    if (!flight) return;

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

  withdrawFlightInsuranceCredit(_flight, address, callback) {
    let self = this;

    let payload = {
      airline: _flight.airlineAddress,
      flight: _flight.flightNumber,
      timestamp: _flight.departureTime,
    };

    self.appContract.methods
      .getCredit(payload.flight, payload.timestamp, payload.airline)
      .send({ from: address }, (error, result) => {
        callback(error, result);
      });
  }

  subscribeToFlightStatusInfoUpdatedEvent(callback) {
    console.log("Subscribe to FlightStatusInfoUpdatedEvent ...");
    this.appContract.events.OracleRequest(callback);
  }

  async registerFlight(
    flightNumber,
    destination,
    origin,
    statusCode,
    departureTime,
    callback
  ) {
    let self = this;
    let payload = {
      flightNumber,
      destination,
      origin,
      statusCode,
      departureTime,
    };
    await this.web3.eth.getAccounts((error, accts) => {
      self.accounts = accts;
    });

    console.log({ add: self.activeAddress });
    self.appContract.methods
      .registerFlight(
        payload.flightNumber,
        payload.destination,
        payload.origin,
        payload.statusCode,
        payload.departureTime
      )
      .send(
        { from: self.activeAddress, gas: 5000000, gasPrice: 20000000 },
        (error, result) => {
          callback(error, payload);
        }
      );
  }
}
