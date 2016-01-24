Roster
==============
__Roster__ is what we made to get familiar with NodeJS as webserver in combination with Socket.IO.

## NodeJS
NodeJS tutorials, or any programming tutorial for that matter, never show how to create a proper application structure so it can become more than just the purpose of a tutorial.
And because of this we used this project to try out some techniques in order to give our project more structure so it will allow us to create "bigger" applications. 
Do note that this is just a prove-of-concept. 
It shows the beginning of structured project without the use of specialized frameworks to do that for us.
We hope this project can also serve as teaching tool for the rest out there who've come across the same needs with a NodeJS-based webapplication.


## Technologies
__Roster__ uses the following technologies:

| Technology                                                    | Description                         |
| ------------------------------------------------------------- | ----------------------------------- |
| [NodeJS](https://nodejs.org)                                  | JavaScript runtime                  |
| [Express](http://expressjs.com/)                              | NodeJS web framework                |
| [Socket.io](http://socket.io/)                                | Websockets framework                |
| [Gulp](http://gulpjs.com/)                                    | Gulp JavaScript task runner         |
| [Compass](http://compass-style.org)                           | CSS authoring framework (scss/sass) |
| [RequireJS](http://requirejs.org)                             | JavaScript file and module loader   |
| [jQuery](http://jquery.com)                                   | jQuery                              |
| [MySQL](http://www.mysql.com)                                 | MySQL Database                      |

## MySQL DB
You can find the minimum DB schema in the __app/db__ folder.
This schema creates the necessary tables and has also prefilled the user DB with some dummy data.
You can replace this data as you wish.

## Compile
In order to run __Roster__ you may want to compile it first. 
This is easily done by running `gulp` in the root of the project folder on the command-line.
```
gulp
```

## Fire it up!
Start the project by running index.js with NodeJS like so:
```
node index.js
```
The webapplication binds to port 3000.