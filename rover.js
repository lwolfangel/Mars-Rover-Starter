class Rover {
   constructor(position) {
      this.position = position;
      this.mode = "NORMAL";
      this.generatorWatts = 110;
      if (!position) {
         throw Error("position is required.");
      }
   }
   receiveMessage(message) {
      let res = [];
      let commands = message.commands;
      for(let i = 0; i < commands.length; i++) {
         let command = message.commands[i];
         if (command.commandType === "MOVE") {
            if(this.mode === "LOW_POWER") {
               res[i] = {completed: false};
            } else {
               this.position = command.value;
               res[i] = {completed: true};
            }
         } else if (command.commandType === "STATUS_CHECK") {
            res[i] = {completed: true, roverStatus: {mode: this.mode, generatorWatts: this.generatorWatts, position: this.position}}
         } else if (command.commandType === "MODE_CHANGE") {
            this.mode = command.value;
            res[i] = {completed: true}; 
         }
      }
      let result = {
         message: message.name,
         results: res
      } 
      return result;
   }
}


module.exports = Rover;