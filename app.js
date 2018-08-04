/* Primary file for hello world API
 * 1 add Dependencies
 *  2 Define server
 * 3 start server listen
 * ====== run server to test ==========
 * 4 Define handlers and router
 */

// Dependencies
var http = require('http');
var url = require('url');
var StringDecoder = require('string_decoder').StringDecoder;
var HelloResponse = require('./responses')
 // Configure the server to respond to all requests with a string
 Server = http.createServer(function(req,res){

  // Parse requested url
  var parsedUrl = url.parse(req.url, true)
  // Get the path
  var path = parsedUrl.pathname;
  // trim path
  var trimmedPath = path.replace(/^\/+|\/+$/g,'');
  // Get the query string (parsedUrl)as an object
  var queryStringObject = parsedUrl.query;
  // Get the HTTP method eg send or post
  var method = req.method
  //Get the headers as an object
  var headers = req.headers;
  // create new decoder
  var decoder = new StringDecoder('utf-8');
  // create empty holder for data
  var buffer = '';
  // append request data to holder
  req.on('data', function(data){
      buffer += decoder.write(data)
  });
  // build the response - the handler logic goes in here
  req.on('end', function(){
    buffer += decoder.end()
      // Check the router for a matching path for a handler. If one is not found, use the notFound handler instead.
      var chosenHandler = typeof(router[trimmedPath]) !== 'undefined' ? router[trimmedPath] : handlers.notFound;
      // Construct the data object to send to the handler
      var data = {
        'trimmedPath' : trimmedPath,
        'queryStringObject' : queryStringObject,
        'method' : method,
        'headers' : headers,
        'payload' : buffer
      };
      // Route the request to the handler specified in the router
      chosenHandler(data,function(statusCode,payload){

        // Use the status code returned from the handler, or set the default status code to 200
        statusCode = typeof(statusCode) == 'number' ? statusCode : 200;

        // Use the payload returned from the handler, or set the default payload to an empty object
        payload = typeof(payload) == 'object'? payload : {};

        // Convert the payload to a string
        var payloadString = JSON.stringify(payload);

        // Return the response
        //return as json
        res.setHeader('Content-Type','application/json')
        res.writeHead(statusCode);
        res.end(payloadString);
        console.log("Returning this response: ",statusCode,payloadString);

      }); // terminate chosen handler

}); // terminate  end buffer
});// terminate  server config

// create port and Start the server
var port = 3000;
Server.listen(port, function(){
    console.log('The server is listening on port '+port)
});

// Define all the handler functions c/w data and cb
var handlers = {};
//hello handler
handlers.hello = function (data, callback){
    callback(406,{HelloResponse})
};
// Not found handler
handlers.notFound = function(data, callback){
    callback(404)
};
// Define the request router
var router = {
    'hello': handlers.hello
};
