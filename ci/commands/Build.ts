import { Packager } from "../packaging/Packager";

(async () => {
  await Packager.run();
})().catch(console.log);
