import express from 'express';
import cluster from 'cluster';
import * as os from 'os';

const modoCluster = process.argv[3] == "CLUSTER";
const numCPUs = os.cpus().length;

/* ------------------------------------------------------------------- */
/* MASTER */
if (modoCluster && cluster.isPrimary) {
    console.log({numCPUs});
    console.log(`PID MASTER ${process.pid}`);

    for (let index = 0; index < numCPUs; index++) {
        cluster.fork();        
    }

    cluster.on(`exit`, worker => {
        console.log(`worker`, worker.process.pid, ` died`, new Date().toLocaleString());
        cluster.fork();
    })
} else {
    const app = express();
    const PORT= parseInt(process.argv[2]) || 8080;
   /*  const args = parseArgs(process.argv.slice(2)); */
   

    app.get('/datos', (req, res) => {
        res.send(`Servidor express en ${PORT} - PID: ${process.pid} - ${new Date().toLocaleString()} - ${process.argv[0]} - ${process.argv[1]} - ${process.argv[2]}`)
    })
    
    app.listen(PORT, err => {
        if (!err) console.log(`Servidor express escuchando en puerto ${PORT} - PID WORKER: ${process.pid}`)
    })
    
}