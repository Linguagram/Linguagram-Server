# Linguagram API Documentation

## Endpoints

List of available endpoints:

- [Linguagram API Documentation](#linguagram-api-documentation)
  - [Endpoints](#endpoints)
  - [1. POST /users/register](#1-post-usersregister)
  - [2. POST /users/login](#2-post-userslogin)
  - [3. POST /users/verify](#3-post-usersverify)
  - [4. GET /groups/:groupId/messages](#4-get-groupsgroupidmessages)
  - [5. POST /groups/:groupId/messages](#5-post-groupsgroupidmessages)
  - [6. GET /groups/:groupId/messages/:messageId](#6-get-groupsgroupidmessagesmessageid)
  - [7. PUT /groups/:groupId/messages/:messageId](#7-put-groupsgroupidmessagesmessageid)
  - [8. DELETE /groups/:groupId/messages/:messageId](#8-delete-groupsgroupidmessagesmessageid)
  - [9. GET /groups/@me](#9-get-groupsme)
  - [10. POST /users/avatar](#10-post-usersavatar)
  - [11. GET /users/:userId](#11-get-usersuserid)
  - [12. GET /languages](#12-get-languages)
  - [13. PUT /users/@me](#13-put-usersme)
  - [14. GET /languages/@me](#14-get-languagesme)
  - [15. GET /friends](#15-get-friends)
  - [16. POST /friends/:friendId](#16-post-friendsfriendid)
  - [17. DELETE /users/avatar](#17-delete-usersavatar)
  - [18. PATCH /friendships/:userId](#18-patch-friendshipsuserid)
  - [19. DELETE /friendships/:friendId](#19-delete-friendshipsfriendid)
  - [20. POST /groups/:groupId/join](#20-post-groupsgroupidjoin)
  - [21. DELETE /groupmembers/:groupId](#21-delete-groupmembersgroupid)
  - [22. PUT /groups/:groupId](#22-put-groupsgroupid)
  - [23. POST /translate](#23-post-translate)
  - [24. POST /groups](#24-post-groups)
  - [25. PATCH /users/status](#25-patch-usersstatus)
  - [26. PATCH /groups/:groupId/messages](#26-patch-groupsgroupidmessages)
  - [27. GET /explore/users](#27-get-exploreusers)
  - [28. GET /explore/groups](#28-get-exploregroups)
  - [29. GET /interests](#29-get-interests)
  - [30. GET /users/@me](#30-get-usersme)
  - [31. GET /groups/:userId](#31-get-groupsuserid)
  - [32. POST /attachment](#32-post-attachment)
  - [Global Error](#global-error)

&nbsp;

## 1. POST /users/register


Description :

- Create new user

Request :

- body :

```json
{
    "username" : "string | required",
    "email" : "string | email format | unique | required",
    "password" : "string | required | min length 8",
    "confirmPassword" : "string | required to match password",
    "country" : "string",
    "phoneNumber" : "string",
    "status" : "string",
    "nativeLanguages" : ["number"],
    "interestLanguages" : ["number"],
    "interests" : ["number"]
}

```

_Response (201 - created)_

```json
{
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTEsImlhdCI6MTY3MzI0MjI1MX0.zGa7T_fyXa1NIIjEIJeF4OIjD4feYnrwXi94KVcSXsc",
    "user": {
        "id": 11,
        "username": "asdawed",
        "email": "sforrest210@chron.com",
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


## 2. POST /users/login

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


## 3. POST /users/verify

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
                },...
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
                },...
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
            },...
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
            },...
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
    "id": 1,
    "content": "hello there",
    "deleted": null,
    "MediaId": 1,
    "UserId": 1,
    "GroupId": 1,
    "isRead": null,
    "createdAt": "2023-01-08T19:56:28.006Z",
    "updatedAt": "2023-01-08T19:56:28.006Z",
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
            "createdAt": "2023-01-08T19:56:27.810Z",
            "updatedAt": "2023-01-08T19:56:27.810Z"
        },
        "UserLanguages": [
            {
                "id": 3,
                "type": "interest",
                "UserId": 1,
                "LanguageId": 3,
                "createdAt": "2023-01-08T19:56:28.022Z",
                "updatedAt": "2023-01-08T19:56:28.022Z",
                "Language": {
                    "id": 3,
                    "name": "Arabic",
                    "createdAt": "2023-01-08T19:56:28.014Z",
                    "updatedAt": "2023-01-08T19:56:28.014Z"
                }
            },...
        ],
        "UserInterests": [
            {
                "id": 1,
                "UserId": 1,
                "InterestId": 3,
                "createdAt": "2023-01-08T19:56:28.032Z",
                "updatedAt": "2023-01-08T19:56:28.032Z",
                "Interest": {
                    "id": 3,
                    "name": "Anime",
                    "createdAt": "2023-01-08T19:56:28.029Z",
                    "updatedAt": "2023-01-08T19:56:28.029Z"
                }
            },...
        ],
        "isOnline": false
    },
    "Medium": {
        "id": 1,
        "name": "avatar",
        "url": "https://www.syfy.com/sites/syfy/files/styles/1200x1200/public/thanos-avengers-infinity-war.jpg?itok=trgl94eg&timestamp=1525386653",
        "format": "image/jpg",
        "createdAt": "2023-01-08T19:56:27.810Z",
        "updatedAt": "2023-01-08T19:56:27.810Z"
    },
    "Group": {
        "id": 1,
        "name": "private",
        "type": "dm",
        "createdAt": "2023-01-08T19:56:28.003Z",
        "updatedAt": "2023-01-08T19:56:28.003Z"
    },
    "edited": false
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
    "message": "Content is required to edit message"
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
            },...
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
            },...
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


## 9. GET /groups/@me

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
        "name": "private",
        "type": "dm",
        "createdAt": "2023-01-07T04:59:24.335Z",
        "updatedAt": "2023-01-07T04:59:24.335Z",
        "unreadMessageCount": 2,
        "GroupMembers": [
            {
                "id": 1,
                "GroupId": 1,
                "UserId": 1,
                "createdAt": "2023-01-07T04:59:24.342Z",
                "updatedAt": "2023-01-07T04:59:24.342Z",
                "User": {
                    "id": 1,
                    "username": "Sissie Forrest",
                    "email": "sforrest0@chron.com",
                    "country": "Switzerland",
                    "status": "venenatis non sodales sed tincidunt eu felis fusce posuere felis",
                    "phoneNumber": "+1 339 769 7021",
                    "verified": true,
                    "AvatarId": 1,
                    "createdAt": "2023-01-07T04:59:24.147Z",
                    "updatedAt": "2023-01-07T04:59:24.147Z",
                    "isOnline": false
                }
            },...
        ]
    },...
]
```


## 10. POST /users/avatar

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
    "AvatarId": 21,
    "Avatar": {
        "id": 21,
        "name": "4db30eaf4b70dfee0e7e5cd8ded5531f_xl0EL2jdR",
        "url": "https://ik.imagekit.io/sjhgfksjhdgflasfudoi/4db30eaf4b70dfee0e7e5cd8ded5531f_xl0EL2jdR",
        "format": "image/png",
        "createdAt": "2023-01-07T15:50:02.973Z",
        "updatedAt": "2023-01-07T15:50:02.973Z"
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
        },...
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
        },...
    ],
    "isOnline": false
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


## 13. PUT /users/@me

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
    "AvatarId": 21,
    "Avatar": {
        "id": 21,
        "name": "4db30eaf4b70dfee0e7e5cd8ded5531f_xl0EL2jdR",
        "url": "https://ik.imagekit.io/sjhgfksjhdgflasfudoi/4db30eaf4b70dfee0e7e5cd8ded5531f_xl0EL2jdR",
        "format": "image/png",
        "createdAt": "2023-01-07T15:50:02.973Z",
        "updatedAt": "2023-01-07T15:50:02.973Z"
    },
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


## 14. GET /languages/@me

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
        "createdAt": "2023-01-08T04:09:06.588Z",
        "updatedAt": "2023-01-08T04:09:06.588Z",
        "User": {
            "id": 1,
            "username": "Sissie Forrest",
            "email": "sforrest0@chron.com",
            "country": "Switzerland",
            "status": "test update status",
            "phoneNumber": "+1 339 769 7021",
            "verified": true,
            "AvatarId": 10,
            "Avatar": "object",
            "UserLanguages": "array",
            "UserInterests" : "array",
            "isOnline": false
        },
        "Friend": {
             "id": 2,
            "username": "Krispin Admin",
            "email": "admin@admin.com",
            "country": "Cuba",
            "status": "ullamcorper purus sit amet nulla quisque arcu libero rutrum ac lobortis vel dapibus at diam nam tristique",
            "phoneNumber": "+86 589 929 4346",
            "verified": false,
              "AvatarId": 2,
            "Avatar": "object",
            "UserLanguages": "array",
            "UserInterests" : "array",
            "isOnline": false
        }
    },...
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

## 17. DELETE /users/avatar

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
    "AvatarId": 1,
    "Avatar": {
        "id": 1,
        "name": "avatar",
        "url": "https://www.syfy.com/sites/syfy/files/styles/1200x1200/public/thanos-avengers-infinity-war.jpg?itok=trgl94eg&timestamp=1525386653",
        "format": "image/jpg",
        "createdAt": "2023-01-08T04:09:06.355Z",
        "updatedAt": "2023-01-08T04:09:06.355Z"
    },
    "UserLanguages": [
        {
            "id": 3,
            "type": "interest",
            "UserId": 1,
            "LanguageId": 3,
            "createdAt": "2023-01-08T04:09:06.612Z",
            "updatedAt": "2023-01-08T04:09:06.612Z",
            "Language": {
                "id": 3,
                "name": "Lao",
                "createdAt": "2023-01-08T04:09:06.603Z",
                "updatedAt": "2023-01-08T04:09:06.603Z"
            }
        },...
    ],
    "UserInterests": [
        {
            "id": 1,
            "UserId": 1,
            "InterestId": 3,
            "createdAt": "2023-01-08T04:09:06.622Z",
            "updatedAt": "2023-01-08T04:09:06.622Z",
            "Interest": {
                "id": 3,
                "name": "Anime",
                "createdAt": "2023-01-08T04:09:06.620Z",
                "updatedAt": "2023-01-08T04:09:06.620Z"
            }
        },...
    ]
}
```


## 18. PATCH /friendships/:userId

Description :

- Accept friend request

- params :

```json
{
    "userId" : "integer"
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
    "AvatarId": 1,
    "Avatar": {
        "id": 1,
        "name": "avatar",
        "url": "https://www.syfy.com/sites/syfy/files/styles/1200x1200/public/thanos-avengers-infinity-war.jpg?itok=trgl94eg&timestamp=1525386653",
        "format": "image/jpg",
        "createdAt": "2023-01-08T04:09:06.355Z",
        "updatedAt": "2023-01-08T04:09:06.355Z"
    },
    "UserLanguages": [
        {
            "id": 3,
            "type": "interest",
            "UserId": 1,
            "LanguageId": 3,
            "createdAt": "2023-01-08T04:09:06.612Z",
            "updatedAt": "2023-01-08T04:09:06.612Z",
            "Language": {
                "id": 3,
                "name": "Lao",
                "createdAt": "2023-01-08T04:09:06.603Z",
                "updatedAt": "2023-01-08T04:09:06.603Z"
            }
        },...
    ],
    "UserInterests": [
        {
            "id": 1,
            "UserId": 1,
            "InterestId": 3,
            "createdAt": "2023-01-08T04:09:06.622Z",
            "updatedAt": "2023-01-08T04:09:06.622Z",
            "Interest": {
                "id": 3,
                "name": "Anime",
                "createdAt": "2023-01-08T04:09:06.620Z",
                "updatedAt": "2023-01-08T04:09:06.620Z"
            }
        },...
    ]
}
```

_Response (400 - Bad Request)_

```json
{
    "error": true,
    "message":  "Invalid userId" 
}
OR
{
    "error": true,
    "message": "Friend request already accepted"
}
```

_Response (404 - Not Found)_

```json
{
    "error": true,
    "message": "Friendship not found"
}

```


## 19. DELETE /friendships/:friendId

Description :

- Unfriend a friend

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
        "createdAt": "2023-01-08T04:09:06.355Z",
        "updatedAt": "2023-01-08T04:09:06.355Z"
    },
    "UserLanguages": [
        {
            "id": 3,
            "type": "interest",
            "UserId": 1,
            "LanguageId": 3,
            "createdAt": "2023-01-08T04:09:06.612Z",
            "updatedAt": "2023-01-08T04:09:06.612Z",
            "Language": {
                "id": 3,
                "name": "Lao",
                "createdAt": "2023-01-08T04:09:06.603Z",
                "updatedAt": "2023-01-08T04:09:06.603Z"
            }
        },...
    ],
    "UserInterests": [
        {
            "id": 1,
            "UserId": 1,
            "InterestId": 3,
            "createdAt": "2023-01-08T04:09:06.622Z",
            "updatedAt": "2023-01-08T04:09:06.622Z",
            "Interest": {
                "id": 3,
                "name": "Anime",
                "createdAt": "2023-01-08T04:09:06.620Z",
                "updatedAt": "2023-01-08T04:09:06.620Z"
            }
        },...
    ]
}
```

_Response (400 - Bad Request)_

```json
{
    "error": true,
    "message":  "Invalid friendId" 
}
```

_Response (404 - Not Found)_

```json
{
    "error": true,
    "message": "Friendship not found"
}

```


## 20. POST /groups/:groupId/join

Description :

- Join a group

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
{
    "id": 14,
    "GroupId": 7,
    "UserId": 2,
    "updatedAt": "2023-01-08T05:40:11.685Z",
    "createdAt": "2023-01-08T05:40:11.685Z",
    "isOnline": false
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
    "message":  "Already a member" 
}
```

_Response (404 - Not Found)_

```json
{
    "error": true,
    "message": "Group not found"
}

```


## 21. DELETE /groupmembers/:groupId

Description :

- Leave group

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
{
    "id": 15,
    "GroupId": 8,
    "UserId": 2,
    "createdAt": "2023-01-08T06:10:16.377Z",
    "updatedAt": "2023-01-08T06:10:16.377Z",
    "Group": {
        "id": 8,
        "name": "family",
        "type": "group",
        "createdAt": "2023-01-08T05:02:55.113Z",
        "updatedAt": "2023-01-08T05:02:55.113Z"
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

```


## 22. PUT /groups/:groupId

Description :

- Edit group

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

- body:

```json
{
    "name": "string | required"
}
```

_Response (200 - OK)_

```json
{
    "id": 7,
    "name": "WDbnhZZ63W1",
    "type": "group",
    "createdAt": "2023-01-08T05:02:55.113Z",
    "updatedAt": "2023-01-08T05:02:55.113Z",
    "GroupMembers": [
        {
            "id": 17,
            "GroupId": 7,
            "UserId": 2,
            "createdAt": "2023-01-08T06:18:27.629Z",
            "updatedAt": "2023-01-08T06:18:27.629Z"
        }
    ]
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
    "message": "Group name is required"
}
```

_Response (404 - Not Found)_

```json
{
    "error": true,
    "message": "Unknown Group"
}

```


## 23. POST /translate

Description :

- Translate text

Request :

- headers :

```json
{
    "access_token" : "string | required"
}
```

- body:

```json
{
    "text": "string | required",
    "to": "string",
    "from": "string"
}
```

_Response (200 - OK)_

```json
{
    "translated": "??????????????????????????? 3"
}
```

_Response (400 - Bad Request)_

```json
{
    "error": true,
    "message":  "Text is required" 
}
OR
{
    "error": true,
    "message": "No target language specified"
}
```


## 24. POST /groups

Description :

- Create group

Request :

- headers :

```json
{
    "access_token" : "string | required"
}
```

- body:

```json
{
    "name": "string | required"
}
```

_Response (200 - OK)_

```json
{
    "id": 14,
    "name": "saya punya anak kambing 3",
    "type": "group",
    "updatedAt": "2023-01-08T07:40:56.207Z",
    "createdAt": "2023-01-08T07:40:56.207Z",
    "GroupMembers": [
        {
            "id": 14,
            "UserId": 2,
            "GroupId": 14,
            "updatedAt": "2023-01-08T07:40:56.416Z",
            "createdAt": "2023-01-08T07:40:56.416Z",
            "User": {
                "id": 2,
                "username": "Krispin Admin",
                "email": "admin@admin.com",
                "country": "Cuba",
                "status": "ullamcorper purus sit amet nulla quisque arcu libero rutrum ac lobortis vel dapibus at diam nam tristique",
                "phoneNumber": "+86 589 929 4346",
                "verified": false,
                "AvatarId": 2,
                "Avatar": {
                    "id": 2,
                    "name": "avatar",
                    "url": "https://images.hindustantimes.com/rf/image_size_960x540/HT/p2/2020/10/21/Pictures/_7e701072-1375-11eb-9315-b00ef9141a48.jpg",
                    "format": "image/jpg",
                    "createdAt": "2023-01-08T07:05:17.609Z",
                    "updatedAt": "2023-01-08T07:05:17.609Z"
                },
                "UserLanguages": [
                    {
                        "id": 4,
                        "type": "interest",
                        "UserId": 2,
                        "LanguageId": 1,
                        "createdAt": "2023-01-08T07:05:18.644Z",
                        "updatedAt": "2023-01-08T07:05:18.644Z",
                        "Language": {
                            "id": 1,
                            "name": "Afrikaans",
                            "createdAt": "2023-01-08T07:05:18.565Z",
                            "updatedAt": "2023-01-08T07:05:18.565Z"
                        }
                    },
                    {
                        "id": 2,
                        "type": "native",
                        "UserId": 2,
                        "LanguageId": 3,
                        "createdAt": "2023-01-08T07:05:18.644Z",
                        "updatedAt": "2023-01-08T07:05:18.644Z",
                        "Language": {
                            "id": 3,
                            "name": "Arabic",
                            "createdAt": "2023-01-08T07:05:18.565Z",
                            "updatedAt": "2023-01-08T07:05:18.565Z"
                        }
                    }
                ],
                "UserInterests": [
                    {
                        "id": 4,
                        "UserId": 2,
                        "InterestId": 4,
                        "createdAt": "2023-01-08T07:05:18.832Z",
                        "updatedAt": "2023-01-08T07:05:18.832Z",
                        "Interest": {
                            "id": 4,
                            "name": "Politic",
                            "createdAt": "2023-01-08T07:05:18.709Z",
                            "updatedAt": "2023-01-08T07:05:18.709Z"
                        }
                    },
                    {
                        "id": 5,
                        "UserId": 2,
                        "InterestId": 5,
                        "createdAt": "2023-01-08T07:05:18.832Z",
                        "updatedAt": "2023-01-08T07:05:18.832Z",
                        "Interest": {
                            "id": 5,
                            "name": "Manga",
                            "createdAt": "2023-01-08T07:05:18.709Z",
                            "updatedAt": "2023-01-08T07:05:18.709Z"
                        }
                    }
                ],
                "isOnline": false
            }
        }
    ]
}
```

_Response (400 - Bad Request)_

```json


{
    "error": true,
    "message": "Group name is required"
}
```


## 25. PATCH /users/status

Description :

- Edit user status

Request :

- headers :

```json
{
    "access_token" : "string | required"
}
```

- body:

```json
{
    "status": "string | required"
}
```

_Response (200 - OK)_

```json
{
    "id": 1,
    "username": "Sissie Forrest",
    "email": "sforrest0@chron.com",
    "country": "Switzerland",
    "status": "test update status",
    "phoneNumber": "+1 339 769 7021",
    "verified": true,
    "AvatarId": null,
    "Avatar": null,
    "UserLanguages": [
        {
            "id": 3,
            "type": "interest",
            "UserId": 1,
            "LanguageId": 3,
            "createdAt": "2023-01-08T04:09:06.612Z",
            "updatedAt": "2023-01-08T04:09:06.612Z",
            "Language": {
                "id": 3,
                "name": "Lao",
                "createdAt": "2023-01-08T04:09:06.603Z",
                "updatedAt": "2023-01-08T04:09:06.603Z"
            }
        },...
    ],
    "UserInterests": [
        {
            "id": 1,
            "UserId": 1,
            "InterestId": 3,
            "createdAt": "2023-01-08T04:09:06.622Z",
            "updatedAt": "2023-01-08T04:09:06.622Z",
            "Interest": {
                "id": 3,
                "name": "Anime",
                "createdAt": "2023-01-08T04:09:06.620Z",
                "updatedAt": "2023-01-08T04:09:06.620Z"
            }
        },...
    ],
    "isOnline": false,
    "updatedAt": "2023-01-08T04:44:44.610Z"
}
```

_Response (400 - Bad Request)_

```json
{
    "error": true,
    "message":  "Status is required" 
}
```


## 26. PATCH /groups/:groupId/messages

Description :

- Mark messages as read

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
    "isRead": true
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
```


## 27. GET /explore/users

Description :

- Get users to explore

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
        "id": 3,
        "username": "Nev Matusovsky",
        "email": "nmatusovsky2@mlb.com",
        "country": "Sweden",
        "status": "justo lacinia eget tincidunt eget tempus vel pede morbi porttitor lorem id ligula suspendisse ornare consequat lectus in",
        "phoneNumber": "+966 878 394 6703",
        "verified": true,
        "AvatarId": 3,
        "Avatar": {
            "id": 3,
            "name": "avatar",
            "url": "https://i.pinimg.com/736x/b5/67/87/b567873fff4317f1a02300a1da73565d.jpg",
            "format": "image/jpg",
            "createdAt": "2023-01-08T07:05:17.609Z",
            "updatedAt": "2023-01-08T07:05:17.609Z"
        },
        "UserLanguages": [
            {
                "id": 7,
                "type": "native",
                "UserId": 3,
                "LanguageId": 1,
                "createdAt": "2023-01-08T07:05:18.644Z",
                "updatedAt": "2023-01-08T07:05:18.644Z",
                "Language": {
                    "id": 1,
                    "name": "Afrikaans",
                    "createdAt": "2023-01-08T07:05:18.565Z",
                    "updatedAt": "2023-01-08T07:05:18.565Z"
                }
            }
        ],
        "UserInterests": [],
        "isOnline": false
    },
    {
        "id": 4,
        "username": "Ashleigh Brabban",
        "email": "abrabban3@angelfire.com",
        "country": "Sweden",
        "status": "gravida nisi at nibh in hac habitasse platea dictumst aliquam",
        "phoneNumber": "+33 648 933 7445",
        "verified": true,
        "AvatarId": 4,
        "Avatar": {
            "id": 4,
            "name": "avatar",
            "url": "http://anime.falseblue.com/wp-content/uploads/2012/06/Thor%2BChris%2BHemsworth.jpg",
            "format": "image/jpg",
            "createdAt": "2023-01-08T07:05:17.609Z",
            "updatedAt": "2023-01-08T07:05:17.609Z"
        },
        "UserLanguages": [
            {
                "id": 8,
                "type": "native",
                "UserId": 4,
                "LanguageId": 1,
                "createdAt": "2023-01-08T07:05:18.644Z",
                "updatedAt": "2023-01-08T07:05:18.644Z",
                "Language": {
                    "id": 1,
                    "name": "Afrikaans",
                    "createdAt": "2023-01-08T07:05:18.565Z",
                    "updatedAt": "2023-01-08T07:05:18.565Z"
                }
            }
        ],
        "UserInterests": [],
        "isOnline": false
    },
    {
        "id": 5,
        "username": "Beryle Glaisner",
        "email": "bglaisner4@arizona.edu",
        "country": "Czech Republic",
        "status": "curae donec pharetra magna vestibulum aliquet ultrices erat tortor sollicitudin mi sit amet lobortis sapien",
        "phoneNumber": "+370 246 259 3472",
        "verified": true,
        "AvatarId": 5,
        "Avatar": {
            "id": 5,
            "name": "avatar",
            "url": "https://oyster.ignimgs.com/mediawiki/apis.ign.com/iron-man-2-movie/e/e7/Rhodey-im2.jpg",
            "format": "image/jpg",
            "createdAt": "2023-01-08T07:05:17.609Z",
            "updatedAt": "2023-01-08T07:05:17.609Z"
        },
        "UserLanguages": [
            {
                "id": 9,
                "type": "native",
                "UserId": 5,
                "LanguageId": 1,
                "createdAt": "2023-01-08T07:05:18.644Z",
                "updatedAt": "2023-01-08T07:05:18.644Z",
                "Language": {
                    "id": 1,
                    "name": "Afrikaans",
                    "createdAt": "2023-01-08T07:05:18.565Z",
                    "updatedAt": "2023-01-08T07:05:18.565Z"
                }
            }
        ],
        "UserInterests": [],
        "isOnline": false
    }
]
```


## 28. GET /explore/groups

Description :

- Get groups to explore

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
        "id": 14,
        "name": "saya punya anak kambing 3",
        "type": "group",
        "createdAt": "2023-01-08T07:40:56.207Z",
        "updatedAt": "2023-01-08T07:40:56.207Z",
        "GroupMembers": [
            {
                "id": 14,
                "GroupId": 14,
                "UserId": 2,
                "createdAt": "2023-01-08T07:40:56.416Z",
                "updatedAt": "2023-01-08T07:40:56.416Z",
                "User": {
                    "id": 2,
                    "username": "Krispin Admin",
                    "email": "admin@admin.com",
                    "country": "Cuba",
                    "status": "saya punya anak kambing 3",
                    "phoneNumber": "+86 589 929 4346",
                    "verified": false,
                    "AvatarId": 2,
                    "Avatar": {
                        "id": 2,
                        "name": "avatar",
                        "url": "https://images.hindustantimes.com/rf/image_size_960x540/HT/p2/2020/10/21/Pictures/_7e701072-1375-11eb-9315-b00ef9141a48.jpg",
                        "format": "image/jpg",
                        "createdAt": "2023-01-08T07:05:17.609Z",
                        "updatedAt": "2023-01-08T07:05:17.609Z"
                    },
                    "UserLanguages": [
                        {
                            "id": 4,
                            "type": "interest",
                            "UserId": 2,
                            "LanguageId": 1,
                            "createdAt": "2023-01-08T07:05:18.644Z",
                            "updatedAt": "2023-01-08T07:05:18.644Z",
                            "Language": {
                                "id": 1,
                                "name": "Afrikaans",
                                "createdAt": "2023-01-08T07:05:18.565Z",
                                "updatedAt": "2023-01-08T07:05:18.565Z"
                            }
                        },
                        {
                            "id": 2,
                            "type": "native",
                            "UserId": 2,
                            "LanguageId": 3,
                            "createdAt": "2023-01-08T07:05:18.644Z",
                            "updatedAt": "2023-01-08T07:05:18.644Z",
                            "Language": {
                                "id": 3,
                                "name": "Arabic",
                                "createdAt": "2023-01-08T07:05:18.565Z",
                                "updatedAt": "2023-01-08T07:05:18.565Z"
                            }
                        }
                    ],
                    "UserInterests": [
                        {
                            "id": 4,
                            "UserId": 2,
                            "InterestId": 4,
                            "createdAt": "2023-01-08T07:05:18.832Z",
                            "updatedAt": "2023-01-08T07:05:18.832Z",
                            "Interest": {
                                "id": 4,
                                "name": "Politic",
                                "createdAt": "2023-01-08T07:05:18.709Z",
                                "updatedAt": "2023-01-08T07:05:18.709Z"
                            }
                        },
                        {
                            "id": 5,
                            "UserId": 2,
                            "InterestId": 5,
                            "createdAt": "2023-01-08T07:05:18.832Z",
                            "updatedAt": "2023-01-08T07:05:18.832Z",
                            "Interest": {
                                "id": 5,
                                "name": "Manga",
                                "createdAt": "2023-01-08T07:05:18.709Z",
                                "updatedAt": "2023-01-08T07:05:18.709Z"
                            }
                        }
                    ]
                }
            }
        ]
    },
    {
        "id": 7,
        "name": "family",
        "type": "group",
        "createdAt": "2023-01-08T07:05:18.467Z",
        "updatedAt": "2023-01-08T07:05:18.467Z",
        "GroupMembers": []
    },
    {
        "id": 9,
        "name": "high school",
        "type": "group",
        "createdAt": "2023-01-08T07:05:18.467Z",
        "updatedAt": "2023-01-08T07:05:18.467Z",
        "GroupMembers": []
    },
    {
        "id": 6,
        "name": "high school",
        "type": "group",
        "createdAt": "2023-01-08T07:05:18.467Z",
        "updatedAt": "2023-01-08T07:05:18.467Z",
        "GroupMembers": []
    },
    {
        "id": 8,
        "name": "family",
        "type": "group",
        "createdAt": "2023-01-08T07:05:18.467Z",
        "updatedAt": "2023-01-08T07:05:18.467Z",
        "GroupMembers": []
    },
    {
        "id": 10,
        "name": "work",
        "type": "group",
        "createdAt": "2023-01-08T07:05:18.467Z",
        "updatedAt": "2023-01-08T07:05:18.467Z",
        "GroupMembers": []
    }
]
```


## 29. GET /interests

Description :

- Get all available interest

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
        "name": "Military History and Wars",
        "createdAt": "2023-01-08T07:05:18.709Z",
        "updatedAt": "2023-01-08T07:05:18.709Z"
    },
    {
        "id": 2,
        "name": "PC Master Race",
        "createdAt": "2023-01-08T07:05:18.709Z",
        "updatedAt": "2023-01-08T07:05:18.709Z"
    },
    {
        "id": 3,
        "name": "Anime",
        "createdAt": "2023-01-08T07:05:18.709Z",
        "updatedAt": "2023-01-08T07:05:18.709Z"
    },
    {
        "id": 4,
        "name": "Politic",
        "createdAt": "2023-01-08T07:05:18.709Z",
        "updatedAt": "2023-01-08T07:05:18.709Z"
    },
    {
        "id": 5,
        "name": "Manga",
        "createdAt": "2023-01-08T07:05:18.709Z",
        "updatedAt": "2023-01-08T07:05:18.709Z"
    },
    {
        "id": 6,
        "name": "Economy",
        "createdAt": "2023-01-08T07:05:18.709Z",
        "updatedAt": "2023-01-08T07:05:18.709Z"
    },
    {
        "id": 7,
        "name": "Programming",
        "createdAt": "2023-01-08T07:05:18.709Z",
        "updatedAt": "2023-01-08T07:05:18.709Z"
    },
    {
        "id": 8,
        "name": "Philosophy",
        "createdAt": "2023-01-08T07:05:18.709Z",
        "updatedAt": "2023-01-08T07:05:18.709Z"
    },
    {
        "id": 9,
        "name": "Movies",
        "createdAt": "2023-01-08T07:05:18.709Z",
        "updatedAt": "2023-01-08T07:05:18.709Z"
    },
    {
        "id": 10,
        "name": "Smart Phone",
        "createdAt": "2023-01-08T07:05:18.709Z",
        "updatedAt": "2023-01-08T07:05:18.709Z"
    },
    {
        "id": 11,
        "name": "AI and Machine Learning",
        "createdAt": "2023-01-08T07:05:18.709Z",
        "updatedAt": "2023-01-08T07:05:18.709Z"
    },
    {
        "id": 12,
        "name": "Music",
        "createdAt": "2023-01-08T07:05:18.709Z",
        "updatedAt": "2023-01-08T07:05:18.709Z"
    },
    {
        "id": 13,
        "name": "Investing and Personal Finance",
        "createdAt": "2023-01-08T07:05:18.709Z",
        "updatedAt": "2023-01-08T07:05:18.709Z"
    },
    {
        "id": 14,
        "name": "Planes",
        "createdAt": "2023-01-08T07:05:18.709Z",
        "updatedAt": "2023-01-08T07:05:18.709Z"
    },
    {
        "id": 15,
        "name": "Engineering",
        "createdAt": "2023-01-08T07:05:18.709Z",
        "updatedAt": "2023-01-08T07:05:18.709Z"
    },
    {
        "id": 16,
        "name": "Archeology",
        "createdAt": "2023-01-08T07:05:18.709Z",
        "updatedAt": "2023-01-08T07:05:18.709Z"
    },
    {
        "id": 17,
        "name": "Tech trends",
        "createdAt": "2023-01-08T07:05:18.709Z",
        "updatedAt": "2023-01-08T07:05:18.709Z"
    },
    {
        "id": 18,
        "name": "Drone Zone",
        "createdAt": "2023-01-08T07:05:18.709Z",
        "updatedAt": "2023-01-08T07:05:18.709Z"
    }
]
```


## 30. GET /users/@me

Description :

- Get current user

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
    "id": 2,
    "username": "Krispin Admin",
    "email": "admin@admin.com",
    "country": "Cuba",
    "status": "saya punya anak kambing 3",
    "phoneNumber": "+86 589 929 4346",
    "verified": false,
    "AvatarId": 2,
    "Avatar": {
        "id": 2,
        "name": "avatar",
        "url": "https://images.hindustantimes.com/rf/image_size_960x540/HT/p2/2020/10/21/Pictures/_7e701072-1375-11eb-9315-b00ef9141a48.jpg",
        "format": "image/jpg",
        "createdAt": "2023-01-08T07:05:17.609Z",
        "updatedAt": "2023-01-08T07:05:17.609Z"
    },
    "UserLanguages": [
        {
            "id": 4,
            "type": "interest",
            "UserId": 2,
            "LanguageId": 1,
            "createdAt": "2023-01-08T07:05:18.644Z",
            "updatedAt": "2023-01-08T07:05:18.644Z",
            "Language": {
                "id": 1,
                "name": "Afrikaans",
                "createdAt": "2023-01-08T07:05:18.565Z",
                "updatedAt": "2023-01-08T07:05:18.565Z"
            }
        },
        {
            "id": 2,
            "type": "native",
            "UserId": 2,
            "LanguageId": 3,
            "createdAt": "2023-01-08T07:05:18.644Z",
            "updatedAt": "2023-01-08T07:05:18.644Z",
            "Language": {
                "id": 3,
                "name": "Arabic",
                "createdAt": "2023-01-08T07:05:18.565Z",
                "updatedAt": "2023-01-08T07:05:18.565Z"
            }
        }
    ],
    "UserInterests": [
        {
            "id": 4,
            "UserId": 2,
            "InterestId": 4,
            "createdAt": "2023-01-08T07:05:18.832Z",
            "updatedAt": "2023-01-08T07:05:18.832Z",
            "Interest": {
                "id": 4,
                "name": "Politic",
                "createdAt": "2023-01-08T07:05:18.709Z",
                "updatedAt": "2023-01-08T07:05:18.709Z"
            }
        },
        {
            "id": 5,
            "UserId": 2,
            "InterestId": 5,
            "createdAt": "2023-01-08T07:05:18.832Z",
            "updatedAt": "2023-01-08T07:05:18.832Z",
            "Interest": {
                "id": 5,
                "name": "Manga",
                "createdAt": "2023-01-08T07:05:18.709Z",
                "updatedAt": "2023-01-08T07:05:18.709Z"
            }
        }
    ]
}
```


## 31. GET /groups/:userId

Description :

- Get DM group with userId

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
    "name": null,
    "type": "dm",
    "createdAt": "2023-01-08T07:05:18.467Z",
    "updatedAt": "2023-01-08T07:05:18.467Z",
    "GroupMembers": [
        {
            "id": 1,
            "GroupId": 1,
            "UserId": 1,
            "createdAt": "2023-01-08T07:05:18.533Z",
            "updatedAt": "2023-01-08T07:05:18.533Z"
        },
        {
            "id": 2,
            "GroupId": 1,
            "UserId": 2,
            "createdAt": "2023-01-08T07:05:18.533Z",
            "updatedAt": "2023-01-08T07:05:18.533Z"
        }
    ]
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
    "message": "Group not found"
}
```


## 32. POST /attachment

Description :

- Create message attachment

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
    "attachment": "file upload"
}
```

_Response (201 - Created)_

```json
{
    "id": 1,
    "name": "attachment",
    "url": "https://www.syfy.com/sites/syfy/files/styles/1200x1200/public/thanos-avengers-infinity-war.jpg?itok=trgl94eg&timestamp=1525386653",
    "format": "image/jpg",
    "createdAt": "2023-01-06T08:46:50.080Z",
    "updatedAt": "2023-01-06T08:46:50.080Z"
}
```

_Response (400 - Bad Request)_

```json
{
    "status": 400,
    "message": "attachment is required",
}
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
