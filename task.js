const { Console } = require("console");
const fs = require("fs");

const args = process.argv;

const currentWorkingDirectory = args[1].slice(0, -7);

if (fs.existsSync(currentWorkingDirectory + "todo.txt") === false) {
  let createStream = fs.createWriteStream("todo.txt");
  createStream.end();
}

if (fs.existsSync(currentWorkingDirectory + "done.txt") == false) {
  let createStream = fs.createWriteStream("done.txt");

  createStream.end();
}

const InfoFun = () => {
  const UsageText = `
Usage :-
$ ./task add 2 hello world    # Add a new item with priority 2 and text "hello world" to the list
$ ./task ls                   # Show incomplete priority list items sorted by priority in ascending order
$ ./task del INDEX            # Delete the incomplete item with the given index
$ ./task done INDEX           # Mark the incomplete item with the given index as complete
$ ./task help                 # Show usage
$ ./task report               # Statistics
    `;
  console.log(UsageText);
};

const listFun = () => {
  let data = [];
  const fileData = fs
    .readFileSync(currentWorkingDirectory + "todo.txt")
    .toString();
  data = fileData.split("\n");
  // let filterData = data.filter((value) => value !== "");
  filterData = data;
  if (filterData.length === 1) {
    console.log("There are no pending todos!");
  }

  for (let index = 1; index < filterData.length; index++) {
    console.log(`${index}. ${filterData[index]}`);
  }
};

const addFun = () => {
  const newTask = args[4];
  const priority = args[3];
  if (newTask) {
    let data = [];

    const fileData = fs
      .readFileSync(currentWorkingDirectory + "todo.txt")
      .toString();

    fs.writeFile(
      currentWorkingDirectory + "todo.txt",
      fileData + "\n" + newTask + " " + "[" + priority + "]",
      function (err) {
        if (err) throw err;
        console.log(`Added task: "${newTask}" with priority ${priority}`);
      }
    );
  } else {
    console.log("Error: Missing todo string. Nothing added!");
  }
};

const deleteFun = () => {
  const deleteIndex = args[3];
  if (deleteIndex) {
    let data = [];
    const fileData = fs
      .readFileSync(currentWorkingDirectory + "todo.txt")
      .toString();
    data = fileData.split("\n");
    // let filterData = data.filter(function (value) {
    //   return value !== "";
    // });
    filterData = data;
    if (deleteIndex > filterData.length || deleteIndex <= 0) {
      console.log(
        "Error: todo #" + deleteIndex + " does not exist. Nothing deleted."
      );
    } else {
      // console.log(filterData);

      filterData = filterData.filter((item) => item != filterData[deleteIndex]);

      // filterData = filterData.splice(filterData[deleteIndex], 1);

      // filterData.splice(filterData[deleteIndex], 1);
      // console.log(filterData);

      const newData = filterData.join("\n");

      fs.writeFile(
        currentWorkingDirectory + "todo.txt",
        newData,
        function (err) {
          if (err) throw err;
          console.log("Deleted todo #" + deleteIndex);
        }
      );
    }
  } else {
    console.log("Error: Missing NUMBER for deleting todo.");
  }
};

const doneFun = () => {
  const doneIndex = args[3];
  if (doneIndex) {
    let data = [];
    let dateobj = new Date();
    let dateString = dateobj.toISOString().substring(0, 10);
    const fileData = fs
      .readFileSync(currentWorkingDirectory + "todo.txt")
      .toString();
    const doneData = fs
      .readFileSync(currentWorkingDirectory + "done.txt")
      .toString();
    data = fileData.split("\n");
    // let filterData = data.filter(function (value) {
    //   return value !== "";
    // });
    filterData = data;
    if (doneIndex > filterData.length || doneIndex <= 0) {
      console.log("Error: todo #" + doneIndex + " does not exist.");
    } else {
      const deleted = filterData.filter(
        (item) => item == filterData[doneIndex]
      );
      filterData = filterData.filter((item) => item != deleted);

      const newData = filterData.join("\n");

      fs.writeFile(
        currentWorkingDirectory + "todo.txt",
        newData,
        function (err) {
          if (err) throw err;
        }
      );
      fs.writeFile(
        currentWorkingDirectory + "done.txt",
        deleted + "\n" + doneData,
        function (err) {
          if (err) throw err;
          console.log("Marked todo #" + doneIndex + " as done.");
        }
      );
    }
  } else {
    console.log("Error: Missing NUMBER for marking todo as done.");
  }
};

const reportFun = () => {
  let todoData = [];
  let doneData = [];

  const todo = fs.readFileSync(currentWorkingDirectory + "todo.txt").toString();
  const done = fs.readFileSync(currentWorkingDirectory + "done.txt").toString();
  todoData = todo.split("\n");
  doneData = done.split("\n");

  todoLength = todoData.filter((item) => item !== "");
  doneLength = doneData.filter((item) => item !== "");

  console.log("Pending : " + todoLength.length);
  for (let i = 1; i < todoData.length; i++) {
    console.log(`${i}. ${todoData[i]}`);
  }

  console.log("Completed : " + doneLength.length);
  for (let i = 1; i < doneData.length; i++) {
    console.log(`${i}. ${doneData[i]}`);
  }
};

switch (args[2]) {
  case "add": {
    addFun();
    break;
  }

  case "ls": {
    listFun();
    break;
  }
  case "del": {
    deleteFun();
    break;
  }
  case "done": {
    doneFun();
    break;
  }
  case "help": {
    InfoFun();
    break;
  }
  case "report": {
    reportFun();
    break;
  }
  default: {
    InfoFun();
  }
}
