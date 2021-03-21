const Docker = require("dockerode");
const stream = require("stream");
class Sandbox {
    constructor(image) {
        this.dockerConnection = new Docker({
            socketPath: "/var/run/docker.sock",
        });

        this.image = image;
        this.stream = null;
        this.container = null;
    }

    /**
     * Runs the command
     * @param {string} cmd 
     */
    async _run(cmd) {
        this.container = await this.dockerConnection.createContainer({
            Image: this.image,
            Tty: true,
            Cmd: cmd,
            OpenStdin: true,
            StdinOnce: false,
            AutoRemove: true,
        });

        this.stream = await this.container.attach({
            stream: true,
            stdin: true,
            stdout: true,
        });

        await this.container.start();
    }

    /**
     * Launches a /bin/sh shell in the docker container
     * @returns {Promise<NodeJS.ReadWriteStream>}
     */
    async launchSHShell() {
        await this._run("/bin/sh");

        return this.stream;
    }

    async destroy() {
        await this.container.stop();
    }
}

module.exports = Sandbox;
