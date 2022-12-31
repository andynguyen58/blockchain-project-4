import DOM from "./dom";
import Contract from "./contract";
import "./flightsurety.css";
import moment from "moment";
import CONSTANTS from "./constants";

async () => {
  //   let contract = new Contract("localhost", () => {
  //     contract.isContractOperational((error, result) => {
  //       if (error) {
  //         console.log({ error });
  //         throw error;
  //       }
  //       showResults("Operational Status", [
  //         {
  //           label: "Operational Status",
  //           error: error,
  //           value: result,
  //         },
  //       ]);
  //       DOM.elid("user-type").innerHTML = contract.userType;
  //       DOM.elid("address").innerHTML = contract.activeAddress;
  //       contract.getUserBalance((error, result) => {
  //         DOM.elid("balance").innerHTML = `${result} ETH`;
  //       });
  //       renderFlightInformation(contract);
  //     });
  //     contract.subscribeToFlightStatusInfoUpdatedEvent((error, event) => {
  //       if (error) {
  //         throw error;
  //       }
  //       let result = event.returnValues;
  //       console.log({ result });
  //     });
  //   });
  // })();
  // const getFlightStatus = (code) => {
  //   return CONSTANTS.AIRLINE_STATUS_CODE[code];
  // };
  // const submitToOracle = (contract) => {
  //   contract.submitToOracle();
  // };
  // const renderAirlineInformation = (contract, flightsInformationTable) => {
  //   let contentRow = DOM.div({ className: "row" });
  //   const flightInformation = contract.getFlightDescriptionByAddress();
  //   if (!flightInformation) {
  //     DOM.elid("log").innerHTML = "Not register any flight yet";
  //     return;
  //   }
  //   contentRow.appendChild(
  //     DOM.div({ className: "col-sm-2" }, flightInformation.origin)
  //   );
  //   contentRow.appendChild(
  //     DOM.div({ className: "col-sm-2" }, flightInformation.destination)
  //   );
  //   contentRow.appendChild(
  //     DOM.div({ className: "col-sm-2" }, flightInformation.flightNumber)
  //   );
  //   contentRow.appendChild(
  //     DOM.div(
  //       { className: "col-sm-2" },
  //       moment(flightInformation.departureTime).format("ddd YYYY-MM-DD HH:mm")
  //     )
  //   );
  //   const statusSelection = DOM.select({
  //     className: "col-sm-2",
  //     id: "flight-selection",
  //   });
  //   Object.keys(CONSTANTS.AIRLINE_STATUS_CODE).forEach((key) => {
  //     const statusOption = DOM.option(
  //       { className: "col-sm-2", id: "flight-status" },
  //       CONSTANTS.AIRLINE_STATUS_CODE[key]
  //     );
  //     statusSelection.appendChild(statusOption);
  //   });
  //   contentRow.append(statusSelection);
  //   contentRow.appendChild(
  //     DOM.button(
  //       {
  //         className: "col-sm-2 btn-primary",
  //         onclick: () => submitToOracle(contract),
  //       },
  //       "Submit to Oracle"
  //     )
  //   );
  //   contract.requestThisActiveFlightStatusInfo((error, result) => {
  //     console.log(result);
  //     DOM.elid("flight-status").innerHTML = getFlightStatus(result.status);
  //   });
  //   flightsInformationTable.append(contentRow);
  // };
  // const renderPassengerInformation = (contract, flightsInformationTable) => {
  //   contract.flights.forEach((flight, index) => {
  //     let contentRow = DOM.div({ className: "row" });
  //     contentRow.appendChild(DOM.div({ className: "col-sm-2" }, flight.origin));
  //     contentRow.appendChild(
  //       DOM.div({ className: "col-sm-2" }, flight.destination)
  //     );
  //     contentRow.appendChild(
  //       DOM.div({ className: "col-sm-2" }, flight.flightNumber)
  //     );
  //     contentRow.appendChild(
  //       DOM.div(
  //         { className: "col-sm-2" },
  //         moment(flight.departureTime).format("ddd YYYY-MM-DD HH:mm")
  //       )
  //     );
  //     contentRow.appendChild(
  //       DOM.div({ className: "col-sm-2 success" }, "STATUS")
  //     );
  //     contract.requestFlightStatusInfo(index, (error, flight) => {
  //       console.log(contract.getFlightDescriptionByIdx(index));
  //     });
  //     contentRow.appendChild(
  //       DOM.button({ className: "col-sm-2 btn-primary" }, "STATUS")
  //     );
  //     flightsInformationTable.append(contentRow);
  //   });
  // };
  // function renderFlightInformation(contract) {
  //   let flightsInformationTable = DOM.elid("flights-information");
  //   let titleRow = DOM.div({ className: "row" });
  //   titleRow.appendChild(DOM.div({ className: "col-sm-2" }, "Origin"));
  //   titleRow.appendChild(DOM.div({ className: "col-sm-2" }, "Destination"));
  //   titleRow.appendChild(DOM.div({ className: "col-sm-2" }, "Flight number"));
  //   titleRow.appendChild(DOM.div({ className: "col-sm-2" }, "Departure time"));
  //   titleRow.appendChild(DOM.div({ className: "col-sm-2" }, "Status"));
  //   titleRow.appendChild(DOM.div({ className: "col-sm-2" }, "Action"));
  //   flightsInformationTable.append(titleRow);
  //   if (contract.userType === "AIRLINE") {
  //     renderAirlineInformation(contract, flightsInformationTable);
  //   } else {
  //     renderPassengerInformation(contract, flightsInformationTable);
  //   }
  // }
  // function showResults(title, results) {
  //   let displayDiv = DOM.elid("display-wrapper");
  //   displayDiv.append(DOM.h2(title));
  //   displayDiv.append(
  //     DOM.h5({ className: "success" }, results[0].value.toString().toUpperCase())
  //   );
};
