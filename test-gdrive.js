import https from 'https';

function get(url) {
  https.get(url, (res) => {
    console.log('Status Code:', res.statusCode);
    if (res.statusCode === 302 || res.statusCode === 303) {
      console.log('Redirecting to:', res.headers.location);
      get(res.headers.location);
      return;
    }
    console.log('Content-Type:', res.headers['content-type']);
    let size = 0;
    res.on('data', (chunk) => {
      size += chunk.length;
    });
    res.on('end', () => {
      console.log('Size:', size);
    });
  });
}

get('https://lh3.googleusercontent.com/d/1iZeUIdIGEUKfeCWbNCQHnMpK93J1xlum');
