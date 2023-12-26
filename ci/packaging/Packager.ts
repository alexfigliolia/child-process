import { writeFileSync } from "fs";
import { exec } from "child_process";
import { promisify } from "util";
import path from "path";

export class Packager {
  private static execute = promisify(exec);

  public static async run() {
    await this.clearCache();
    await Promise.all([this.buildESM(), this.buildCommon()]);
    return this.packageTargets();
  }

  private static clearCache() {
    return this.execute("rm -rf dist");
  }

  private static buildESM() {
    return this.execute(
      "npx tsc -p cd/tsconfig.mjs.json && npx tsc-alias -p cd/tsconfig.mjs.json",
    );
  }

  private static buildCommon() {
    return this.execute(
      "npx tsc -p cd/tsconfig.cjs.json && npx tsc-alias -p cd/tsconfig.cjs.json",
    );
  }

  private static packageTargets() {
    this.addESMRoot();
    this.addCommonRoot();
  }

  private static addESMRoot() {
    writeFileSync(
      path.resolve("dist/mjs/package.json"),
      this.format({
        type: "module",
      }),
    );
  }

  private static addCommonRoot() {
    writeFileSync(
      path.resolve("dist/cjs/package.json"),
      this.format({
        type: "commonjs",
      }),
    );
  }

  private static format(record: Record<string, any>) {
    return JSON.stringify(record, null, 2);
  }
}
