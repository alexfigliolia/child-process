# Child Process
A small wrapper around the Node.js `ChildProcess.spawn` function that provides access to not only the child process, but a wrapping promise to use in your JavaScript logic.

# Getting Started

## Installation
```bash
npm install --save @figliolia/child-process
# or
yarn add @figliolia/child-process
```

### Basic Usage

```typescript
import { ChildProcess } from "@figliolia/child-process";

const CP = new ChildProcess(
	"some shell command"
);

// Await the completion of your command
await CP.handler;

// Use the raw child process in your code
CP.process.on("something", () => {});
```

### Advanced Usage
It's fairly common to require the management of multiple sub-process when building complex applications such as development environments, CI's, and more.

This library provides a means for handling multiple child process's as well as binding to kill exit signals that may cause an underlying application to fail.

```typescript
import { ChildProcess } from "@figliolia/child-process";

class MyApplication {

	public static run() {
		const shells = this.bootStuffUp();
		// Kill each shell if the parent process receives
		// a kill signal or uncaught exception
		ChildProcess.bindExits(shells);
		// Await the completion of all commands
		return Promise.all(shells.map(CP => CP.handler));
	}

	private static bootStuffUp() {
		return [
			new ChildProcess(
				"some shell command"
			),
			new ChildProcess(
				"another shell command"
			),
			new ChildProcess(
				"perhaps another shell command"
			),
		]
	}
}
```