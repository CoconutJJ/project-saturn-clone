const Docker = require("dockerode");
const fs = require("fs");
const uuid = require("uuid");
const stream = require("stream");
const path = require("path");
const Interrupts = require("../interrupts");

class Sandbox {
    constructor(image) {
        this.dockerConnection = new Docker({
            socketPath: "/var/run/docker.sock",
        });

        this.image = image;
        this.stream = null;
        this.container = null;
        this.mountPath = "";
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
            HostConfig: {
                NetworkMode: "none",
                Binds: [this.mountPath + ":/home/appuser/workdir"],
            },
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
     *
     * @param {string} filename
     * @param {ArrayBufferView} filedata
     */
    createMountFile(filename, filedata) {
        fs.writeFileSync(path.join(this.mountPath, filename), filedata);
    }

    makeMountDir(dirname) {
        fs.mkdirSync(path.join(this.mountPath, dirname));
    }

    createMount() {
        this.mountPath = path.join(__dirname, uuid.v4());
        fs.mkdirSync(this.mountPath);

        Interrupts.addOnExitJob(() => {
            this.destroy();
        });
    }

    destroyHostMount() {
        fs.rmSync(this.mountPath, { recursive: true, force: true });
    }

    /**
     * Launches a /bin/sh shell in the docker container
     * @returns {Promise<NodeJS.ReadWriteStream>}
     */
    async launchSHShell() {
        this.createMount();

        await this._run("/bin/sh");

        Interrupts.addOnExitJob(() => {
            this.destroy();
        });

        return this.stream;
    }

    async destroy() {
        await this.container.stop();

        this.destroyHostMount();
    }
}

module.exports = Sandbox;
