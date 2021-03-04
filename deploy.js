const path = require("path");
const cp = require("child_process");
const fs = require("fs");

function deploy() {
  const src = path.resolve(__dirname, "./dist");
  const dest = path.resolve(__dirname, "./react-watermark");
  const command = `cp -r  ${src}/* ${dest}`;

  cp.execSync("rm -rf " + src);

  cp.exec("tsc && vite build", (err) => {
    if (err) {
      console.error("build failed", err);
      return;
    }

    let exist = fs.existsSync(src);

    console.log("exist", exist);

    while (!exist) {
      console.log("wait files creating...", exist);
      exist = fs.existsSync(src);
    }

    console.log("do copy");

    cp.exec(command, (err) => {
      if (err) {
        console.error("copy files failed", err);
        return;
      }

      console.log("do deploy");

      cp.exec("cd react-watermark && vercel --prod", (err) => {
        if (err) {
          console.error("deploy failed", err);
          return;
        }
        console.log("deploy success");
      });
    });
  });
}

deploy();
