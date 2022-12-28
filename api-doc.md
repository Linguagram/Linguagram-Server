# Linguagram API Documentation

## Endpoints :

List of available endpoints:

- `POST /register`
- `POST /login`
- `POST /verify`


&nbsp;

## 1. POST /register

Description :
- Create a new user in database

Request : 
- body :


```json
{
    "username" : "string",
    "email" : "string",
    "password" : "string",
    "country" : "string",
    "phoneNumber" : "string",    
}

```

_Response (201 - created)_

```json
{
    "email" : "string",
    "username" : "string",
    "link" : "string",    
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














