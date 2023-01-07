# Linguagram API Documentation

## Endpoints

List of available endpoints:

- `POST /users/register`
- `POST /users/login`
- `POST /users/verify`

- `GET /groups/:groupId/messages`
- `POST /groups/:groupId/messages`
- `GET /groups/:groupId/messages/:messageId`

- `PUT /groups/:groupId/messages/:messageId`
- `DELETE /groups/:groupId/messages/:messageId`

- `GET /groups/@me`
- `POST /users/avatar`
- `DELETE /users/avatar`
- `GET /users/:userId`

- `GET /languages`
- `PUT /users/@me`
- `GET /languages/@me`

- `GET /friends`
- `POST /friends/:friendId`

- `PATCH /friendships/:userId`
- `DELETE /friendships/:friendId`

- `POST /groups/:groupId/join`
- `DELETE /groupmembers/:groupId`
- `PUT /groups/:groupId`

- `POST /translate`
- `POST /groups`

- `PATCH /users/status`
- `PATCH /groups/:groupId/messages`

- `GET /explore/users`
- `GET /explore/groups`
- `GET /interests`
- `GET /users/@me`
- `GET /groups/:userId`

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
    "status" : "string",
    "nativeLanguages" : ["number"],
    "interestLanguages" : ["number"],
    "interests" : ["number"] // !TODO update response (include interests in the response)
}

```

_Response (201 - created)_

```json
{
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTMsImlhdCI6MTY3Mjk4NzExNH0.-QIqOmTKHe_UZp_--AO1xlQqvSjJxi9xsz_p3DKOOO0",
    "user": {
        "id": 13,
        "username": "sipri",
        "email": "admin@test.com",
        "country": null,
        "status": null,
        "phoneNumber": null,
        "verified": false,
        "AvatarId": null,
        "Avatar": null,
        "UserLanguages": [],
        "UserInterests": []
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
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiaWF0IjoxNjcyOTczOTQxfQ.RhpHylcU-Ee2suJ0l0wcpRr8LA45bq4KmwmCPBPukuo",
    "user": {
        "id": 2,
        "username": "Krispin Admin",
        "email": "admin@admin.com",
        "country": "Cuba",
        "status": "ullamcorper purus sit amet nulla quisque arcu libero rutrum ac lobortis vel dapibus at diam nam tristique",
        "phoneNumber": "+86 589 929 4346",
        "verified": true,
        "AvatarId": 2,
        "createdAt": "2023-01-06T02:41:04.980Z",
        "updatedAt": "2023-01-06T02:41:04.980Z"
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

_Response (400 - Bad Request)_

```json
{
    "error": true,
    "message": "Your email address has been verified"
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
[
    {
        "id": 4,
        "content": "But I have the death star cannon",
        "deleted": false,
        "MediaId": null,
        "UserId": 2,
        "GroupId": 1,
        "createdAt": "2023-01-06T08:46:50.275Z",
        "updatedAt": "2023-01-06T08:46:50.275Z",
        "User": {
            "id": 1,
            "username": "Sissie Forrest",
            "email": "sforrest0@chron.com",
            "country": "Switzerland",
            "status": "venenatis non sodales sed tincidunt eu felis fusce posuere felis",
            "phoneNumber": "+1 339 769 7021",
            "verified": false,
            "AvatarId": 1,
            "Avatar": {
                "id": 1,
                "name": "avatar",
                "url": "https://www.syfy.com/sites/syfy/files/styles/1200x1200/public/thanos-avengers-infinity-war.jpg?itok=trgl94eg&timestamp=1525386653",
                "format": "image/jpg",
                "createdAt": "2023-01-06T08:46:50.080Z",
                "updatedAt": "2023-01-06T08:46:50.080Z"
            },
            "UserLanguages": [
                {
                    "id": 3,
                    "type": "interest",
                    "UserId": 1,
                    "LanguageId": 3,
                    "createdAt": "2023-01-06T08:46:50.289Z",
                    "updatedAt": "2023-01-06T08:46:50.289Z",
                    "Language": {
                        "id": 3,
                        "name": "Lao",
                        "createdAt": "2023-01-06T08:46:50.281Z",
                        "updatedAt": "2023-01-06T08:46:50.281Z"
                    }
                },
                {
                    "id": 1,
                    "type": "native",
                    "UserId": 1,
                    "LanguageId": 10,
                    "createdAt": "2023-01-06T08:46:50.289Z",
                    "updatedAt": "2023-01-06T08:46:50.289Z",
                    "Language": {
                        "id": 10,
                        "name": "Moldovan",
                        "createdAt": "2023-01-06T08:46:50.281Z",
                        "updatedAt": "2023-01-06T08:46:50.281Z"
                    }
                }
            ],
            "UserInterests": [
                {
                    "id": 1,
                    "UserId": 1,
                    "InterestId": 3,
                    "createdAt": "2023-01-06T08:46:50.298Z",
                    "updatedAt": "2023-01-06T08:46:50.298Z",
                    "Interest": {
                        "id": 3,
                        "name": "Anime",
                        "createdAt": "2023-01-06T08:46:50.295Z",
                        "updatedAt": "2023-01-06T08:46:50.295Z"
                    }
                },
                {
                    "id": 2,
                    "UserId": 1,
                    "InterestId": 2,
                    "createdAt": "2023-01-06T08:46:50.298Z",
                    "updatedAt": "2023-01-06T08:46:50.298Z",
                    "Interest": {
                        "id": 2,
                        "name": "PC Master Race",
                        "createdAt": "2023-01-06T08:46:50.295Z",
                        "updatedAt": "2023-01-06T08:46:50.295Z"
                    }
                },
                {
                    "id": 3,
                    "UserId": 1,
                    "InterestId": 1,
                    "createdAt": "2023-01-06T08:46:50.298Z",
                    "updatedAt": "2023-01-06T08:46:50.298Z",
                    "Interest": {
                        "id": 1,
                        "name": "Military History and Wars",
                        "createdAt": "2023-01-06T08:46:50.295Z",
                        "updatedAt": "2023-01-06T08:46:50.295Z"
                    }
                }
            ]
        },
        "Medium": null,
        "Group": {
            "id": 1,
            "name": "private",
            "type": "dm",
            "createdAt": "2023-01-06T08:46:50.272Z",
            "updatedAt": "2023-01-06T08:46:50.272Z"
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
    "deleted": false,
    "id": 11,
    "content": "testing",
    "GroupId": 1,
    "UserId": 1,
    "updatedAt": "2023-01-06T13:17:17.138Z",
    "createdAt": "2023-01-06T13:17:17.138Z",
    "Medium": {
        "id": 12,
        "name": "bf0946c9da723ffc8a2a99f4e3d86c88_lQGIkp6-3",
        "url": "https://ik.imagekit.io/sjhgfksjhdgflasfudoi/bf0946c9da723ffc8a2a99f4e3d86c88_lQGIkp6-3",
        "format": "text/markdown",
        "updatedAt": "2023-01-06T21:20:41.780Z",
        "createdAt": "2023-01-06T21:20:41.780Z"
    },
    "User": {
        "id": 1,
        "username": "Sissie Forrest",
        "email": "sforrest0@chron.com",
        "country": "Switzerland",
        "status": "venenatis non sodales sed tincidunt eu felis fusce posuere felis",
        "phoneNumber": "+1 339 769 7021",
        "verified": false,
        "AvatarId": 1,
        "Avatar": {
            "id": 1,
            "name": "avatar",
            "url": "https://www.syfy.com/sites/syfy/files/styles/1200x1200/public/thanos-avengers-infinity-war.jpg?itok=trgl94eg&timestamp=1525386653",
            "format": "image/jpg",
            "createdAt": "2023-01-06T08:46:50.080Z",
            "updatedAt": "2023-01-06T08:46:50.080Z"
        },
        "UserLanguages": [
            {
                "id": 3,
                "type": "interest",
                "UserId": 1,
                "LanguageId": 3,
                "createdAt": "2023-01-06T08:46:50.289Z",
                "updatedAt": "2023-01-06T08:46:50.289Z",
                "Language": {
                    "id": 3,
                    "name": "Lao",
                    "createdAt": "2023-01-06T08:46:50.281Z",
                    "updatedAt": "2023-01-06T08:46:50.281Z"
                }
            },
            {
                "id": 1,
                "type": "native",
                "UserId": 1,
                "LanguageId": 10,
                "createdAt": "2023-01-06T08:46:50.289Z",
                "updatedAt": "2023-01-06T08:46:50.289Z",
                "Language": {
                    "id": 10,
                    "name": "Moldovan",
                    "createdAt": "2023-01-06T08:46:50.281Z",
                    "updatedAt": "2023-01-06T08:46:50.281Z"
                }
            }
        ],
        "UserInterests": [
            {
                "id": 1,
                "UserId": 1,
                "InterestId": 3,
                "createdAt": "2023-01-06T08:46:50.298Z",
                "updatedAt": "2023-01-06T08:46:50.298Z",
                "Interest": {
                    "id": 3,
                    "name": "Anime",
                    "createdAt": "2023-01-06T08:46:50.295Z",
                    "updatedAt": "2023-01-06T08:46:50.295Z"
                }
            },
            {
                "id": 2,
                "UserId": 1,
                "InterestId": 2,
                "createdAt": "2023-01-06T08:46:50.298Z",
                "updatedAt": "2023-01-06T08:46:50.298Z",
                "Interest": {
                    "id": 2,
                    "name": "PC Master Race",
                    "createdAt": "2023-01-06T08:46:50.295Z",
                    "updatedAt": "2023-01-06T08:46:50.295Z"
                }
            },
            {
                "id": 3,
                "UserId": 1,
                "InterestId": 1,
                "createdAt": "2023-01-06T08:46:50.298Z",
                "updatedAt": "2023-01-06T08:46:50.298Z",
                "Interest": {
                    "id": 1,
                    "name": "Military History and Wars",
                    "createdAt": "2023-01-06T08:46:50.295Z",
                    "updatedAt": "2023-01-06T08:46:50.295Z"
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
    "id": 11,
    "content": null,
    "deleted": false,
    "MediaId": 11,
    "UserId": 1,
    "GroupId": 1,
    "createdAt": "2023-01-05T12:28:01.213Z",
    "updatedAt": "2023-01-05T12:28:01.213Z",
    "User": {
        "id": 1,
        "username": "Sissie Forrest",
        "email": "sforrest0@chron.com",
        "password": "$2a$08$KfkLz6wbZs7yi1l30fdGQOoWpTBssKbvdLwye773h7IWP5u1j1jFy",
        "country": "Switzerland",
        "status": "venenatis non sodales sed tincidunt eu felis fusce posuere felis",
        "phoneNumber": "+1 339 769 7021",
        "verified": true,
        "AvatarId": 1,
        "createdAt": "2023-01-05T10:41:33.325Z",
        "updatedAt": "2023-01-05T10:41:33.325Z"
    },
    "Medium": {
        "id": 11,
        "name": "d06951e8c51d6aa65f001bf80291aa61_RnRvpvMA-",
        "url": "https://ik.imagekit.io/sjhgfksjhdgflasfudoi/d06951e8c51d6aa65f001bf80291aa61_RnRvpvMA-",
        "format": "image/png",
        "createdAt": "2023-01-05T12:28:01.204Z",
        "updatedAt": "2023-01-05T12:28:01.204Z"
    },
    "Group": {
        "id": 1,
        "name": "private",
        "type": "dm",
        "createdAt": "2023-01-05T10:41:33.523Z",
        "updatedAt": "2023-01-05T10:41:33.523Z"
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
    "id": 1,
    "content": "testing later",
    "deleted": false,
    "MediaId": 1,
    "UserId": 1,
    "GroupId": 1,
    "createdAt": "2023-01-05T09:57:33.467Z",
    "updatedAt": "2023-01-05T10:08:36.779Z",
    "User": {
        "id": 1,
        "username": "Sissie Forrest",
        "email": "sforrest0@chron.com",
        "password": "$2a$08$gO98orcgtRzGF6xZ.IuLVeZm/hr0kVZtyNSifzpdjeEzPYefNRBFm",
        "country": "Switzerland",
        "status": "venenatis non sodales sed tincidunt eu felis fusce posuere felis",
        "phoneNumber": "+1 339 769 7021",
        "verified": true,
        "AvatarId": 1,
        "createdAt": "2023-01-05T09:57:33.278Z",
        "updatedAt": "2023-01-05T09:57:33.278Z"
    },
    "Medium": {
        "id": 1,
        "name": "avatar",
        "url": "https://www.syfy.com/sites/syfy/files/styles/1200x1200/public/thanos-avengers-infinity-war.jpg?itok=trgl94eg&timestamp=1525386653",
        "format": "image/jpg",
        "createdAt": "2023-01-05T09:57:33.266Z",
        "updatedAt": "2023-01-05T09:57:33.266Z"
    },
    "Group": {
        "id": 1,
        "name": "private",
        "createdAt": "2023-01-05T09:57:33.464Z",
        "updatedAt": "2023-01-05T09:57:33.464Z"
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
    "id": 1,
    "deleted": true,
    "Group": {
        "id": 1,
        "name": "private",
        "type": "dm",
        "createdAt": "2023-01-07T04:59:24.335Z",
        "updatedAt": "2023-01-07T04:59:24.335Z"
    },
    "UserId": 1,
    "User": {
        "id": 1,
        "username": "Sissie Forrest",
        "email": "sforrest0@chron.com",
        "country": "Switzerland",
        "status": "venenatis non sodales sed tincidunt eu felis fusce posuere felis",
        "phoneNumber": "+1 339 769 7021",
        "verified": true,
        "AvatarId": 1,
        "Avatar": {
            "id": 1,
            "name": "avatar",
            "url": "https://www.syfy.com/sites/syfy/files/styles/1200x1200/public/thanos-avengers-infinity-war.jpg?itok=trgl94eg&timestamp=1525386653",
            "format": "image/jpg",
            "createdAt": "2023-01-07T04:59:24.138Z",
            "updatedAt": "2023-01-07T04:59:24.138Z"
        },
        "UserLanguages": [
            {
                "id": 3,
                "type": "interest",
                "UserId": 1,
                "LanguageId": 3,
                "createdAt": "2023-01-07T04:59:24.358Z",
                "updatedAt": "2023-01-07T04:59:24.358Z",
                "Language": {
                    "id": 3,
                    "name": "Lao",
                    "createdAt": "2023-01-07T04:59:24.346Z",
                    "updatedAt": "2023-01-07T04:59:24.346Z"
                }
            },
            {
                "id": 1,
                "type": "native",
                "UserId": 1,
                "LanguageId": 10,
                "createdAt": "2023-01-07T04:59:24.358Z",
                "updatedAt": "2023-01-07T04:59:24.358Z",
                "Language": {
                    "id": 10,
                    "name": "Moldovan",
                    "createdAt": "2023-01-07T04:59:24.346Z",
                    "updatedAt": "2023-01-07T04:59:24.346Z"
                }
            }
        ],
        "UserInterests": [
            {
                "id": 1,
                "UserId": 1,
                "InterestId": 3,
                "createdAt": "2023-01-07T04:59:24.369Z",
                "updatedAt": "2023-01-07T04:59:24.369Z",
                "Interest": {
                    "id": 3,
                    "name": "Anime",
                    "createdAt": "2023-01-07T04:59:24.366Z",
                    "updatedAt": "2023-01-07T04:59:24.366Z"
                }
            },
            {
                "id": 2,
                "UserId": 1,
                "InterestId": 2,
                "createdAt": "2023-01-07T04:59:24.369Z",
                "updatedAt": "2023-01-07T04:59:24.369Z",
                "Interest": {
                    "id": 2,
                    "name": "PC Master Race",
                    "createdAt": "2023-01-07T04:59:24.366Z",
                    "updatedAt": "2023-01-07T04:59:24.366Z"
                }
            },
            {
                "id": 3,
                "UserId": 1,
                "InterestId": 1,
                "createdAt": "2023-01-07T04:59:24.369Z",
                "updatedAt": "2023-01-07T04:59:24.369Z",
                "Interest": {
                    "id": 1,
                    "name": "Military History and Wars",
                    "createdAt": "2023-01-07T04:59:24.366Z",
                    "updatedAt": "2023-01-07T04:59:24.366Z"
                }
            }
        ],
        "isOnline": false
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
    "message":  "This message has already been deleted"
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
[
    {
        "id": 1,
        "GroupId": 1,
        "UserId": 1,
        "createdAt": "2023-01-06T02:10:31.190Z",
        "updatedAt": "2023-01-06T02:10:31.190Z",
        "Group": {
            "id": 1,
            "name": "private",
            "type": "dm",
            "createdAt": "2023-01-06T02:10:31.184Z",
            "updatedAt": "2023-01-06T02:10:31.184Z"
        }
    },
    {
        "id": 4,
        "GroupId": 2,
        "UserId": 1,
        "createdAt": "2023-01-06T02:10:31.190Z",
        "updatedAt": "2023-01-06T02:10:31.190Z",
        "Group": {
            "id": 2,
            "name": "private",
            "type": "dm",
            "createdAt": "2023-01-06T02:10:31.184Z",
            "updatedAt": "2023-01-06T02:10:31.184Z"
        }
    },...
]
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
{
    "id": 1,
    "username": "Sissie Forrest",
    "email": "sforrest0@chron.com",
    "country": "Switzerland",
    "status": "venenatis non sodales sed tincidunt eu felis fusce posuere felis",
    "phoneNumber": "+1 339 769 7021",
    "verified": true,
    "AvatarId": 11,
    "Avatar": {
        "id": 11,
        "name": "1f7851ce062d27144afe91ee52593578_hiAK42ceu",
        "url": "https://ik.imagekit.io/sjhgfksjhdgflasfudoi/1f7851ce062d27144afe91ee52593578_hiAK42ceu",
        "format": "image/jpeg",
        "updatedAt": "2023-01-06T02:13:38.021Z",
        "createdAt": "2023-01-06T02:13:38.021Z"
    },
    "updatedAt": "2023-01-06T02:13:38.032Z"
}
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
    "id": 1,
    "username": "Sissie Forrest",
    "email": "sforrest0@chron.com",
    "country": "Switzerland",
    "status": "venenatis non sodales sed tincidunt eu felis fusce posuere felis",
    "phoneNumber": "+1 339 769 7021",
    "verified": true,
    "AvatarId": 11,
    "Avatar": {
        "id": 11,
        "name": "1f7851ce062d27144afe91ee52593578_hiAK42ceu",
        "url": "https://ik.imagekit.io/sjhgfksjhdgflasfudoi/1f7851ce062d27144afe91ee52593578_hiAK42ceu",
        "format": "image/jpeg",
        "createdAt": "2023-01-06T02:13:38.021Z",
        "updatedAt": "2023-01-06T02:13:38.021Z"
    }
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
        "id": 1,
        "name": "Papiamento",
        "createdAt": "2023-01-06T02:10:31.193Z",
        "updatedAt": "2023-01-06T02:10:31.193Z"
    },
    {
        "id": 2,
        "name": "Northern Sotho",
        "createdAt": "2023-01-06T02:10:31.193Z",
        "updatedAt": "2023-01-06T02:10:31.193Z"
    },
    {
        "id": 3,
        "name": "Lao",
        "createdAt": "2023-01-06T02:10:31.193Z",
        "updatedAt": "2023-01-06T02:10:31.193Z"
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
    "id" : 1,
    "username" : "Sissie Forrest",
    "email" : "sforrest0@chron.com",    
    "country" : "Norway",
    "phoneNumber" : "+1 339 769 7021",
    "status" : "venenatis non sodales sed tincidunt eu felis fusce posuere felis",
    "UserLanguages" : [
        {
            "id": 1,
            "type": "native",
            "UserId": 1,
            "LanguageId": 10,
            "createdAt": "2022-12-29T13:54:58.517Z",
            "updatedAt": "2022-12-29T13:54:58.517Z",
            "Language": {
                "id": 1,
                "name": "Polish",
                "createdAt": "2022-12-29T13:02:08.364Z",
                "updatedAt": "2022-12-29T13:02:08.364Z"
            }
        },{
            "id": 1,
            "type": "interest",
            "UserId": 1,
            "LanguageId": 3,
            "createdAt": "2022-12-29T13:54:58.517Z",
            "updatedAt": "2022-12-29T13:54:58.517Z",
            "Language": {
                "id": 3,
                "name": "Lao",
                "createdAt": "2022-12-29T13:02:08.364Z",
                "updatedAt": "2022-12-29T13:02:08.364Z"
            }
        }
    ]
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
{
    "UserLanguages" : [
        {
            "id": 1,
            "type": "interest",
            "UserId": 1,
            "LanguageId": 3,
            "createdAt": "2022-12-29T13:54:58.517Z",
            "updatedAt": "2022-12-29T13:54:58.517Z",
            "Language": {
                "id": 3,
                "name": "Lao",
                "createdAt": "2022-12-29T13:02:08.364Z",
                "updatedAt": "2022-12-29T13:02:08.364Z"
            }
        }
    ]
}
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
[
     {
        "id": 1,
        "UserId": 1,
        "FriendId": 2,
        "isAccepted": false,
        "createdAt": "2023-01-04T14:46:02.804Z",
        "updatedAt": "2023-01-04T14:46:02.804Z",
        "User": {
            "id": 1,
            "username": "Sissie Forrest",
            "email": "sforrest0@chron.com",
            "password": "$2a$08$bwvSaCVrejfQoPU/vlHye.ogCKIc4Z.33GtTw3wh0CiYNlycnU6HW",
            "country": "Switzerland",
            "status": "venenatis non sodales sed tincidunt eu felis fusce posuere felis",
            "phoneNumber": "+1 339 769 7021",
            "verified": true,
            "AvatarId": 1,
            "createdAt": "2023-01-04T14:46:02.417Z",
            "updatedAt": "2023-01-04T14:46:02.417Z"
        },
        "Friend": {
            "id": 2,
            "username": "Krispin Admin",
            "email": "admin@admin.com",
            "password": "$2a$08$1X.cFlCrqRmeKkFn/5NvguOYc/4QCixGj3P3jAURtKlQmNZJuoWkS",
            "country": "Cuba",
            "status": "ullamcorper purus sit amet nulla quisque arcu libero rutrum ac lobortis vel dapibus at diam nam tristique",
            "phoneNumber": "+86 589 929 4346",
            "verified": true,
            "AvatarId": 2,
            "createdAt": "2023-01-04T14:46:02.475Z",
            "updatedAt": "2023-01-04T14:46:02.475Z"
        }
    },
    ...
]
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
{
    "isAccepted": false,
    "id": 9,
    "FriendId": 5,
    "UserId": 2,
    "updatedAt": "2023-01-05T01:51:22.011Z",
    "createdAt": "2023-01-05T01:51:22.011Z"
}
```

## 17. DELETE /avatar

Description :

- Delete user's avatar

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
    "id": 1,
    "username": "Sissie Forrest",
    "email": "sforrest0@chron.com",
    "country": "Switzerland",
    "status": "venenatis non sodales sed tincidunt eu felis fusce posuere felis",
    "phoneNumber": "+1 339 769 7021",
    "verified": true,
    "AvatarId": null,
    "Avatar": {
        "id": 1,
        "name": "avatar",
        "url": "https://www.syfy.com/sites/syfy/files/styles/1200x1200/public/thanos-avengers-infinity-war.jpg?itok=trgl94eg&timestamp=1525386653",
        "format": "image/jpg",
        "createdAt": "2023-01-04T23:55:30.182Z",
        "updatedAt": "2022-12-28T23:37:42.002Z"
    },
    "updatedAt": "2023-01-05T09:22:13.746Z"
}
```


## 18. PATCH /friendships/:userId


## 19. DELETE /friendships/:friendId



## 20. POST /groups/:groupId/join


## 21. DELETE /groupmembers/:groupId


## 22. PUT /groups/:groupId


## 23. POST /translate


## 24. POST /groups

## 25. GET /explore/groups


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
