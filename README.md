# Event-Calendar
######Running Client
1)yarn install
2)yarn start

http://localhost:8080/public/#/

######Running Server

1)yarn server
http://localhost:3000/

"databaseURI": "mongodb://127.0.0.1:27017/local",

The main view is the calendar of a month, with “next” and “previous” buttons to go to another month. Any events are shown inside the appropriate date box. One can click on a date to create an event, which consists of a title, description & event type.User can also update & remove the event by clicking on that specific event.

Used socket IO for all browser auto update.



