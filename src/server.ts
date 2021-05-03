import * as net from 'net';
import { EventEmitter } from 'events';
import 'colors';
import { exec } from 'child_process';




class NotesManagerServer extends EventEmitter {
  private server: net.Server;
  constructor() {
    super();
    this.server = net.createServer((connection) => {
      
      connection.on('error', (err) => {
        console.log(`There has been an error: ${err.message}`.red);
        process.exit(-1);
      });

      let incomingRequest = '';
      connection.on('data', (chunk) => {
        incomingRequest += chunk;
        
        if (incomingRequest[incomingRequest.length - 1] === '\n') {
          this.emit('request', JSON.parse(incomingRequest));
          incomingRequest = '';
        }
      });

      this.on('request', (req) => {
        console.log(`Request received: ${JSON.stringify(req)}`);
        
        let process = 'node ./dist/NotesManager/notes-app.js ';
        const cmd = req.type;
        

        switch (cmd) {
          case 'add':
            process += `add --username="${req.username}" --title="${req.title}" --body="${req.body}" --color="${req.color}"`;
            break;
          case 'list':
            process += `list --username="${req.username}"`;
            break;
        }

        let processOutput = '';
        exec(process, (err, data, stderr) => {
          
          if (err) {
            processOutput = `Error: ${err.message} while executing NotesManager`.red;
            console.log(processOutput);  
          } else {
            processOutput = data;
          } 

          this.sendResponse(connection, JSON.stringify(
            {
              output: processOutput,
            }
          ));

          connection.end();
        })

      });
      
      
    });
  }

  listen(port: number) {
    this.server.listen(port, () => {
      console.log(`NotesManager server is listenning on ${port}`.yellow);
    });
  }

  sendResponse(connection: net.Socket, res: string) {
    const splittedRes = res.split('');

    while(splittedRes.length > 0) {
      let chunk = splittedRes.splice(0, 51).join('');
      chunk += splittedRes.length === 0 ? '\n' : '';
      connection.write(chunk);
    }
  }
}

const port = parseInt(process.argv[2]) | 5510;

const server = new NotesManagerServer();

server.listen(port);
