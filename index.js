const qrcode = require('qrcode-terminal');
const axios = require('axios');
const { Client, LocalAuth } = require('whatsapp-web.js');
//const { getAuthenticationCredentials } = require('./localAuth.js');

const client = new Client({
//  authStrategy: new LocalAuth(),
  puppeteer: {
    args: ['--no-sandbox']
  }
});



client.on('qr', qr => {
  qrcode.generate(qr, {small: true});
  console.log('QR RECEIVED', qr);
});

client.on('ready', () => {
  console.log('Client is ready!');
});

client.on('message', async message => {
  if (message.body.startsWith('/gita')) {
    const searchQuery = message.body.slice(6).trim();
    const verse = await getGitaVerse(searchQuery);
    message.reply(verse);
  }
});

async function getGitaVerse(searchQuery) {
  const apiUrl = `https://bhagavadgitaapi.in/slok/`;
  try {
    const response = await axios.get(apiUrl);
    //const verse = `${response.data.slokas[0].sloka} - ${response.data.slokas[0].verse}`;
    return response.data;
  } catch (error) {
    console.error(error);
    return 'An error occurred while fetching the verse. Please try again later.';
  }
}

client.initialize();
