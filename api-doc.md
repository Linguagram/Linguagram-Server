# Linguagram API Documentation

## Endpoints

List of available endpoints:

- `POST /register`
- `POST /login`
- `POST /verify`
- `GET /groups/:groupId/messages`

&nbsp;

## 1. POST /register

Description :

- Create a new user in database

Request :

- body :

```json
{
    "username" : "string | required",
    "email" : "string | email format | unique | required",
    "password" : "string | required | min length 8",
    "country" : "string",
    "phoneNumber" : "string",
    "nativeLanguages" : ["number"],
    "interestLanguages" : ["number"],
}

```

_Response (201 - created)_

```json
{
    "access_token" : "sadfluigwuoraygfwoluygfaoi47fryt428oi75triwy7rafgkwy",
    "user" : {
	"id": 1,
	"username": "India",
	"email": "indian@mail.com",
	"country": "India",
	"phoneNumber": "+69878656754567",
	"verified": false,
	"UserLanguages": [
	    {
	    },
	    {
	    },
	    {
	    }
	]
    },
}

```

_Response (400 - Bad Request)_

```json
{
    "message" : "Email is required"        
}
OR
{
    "message" : "Password is required"        
}
OR
{
    "message" : "Email has already been registered"        
}
OR
{
    "message" : "Username is required"        
}
OR
{
    "message" : "Invalid email format"        
}
OR
{
    "message" : "Password must have at least 8 characters"        
}
OR
{
    "message" : "Password is required"        
}

```

# 2. POST /login

Description :

- Logging in user and returning access token

Request :

- body :

```json
{
    "email" : "string",
    "password" : "string",   
}

```

_Response (200 - OK)_

```json
{
  "access_token" : "string"
}
```

_Response (401 - Unauthorized)_

```json
{
    "message": "Invalid email/password"
}
OR
{
    "message": "Email address has not been verified!"
}
```

# 3. POST /verify

Description :

- Verify the link given by user

Request :

- query :

```json
{
    "verification" : "string",
}

```

_Response (200 - OK)_

```json
{
  "message" : "<email> has been verified"
}
```

_Response (401 - Unauthorized)_

```json
{
    "message": "Invalid Link"
}
OR
{
    "message": "Your email address has been verified"
}
OR
{
    "message": "Invalid Token"
}
```



# 4. GET /messages/:groupId

Description :

- Get messages by group id

Request :

- headers :

```json
{
    "access_token" : "string"
}

```

- params :

```json
{
    "id" : "integer"
}

```

_Response (200 - OK)_

```json
[{
  "content" : "text",
    "Media" : {
        
  }
}]
```

_Response (401 - Unauthorized)_

```json
{
    "message": "Invalid Token"
}
```

## Global Error

_Response (401 - Unauthorized)_

```json
{
    "error": true,
    "message": "Invalid token"
}
```

_Response (403 - Forbidden)_

```json
{
    "error": true,
    "message": "Forbidden"
}
```

_Response (500 - Internal Server Error)_

```json
{
    "error": true,
    "message": "Internal server error"
}
```
