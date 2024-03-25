const io = require('socket.io-client');

class MessageClass {
    constructor({
        init = {
            url: '',
        },
        onSubscribed,
        onNewNotification,
        onConnected,
        onDisconnected,
        onLoadedMoreNotifications,
    } = {}) {
        this._initSocket({ onConnected, onDisconnected, init });

        this.socket.on('subscribed', onSubscribed);
        this.socket.on('new-notification', onNewNotification);
        this.socket.on('loaded-more-notifications', onLoadedMoreNotifications);
    }

    // Private method, not accessible from outside
    _initSocket({ onConnected, onDisconnected, init }) {
        try {
            if (!init.url) throw new Error('URL is missing');
            const { url } = init;
            this.socket = io(url,
                {
                    transports: ['websocket', 'polling'],
                    query: {
                        id: 'connection123'
                    },
                }
            );
        } catch (e) {
            throw new Error(e);
        }

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

    loadMoreNotifications(data) {
        this.socket.emit('load-more-notifications', data);
        return this;
    }
}

module.exports = MessageClass;