# Fetch - Receipt Processor - Ben Simon

This is a RESTful API web service built using TypeScript and NestJS for the Fetch Receipt Processor challenge. The application is containerized with Docker, ensuring easy setup and execution regardless of the host environment.

## Table of Contents

1.) [Getting Started](#getting-started)

2.) [Endpoints](#endpoints)

3.) [Rules](#rules)

4.) [Testing](#testing)

5.) [Why NestJS?](#why-nestjs)

<a name="getting-started"></a>

## Getting Started

### Prerequisites

#### Git

Git must be installed on your local machine in order to fetch the source code from this repository. A guide to installing Git based on your specific operating system can be found [here](https://github.com/git-guides/install-git).

#### Docker

Ensure that Docker is installed and running on your system. One option for Docker installation is Docker Desktop, which is available for Linux, MacOS, and Windows. Docker's official installation guide can be found [here](https://docs.docker.com/engine/install/).

### Step 1: Fetch the Source Code

To get started, you will need to fetch the source code for this application. This can be done via one of two connection methods: HTTPS or SSH. If you are unsure, I would recommend attempting HTTPS first as it is unlikely that you have an SSH key set up on your GitHub account.

Run one of the following two commands, depending on your connection method:

**HTTPS:** `git clone https://github.com/bhsimon3/fetch.git`

**SSH:** `git clone git@github.com:bhsimon3/fetch.git`

### Step 2: Build the Docker Image

The second step to running this application is to build the Docker image based on the provided Dockerfile.

First, you will need to navigate to the folder that was cloned in Step 1:

`cd fetch`

Then, you will need to build the Docker image. This can be done with the following command:

`docker build -t receipt-processor .`

### Step 3: Run the Docker Image

Finally, to run the application you will need to start a Docker container based on the image created in Step 2. To do this, you can use the following command:

`docker-compose up --build`

<a name="endpoints"></a>

## Endpoints

The API currently has two endpoints: `/receipts/process` and `/receipts/{id}/points`. You can find more information about and examples using these two endpoints below.

### Process Receipts

**Path**: `/receipts/process`

**Method**: `POST`

**Payload**: Receipt JSON

**Response**: JSON containing an id for the receipt.

**Description**:

Takes in a JSON receipt and returns a JSON object with an ID generated by the API. The ID can then be passed into the `/receipts/{id}/points` endpoint to get the number of points the receipt was awarded.

How many points should be earned is defined by the rules listed in the Rules section below.

**Example Payload**:

    {
        "retailer": "Walgreens",
        "purchaseDate": "2022-01-02",
        "purchaseTime": "08:25",
        "total": "2.65",
        "items": [
            {"shortDescription": "Pepsi - 12-oz", "price": "1.25"},
            {"shortDescription": "Dasani", "price": "1.40"}
        ]
    }

**Example Request via `curl`**:

    curl -X POST -H "Content-Type: application/json" -d "{\"retailer\":\"Walgreens\",\"purchaseDate\":\"2022-01-02\",\"purchaseTime\":\"08:25\",\"total\":\"2.65\",\"items\":[{\"shortDescription\":\"Pepsi - 12-oz\",\"price\":\"1.25\"},{\"shortDescription\":\"Dasani\",\"price\":\"1.40\"}]}" http://localhost:3000/receipts/process

**Example Response**:

    { "id": "5" }

### Get Points

**Path**: `/receipts/{id}/points`

**Method**: `GET`

**Payload**: None

**Response**: A JSON object containing the number of points awarded.

**Example Request (via cURL)**:

    curl -X GET "localhost:3000/receipts/3/points" \ -H "Content-Type: application/json"

**Example Request (via Fetch API in JavaScript)**:

    let id = 3;

    fetch(`localhost:3000/receipts/${id}/points`)
        .then((response) => {
    	    return response.json();
        })
        .then((data) => {
    	    // Process the response data as needed
    	    console.log(data);
        })
    	.catch((error) => {
    	    console.error("Error: ", error);
        });

**Example Response**:

    { "points": 28 }

**Note**: If the ID passed in is not found, a 404 status code will be returned.

<a name="rules"></a>

## Rules

These rules collectively define how many points should be awarded to a receipt.

- One points for every alphanumeric character in the retailer name.
- 50 points if the total is a round dollar amount with no cents.
- 25 points if the total is a multiple of `0.25`.
- 5 points for every two items on the receipt.
- If the trimmed length of the item description is a multiple of 3, multiply the price by `0.2` and round up to the nearest integer. The result is the number of points earned.
- 6 points if the day in the purchase date is odd.
- 10 points if the time of purchase is after 2:00pm and before 4:00pm.

### Examples

```json
{
  "retailer": "Target",
  "purchaseDate": "2022-01-01",
  "purchaseTime": "13:01",
  "items": [
    {
      "shortDescription": "Mountain Dew 12PK",
      "price": "6.49"
    },
    {
      "shortDescription": "Emils Cheese Pizza",
      "price": "12.25"
    },
    {
      "shortDescription": "Knorr Creamy Chicken",
      "price": "1.26"
    },
    {
      "shortDescription": "Doritos Nacho Cheese",
      "price": "3.35"
    },
    {
      "shortDescription": "   Klarbrunn 12-PK 12 FL OZ  ",
      "price": "12.00"
    }
  ],
  "total": "35.35"
}
```

```text
Total Points: 28
Breakdown:
     6 points - retailer name has 6 characters
    10 points - 4 items (2 pairs @ 5 points each)
     3 Points - "Emils Cheese Pizza" is 18 characters (a multiple of 3)
                item price of 12.25 * 0.2 = 2.45, rounded up is 3 points
     3 Points - "Klarbrunn 12-PK 12 FL OZ" is 24 characters (a multiple of 3)
                item price of 12.00 * 0.2 = 2.4, rounded up is 3 points
     6 points - purchase day is odd
  + ---------
  = 28 points
```

---

```json
{
  "retailer": "M&M Corner Market",
  "purchaseDate": "2022-03-20",
  "purchaseTime": "14:33",
  "items": [
    {
      "shortDescription": "Gatorade",
      "price": "2.25"
    },
    {
      "shortDescription": "Gatorade",
      "price": "2.25"
    },
    {
      "shortDescription": "Gatorade",
      "price": "2.25"
    },
    {
      "shortDescription": "Gatorade",
      "price": "2.25"
    }
  ],
  "total": "9.00"
}
```

```text
Total Points: 109
Breakdown:
    50 points - total is a round dollar amount
    25 points - total is a multiple of 0.25
    14 points - retailer name (M&M Corner Market) has 14 alphanumeric characters
                note: '&' is not alphanumeric
    10 points - 2:33pm is between 2:00pm and 4:00pm
    10 points - 4 items (2 pairs @ 5 points each)
  + ---------
  = 109 points
```

<a name="testing"></a>

## Testing

TODO

<a name="why-nestjs"></a>

## Why NestJS?

### TypeScript Support

NestJS is built with and fully supports TypeScript, enhancing code quality and readability. TypeScript enables developers to catch potential bugs and errors early into the development process, saving development time and enabling a more robust application.

Additionally, JavaScript/TypeScript's wide adoption and usage means that should the application require scaling of team size, there is a massive pool of developers with experience using the language that would be able to leverage their knowledge and expertise from day 1 of onboarding.

Finally, through the use of technologies such as `tRPC`, choosing TypeScript for our backend allows us to automatically share exact typings between the frontend and backend (should a frontend be built for this application), ensuring type safety across requests and responses.

### Scalability and Flexibility

NestJS supports both monolithic and microservice-based architecture out-of-the-box, allowing flexibility in the architecture of the application as it scales. An application that begins as a NestJS monolith can be later converted into a microservice-based architecture without needing to start completely from the ground up.

### Opinionated Architecture

NestJS provides well-defined, documented, and opinionated architecture, which encourages developers to write clean, maintainable code that follows best practices. Additionally, NestJS modules allow for easy management of dependencies and promote code organization and reusability.

### Community Support

The community surrounding NestJS is large, active, and modern -- the community contributes to a huge number of external packages and modules that can be easily imported into an application to extend the app's functionality. Whether you need logging, health check reporting, authentication, ORM functionalities, or whatever -- chances are, there's a package that will speed up development time significantly.

### Tradeoffs

As with any technology, some tradeoffs are made by choosing NestJS. The major tradeoffs made here include increased overhead for a small application, possible performance concerns if running on lightweight hardware (as with most NodeJS-based applications), and the learning curve that comes with any highly opinionated and structured framework.
