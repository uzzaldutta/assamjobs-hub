import fetch from 'node-fetch';

async function run() {
  try {
    const res = await fetch("https://y-ruddy-nine-46.vercel.app/api/jobs/scrape-nfr");
    const json = await res.json();
    console.log(json);
  } catch (err) {
    console.error(err);
  }
}
run();
