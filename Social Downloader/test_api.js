const https = require('https');

const data = JSON.stringify({
  url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
});

const options = {
  hostname: 'social-download-all-in-one.p.rapidapi.com',
  path: '/v1/social/autolink',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'x-rapidapi-host': 'social-download-all-in-one.p.rapidapi.com',
    'x-rapidapi-key': '2eaacd4a9bmsh759a563f749387dp1bd14fjsn85f99e89867f',
    'Content-Length': data.length
  }
};

const req = https.request(options, (res) => {
  let body = '';
  res.on('data', (d) => { body += d; });
  res.on('end', () => {
    console.log("Status:", res.statusCode);
    console.log("Body:", body);
  });
});

req.on('error', (error) => {
  console.error(error);
});

req.write(data);
req.end();
