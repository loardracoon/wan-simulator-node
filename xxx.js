app.get('/nic', getNIC)

app.get('/nic/:port', (req,res)=>{
    const {port} = req.params
    openDB().then(db=>{
        db.get('SELECT * FROM wan WHERE id = ?', port).then(result =>{
            res.status(200).json({
                values: result
            })
        }).catch(error => res.status(403).json({}))
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
                const commands = [
                    `sudo tc qdisc delete dev ${newValues.name} root`,
                    `sudo tc qdisc add dev ${newValues.name} root netem latency ${newValues.latency}ms ${Math.floor(newValues.latency/5)}ms 25% loss ${newValues.loss}% 25%`,
                    `sudo tc qdisc show dev ${newValues.name}`
                ]
                commands.forEach(cmd=>{
                    console.log(cmd)
                    console.log(execSync(cmd).toString())
                })

                res.status(200).json({
                    values,
                    newValues,
                    commands
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