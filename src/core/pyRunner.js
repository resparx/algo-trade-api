import { spawn } from 'child_process';

const pyRunner = ({path, args, onData}) => {
    const process = spawn('python3',[path,...args])
    process.stdout.on('data', (data) => onData(data) )
}

export default pyRunner