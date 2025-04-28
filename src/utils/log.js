export const log = (...args) => {
    // Capture the stack trace and remove file paths or locations
    const stack = new Error().stack.split('\n')[2].trim();
    const simplifiedStack = stack.replace(/\(.*?\)/, ''); // Remove the file path and location

    const message = args.map(arg => {
        if (arg === undefined) {
            return 'undefined';
        }
        return typeof arg === 'object' ? JSON.stringify(arg, null, 2) : arg;
    }).join(' ');

    console.log(`\x1b[32m${simplifiedStack}\x1b[0m: ${message}`);
};
