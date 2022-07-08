const pgp = require("pg-promise")();

let tableName = 'counters_store';
let db = null;

const store = {
    createTable: (pgConectingString, tableNameParam) => {
        const urlPG = pgConectingString;
        
        db = pgp(urlPG);
        tableName = tableNameParam || tableName;

        db.none("DROP TABLE IF EXISTS " + tableName)
        .then(() => {
            db.none("CREATE TABLE IF NOT EXISTS " + tableName + " (uuid text, count int, first_req_for_window_time numeric)").then(
                () => console.log('limiter\'s postgres conected on: ' + pgConectingString.split('@')[1].split('/')[0] + ', it uses ' + tableName + ' table')
            )
        })
        .catch(function (error) {
            console.log("ERROR:", error);
        });
    },

    getCounterByUUID: (uuid) => {
        return db.oneOrNone("SELECT * FROM " + tableName + " WHERE uuid=$1", [uuid])
        .catch(function (error) {
            console.log("ERROR:", error);
        });
    },

    addNewCounter: (counter) => {
        db.none("INSERT INTO " + tableName + " (uuid, count, first_req_for_window_time) VALUES ($1, $2, $3)", 
            [counter.uuid, counter.count, counter.first_req_for_window_time])
        .catch(function (error) {
            console.log("ERROR:", error);
        })
    },

    resetCounterByUUID: (uuid, counter) => {
        db.none("UPDATE " + tableName + " SET count=$2, first_req_for_window_time=$3 WHERE uuid=$1", 
            [uuid, counter.count, counter.first_req_for_window_time])
        .catch(function (error) {
            console.log("ERROR:", error);
        })
    },

    addCountByUUID: (uuid, additional_count) => {
        db.none("UPDATE " + tableName + " SET count=count+$2 WHERE uuid=$1", 
            [uuid, additional_count])
        .catch(function (error) {
            console.log("ERROR:", error);
        })
    }
};

module.exports = store;