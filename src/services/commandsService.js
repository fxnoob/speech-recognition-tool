import emojiCommand from "./commands/emoji";
import undoCommand from "./commands/undo";
import redoCommand from "./commands/redo";
import newLineCommand from "./commands/newline";
import pressEnterCommand from "./commands/press_enter";

class Commands {
  constructor() {
    this.options = {};
    this.commands = {};
  }
  setOptions(options) {
    this.options = options;
  }
  async getCommands(langId) {
    const Commands = [];
    try {
      Commands.push(await emojiCommand(langId));
      Commands.push(await undoCommand(langId));
      Commands.push(await redoCommand(langId));
      Commands.push(await newLineCommand(langId));
      Commands.push(await pressEnterCommand(langId));
    } catch (e) {
      console.log({ e });
    }
    console.log(Commands);
    this.commands = Commands;

    return Commands;
  }
}
const command = new Commands();
export default command;
