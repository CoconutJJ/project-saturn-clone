const { Terminal } = require("xterm");

class XTermBuffer {

    /**
     * 
     * @param {Terminal} term 
     */
    constructor (term) {
        this.term = term;
        this.cursor = 0;
        this.line = "";
    }

    left() {
        
        if (this.cursor > 0) {
            this.cursor--;
            this.term.write(String.fromCharCode(27) + "[D");
            return true;
        }

        return false;
    }

    right() {

        if (this.cursor + 1 <= this.line.length) {
            this.cursor++;
            this.term.write(String.fromCharCode(27) + "[C");
            return true;
        }

        return false;

    }

    backspace() {

        if (this.cursor - 1 < 0) {
            return false;
        }

        let head = this.line.substr(0, this.cursor -1)
        let tail = this.line.substr(this.cursor);

        this.line = head + tail

        this.term.write("\b" + " ".repeat(tail.length + 1) + "\b".repeat(tail.length + 1) + tail + "\b".repeat(tail.length));

        this.cursor--;

    }

    newline() {
        this.line = "";
        this.cursor = 0;
        this.term.write("\r\n");
    }

    set(char) {
        this.term.write(char);
    }

    write(char) {
        let head = this.line.substr(0, this.cursor);
        let tail = this.line.substr(this.cursor);

        this.line = head + char + tail;
        
        this.term.write(" ".repeat(tail.length) + "\b".repeat(tail.length) + char + tail + "\b".repeat(tail.length));

        this.cursor++;
    }
}

export default XTermBuffer;