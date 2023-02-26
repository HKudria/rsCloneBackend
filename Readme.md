# Backend for RsClone MonkeyType

Api for RsClone final task "MonkeyType".

## Setup and Running

- Use `node 14.x` or higher.
- For local deploy clone this repo: `$ git clone https://github.com/HKudria/rsCloneBackend.git`.
- Go to downloaded folder: `$ cd async-race-api`.
- Install dependencies: `$ npm install`.
- Start server: `$ npm start`.
- Now you can send requests to the address: `http://localhost:4001`.

## Deploys on server

- Set variable from .env
- Change port from 4001 to 80
- Also, you can usage it deploys on server. Actual link `https://rscloneback.onrender.com`

## Usage

**Register**
----
Register new user.

<details>

* **URL**

  /register

* **Method:**

  `POST`

* **Headers:**

  None

* **Data Params**

    ```json
          {
            "first_name": "String",
            "last_name": "String",
            "email": "String",
            "password": "String"
          }
   ```
 

* **Success Response:**

    * **Code:** 200 OK <br />
      **Content:**
      ```json
          "success"
      ```

* **Error Response:**

    * **Code:** 409 conflict <br />
      **Content:**
       ```json
           {
              "error": "errors.allFieldRequired"
           }
       ```
      **Description:**  Not all field was sent  

    * **Code:** 409 conflict <br />
      **Content:**
        ```json
         {
           "error": "errors.userExist"
         }
       ```
      **Description:** User with sent email is exit

</details>

**Login**
----
Login into system.

<details>

* **URL**

  /login

* **Method:**

  `POST`

* **Headers:**

  None

* **Data Params**

    ```json
          {
            "email": "String",
            "password": "String"
          }
   ```


* **Success Response:**

    * **Code:** 200 OK <br />
      **Content:**
      ```json
          {
            "fName": "String",
            "lName": "String",
            "email": "String",
            "id": "String"
          }
      ```

* **Error Response:**

    * **Code:** 409 conflict <br />
      **Content:**
       ```json
           {
              "error": "errors.allFieldRequired"
           }
       ```
      **Description:**  Not all field was sent

    * **Code:** 403 invalid <br />
      **Content:**
        ```json
         {
           "error": "errors.invalidCredential"
         }
       ```
      **Description:** Token incorrect

</details>

**Get user info**
----
Get all stats about user's games.

<details>

* **URL**

  /userData

* **Method:**

  `GET`

* **Headers:**

  ```[ x-access-token: JWTToken ]```

* **Data Params**

    None

* **Success Response:**

    * **Code:** 200 OK <br />
      **Content:**
      ```json
        [
            { 
              "_id":"string",
              "email":"string",
              "startTime":"number",
              "endTime":"number",
              "length":"number",
              "errorChar":"number",
              "correctChar":"number",
              "text":"string",
              "currIndex":"number",
              "time":"number",
              "fullName":"string",
              "date": "string",
              "percent": "number"
            },
            {
              "..." : "..."
            }
        ]
      ```

* **Error Response:**

    * **Code:** 403 invalid <br />
      **Content:**
       ```json
           {
              "error": "errors.empty"
           }
       ```
      **Description:**  Token wasn't sent

    * **Code:** 403 invalid <br />
      **Content:**
        ```json
         {
           "error": "errors.invalidCredential"
         }
       ```
      **Description:** Token incorrect

</details>

**Save user game**
----
After finish game save game stats.

<details>

* **URL**

  /saveUserResult

* **Method:**

  `POST`

* **Headers:**

  ```[ x-access-token: JWTToken ]```

* **Data Params**

    ```json
        {          
              "startTime":"number",
              "endTime":"number",
              "length":"number",
              "errorChar":"number",
              "correctChar":"number",
              "text":"string",
              "currIndex":"number",
              "time":"number",
              "percent": "number"
        }
   ```

* **Success Response:**

    * **Code:** 200 OK <br />
      **Content:**
      ```json
            { 
              "message": "saved"
            }
      ```

* **Error Response:**

    * **Code:** 403 invalid <br />
      **Content:**
       ```json
           {
              "error": "errors.empty"
           }
       ```
      **Description:**  Token wasn't sent

    * **Code:** 403 invalid <br />
      **Content:**
        ```json
         {
           "error": "errors.invalidCredential"
         }
       ```
      **Description:** Token incorrect

    * **Code:** 409 conflict <br />
      **Content:**
        ```json
         {
            "error": "errors.allFieldRequired"
         }
      ```
      **Description:**  Not all field was sent

    * **Code:** 409 invalid <br />
      **Content:**
        ```json
         {
           "error": "errors.userNotFound"
         }
       ```
      **Description:** User with this email and token not found

</details>

**Get leader board**
----
Get result all saved games of users from db

<details>

* **URL**

  /getLeaders

* **Method:**

  `GET`

* **Headers:**

  None

* **Data Params**

  None

* **Success Response:**

    * **Code:** 200 OK <br />
      **Content:**
     ```json
           [
            {
              "_id": "string",
              "email":"string",
              "result_time":"number",
              "correct_input":"number",
              "incorrect_input":"number",
              "text":"string",
              "timer":"number",
              "timer_percent":"number",
              "full_name":"string",
              "date": "string",
              "percent": "number"
            },
            {
              "..." : "..."
            }
           ]
    ```

* **Error Response:**

    * **Code:** 409 invalid <br />
      **Content:**
        ```json
         {
           "error": "errors.noData"
         }
       ```
      **Description:** No saved games in DB

</details>
