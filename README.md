# FlightSurety

FlightSurety is a sample application project for Udacity's Blockchain course.

## Install

This repository contains Smart Contract code in Solidity (using Truffle), tests (also using Truffle), dApp scaffolding (using HTML, CSS and JS).
*For this project, I also use ReactJS for dApp for better state management*

To install:

`npm install`
`truffle compile`
`truffle migrate --reset all`

## Develop Client

To run truffle tests:

`truffle test ./test/flightSurety.js`
`truffle test ./test/oracles.js`

To use the dapp:

`npm run dapp`

To view dapp:

`http://localhost:8000`

## Develop Server

`npm run server`
`truffle test ./test/oracles.js`

## Ganache server
`ganache-cli -m "struggle bright bless floor ceiling blame lift fly expand shrug model unaware" -a 50 -e 5000`

## Test results
`truffle test ./test/flightSurety.js`
![image](https://user-images.githubusercontent.com/92301247/210284441-e8a40e44-21d8-49ec-8a89-5ad830cb7277.png)

`truffle test ./test/oracles.js`
![image](https://user-images.githubusercontent.com/92301247/210284502-10fd6c54-6139-4945-bb48-8deab57021d5.png)
![image](https://user-images.githubusercontent.com/92301247/210284517-40379af5-4a15-425a-a0b4-31289bded496.png)

## Over view

I separated dApp into 2 role: "Airline" and "Passenger"

*Airline*

- The user can register a flight and set status for it:
![image](https://user-images.githubusercontent.com/92301247/210284640-7631de91-5749-45b1-ae56-4eff54fc80d1.png)
- User can retrieve information about that flight:
![image](https://user-images.githubusercontent.com/92301247/210284690-7942f98a-fa0e-4436-94a0-9ae19cedf4a6.png)

*Passenger*

- User can retrieve information of all flights:
![image](https://user-images.githubusercontent.com/92301247/210284734-c6f48d69-d0a9-4a5a-8427-ee6c46ed2640.png)

- User can buy insurance for specific flight, and can redeem credit from the insurance:
![image](https://user-images.githubusercontent.com/92301247/210284764-712640ff-422c-4deb-b720-19dcf9b77755.png)
![image](https://user-images.githubusercontent.com/92301247/210284772-5bb7f76c-1f39-4da3-8f31-10e833023e08.png)

*FlightSurety is a awesome project, it's really fun to do this project, I wish I had some more time to learn about it, by the way having a nice day for who is the reviewer. Many thanks for your support during my course ^^*
