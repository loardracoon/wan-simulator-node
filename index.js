const express = require('express');
const bodyParser = require('body-parser')
const openDB = require('./configDB');
const app = express();

app.use(bodyParser.json())

app.get('/', (req,res)=>{
    res.status(200).json({message: `System is Up`})
});

app.get('/nic', (req,res)=>{
    openDB().then(db=>{
        db.all('SELECT * FROM wan WHERE 1').then(result => {
            console.log(result);
            res.status(200).json(result);
        }).catch(e=> res.status(403).json(e))
    })
})

app.get('/nic/:port', (req,res)=>{
    const {port} = req.params
    openDB().then(db=>{
        db.get('SELECT * FROM wan WHERE id = ?', port).then(result =>{
            res.status(200).json({
                values: result,
                commands: [
                    `tc qdisc add dev ${result.name} root netem loss ${result.loss}`,
                    `tc qdisc add dev ${result.name} root netem latency ${result.latency}ms`,
                ]
            })
        }).catch()
    })
    
});
app.post('/nic/:port', (req,res)=>{
    const {port} = req.params;
    const {loss, latency, bandwidth} = req.body;
    console.log(req.body)
    
    openDB().then(db=>{
        db.get('SELECT * FROM wan WHERE id = ?', port).then(values =>{
            const newValues = {
                id: port,
                name: values.name,
                loss: (loss === undefined) ? values.loss : loss,
                latency: (latency === undefined) ? values.latency : latency,
                bandwidth: (bandwidth === undefined) ? values.bandwidth : bandwidth,
            };
            db.run('UPDATE wan SET loss = ?, latency = ?, bandwidth = ? WHERE id = ?',
                newValues.loss,
                newValues.latency,
                newValues.bandwidth,
                port
            ).then(result =>{
                res.status(200).json({
                    values,
                    newValues,
                    commands:[
                        `tc qdisc add dev ${newValues.name} root netem loss ${newValues.loss}`,
                        `tc qdisc add dev ${newValues.name} root netem latency ${newValues.latency}ms`,    
                    ]
                })
            }).catch(e=>{
                res.status(403).json({});
            })
        }).catch(e=>res.status(403).json({}))
    })
    
});
app.delete('/nic/:port', (req,res)=>{
    //execSync(`tc qdisc add dev ${wan[port].name} root netem loss ${wan[port].latency}`)
});

app.listen('5000')


function setWANSimulationPort(req, res){
    const {port} = req.params
}

function getWANSimulationPort(req, res){
    const {port} = req.params
}

function resetWANSimulationPort(req, res){
    const {port} = req.params
}