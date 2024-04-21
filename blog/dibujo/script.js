var figures = 0;

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

    canvas.on('object:modified', function (event) {
        var modifiedObject = event.target;
        manejarMovimiento(modifiedObject);
    });
}

function initServer() {
    websocket = new WebSocket(wsUri);
    websocket.onopen = connectionOpen;
    websocket.onmessage = onMessageFromServer;
}



function manejarMovimiento(object) {
    adaptarObjeto(object.type, object);
}
function connectionOpen() {
    websocket.send('connection open');

}

function onMessageFromServer(message) {
    console.log('received: ' + message);
    if (isJson(message.data)) {
        var info = JSON.parse(message.data); 
        info.figures.forEach(info => {
            addObject(info.figura, info.obj);
        });
        console.log("clients: "+info.clients);
        document.getElementById('clientCount').textContent = info.clients;
    }
}

function addObject(type, obj) {
    switch (type) {
        case 'Rectangle':
            canvas.add(new fabric.Rect(obj));
            figures++;
            break;
        case 'Circle':
            canvas.add(new fabric.Circle(obj));
            figures++;
            break;
        case 'Triangle':
            canvas.add(new fabric.Triangle(obj));
            figures++;
            break;
        default:
            console.log("shape not allowed");
    }
}

function adaptarObjeto(type, objeto) {
    console.log(objeto);
    switch (type) {
        case 'rect':
            obj = {
                id: objeto.id,
                top: objeto.top,
                left: objeto.left,
                width: objeto.width,
                height: objeto.height,
                fill: objeto.fill,
            }
            sendObject('Rectangle', obj);
            break;
        case 'triangle':
            obj = {
                id: objeto.id,
                top: objeto.top,
                left: objeto.left,
                width: objeto.width,
                height: objeto.height,
                fill: objeto.fill,
            }
            sendObject('Triangle', obj);
            break;
        case 'circle':
            obj = {
                id: objeto.id,
                top: objeto.top,
                left: objeto.left,
                radius: objeto.radius,
                fill: objeto.fill,
            }
            sendObject('Circle', obj);
            break;
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
        id: figures,
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
        id: figures,
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
        id: figures,
        top: 100,
        left: 100,
        width: 80,
        height: 60,
        fill: 'red'
    };
    addObject('Triangle', obj)
    sendObject('Triangle', obj);
}

function sendObject(type, obj) {
    var info = {}
    info.obj = obj;
    info.figura = type;
    info.id = obj.id;
    doSend(JSON.stringify(info));
}