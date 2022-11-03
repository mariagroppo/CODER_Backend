/* app.get('/random-debug', (req, res) => {
    let randoms = calcularRandoms(0, 9, 10000)
    console.log(randoms)
    res.json({ randoms });
})

app.get('/random-nodebug', (req, res) => {
    let randoms = calcularRandoms(0, 9, 10000)
    res.json({ randoms });
})
 */
/* Análisis de performance con proriler ---------------------------------------------------------
node --prof server.js
artillery quick -c 50 -n 50 "http://localhost:8080/ramdom-debug" > artillery_slow.txt
artillery quick -c 50 -n 50 "http://localhost:8080/ramdom-nodebug" > artillery_fast.txt */