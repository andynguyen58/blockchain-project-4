import DOM from "./dom";
import Contract from "./contract";
import "./flightsurety.css";
import moment from "moment";
import CONSTANTS from "./constants";

const App = function _App() {
  return `
  <div class="top-20" id="display-wrapper"></div>

  <h2>
    User type:
    <h5 id="user-type">${_App.state.userType}</h5>
  </h2>

  <h2>
    Balance:
    <h5 id="balance">${_App.state.balance}</h5>
  </h2>

  <h2>
    Address:
    <h5 id="address">${_App.state.address}</h5>
  </h2>

  <h2>
    Log:
    <h5 id="log">${_App.state.log}</h5>
  </h2>

  <h2>
    Flight information:
    <h5 id="flight-information"></h5>
  </h2>

  <table id="flights-information"></table>
    `;
};

App.state = {
  count: 0,
  increment: () => {
    setState(() => App.state.count++);
  },
  userType: "UNKNOWN",
  balance: "0",
  address: "",
  log: "",
};

const setState = (callback) => {
  callback();
  updateTree(); // extracted function
};

// let contract = new Contract("localhost", () => {
//   contract.isContractOperational((error, result) => {
//     if (error) {
//       console.log({ error });
//       throw error;
//     }
//     showResults("Operational Status", [
//       {
//         label: "Operational Status",
//         error: error,
//         value: result,
//       },
//     ]);
//     DOM.elid("user-type").innerHTML = contract.userType;
//     DOM.elid("address").innerHTML = contract.activeAddress;
//     contract.getUserBalance((error, result) => {
//       DOM.elid("balance").innerHTML = `${result} ETH`;
//     });
//     renderFlightInformation(contract);
//   });
//   contract.subscribeToFlightStatusInfoUpdatedEvent((error, event) => {
//     if (error) {
//       throw error;
//     }
//     let result = event.returnValues;
//     console.log({ result });
//   });
// });

const updateTree = () => {
  document.getElementById("app").innerHTML = App();
};

updateTree();
