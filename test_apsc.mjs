async function run() {
  try {
    const res = await fetch("https://apsc.nic.in/status_of_advt.asp");
    console.log(res.status);
  } catch(e) {
    console.log(e.message);
  }
}
run();
