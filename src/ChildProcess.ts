import { exec, spawn } from "node:child_process";
import type {
  SpawnOptions,
  ChildProcess as Child_Process,
} from "node:child_process";
import { promisify } from "node:util";

export class ChildProcess {
  process: Child_Process;
  handler: Promise<void>;
  public static execute = promisify(exec);
  constructor(command: string, options: SpawnOptions = { stdio: "inherit" }) {
    const [root, args] = ChildProcess.split(command);
    this.process = spawn(root, args, options);
    this.handler = ChildProcess.promisify(this.process);
  }

  public static wrapCommand(
    command: string,
    options: SpawnOptions = { stdio: "inherit" },
  ) {
    const [root, args] = this.split(command);
    const CP = spawn(root, args, options);
    return this.promisify(CP);
  }

  public static promisify(CP: Child_Process) {
    return new Promise<void>((resolve, reject) => {
      CP.on("exit", code => {
        if (code === 1) {
          reject();
        } else {
          resolve();
        }
      });
    });
  }

  public static split(
    command: string,
  ): [command: string, args: readonly string[]] {
    const [root, ...args] = command.split(" ");
    return [root, args];
  }

  public static get parentProcess() {
    return process as unknown as NodeJS.Process;
  }

  public static bindExits(CPs: Child_Process[]) {
    const NUKE = () => {
      CPs.forEach(CP => CP.kill());
    };
    this.parentProcess.on("exit", NUKE);
    this.parentProcess.on("SIGINT", NUKE);
    this.parentProcess.on("SIGQUIT", NUKE);
    this.parentProcess.on("beforeExit", NUKE);
    this.parentProcess.on("uncaughtException", NUKE);
    this.parentProcess.on("unhandledRejection", NUKE);
  }
}
