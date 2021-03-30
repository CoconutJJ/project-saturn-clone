class Interrupts {

    static jobq = []

    static init() {

        process.on("SIGINT", () => {

            for(let f of this.jobq) {
                f();
            }

        })

    }


    static addOnExitJob(f) {
        this.jobq.push(f);
    }

}

module.exports = Interrupts;