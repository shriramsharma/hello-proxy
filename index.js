let http = require('http')
let request = require('request')
let path = require('path')
let fs = require('fs')
let logPath = argv.log && path.join(__dirname, argv.log)
let getLogStream = ()=> logPath ? fs.createWriteStream(logPath) : process.stdout

let argv = require('yargs')
    .default('host', '127.0.0.1')
        .argv
	let scheme = 'http://'
// Build the destinationUrl using the --host value

let port = argv.port || (argv.host === '127.0.0.1' ? 8000 : 80)

let destinationUrl = argv.url || scheme + argv.host + ':' + port

http.createServer((req, res) => {
	    console.log(`Request received at: ${req.url}`)
	    //res.end('hello world\n')
	    for (let header in req.headers) {
		        res.setHeader(header, req.headers[header])
	    }
	process.stdout.write('\n\n\n' + JSON.stringify(req.headers))
	//req.pipe(process.stdout)
	//req.pipe(getLogStream())
	req.pipe(logStream, {end: false})
	logStream.write('Request headers: ' + JSON.stringify(req.headers))
	req.pipe(res)
}).listen(8000)

http.createServer((req, res) => {
	  console.log(`Proxying request to: ${destinationUrl + req.url}`)
	  // Proxy code here
	  if(req.headers['x-destination-url']) {
	  	destinationUrl = req.headers['x-destination-url']
	  }
	  let options = {
	  	headers: req.headers,
		url: `http://${destinationUrl}${req.url}`
	  }
	options.method = req.method
	let downstreamResponse = req.pipe(request(options))
	process.stdout.write(JSON.stringify(downstreamResponse.headers))
	downstreamResponse.pipe(process.stdout)
	downstreamResponse.pipe(res)
//	req.pipe(request(options)).pipe(res)
}).listen(8001)
