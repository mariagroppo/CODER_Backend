import parseArgs from "minimist";
const args = parseArgs(process.argv.slice(2));

//node test.js --> ejecuta en puerto 8080
//node test.js -p xxxx --> ejecuta en puerto xxxx

const PORT = args.p || 8080;

console.log(PORT);