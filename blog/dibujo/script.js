if (window.WebSocket) {
    console.log("WebSockets supported.");
}
else {
    console.log("WebSockets NOT supported.");
    alert("Consider updating your browser for a better experience.");
}
window.addEventListener("load", init);
wsUri = "ws://localhost:9001";
function init() {
    initServer();
    canvas = new fabric.Canvas('canvas');
    addCircle.addEventListener('click', addCircleHandler);
    addRectangle.addEventListener('click', addRectangleHandler);
    addTriangle.addEventListener('click', addTriangleHandler); 
}

function initServer() {
    websocket = new WebSocket(wsUri);
    websocket.onopen = connectionOpen;
    websocket.onmessage = onMessageFromServer;
}

function connectionOpen() {
    websocket.send('connection open');

}

function onMessageFromServer(message) {
    console.log('received: ' + message);
    if (isJson(message.data)) {
        var info = JSON.parse(message.data);
        console.log("got data from server"); 
        console.log(info);
        info.forEach(info => {
            addObject(info.figura,info.obj);
        });
        
    }
}

function addObject(type,obj){
    switch(type){
        case 'Rectangle':
            canvas.add(new fabric.Rect(obj));
            break;
        case 'Circle':
            canvas.add(new fabric.Circle(obj));
            break;
        case 'Triangle':
            canvas.add(new fabric.Triangle(obj));
            break;
        default:
            console.log("shape not allowed");
    }
}
function testWebSocket() {
    websocket = new WebSocket(wsUri);
    websocket.onopen = onOpen;
    websocket.onclose = onClose;
    websocket.onmessage = onMessage;
    websocket.onerror = onError;
}

function onOpen() {
    writeToScreen("CONNECTED");
    doSend("Hello Websocket!!");
}
function onClose() {
    writeToScreen("DISCONNECTED");
}
function onMessage(evt) {
    writeToScreen('<span style="color:blue;">RESPONSE: ' + evt.data + '</span>');
    websocket.close();
}
function onError(evt) {
    writeToScreen('<span style="color: red;">ERROR:</span> ' + evt.data);
}
function doSend(message) { 
    websocket.send(message);
}
function writeToScreen(message) {
    var pre = document.createElement("p");
    pre.innerHTML = message;
    output.appendChild(pre);
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

function addCircleHandler() {
    var obj = {
        top: 100,
        left: 100,
        radius: 40,
        fill: 'green'
    };
    addObject('Circle', obj)
    sendObject('Circle', obj);
}
function addRectangleHandler() {
    var obj = {
        top: 100,
        left: 100,
        width: 80,
        height: 60,
        fill: 'blue'
    };
    addObject('Rectangle', obj)
    sendObject('Rectangle', obj);
}

function addTriangleHandler() {
    var obj = {
        top: 100,
        left: 100,
        width: 80,
        height: 60,
        fill: 'red'
    };
    addObject('Triangle', obj)
    sendObject('Triangle', obj);
}

function sendObject(type,obj){
    var info = {}
    info.obj = obj; 
    info.figura = type;
    doSend(JSON.stringify(info));
}