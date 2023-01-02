import "./App.css";
import { useState, useEffect } from "react";
import Contract from "./contract";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";

const App = () => {
  const [flights, setFlights] = useState([]);
  const [operationStatus, setOperationStatus] = useState(false);
  const [userType, setUserType] = useState("");
  const [address, setAddress] = useState("");

  useEffect(() => {
    let contract = new Contract("localhost", () => {
      contract.isContractOperational((error, result) => {
        if (error) {
          console.log({ error });
          throw error;
        }

        setOperationStatus(result);
      });
      contract.subscribeToFlightStatusInfoUpdatedEvent((error, event) => {
        if (error) {
          throw error;
        }
        let result = event.returnValues;
        console.log({ result });
      });
    });
  });

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
            <Card.Title style={styles.title}>Address:</Card.Title>
            <Card.Text>{address}</Card.Text>
          </Card.Body>
        </Card>

        <Card style={styles.cardContainer}>
          <Card.Body>
            <Card.Title style={styles.title}>Log:</Card.Title>
            <Card.Text style={styles.statusActive}>
              {operationStatus.toString().toUpperCase()}
            </Card.Text>
          </Card.Body>
        </Card>
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
};

export default App;
