const openDB = require('./configDB')

module.exports = async function createTable(){
    openDB().then(db=>{
        db.exec('CREATE TABLE wan (id INTEGER PRIMARY KEY, name VARCHAR, loss INTEGER(2), latency INTEGER(4), bandwidth INTEGER(3));');
        db.exec('INSERT INTO wan VALUES(1, "eth0", 0,0,100),(2, "eth1", 0, 0, 50);');
    })
}