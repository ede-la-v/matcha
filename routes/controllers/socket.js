var express = require('express');
var Notifs = require('../models/notifs');
var Users = require('../models/users');
// var session = require("express-session")({
//   //key: 'session.sid',
//   secret: 'foo',
//   resave: true,
//   saveUninitialized: true,
// });
// var sharedsession = require("express-socket.io-session");

var user = new Object();

exports = module.exports = function(io){
  io.sockets.on('connection', function (socket) {
  	
    socket.on('credentials', function (id) {
    	user[id] = socket.id;
      socket.broadcast.emit('conn', id);
    	
  	});

    socket.on('message', function (id) {
      socket.broadcast.to(user[id]).emit('message', "");
      
    });

    socket.on('like', function (id) {
    	if (id.notified != id.notifier)
      {
        Notifs.addNotif('like', id.notifier, id.notified, function(err, likes){
              if (err) console.log(err);
  		    Notifs.getLastNotifsUser(id.notified, function(err, notifs){
  	            if (err) console.log(err);
  			    socket.broadcast.to(user[id.notified]).emit('notif', notifs);
  			  });   
  	  	});
      }
  	});

  	socket.on('unlike', function (id) {
    	if (id.notified != id.notifier)
      {
        Notifs.addNotif('unlike', id.notifier, id.notified, function(err, likes){
            if (err) console.log(err);
            Notifs.getLastNotifsUser(id.notified, function(err, notifs){
	            if (err) console.log(err);
			    socket.broadcast.to(user[id.notified]).emit('notif', notifs);
			});   
	  	});
      }
  	});

  	socket.on('likeb', function (id) {
      if (id.notified != id.notifier)
      {
      	Notifs.addNotif('likeb', id.notifier, id.notified, function(err, likes){
          if (err) console.log(err);
          Notifs.getLastNotifsUser(id.notified, function(err, notifs){
            if (err) console.log(err);
  			    socket.broadcast.to(user[id.notified]).emit('notif', notifs);
    			});   
  	  	});
      }
  	});

  	socket.on('view', function (id) {
      if (id.notified != id.notifier)
      {
    	  Notifs.addNotif('view', id.notifier, id.notified, function(err, likes){
            if (err) console.log(err);
            Notifs.getLastNotifsUser(id.notified, function(err, notifs){
	            if (err) console.log(err);
              if (user[id.notified])
                socket.broadcast.to(user[id.notified]).emit('notif', notifs);
              socket.emit('status', user[id.notified]?true:false);
              Users.updateScore(id.notified, (err) => {
              })

			      });  
	  	  });
      }
  	});

  	socket.on('disconnect', () => {
	    for (var key in user)
      {
        if (user[key] == socket.id)
        {
          socket.broadcast.emit('deconn', key);
          delete user[key]
          Users.updateStatus(Number(key), function(err, notifs){
            if (err) console.log(err);
          }); 
        }
      }
	  });

  });
}



