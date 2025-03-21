[Note: This project is work in progress & is not fully built. Once completed, it will be updated here.]
# FULLLSTACK BACKEND PROJECT
-----------------------------
## What is this project
-----------------------
This is a node js project built to provide a user authentication system.

## Libraries used
-----------------
> bcryptjs: to encrypt passwords before storing in database
> 
> cookie-parser: to work with cookies
> 
> cors: to deal with cors related errors
> 
> dotenv: to work with sensitive information
> 
> express: to create a rest api server
> 
> jsonwebtoken: to create JWT (JSON Web Token) tokens
> 
> mongodb: to perform CRUD operations in the database
> 
> mongoose: ODM to work with the database
> 
> nodemailer: to send emails to users
>

## Functionalities
------------------
> Users can register themselves with an email
>
> Users, once registered, will get a verification email
>
> Users can make a get request with the link from the email to verify themselves to successfully register
>
> Once registered and verified, users can login with the registered email and password
