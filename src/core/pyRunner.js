import { spawn } from 'child_process';

const pyRunner = ({path, args}, getData ) => {
    const process = spawn('python3',[path,...args])
    process.stdout.on('data', (data) => getData(data) )
    process.on('exit', ()=>process.kill())
}

export default pyRunner