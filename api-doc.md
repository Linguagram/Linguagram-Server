# Linguagram API Documentation

## Endpoints

List of available endpoints:

- `POST /register`
- `POST /login`
- `POST /verify`

- `GET /groups/:groupId/messages`
- `POST /groups/:groupId/messages`
- `GET /groups/:groupId/messages/:messageId`

- `PUT /groups/:groupId/messages/:messageId`
- `DELETE /groups/:groupId/messages/:messageId`

- `GET /groups`
- `POST /avatar`
- `GET /users/:userId`

- `GET /languages`
- `PUT /@me`
- `GET /@me/languages`

- `GET /friends`
- `POST /friends/:friendId`

&nbsp;


## 1. POST /register

Description :

- Create new user

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
    "interestLanguages" : ["number"]
}

```

_Response (201 - created)_

```json
{
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MjEsImlhdCI6MTY3MjMyMjA5OH0.3q9RNbVYSc5obpNX2rU6uhLw6JDmbneCx38UO6xMMSE",
    "user": {
        "id": 21,
        "username": "e",
        "email": "hello5@mail.com",
        "country": null,
        "status": null,
        "phoneNumber": null,
        "verified": false,
        "AvatarId": null,
        "Avatar": null,
        "UserLanguages": [
            {
                "id": 10,
                "type": "native",
                "UserId": 21,
                "LanguageId": 1,
                "createdAt": "2022-12-29T13:54:58.517Z",
                "updatedAt": "2022-12-29T13:54:58.517Z",
                "Language": {
                    "id": 1,
                    "name": "Papiamento",
                    "createdAt": "2022-12-29T13:02:08.364Z",
                    "updatedAt": "2022-12-29T13:02:08.364Z"
                }
            },
            {
                "id": 11,
                "type": "native",
                "UserId": 21,
                "LanguageId": 2,
                "createdAt": "2022-12-29T13:54:58.517Z",
                "updatedAt": "2022-12-29T13:54:58.517Z",
                "Language": {
                    "id": 2,
                    "name": "Northern Sotho",
                    "createdAt": "2022-12-29T13:02:08.364Z",
                    "updatedAt": "2022-12-29T13:02:08.364Z"
                }
            },
            {
                "id": 12,
                "type": "native",
                "UserId": 21,
                "LanguageId": 3,
                "createdAt": "2022-12-29T13:54:58.517Z",
                "updatedAt": "2022-12-29T13:54:58.517Z",
                "Language": {
                    "id": 3,
                    "name": "Lao",
                    "createdAt": "2022-12-29T13:02:08.364Z",
                    "updatedAt": "2022-12-29T13:02:08.364Z"
                }
            },
            {
                "id": 13,
                "type": "interest",
                "UserId": 21,
                "LanguageId": 4,
                "createdAt": "2022-12-29T13:54:58.517Z",
                "updatedAt": "2022-12-29T13:54:58.517Z",
                "Language": {
                    "id": 4,
                    "name": "Catalan",
                    "createdAt": "2022-12-29T13:02:08.364Z",
                    "updatedAt": "2022-12-29T13:02:08.364Z"
                }
            }
        ]
    }
}
```

_Response (400 - Bad Request)_

```json
{
    "error": true,
    "message" : "Email is required"        
}
OR
{
    "error": true,
    "message" : "Password is required"        
}
OR
{
    "error": true,
    "message" : "Email has already been registered"        
}
OR
{
    "error": true,
    "message" : "Username is required"        
}
OR
{
    "error": true,
    "message" : "Invalid email format"        
}
OR
{
    "error": true,
    "message" : "Password must have at least 8 characters"        
}
OR
{
    "error": true,
    "message" : "Password is required"        
}
OR
{
    "error": true,
    "message" : "Password do not match"
}
```


## 2. POST /login

Description :

- Logging in user and returning access token

Request :

- body :

```json
{
    "email" : "string | required",
    "password" : "string | required"
}
```

_Response (200 - OK)_

```json
{
  "access_token" : "string"
}
```

_Response (400 - Bad Request)_

```json
{
    "error": true,
    "message" : "Email is required"        
}
OR
{
    "error": true,
    "message" : "Password is required"        
}
```

_Response (401 - Unauthorized)_

```json
{
    "error": true,
    "message": "Invalid email/password"
}
OR
{
    "error": true,
    "message": "Email address has not been verified!"
}
```


## 3. POST /verify

Description :

- Verify the link given by user

Request :

- query :

```json
{
    "verification" : "string | required",
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
    "error": true,
    "message": "Invalid Link"
}
OR
{
    "error": true,
    "message": "Invalid Token"
}
```

_Response (400 - Bad Request)_

```json
{
    "error": true,
    "message": "Your email address has been verified"
}
```


## 4. GET /groups/:groupId/messages

Description :

- Get group messages

Request :

- headers :

```json
{
    "access_token" : "string | required"
}

```

- params :

```json
{
    "groupId" : "integer"
}
```

_Response (200 - OK)_

```json
[{
        "id" : "1",
        "content" : "hello there",
        "MediaId" : "1",
        "UserId" : "1",
        "GroupId" : "1",
        "Media" : {
            "id" : "1",
            "name" : "avatar",
            "url" : "https://www.syfy.com/sites/syfy/files/styles/1200x1200/public/thanos-avengers-infinity-war.jpg?itok=trgl94eg&timestamp=1525386653",
            "format": "image/jpg",
            "createdAt" : "2022-12-29 06:37:42.002 +0700",
            "updatedAt" : "2022-12-29 06:37:42.002 +0700"
                },
        "User" : {
            "id" : "1",
            "username" : "Sissie Forrest",
            "email" : "sforrest0@chron.com",
            "phoneNumber" : "+1 339 769 7021",
            "country" : "Switzerland",
            "status" : "venenatis non sodales sed tincidunt eu felis fusce posuere felis",
            "verified" : "true",
            "AvatarId" : 1,
            "createdAt" : "2022-12-29 06:37:42.013 +0700",
            "updatedAt" : "2022-12-29 06:37:42.013 +0700"
        },
        "Group" : {
            "id" : "1",
            "name" : "private",
            "createdAt" : "2022-12-29 06:37:42.195 +0700",
            "updatedAt" : "2022-12-29 06:37:42.195 +0700"
        }
    },...
]
```

_Response (400 - Bad Request)_

```json
{
    "error": true,
    "message":  "Invalid groupId"
}
```

_Response (404 - Not Found)_

```json
{
    "error": true,
    "message": "Unknown Group"
}
OR
{
    "error": true,
    "message": "Unknown message"
}
```


## 5. POST /groups/:groupId/messages

Description :

- Create message

Request :

- headers :

```json
{
    "access_token" : "string | required",
    "Content-Type": "multipart/form-data"
}
```

- params :

```json
{
    "groupId" : "integer"
}

```

- body :

```json
{
    "content": "string",
    "attachment": "file upload"
}
```

_Response (200 - OK)_

```json
{
        "id" : "11",
        "content" : "what in the flying hell",
        "MediaId" : "11",
        "UserId" : "1",
        "GroupId" : "1",
        "Media" : {
            "id" : "1",
            "name" : "something",
            "url" : "https://www.syfy.com/sites/syfy/files/styles/1200x1200/public/thanos-avengers-infinity-war.jpg?itok=trgl94eg&timestamp=1525386653",
            "format": "image/jpg",
            "createdAt" : "2022-12-29 06:37:42.002 +0700",
            "updatedAt" : "2022-12-29 06:37:42.002 +0700"
                },
        "User" : {
            "id" : "1",
            "username" : "Sissie Forrest",
            "email" : "sforrest0@chron.com",
            "phoneNumber" : "+1 339 769 7021",
            "country" : "Switzerland",
            "status" : "venenatis non sodales sed tincidunt eu felis fusce posuere felis",
            "verified" : "true",
            "AvatarId" : 1,
            "createdAt" : "2022-12-29 06:37:42.013 +0700",
            "updatedAt" : "2022-12-29 06:37:42.013 +0700"
        },
        "Group" : {
            "id" : "1",
            "name" : "private",
            "createdAt" : "2022-12-29 06:37:42.195 +0700",
            "updatedAt" : "2022-12-29 06:37:42.195 +0700"
        }
    }
```

_Response (400 - Bad Request)_

```json
{
    "error": true,
    "message":  "Invalid groupId"
}
OR
{
    "error": true,
    "message": "One upload or text content is required"
}
```

_Response (404 - Not Found)_

```json
{
    "error": true,
    "message": "Unknown Group"
}
OR
{
    "error": true,
    "message": "Unknown message"
}
```


## 6. GET /groups/:groupId/messages/:messageId

Description :

- Get a message in a group

Request :

- headers :

```json
{
    "access_token" : "string | required"
}
```

- params :

```json
{
    "groupId" : "integer",
    "messageId" : "integer"
}
```

_Response (200 - OK)_

```json
{
    "id" : "1",
    "content" : "hello there",
    "MediaId" : "1",
    "UserId" : "1",
    "GroupId" : "1",
    "Media" : {
        "id" : "1",
        "name" : "avatar",
        "url" : "https://www.syfy.com/sites/syfy/files/styles/1200x1200/public/thanos-avengers-infinity-war.jpg?itok=trgl94eg&timestamp=1525386653",
        "format": "image/jpg",
        "createdAt" : "2022-12-29 06:37:42.002 +0700",
        "updatedAt" : "2022-12-29 06:37:42.002 +0700"
            },
    "User" : {
        "id" : "1",
        "username" : "Sissie Forrest",
        "email" : "sforrest0@chron.com",
        "phoneNumber" : "+1 339 769 7021",
        "country" : "Switzerland",
        "status" : "venenatis non sodales sed tincidunt eu felis fusce posuere felis",
        "verified" : "true",
        "AvatarId" : 1,
        "createdAt" : "2022-12-29 06:37:42.013 +0700",
        "updatedAt" : "2022-12-29 06:37:42.013 +0700"
    },
    "Group" : {
        "id" : "1",
        "name" : "private",
        "createdAt" : "2022-12-29 06:37:42.195 +0700",
        "updatedAt" : "2022-12-29 06:37:42.195 +0700"
    }
}
```

_Response (400 - Bad Request)_

```json
{
    "error": true,
    "message":  "Invalid groupId"
}
```

_Response (404 - Not Found)_

```json
{
    "error": true,
    "message": "Unknown Group"
}
OR
{
    "error": true,
    "message": "Unknown message"
}
```


## 7. PUT /groups/:groupId/messages/:messageId

Description :

- Edit message

Request :

- headers :

```json
{
    "access_token" : "string | required",
    "Content-Type": "multipart/form-data"
}
```

- params :

```json
{
    "groupId" : "integer",
    "messageId" : "integer"
}

```

- body :

```json
{
    "content": "string",
    "attachment": "file upload"
}
```

_Response (200 - OK)_

```json
{
        "id" : "1",
        "content" : "hello there",
        "MediaId" : "1",
        "UserId" : "1",
        "GroupId" : "1",
        "Media" : {
            "id" : "1",
            "name" : "avatar",
            "url" : "https://www.syfy.com/sites/syfy/files/styles/1200x1200/public/thanos-avengers-infinity-war.jpg?itok=trgl94eg&timestamp=1525386653",
            "format": "image/jpg",
            "createdAt" : "2023-01-05 06:55:30.182 +0700",
            "updatedAt" : "2023-01-05 06:55:30.182 +0700"
                },
        "User" : {
            "id" : "1",
            "username" : "Sissie Forrest",
            "email" : "sforrest0@chron.com",
            "phoneNumber" : "+1 339 769 7021",
            "country" : "Switzerland",
            "status" : "venenatis non sodales sed tincidunt eu felis fusce posuere felis",
            "verified" : "true",
            "AvatarId" : 1,
            "createdAt" : "2022-12-29 06:37:42.013 +0700",
            "updatedAt" : "2022-12-29 06:37:42.013 +0700"
        },
        "Group" : {
            "id" : "1",
            "name" : "private",
            "createdAt" : "2022-12-29 06:37:42.195 +0700",
            "updatedAt" : "2022-12-29 06:37:42.195 +0700"
        }
    }
```

_Response (400 - Bad Request)_

```json
{
    "error": true,
    "message":  "Invalid groupId"
}
OR
{
    "error": true,
    "message": "One upload or text content is required"
}
```

_Response (404 - Not Found)_

```json
{
    "error": true,
    "message": "Unknown Group"
}
OR
{
    "error": true,
    "message": "Unknown message"
}
```


## 8. DELETE /groups/:groupId/messages/:messageId

Description :

- Delete message

Request :

- headers :

```json
{
    "access_token" : "string | required"
}
```

- params :

```json
{
    "groupId" : "integer",
    "messageId" : "integer"
}
```

_Response (200 - OK)_

```json
{
    "id": 1
}
```

_Response (400 - Bad Request)_

```json
{
    "error": true,
    "message":  "Invalid groupId"
}
```

_Response (404 - Not Found)_

```json
{
    "error": true,
    "message": "Unknown Group"
}
OR
{
    "error": true,
    "message": "Unknown message"
}
```


## 9. GET /groups

Description :

- Get user groups

Request :

- headers :

```json
{
    "access_token" : "string | required"
}
```

_Response (200 - OK)_

```json
{
    "Group" : {
        "id" : "7",
        "name" : "family",
        "createdAt" : "2022-12-29 06:37:42.195 +0700",
        "updatedAt" : "2022-12-29 06:37:42.195 +0700"
    }
}
```


## 10. POST /avatar

Description :

- Set user avatar

Request :

- headers :

```json
{
    "access_token" : "string | required",
    "Content-Type": "multipart/form-data"
}
```

- body :

```json
{
    "avatar": "file upload"
}
```

_Response (201 - Created)_

```json
[{   
    
    "Media" : {
        "id" : "integer",
        "name" : "string",
        "url" : "string",
        "format": "string",
        "createdAt" : "date",
        "updatedAt" : "date"            
  }
}]
```

_Response (400 - Bad Request)_

```json
{
    "error": true,
    "message": "avatar is required"
}
```


## 11. GET /users/:userId

Description :

- Get user

Request :

- headers :

```json
{
    "access_token" : "string | required"
}
```

_Response (200 - OK)_

```json
{
    "username" : "string",
    "email" : "string",
    "password" : "string",
    "country" : "string",
    "phoneNumber" : "string",
    "nativeLanguages" : ["number"],
    "interestLanguages" : ["number"]
}
```

_Response (400 - Bad Request)_

```json
{
    "error": true,
    "message": "Invalid userId"
}
```

_Response (404 - Not Found)_

```json
{
    "error": true,
    "message": "Unknown user"
}
```


## 12. GET /languages

Description :

- Get all languages

Request :

- headers :

```json
{
    "access_token" : "string | required"
}
```

_Response (200 - OK)_

```json
[
    {
        "name": "Papiamento"
    },
    {
        "name": "Northern Sotho"
    },
    {
        "name": "Lao"
    },
    {
        "name": "Catalan"
    },
    {
        "name": "Kashmiri"
    },...
]
```


## 13. PUT /@me

Description :

- Edit user

Request :

- body :

```json
{
    "username" : "string | required",
    "email" : "string | email format | unique | required",
    "password" : "string | required | min length 8",
    "newPassword" : "string | min length 8",
    "confirmNewPassword" : "string | required if newPassword exist",
    "country" : "string",
    "phoneNumber" : "string",
    "nativeLanguages" : ["number"],
    "interestLanguages" : ["number"]
}

```

_Response (201 - created)_

```json
{
// !TODO
}
```

_Response (400 - Bad Request)_

```json
{
    "error": true,
    "message" : "Email is required"        
}
OR
{
    "error": true,
    "message" : "Password is required"        
}
OR
{
    "error": true,
    "message" : "Email has already been registered"        
}
OR
{
    "error": true,
    "message" : "Username is required"        
}
OR
{
    "error": true,
    "message" : "Invalid email format"        
}
OR
{
    "error": true,
    "message" : "Password must have at least 8 characters"        
}
OR
{
    "error": true,
    "message" : "Password is required"        
}
OR
{
    "error": true,
    "message" : "New password do not match"        
}
```

_Response (401 - Unauthorized)_

```json
{
    "error": true,
    "message": "Invalid old password"
}
```


## 14. GET /@me/languages

Description :

- Get user languages preferences

Request :

- headers :

```json
{
    "access_token" : "string | required"
}
```

_Response (200 - OK)_

```json
// !TODO
```


## 15. GET /friends

Description :

- Get user friends

Request :

- headers :

```json
{
    "access_token" : "string | required"
}
```

_Response (200 - OK)_

```json
// !TODO
```


## 16. POST /friends/:friendId

Description :

- Send friend request

Request :

- headers :

```json
{
    "access_token" : "string | required"
}
```

- params :

```json
{
    "friendId" : "integer"
}
```

_Response (200 - OK)_

```json
// !TODO
```


## Global Error

_Response (400 - Bad Request)_

```json
{
    "error": true,
    "message": "Bad Request"
}
```

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
