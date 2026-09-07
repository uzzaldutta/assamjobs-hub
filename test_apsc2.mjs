process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
async function run() {
  try {
    const res = await fetch("https://apsc.nic.in/status_of_advt.asp");
    console.log(res.status);
    const txt = await res.text();
    console.log("Length:", txt.length);
  } catch(e) {
    console.log(e.message);
  }
}
run();
