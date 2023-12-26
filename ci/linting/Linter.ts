import { spawn } from "child_process";

export class Linter {
  public static async run() {
    await this.typeCheck();
    await this.runEslint();
  }

  private static typeCheck() {
    return this.wrapCommand("yarn tsc --noemit");
  }

  private static runEslint() {
    return this.wrapCommand("yarn eslint ./ --fix");
  }

  private static wrapCommand(command: string) {
    const [root, args] = this.split(command);
    const CP = spawn(root, args, { stdio: "inherit" });
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

  private static split(
    command: string,
  ): [command: string, args: readonly string[]] {
    const [root, ...args] = command.split(" ");
    return [root, args];
  }
}
