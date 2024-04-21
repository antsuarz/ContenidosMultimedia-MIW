var WebSocketServer = require('ws').Server;
wss = new WebSocketServer({ port: 9001 });
var figures = [];
var users = 0;

wss.on('connection', function connection(ws) { 
    info = {
        figures:figures,
        clients: wss.clients.size
    }
    ws.send(JSON.stringify(info));
    ws.on('message', function incoming(message) {
        if (isJson(message)) {
            figure = JSON.parse(message); 
            id = figure.id 
            if(!checkFigure(id)){ 
                figures.push(figure); 
            }
            else{
                figures.forEach(function(existingFigure, index) { 
                    if (existingFigure.obj.id === id) {
                        figures[index] = figure;
                    } 
                });
            }
        } 
    });
});

function checkFigure(id){
    for (var i = 0; i < figures.length; i++) {
        var f = figures[i];
        if (f.obj.id === id) {
            return true;
        }
    }
    return false;
}
function isJson(str) {
    try {
        JSON.parse(str);
    }
    catch (e) {
        return false;
    }
    return true;
}
