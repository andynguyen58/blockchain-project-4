import "./App.css";
import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import Contract from "./contract";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import CONSTANTS from "./constants";
import Table from "react-bootstrap/Table";
import Dropdown from "react-bootstrap/Dropdown";

const App = () => {
  const [operationStatus, setOperationStatus] = useState(false);
  const [address, setAddress] = useState("");
  const [balance, setBalance] = useState("");
  const [flightStatusCode, setFlightStatusCode] = useState(0);
  const [flights, setFlights] = useState([]);
  const [allFlightsStatus, setAllFlightsStatus] = useState(null);
  const [isFlightRegistered, setFlightRegistered] = useState(false);
  const [log, setLog] = useState("");

  // Register flight from data
  const [formData, setFormData] = useState({
    flightNumber: "",
    destination: "",
    origin: "",
    statusCode: "0",
    departureTime: 0,
  });

  const globalContract = useRef(null);

  useEffect(() => {
    let contract = new Contract("localhost", () => {
      contract.isContractOperational((error, result) => {
        if (error) {
          console.log({ error });
          throw error;
        }

        globalContract.current = contract;

        setOperationStatus(result);
      });

      getAddress(contract);

      setFlights(contract.flights);

      contract.getUserBalance((error, result) => {
        setBalance(`${result} ETH`);
      });

      contract.requestThisActiveFlightStatusInfo(address, (error, result) => {
        setFlightStatusCode(result.status);
        setFlightRegistered(result.registered);
      });
    });
  }, [address]);

  const getAddress = async (contract) => {
    const activeAddress = await contract.getActiveAddress();

    setAddress(activeAddress);
  };

  const currentAirlineFlight = useMemo(() => {
    return flights.find((flight) => {
      return flight.airlineAddress?.toLowerCase() === address?.toLowerCase();
    });
  }, [address, flights]);

  const getFlightStatus = (code) => {
    return CONSTANTS.AIRLINE_STATUS_CODE[code];
  };

  const registerFlight = useCallback(() => {
    globalContract.current?.registerFlight(
      formData.flightNumber,
      formData.destination,
      formData.origin,
      formData.statusCode,
      1672695092,
      (error, result) => {
        globalContract.current?.requestThisActiveFlightStatusInfo(
          address,
          (error, result) => {
            setFlightStatusCode(result._statusCode);
            setFlightRegistered(result._isRegistered);
          }
        );
      }
    );
  }, [formData, address]);

  const registerNewFlightFormNode = useMemo(() => {
    return (
      <Form style={styles.formContainer}>
        <h5>Please register a flight</h5>
        <Form.Group className="mb-3" controlId="formBasicText">
          <Form.Label>Flight number</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter flight number"
            value={formData.flightNumber}
            onChange={(e) =>
              setFormData((_formData) => ({
                ..._formData,
                flightNumber: e.target.value,
              }))
            }
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicText">
          <Form.Label>Origin</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter origin code"
            value={formData.origin}
            onChange={(e) =>
              setFormData((_formData) => ({
                ..._formData,
                origin: e.target.value,
              }))
            }
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicText">
          <Form.Label>Destination</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter destination code"
            value={formData.destination}
            onChange={(e) =>
              setFormData((_formData) => ({
                ..._formData,
                destination: e.target.value,
              }))
            }
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicText">
          <Form.Label>Status</Form.Label>
          <Dropdown>
            <Dropdown.Toggle variant="info" id="dropdown-basic">
              {getFlightStatus(formData.statusCode)}
            </Dropdown.Toggle>

            <Dropdown.Menu>
              {Object.keys(CONSTANTS.AIRLINE_STATUS_CODE).map((key) => {
                return (
                  <Dropdown.Item
                    key={key.toString()}
                    onClick={() =>
                      setFormData((_formData) => ({
                        ..._formData,
                        statusCode: key,
                      }))
                    }
                  >
                    {CONSTANTS.AIRLINE_STATUS_CODE[key]}
                  </Dropdown.Item>
                );
              })}
            </Dropdown.Menu>
          </Dropdown>
        </Form.Group>

        <Button variant="primary" onClick={registerFlight} type="submit">
          Register flight
        </Button>
      </Form>
    );
  }, [formData, registerFlight]);

  useEffect(() => {
    flights.forEach((flight) => {
      globalContract.current?.requestFlightStatusInfo(
        flight.airlineAddress,
        (error, result) => {
          if (!error) {
            setAllFlightsStatus((state) => ({
              ...state,
              [flight.airlineAddress]: result,
            }));
          }
        }
      );
    });
  }, [flights]);

  const buyInsurance = useCallback(
    (flight) => {
      globalContract.current?.buyFlightInsurance(
        flight,
        address,
        (error, result) => setLog("Buy insurance successfully: " + result)
      );
    },
    [address]
  );

  const redeemCredit = useCallback(
    (flight) => {
      globalContract.current?.withdrawFlightInsuranceCredit(
        flight,
        address,
        (error, result) => setLog("Redeem credit successfully: " + result)
      );
    },
    [address]
  );

  const flightInformationNode = useMemo(() => {
    if (globalContract.current?.userType === "PASSENGER") {
      return (
        <div>
          <Table striped bordered hover style={styles.tableContainer}>
            <thead>
              <tr>
                <th>Flight number</th>
                <th>Origin</th>
                <th>Destination</th>
                <th>Departure time</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {flights.map((flight) => {
                return (
                  <tr>
                    <td>{flight.flightNumber}</td>
                    <td>{flight.origin}</td>
                    <td>{flight.destination}</td>
                    <td>{flight.departureTime}</td>
                    <td>
                      {getFlightStatus(
                        allFlightsStatus?.[flight.airlineAddress]
                          ?._statusCode ?? "0"
                      )}
                    </td>
                    <td>
                      <Button
                        variant="primary"
                        onClick={() => buyInsurance(flight)}
                        type="submit"
                        style={styles.buttonContainer}
                      >
                        Buy insurance
                      </Button>
                      <Button
                        variant="primary"
                        onClick={() => redeemCredit(flight)}
                        type="submit"
                      >
                        Redeem credit
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </div>
      );
    }

    if (!currentAirlineFlight || !isFlightRegistered) {
      return registerNewFlightFormNode;
    }

    return (
      <div>
        <Table striped bordered hover style={styles.tableContainer}>
          <thead>
            <tr>
              <th>Flight number</th>
              <th>Origin</th>
              <th>Destination</th>
              <th>Departure time</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{currentAirlineFlight.flightNumber}</td>
              <td>{currentAirlineFlight.origin}</td>
              <td>{currentAirlineFlight.destination}</td>
              <td>{currentAirlineFlight.departureTime}</td>
              <td>
                <Dropdown>
                  <Dropdown.Toggle variant="success" id="dropdown-basic">
                    {getFlightStatus(flightStatusCode)}
                  </Dropdown.Toggle>

                  <Dropdown.Menu>
                    {Object.keys(CONSTANTS.AIRLINE_STATUS_CODE).map((key) => {
                      return (
                        <Dropdown.Item
                          key={key.toString()}
                          onClick={() => setFlightStatusCode(key)}
                        >
                          {CONSTANTS.AIRLINE_STATUS_CODE[key]}
                        </Dropdown.Item>
                      );
                    })}
                  </Dropdown.Menu>
                </Dropdown>
              </td>
            </tr>
          </tbody>
        </Table>
      </div>
    );
  }, [
    flightStatusCode,
    registerNewFlightFormNode,
    currentAirlineFlight,
    isFlightRegistered,
    flights,
    allFlightsStatus,
    buyInsurance,
    redeemCredit,
  ]);

  return (
    <div className="App">
      <div className="main-container">
        <Card style={styles.cardContainer}>
          <Card.Body>
            <Card.Title style={styles.title}>Operation status:</Card.Title>
            <Card.Text style={styles.statusActive}>
              {operationStatus.toString().toUpperCase()}
            </Card.Text>
          </Card.Body>
        </Card>

        <Card style={styles.cardContainer}>
          <Card.Body>
            <Card.Title style={styles.title}>User type:</Card.Title>
            <Card.Text>{globalContract.current?.userType}</Card.Text>
          </Card.Body>
        </Card>

        <Card style={styles.cardContainer}>
          <Card.Body>
            <Card.Title style={styles.title}>Address:</Card.Title>
            <Card.Text>{address}</Card.Text>
          </Card.Body>
        </Card>

        <Card style={styles.cardContainer}>
          <Card.Body>
            <Card.Title style={styles.title}>Balance:</Card.Title>
            <Card.Text>{balance}</Card.Text>
          </Card.Body>
        </Card>

        <Card style={styles.cardContainer}>
          <Card.Body>
            <Card.Title style={styles.title}>Log:</Card.Title>
            <Card.Text style={styles.statusActive}>{log}</Card.Text>
          </Card.Body>
        </Card>
        {flightInformationNode}
      </div>
    </div>
  );
};

const styles = {
  statusActive: {
    color: "green",
  },
  cardContainer: {
    marginBottom: 20,
  },
  title: {
    fontWeight: "bold",
  },
  tableContainer: {
    backgroundColor: "white",
  },
  formContainer: {
    backgroundColor: "white",
    padding: 20,
  },
  buttonContainer: {
    marginRight: 20,
  },
};

export default App;
