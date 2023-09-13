const Message = (function () {
    const socket = io('https://notification-service-uywud3yrcq-og.a.run.app',

        {
            transports: ['websocket', 'polling'],
            query: {
                id: 'connection123'
            },
        });

    let isConnected = false;

    socket.on('connect', function () {
        isConnected = true;
        // console.log('Connected with socket.io!');
    });

    socket.on('disconnect', function () {
        isConnected = false;
        // console.log('Disconnected from socket.io!');
    });

    function connect() {
        return new Promise((resolve, reject) => {
            if (isConnected) {
                resolve('Already connected');
            } else {
                socket.connect();
                socket.on('connect', () => {
                    isConnected = true;
                    resolve('Connected');
                });
            }
        });
    }

    function disconnect() {
        return new Promise((resolve, reject) => {
            if (!isConnected) {
                resolve('Already disconnected');
            } else {
                socket.disconnect();
                socket.on('disconnect', () => {
                    isConnected = false;
                    resolve('Disconnected');
                });
            }
        });
    }

    function subscribe(channel) {
        return new Promise((resolve, reject) => {
            socket.emit('subscribe', channel);
            resolve(); // Resolve immediately, assuming subscription was successful
        });
    }

    function subscribed() {
        return new Promise((resolve, reject) => {
            socket.on('subscribed', function (data) {
                resolve(data); // Resolve with data
            });
        });
    }

    function deleteNotifications(id) {
        return new Promise((resolve, reject) => {
            socket.emit('deleteNotifications', id, function (data) {
                console.log('Deleted notifications:', data);
                resolve(data); // Resolve with data
            });
        });
    }

    function deleteAllNotifications(data) {
        return new Promise((resolve, reject) => {
            socket.emit('delete-all-notifications', data, function (data) {
                resolve(data); // Resolve with data
            });
        });
    }

    function newNotification(data) {
        return new Promise((resolve, reject) => {
            socket.on('new-notification', function (data) {
                resolve(data); // Resolve with data
            });
        });
    }

    return {
        connect,
        disconnect,
        subscribe,
        subscribed,
        deleteNotifications,
        newNotification,
        deleteAllNotifications
    };
})();