pragma solidity >=0.4.25;

import "../node_modules/openzeppelin-solidity/contracts/math/SafeMath.sol";

contract FlightSuretyData {
    using SafeMath for uint256;

    /*****************Contact Variables*******************/
    /**                                                  */
    /*****************************************************/
    address private contractOwner;
    bool private operational = true;
    uint256 public registeredCount = 0;

    uint256 public constant AirlineRegistrationFee = 10 ether;

    struct airliner {
        bool registered;
        bool hasPaid;
        mapping(address => bool) voters;
        uint256 votes;
    }

    struct clientFlights {
        bool exist;
        uint256 status;
        bool registered;
        uint256 departuretime;
        uint256 price;
        mapping(address => bool) didByInsurance;
    }

    mapping(address => uint256) private credit;
    mapping(address => bool) private authorizeCallers;
    mapping(bytes32 => clientFlights) private flights;

    struct Airline {
        address airlineWallet;
        bool isRegistered;
        string name;
        uint256 funded;
        uint256 votes;
    }

    mapping(address => Airline) private airlines;

    /********************************************************************************************/
    /*                                       DATA VARIABLES                                     */
    /********************************************************************************************/
    constructor() public {
        contractOwner = msg.sender;
    }

    /********************************************************************************************/
    /*                                       FUNCTION MODIFIERS                                 */
    /********************************************************************************************/
    modifier isAuthorized() {
        require(
            authorizeCallers[msg.sender] == true,
            "Address is not authorized to make calles on data contract"
        );
        _;
    }

    modifier requireIsOperational() {
        require(operational == true, "Contract is currently not operational");
        _; // All modifiers require an "_" which indicates where the function body will be added
    }

    modifier requireContractOwner() {
        require(msg.sender == contractOwner, "Caller is not contract owner");
        _;
    }

    modifier flightExists(bytes32 key) {
        require(flights[key].exist == true, "Flight Doesn't exist");
        _;
    }

    modifier flightstatus(bytes32 key) {
        require(
            flights[key].status != 10,
            "Flight was on time no insurance for you"
        );
        _;
    }

    modifier toSoon(bytes32 key) {
        require(
            flights[key].departuretime < now,
            "Flight must be passed depature data for insurance payout"
        );
        _;
    }

    modifier minimumFundBalance() {
        require(
            address(this).balance > 10 ether,
            "Contract has insufficient funds for withdraw"
        );
        _;
    }
    modifier checkBalance(address _address) {
        require(credit[_address] > 0, "Address has no credit");
        _;
    }

    function changeOperation() external requireContractOwner {
        if (operational == true) {
            operational = false;
        } else {
            operational = true;
        }
    }

    function isOperational() external view returns (bool) {
        return (operational);
    }

    function setOperatingStatus(bool mode) external requireContractOwner {
        operational = mode;
    }

    function authorizeCaller(address addressToAuthorize)
        external
        requireContractOwner
    {
        authorizeCallers[addressToAuthorize] = true;
    }

    function getFlight(bytes32 key)
        external
        view
        isAuthorized
        returns (
            bool exist,
            uint256 status,
            bool registered,
            uint256 departuretime,
            uint256 price
        )
    {
        return (
            flights[key].exist,
            flights[key].status,
            flights[key].registered,
            flights[key].departuretime,
            flights[key].price
        );
    }

    function updateFlightStatus(bytes32 key, uint256 status)
        external
        requireIsOperational
        isAuthorized
        flightExists(key)
    {
        flights[key].status = status;
    }

    function buy(
        bytes32 key,
        address buyer,
        bool withInsurance
    ) external payable requireIsOperational isAuthorized flightExists(key) {
        if (withInsurance == true) {
            flights[key].didByInsurance[buyer] = true;
        }
    }

    function pay(address _address) external requireIsOperational isAuthorized {
        _address.transfer(credit[_address]);
        credit[_address] = 0;
    }

    function fund(bytes32 key, address _address)
        public
        requireIsOperational
        isAuthorized
    {
        flights[key].didByInsurance[_address] = false;
        uint256 half = flights[key].price.div(2);
        uint256 amountTofund = flights[key].price.add(half);
        credit[_address] += amountTofund;
    }

    function getFlightKey(
        address airline,
        string memory flight,
        uint256 timestamp
    ) internal pure returns (bytes32) {
        return keccak256(abi.encodePacked(airline, flight, timestamp));
    }

    function isAirline(address airline) external view returns (bool) {
        if (airlines[airline].airlineWallet == airline) {
            return true;
        } else {
            return false;
        }
    }
    /*****************************************************/
}
