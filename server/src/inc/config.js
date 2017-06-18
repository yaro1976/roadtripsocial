'use strict';

module.exports = {
    db: {
        // url: 'mongodb://vps354082.ovh.net/rskdb',
        // url: 'mongodb://192.168.0.104/rskdb:27017',
        address: 'localhost',
        dbName: 'rskdb',
        user: '',
        pass: '',
        port: 27017,
        connString: function () {
            let connStr = 'mongodb://';
            if (this.user.length && this.pass.length) {
                connStr += this.user + ":" + this.pass + '@';
            }
            connStr += this.address + '/' + this.dbName + ':' + this.port;
            return connStr;
        }
    },
    srv: {
        port: 4200
    },
    security: {
        salt: '',
        hash: '',
    }
};
