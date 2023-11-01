const WebSocket = require("ws");
const jwt = require("jsonwebtoken");
const jwtConfig = require("./jwt");

class Socket {
    constructor(wss) {
        this.wss = wss;
    }

     initWss = () => {
        this.wss.on('connection', ws => {
            ws.on('message', message => {
                const { type, payload: { token } } = JSON.parse(message);
                if (type !== 'authorization') {
                    ws.close();
                    return;
                }
                try {
                    ws.user = jwt.verify(token, jwtConfig.jwtConfig.secret);
                } catch (err) {
                    ws.close();
                }
            })
        });
    };

     broadcast = (userId, data) => {
        if (!this.wss) {
            return;
        }
        this.wss.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN && userId === client.user.userId) {
                console.log(`broadcast sent to ${client.user.username}`);
                client.send(JSON.stringify(data));
            }
        });
    };
}

module.exports = Socket;
