import { createClient } from 'oicq';
import { config } from 'dotenv';
import jsQr from 'jsqr';
import Jimp from 'jimp';
import QrCodeTerminal from 'qrcode-terminal';
import path from 'path';

// load dotenv
config();

// login
const client = createClient(parseInt(process.env.MIRAI_WEBHOOKS_UIN || ''), {
  data_dir: path.resolve(process.cwd(), 'oicq-data'),
  platform: 5,
});

client.on('system.login.qrcode', (data) => {
  Jimp.read(data.image).then((img) => {
    const qrcode = jsQr(new Uint8ClampedArray(img.bitmap.data), img.bitmap.width, img.bitmap.height);
    if (qrcode) {
      QrCodeTerminal.generate(qrcode.data, { small: true }, (str) => console.log(str));
    }
  });

  process.stdin.once('data', () => client.login());
});

client.on('system.online', () => {
  console.log("I'm online!");
});

client.login();
