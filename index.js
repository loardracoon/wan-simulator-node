const express = require('express')
const bodyParser = require('body-parser')
const openDB = require('./configDB');
const app = express();
const {execSync} = require('child_process')

app.use(bodyParser.json())

app.get('/', (req,res)=>{
    res.status(200).json({message: `System is Up`})
});

app.get('/nic', getNIC);
app.post('/nic/:id', setNIC);
app.get('/wan', getWANSimulation)


function getNIC(req, res){
    try{
        let result = execSync("ifconfig | grep flag").toString();
        result = result.split("\n").map(e=>e.match(/([a-zA-Z]{3}[0-9]{1}):/g));

        res.status(200).json(result);
    }catch(err){
        res.status(403).json(err)
    }
}

function setNIC(req, res){
    const {portId} = req.params;
    const {name} = req.body;
    db.run('UPDATE wan SET name = ? WHERE id = ?', name, portId).then(
        result =>{
            res.status(200).json({id: portId, name: name})
        }
    ).catch(
        err=>res.status(403).json({})
    )

}

function setWANSimulationPort(req, res){
    const {port} = req.params
}

function getWANSimulation(req, res){
    res.status(200).json({
        ports: [
            {},
            {},
        ],
        commands:[],
        outputs:[]
    })
}

function resetWANSimulationPort(req, res){
    const {port} = req.params
}
app.listen('5000')

