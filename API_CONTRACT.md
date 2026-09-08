# API Contract

Base URL: `/api`

All responses are JSON.

## 1. Response Format (JSend)

### Success

```json
{
  "status": "success",
  "data": {}
}
```

### Fail

```json
{
  "status": "fail",
  "data": {
    "fieldOrContext": "Explanation of what went wrong"
  },
  "message": "Message explaning what went wrong" //(optional)
}
```

### Fail due to validation

```json
{
  "status": "fail",
  "data": {
    "_global": "Explantion of what goes wrong globaly, it could be a structure error, additon json field and etc" // could be a list
    "fieldOrContext": "Explanation of what went wrong" // could be a list
  },
  "message": "Validation Error" //(optional)
}
```

### Error(only handle INTERNAL_SERVER_ERROR)

```json
{
  "status": "error",
  "message": "error message"
}
```

## 2. Authentication

### 2.1 JWT Cookie

#### On successful authication, the server sets:

- Name: auth-token

- Type: JWT

- HttpOnly: true

- Secure: true (in production)

- SameSite = LAX (more information check [this](https://stackoverflow.com/a/59995877))
- Path: /

#### Frontend:
- Install Docker Desktop to setup dependencies
- Set up the .env.development file in /server. **Note: Must set the correct CLIENT_URL_DEV in the server .env.development file.**
- Doe not set or read the token
- Relies on browser handling cookies
- Must send credentials: "include" on cross-origin requests.
- Example:

```js
fetch("/api/users/me", {
  method: "GET",
  credentials: "include",
});
```

## Auth Endpoints

### 3.1 POST /otp/send

#### **Behavior**
- Send otp to the email input by request body
- Set Cookie called otp_tx to keep session going

#### **Example**
```js
const res = await fetch('http://localhost:3000/api/auth/otp/send', {
        method: 'POST',
        headers:{
            'Content-Type': 'application/json'
        },
        body:JSON.stringify({
            email: "example2@gmail.com",
        })
    });
const {status, data} = await res.json();
```
#### **Request Body**

```json
{
  "email": "a@gmail.com"
}
```

#### **Response Body**

##### 200 ok

```json
{
  "status": "success",
  "data": null
}
```

##### 400 Bad Request 

```json
{
  "status": "fail",
  "error": {
    "email": "Invalid email format"
  },
  "message": "Validation Error"
}
```

##### 503 Service Unavailable

```json
{
  "status": "fail",
  "message": "Signup service is temporarily unavailable. Please try again later."
}
```

### 3.2 POST /auth/otp/verify

#### **Behavior**
- Validate the otp_tx cookie
- Verify the otp code
- Set cookie verify_tx to keep session going

#### **Example**
```js
const res = await fetch('http://localhost:3000/api/auth/otp/verify', {
        method: 'POST',
        credentials: "include",
        headers:{
            'Content-Type': 'application/json'
        },
        body:JSON.stringify({
            "otp": "123456"
        })
    });
const {status, data} = await res.json();
console.log(data);
```
#### **Request Body**

```json
{
  "otp": "123456"
}
```

#### **Response Body**

##### 200 ok

```json
{
  "status": "success",
  "data": null
}
```

##### 401 Unauthorized

```json
{
  "status": "fail",
  "error": {
    "otp_tx": "Invalid Cookie"
  },
  "message": "Authentication required."
}
```

```json
{
  "status": "fail",
  "error": {
    "otp": "Record not found"
  },
  "message": "OTP expired. Please request a new code."
}
```

```json
{
  "status": "fail",
  "error": {
    "otp": "Incorrect OTP"
  },
  "message": "Incorrect OTP. Please try again."
}
```


```json
{
  "status": "fail",
  "error": {
    "otp": "Too many failed attempts"
  },
  "message": "Too many failed attempts. Please request a new code."
}
```

##### 400 Bad Request 

```json
{
  "status": "fail",
  "error": {
    "otp": "Must be a string of exactly 6 digits"
  }
}
```

##### 503 Service Unavailable

```json
{
  "status": "fail",
  "message": "Signup service is temporarily unavailable. Please try again later."
}
```

### 3.3 GET /auth/google

#### **Behavior**

Login by google, afterware the response will assign a cookie which contain the jwt token for authication

#### **Example**
For more information check this [link](https://stackoverflow.com/questions/72382892/access-to-fetch-at-https-accounts-google-com-o-oauth2-v2-auth-has-been-blocked)
```html
<a href="http://localhost:3000/api/auth/google">
    Sign in with Google
</a>
```

#### **Request Body**

- No body
- Please set up .env.delvoepment for redicting to frontend page

#### **Response Body**

- No Response body

### 3.4 POST /auth/signup

#### **Behavior**
- Validate the signup_tx Cookie
- Validate the password field in the request body
- create the user in the database

#### **Request Body**
```json
{
  "password": "wego123456A!" 
}
```

#### **Response Body**
##### 200 ok
```json
{
  "status": "success",
  "data": null
}
```
##### 401 Unauthorized

```json
{
  "status": "fail",
  "error": {
    "signup_tx": "Invalid Cookie"
  },
  "message": "Sign up session expired. Please try again."
}
```
```json
{
  "status": "fail",
  "error": {
    "signup_tx": "Session not found"
  },
  "message": "Sign up session expired. Please start again."
}

```

##### 400 Bad Request
```json
{
  "status": "fail",
  "error": {
    "password": "Reason why password failed"
  },
  "message": "Validation Error"
}
```


##### 503 Service Unavailable

```json
{
  "status": "fail",
  "message": "Signup service is temporarily unavailable. Please try again later."
}
```

### 3.5 POST /auth/login/voprf


#### **Behavior**
- Calculate the evaluation from the give evalReqB64U 
- Set Cookie login_tx to keep session going 
- Send the evaluationB64U back in the response body 

#### **Request Body**
```json
{
  "evalReqB64U": "some Base64URL string" 
}
```

#### **Response Body**
##### 200 ok

```json
{
  "status": "success",
  "data": {
    "evaluationB64U": "some Base64URL string"
  }
}
```
##### 400 BadRequest
```json
{
  "status": "fail",
  "error": {
    "evalReqB64U": "Invalid base64url string"
  },
  "message": "Validaton Error"
}
```

```json
{
  "status": "fail",
  "error": {
    "evalReqB64U": "Invalid evaluation request"
  },
  "message": "Invalid request payload."
}
```
##### 503 Service Unavailable

```json
{
  "status": "fail",
  "message": "Login service is temporarily unavailable. Please try again later."
}
```
### 3.6 POST /auth/login/complete

#### **Behavior**
- Validate the login_tx Cookie 
- Validate emailHashB64U and password
- Set auth_tx Cookie for access token 

#### **Request Body**
```json
{
  "emailHashB64U": "some Base64URL string",
  "password": "wego12312!A"
}
```

#### **Response Body**
##### 200 ok

```json
{
  "status": "success",
  "data": null
}
```
##### 401 Unauthorized

```json
{
  "status": "fail",
  "error": {
    "login_tx": "Invalid Cookie"
  },
  "message": "Login session expired. Please try again."
}
```

```json
{
  "status": "fail",
  "error": {
    "login_tx": "Session not found"
  },
  "message": "Login session expired. Please try again."
}
```

```json
{
  "status": "fail",
  "error": {
    "login_tx": "Invalid Cookie"
  },
  "message": "Login session expired. Please try again."
}
```

```json
{
  "status": "fail",
  "error": {
    "password": "Incorrect password"
  },
  "message": "Incorrect password. Please try again."
}
```

##### 400 Bad Request

```json
{
  "status": "success",
  "error": {
    "emailHashB64U": "reason why fail",
    "password": "reason why fail"
  },
  "message": "Validation Error"
}
```

##### 404 Not Found

```json
{
  "status": "fail",
  "error": {
    "emailHash": "Not Found"
  },
  "message": "Given EmailHash can not be found in our database."
}
```

##### 503 Service Unavailable
```json
{
  "status": "success",
  "message": "Login Service is temporarily unavailable. Please try again later."
}
```


## 4. User Endpoints

### 4.1 GET /auth/google

#### **Auth**

auth-token required, handle by browser

#### **Behavior**

Get current user's resource

#### **Example**
```js
const res = await fetch('http://localhost:3000/api/user/me', {
        method: 'GET',
        credentials: "include",
        headers:{
            'Content-Type': 'application/json'
        },
        // body:JSON.stringify({
        //     email: "example2@gmail.com",
        //     password: "ndN123456!"
        // })
    });
    const data = await res.json();
    console.log(data);
```

#### **Response**

##### 200 ok

```json
{
  "status": "success",
  "data": {
    "user": {
      "userId": 30001,
      "username": "undisturbed-str",
      "displayName": "undisturbed-str",
      "email": "a@gmail.com",
      "createdAt": "2025-11-09T08:24:17.000Z",
      "updatedAt": "2025-11-09T08:24:17.000Z"
    }
  }
}
```

##### 401 Unauthorized

```json
{
  "status": "fail",
  "data": {
    "auth": "Missing or invalid token"
  }
}
```

### 4.2 PATCH /user/me

#### **Auth**

auth-token required, handle by browser

#### **Behavior**

modify current user's resource. As right now, only user's display name are changeable, thing like email we need do authication for that, in the future, we can add more modifiable field

#### **Request**

Allowed fields(atlease one field has to be defined)

```json
{
  "displayName": "string, optional, 5-21 chars"
}
```

#### **Response**

##### 200 ok

```json
{
  "status": "success",
  "data": {
    "user": {
      "userId": 30001,
      "username": "undisturbed-str",
      "displayName": "undisturbed-str",
      "email": "a@gmail.com",
      "createdAt": "2025-11-09T08:24:17.000Z",
      "updatedAt": "2025-11-09T08:24:17.000Z"
    }
  }
}
```

##### 401 Unauthorized

```json
{
  "status": "fail",
  "data": {
    "auth": "Missing or invalid token"
  }
}
```

##### 404 Not Found

```json
{
  "status": "fail",
  "data": null,
  "message": "Can not found current user given the token"
}
```

### 4.3 DELETE /user/me

#### **Auth**

auth-token required, handle by browser

#### **Behavior**

Soft delete user by mark all senstive information as null and update the time on delete_at in db

#### **Response**

##### 200 ok

```json
{
  "status": "success",
  "data": null
}
```

##### 401 Unauthorized

```json
{
  "status": "fail",
  "data": {
    "auth": "Missing or invalid token"
  }
}
```

### 4.4 GET /user/profile/:username

#### **Auth**

Not Required

#### **parameter**

username

#### **Behavior**

Get other user's public information profile by their given username

#### **Response**

##### 200 ok

```json
{
  "status": "success",
  "data": {
    "user": {
      "userId": 30001,
      "username": "undisturbed-str",
      "displayName": "undisturbed-str",
      "createdAt": "2025-11-09T08:24:17.000Z"
    }
  }
}
```

##### 404 Not Found

```json
{
  "status": "fail",
  "data": {
    "username": "Can not found the user of give username"
  }
}
```

## 5. Thread Endpoints

### 5.1 GET /threads/me

#### **Auth**
auth-token required, handle by browser

#### **Behavior**
Get all the thread posted by the current login user

#### **Response**
##### 200 ok
```json
{
  "status": "success",
  "data": {
    "threads": []
  }
}
```

##### 401 Unauthorized

```json
{
  "status": "fail",
  "data": {
    "auth": "Missing or invalid token"
  }
}
```

### 5.2 POST /threads/me

#### **Auth**
auth-token required, handle by browser

#### **Behavior**
Post a thread under login user's account.

#### **Request**


```json
{
  "title": "string,  20-200 chars",
  "content": "string, at least 1-20000 chars"
}
```

#### **Response**
##### 200 ok
```json
{
  "status": "success",
  "data": {
    "thread":{
      "author": "weekly-geosecto",
      "body": "hello!",
      "createdAt": "2025-11-20T11:48:46.000Z",
      "status": "active",
      "threadId": 113335,
      "title": "This is just a random title to make it 20 chars long ",
      "updatedAt": "2025-11-20T11:48:46.000Z",
      "userId": 11
    }
  }
}
```

##### 401 Unauthorized

```json
{
  "status": "fail",
  "data": {
    "auth": "Missing or invalid token"
  }
}
```

### 5.3 PATCH /threads/me/:threadId

#### **Auth**
auth-token required, handle by browser

#### **parameter**

threadId

#### **Behavior**
Post a thread under login user's account.

#### **Request**

Allowed fields(atlease one field has to be defined)

```json
{
  "title": "string,  20-200 chars",
  "content": "string, at least 1-20000 chars"
}
```

#### **Response**
##### 200 ok
```json
{
  "status": "success",
  "data": {
    "thread":{
      "author": "weekly-geosecto",
      "body": "hello!",
      "createdAt": "2025-11-20T11:48:46.000Z",
      "status": "active",
      "threadId": 113335,
      "title": "This is just a random title to make it 20 chars long ",
      "updatedAt": "2025-11-20T11:48:46.000Z",
      "userId": 11
    }
  }
}
```

##### 401 Unauthorized

```json
{
  "status": "fail",
  "data": {
    "auth": "Missing or invalid token"
  }
}
```

```json
{
  "status": "fail",
  "data": {
    "auth": "You don't have ownership for this thread"
  }
}
```

### 5.4 DELETE /threads/me/:threadId

#### **Auth**
auth-token required, handle by browser

#### **parameter**

threadId

#### **Behavior**
DELETE a thread under login user's account.


#### **Response**
##### 200 ok
```json
{
  "status": "success",
  "data": null
}
```

##### 401 Unauthorized

```json
{
  "status": "fail",
  "data": {
    "auth": "Missing or invalid token"
  }
}
```

```json
{
  "status": "fail",
  "data": {
    "auth": "You don't have ownership for this thread"
  }
}
```

### 5.5 GET /threads/:threadId

#### **Auth**

Not Required

#### **parameter**

threadId

#### **Behavior**

Get other thread information 

#### **Response**

##### 200 ok

```json
{
  "status": "success",
  "data": {
    "thread": {
      "threadId": 1,
      "userId": 1,
      "body": "Welcome everyone to WeGoApp!",
      "title": "Welcome Thread",
      "author": "alice01",
      "createdAt": "2025-11-15T10:06:46.000Z",
      "updatedAt": "2025-11-15T10:06:46.000Z",
      "status": "active"
    }
  }
}
```

##### 404 Not Found

```json
{
  "status": "fail",
  "data": {"thread": "Cannot find thread with the given identifier"}
}
```


### 5.5 GET /threads/:threadId/comments

#### **Auth**

Not Required

#### **parameter**

threadId

#### **Behavior**

Get other thread and comments tree information

#### **Response**

##### 200 ok

```json
{
  "status": "success",
  "data": {
    "thread": {
      "threadId": 1,
      "userId": 1,
      "body": "Welcome everyone to WeGoApp!",
      "title": "Welcome Thread",
      "author": "alice01",
      "createdAt": "2025-11-15T10:06:46.000Z",
      "updatedAt": "2025-11-15T10:06:46.000Z",
      "status": "active"
    },

  "comments": [
    {
      "commentId": 1,
      "body": "Excited to join!",
      "author": "bob02",
      "userId": 2,
      "threadId": 1,
      "replies": []
    },
    {
      "commentId": 2,
      "body": "Welcome Bob!",
      "author": "charlie03",
      "userId": 3,
      "threadId": 1,
      "replies": []
    },
    {
      "commentId": 3,
      "body": "Thanks Charlie!",
      "author": "dana04",
      "userId": 4,
      "threadId": 1,
      "replies": []
    },
    {
      "commentId": 4,
      "body": "This community is awesome.",
      "author": "eve05",
      "userId": 5,
      "threadId": 1,
      "replies": []
    },
    {
      "commentId": 24,
      "body": "[Deleted]",
      "author": null,
      "userId": null,
      "threadId": 1,
      "replies": []
    },
    {
      "commentId": 25,
      "body": "I never thought of that",
      "author": "weekly-geosecto",
      "userId": 11,
      "threadId": 1,
      "replies": []
    },
    {
      "commentId": 26,
      "body": "I never thought of that",
      "author": "weekly-geosecto",
      "userId": 11,
      "threadId": 1,
      "replies": []
    }
  ]
  }
}
```

##### 404 Not Found

```json
{
  "status": "fail",
  "data": {"thread": "Cannot find thread with the given identifier"}
}
```

### 5.6 GET /threads/

#### **Auth**

Not Required


#### **Behavior**

Get ALL thread(include deleted thread)

#### **Response**

##### 200 ok
```json
{
  "status": "success",
  "data": {
    "threads": [
      {
        "threadId": 1,
        "userId": 1,
        "body": "Welcome everyone to WeGoApp!",
        "title": "Welcome Thread",
        "author": "alice01",
        "createdAt": "2025-11-15T10:06:46.000Z",
        "updatedAt": "2025-11-15T10:06:46.000Z",
        "status": "active"
      },
      {
        "threadId": 2,
        "userId": 2,
        "body": "Share your best tips here.",
        "title": "Tips for New Users",
        "author": "bob02",
        "createdAt": "2025-11-15T10:06:46.000Z",
        "updatedAt": "2025-11-15T10:06:46.000Z",
        "status": "active"
      },
      {
        "threadId": 3,
        "userId": 3,
        "body": "Talk about programming topics.",
        "title": "Let’s Discuss Coding",
        "author": "charlie03",
        "createdAt": "2025-11-15T10:06:46.000Z",
        "updatedAt": "2025-11-15T10:06:46.000Z",
        "status": "active"
      },
      {
        "threadId": 4,
        "userId": 4,
        "body": "What games do you play?",
        "title": "Favorite Games",
        "author": "dana04",
        "createdAt": "2025-11-15T10:06:46.000Z",
        "updatedAt": "2025-11-15T10:06:46.000Z",
        "status": "active"
      },
      {
        "threadId": 5,
        "userId": 5,
        "body": "Anything goes here!",
        "title": "Random Chat",
        "author": "eve05",
        "createdAt": "2025-11-15T10:06:46.000Z",
        "updatedAt": "2025-11-15T10:06:46.000Z",
        "status": "active"
      },
      {
        "threadId": 113335,
        "userId": 11,
        "body": "hello!",
        "title": "This is just a random title to make it 20 chars long ",
        "author": "weekly-geosecto",
        "createdAt": "2025-11-20T11:48:46.000Z",
        "updatedAt": "2025-11-20T11:48:46.000Z",
        "status": "active"
      },
      {
        "threadId": 113336,
        "userId": 11,
        "body": "hello!",
        "title": "This is just a  long ",
        "author": "weekly-geosecto",
        "createdAt": "2025-11-20T11:51:53.000Z",
        "updatedAt": "2025-11-20T11:51:53.000Z",
        "status": "active"
      }
    ]
  }
}
```

## 6. Comment Endpoints

### 6.1 GET /comments/me
#### **Auth**
auth-token required, handle by browser

#### **Behavior**
Get all the comments posted by the current login user

#### **Response**
##### 200 ok
```json
{
  "status": "success",
  "data": {
    "comments": []
  }
}
```

##### 401 Unauthorized

```json
{
  "status": "fail",
  "data": {
    "auth": "Missing or invalid token"
  }
}
```


### 6.2 POST /comments/me/thread/:threadId

#### **Auth**
auth-token required, handle by browser

#### **parameter**

threadId

#### **Behavior**
Post a comment under login user's account.

#### **Request**


```json
{
  "content": "string, at least 1-100000 chars"
}
```

#### **Response**
##### 200 ok
```json
{
  "status": "success",
  "data": {
    "comment": {
      "commentId": 212563,
      "body": "this is a comment under thread 1",
      "author": "weekly-geosecto",
      "parentId": null,
      "userId": 11,
      "threadId": 1,
      "createdAt": "2025-11-21T02:18:29.000Z",
      "updatedAt": "2025-11-21T02:18:29.000Z",
      "status": "active"
    }
  }
}
```

##### 401 Unauthorized

```json
{
  "status": "fail",
  "data": {
    "auth": "Missing or invalid token"
  }
}
```


##### 404 Not Found
```json
{
  "status": "fail",
  "data": {
    "thread": "Cannot find thread with the given identifier"
  },
  "message": "Not found"
}
```

### 6.3 POST /comments/me/thread/:threadId/comment/:parentId

#### **Auth**
auth-token required, handle by browser

#### **parameter**

threadId, parentId

#### **Behavior**
Post a comment under login user's account. With the parameter threadId and parentId, the user able to post a comment under a thread and a parent comment

#### **Request**


```json
{
  "content": "string, at least 1-100000 chars"
}
```

#### **Response**
##### 200 ok
```json
{
  "status": "success",
  "data": {
    "comment": {
      "commentId": 212564,
      "body": "this is a comment under thread 1 and comment 1",
      "author": "weekly-geosecto",
      "parentId": 1,
      "userId": 11,
      "threadId": 1,
      "createdAt": "2025-11-21T02:26:25.000Z",
      "updatedAt": "2025-11-21T02:26:25.000Z",
      "status": "active"
    }
  }
}
```

##### 401 Unauthorized

```json
{
  "status": "fail",
  "data": {
    "auth": "Missing or invalid token"
  }
}
```


##### 404 Not Found
```json
{
  "status": "fail",
  "data": {
    "thread": "Cannot find thread with the given identifier"
  },
  "message": "Not found"
}
```

```json
{
  "status": "fail",
  "data": {
    "thread": "Cannot find thread with the given identifier"
  },
  "message": "Not found"
}
```
```json
{
  "status": "fail",
  "data": null,
  "message": "Cannot find comment with the given identifier"
}
```

```json
{
  "status": "fail",
  "data": {
    "comment": "The comment does not belong to this thread"
  },
  "message": "Not found"
}
```

### 6.4 PATCH /comments/me/:commentId

#### **Auth**
auth-token required, handle by browser

#### **parameter**

commentId

#### **Behavior**
edit a comment under login user's account.

#### **Request**

Allowed fields(atlease one field has to be defined)

```json
{
  "content": "string, at least 1-100000 chars"
}
```

#### **Response**
##### 200 ok
```json
{
  "status": "success",
  "data": {
    "comment": {
      "commentId": 212563,
      "body": "Hello man",
      "author": "weekly-geosecto",
      "parentId": null,
      "userId": 11,
      "threadId": 1,
      "createdAt": "2025-11-21T02:18:29.000Z",
      "updatedAt": "2025-11-21T02:35:29.000Z",
      "status": "active"
    }
  }
}
```

##### 401 Unauthorized

```json
{
  "status": "fail",
  "data": {
    "auth": "Missing or invalid token"
  }
}
```

```json
{
  "status": "fail",
  "data": {
    "auth": "You don't have ownership for this comment"
  },
  "message": "Unauthorized"
}
```

### 5.4 DELETE /comments/me/:commentId

#### **Auth**
auth-token required, handle by browser

#### **parameter**

commentId

#### **Behavior**
DELETE a comment under login user's account.


#### **Response**
##### 200 ok
```json
{
  "status": "success",
  "data": null
}
```

##### 401 Unauthorized

```json
{
  "status": "fail",
  "data": {
    "auth": "Missing or invalid token"
  }
}
```

```json
{
  "status": "fail",
  "data": {
    "auth": "You don't have ownership for this comment"
  }
}
```