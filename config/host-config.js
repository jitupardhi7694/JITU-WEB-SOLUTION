let hostConfig = {};
switch (process.env.NODE_ENV) {
    case 'production':
        hostConfig = {
            PROTOCOL: 'http',
            HOST: '140.238.167.36',
            PORT: '8000',
            REPLY_EMAIL: 'jituwebsolution7709@gmail.com',
            GET_TOUCH_EMAIL: 'jituwebsolution7709@gmail.com',
        };
        break;
    case 'test':
        hostConfig = {
            PROTOCOL: 'http',
            HOST: 'dinshaws.org',
            PORT: process.env.PORT || 4000,
            REPLY_EMAIL: 'jituwebsolution7709@gmail.com',
            GET_TOUCH_EMAIL: 'jituwebsolution7709@gmail.com',
        };
        break;
    default:
        // development environment
        hostConfig = {
            PROTOCOL: 'http',
            HOST: 'localhost',
            PORT: process.env.PORT || 4000,
            REPLY_EMAIL: 'jituwebsolution7709@gmail.com',
            GET_TOUCH_EMAIL: 'jituwebsolution7709@gmail.com',
        };
        break;
}
console.log(process.env.NODE_ENV, hostConfig);
module.exports = hostConfig;
