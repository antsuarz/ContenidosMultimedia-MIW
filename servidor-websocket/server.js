var WebSocketServer = require('ws').Server;
wss = new WebSocketServer({ port: 9001 });
var figures = [];
var users = [];

wss.on('connection', function connection(ws) {
    if(figures.length > 0){
        console.log(figures.length);
        ws.send(JSON.stringify(figures));
    }
    ws.on('message', function incoming(message) {
        if (isJson(message)) {
            figure = JSON.parse(message);
            console.log(figure.top);
            figures.push(figure);
        }
        console.log('received: %s', message);
        ws.send("hola");
        ws.send(message);
    });
});


function isJson(str) {
    try {
        JSON.parse(str);
    }
    catch (e) {
        return false;
    }
    return true;
}
