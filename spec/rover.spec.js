const Rover = require('../rover.js');
const Message = require('../message.js');
const Command = require('../command.js');

// NOTE: If at any time, you want to focus on the output from a single test, feel free to comment out all the others.
//       However, do NOT edit the grading tests for any reason and make sure to un-comment out your code to get the autograder to pass.


describe("Rover class", function() {

  it("constructor sets position and default values for mode and generatorWatts", function(){
    let rover = new Rover(567);
    expect(rover.position).toEqual(567);
    expect(rover.mode).toEqual("NORMAL");
    expect(rover.generatorWatts).toEqual(110);
  });
  it("response returned by receiveMessage contains the name of the message", function() {
    let message = new Message("my awesome message", []);
    let rover = new Rover(567);
    let result = rover.receiveMessage(message); 
    expect(result.message).toEqual("my awesome message");
  }); 
  it("response returned by receiveMessage includes two results if two commands are sent in the message", function() {
    let commands = [new Command('MODE_CHANGE', 'LOW_POWER'), new Command('STATUS_CHECK')];
    let message = new Message('Test message with two commands', commands);
    let rover = new Rover(567);
    let result = rover.receiveMessage(message);
    expect(result.results.length).toEqual(2);

  });
  it("responds correctly to the status check command", function() {
    let commands = [new Command('MODE_CHANGE', 'NORMAL'), new Command('STATUS_CHECK')];
    let message = new Message('Status command test', commands);
    let rover = new Rover(87382098);   
    let response = rover.receiveMessage(message);
    let result = response.results[1];
    expect(result.completed).toEqual(true);  
    expect(result.roverStatus.mode).toEqual("NORMAL");
    expect(result.roverStatus.generatorWatts).toEqual(110);
    expect(result.roverStatus.position).toEqual(87382098)
  });

it("responds correctly to the mode change command", function() {
  let commands = [new Command('MODE_CHANGE', 'NORMAL'), new Command('STATUS_CHECK')];
  let message = new Message('Mode command test', commands);
  let rover = new Rover(87382098);
  let response = rover.receiveMessage(message);
  let roverStatus = response.results[1];
  expect(response.results[1].roverStatus.mode).toEqual('NORMAL');
 

  commands = [new Command('MODE_CHANGE', 'LOW_POWER'), new Command('STATUS_CHECK')];
  message = new Message('mode command test', commands); 
  response = rover.receiveMessage(message);
  roverStatus = response.results[1];
  expect(response.results[1].roverStatus.mode).toEqual('LOW_POWER');
  
});

it("responds with a false completed value when attempting to move in LOW_POWER mode", function() { 
  let commands = [new Command('MODE_CHANGE', 'LOW_POWER')];
  let message = new Message('Changing mode to low power', commands);
  let rover = new Rover(87382098);
  let response = rover.receiveMessage(message);

  commands = [new Command('MOVE', 12343)];
  message = new Message('move command', commands);
  response = rover.receiveMessage(message);
  moveStatus = response.results[0]
  expect(moveStatus.completed).toEqual(false)

});

it("responds with the position for the move command", function() {
  let commands = [new Command('MOVE', 4321)];
  let message = new Message('move command', commands);
  let rover = new Rover(4321);
  let response = rover.receiveMessage(message)
  let moveStatus = response.results[0]
  expect(moveStatus.completed).toEqual(true)

  commands = [new Command('STATUS_CHECK')];
  message = new Message('move status', commands);
  response = rover.receiveMessage(message)
  moveStatus = response.results[0]
  expect(moveStatus.roverStatus.position).toEqual(4321)
});




});