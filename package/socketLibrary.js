const io = require('socket.io-client');

class MessageClass {
    constructor({
        onSubscribed,
        onNewNotification,
        onConnected,
        onDisconnected,
    } = {}) {
        this._initSocket({ onConnected, onDisconnected });

        this.socket.on('subscribed', onSubscribed);
        this.socket.on('new-notification', onNewNotification);
    }

    // Private method, not accessible from outside
    _initSocket({ onConnected, onDisconnected }) {
        this.socket = io('http://localhost:9000',
            {
                transports: ['websocket', 'polling'],
                query: {
                    id: 'connection123'
                },
            }
        );

        this.socket.on('connect', () => {
            this.isConnected = true;
            onConnected?.();
        });

        this.socket.on('disconnect', () => {
            this.isConnected = false;
            onDisconnected?.();
        });
    }

    connect() {
        if (this.isConnected) return this;

        this.socket.connect();
        return this;
    }

    disconnect() {
        return new Promise((resolve, reject) => {
            if (!this.isConnected) {
                resolve('Already disconnected');
            } else {
                this.socket.disconnect();
                this.socket.on('disconnect', () => {
                    this.isConnected = false;
                    resolve('Disconnected');
                });
            }
        });
    }

    subscribe(channel) {
        this.socket.emit('subscribe', channel);
        return this;
    }

    deleteNotification(id) {
        this.socket.emit('delete-notification', id)
        return this;
    }

    deleteAllNotifications(data) {
        this.socket.emit('delete-all-notifications', data);
        return this;
    }

    updateNotification(data) {
        this.socket.emit('update-notification', data);
        return this;
    }
}

module.exports = MessageClass;