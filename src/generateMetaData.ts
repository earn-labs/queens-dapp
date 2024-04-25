import fs from "fs";
import process from "process";
import { readdir } from "fs/promises";

const img_url =
  "ipfs://bafybeiclopxmp43iwj6zpkoli26dcmqr63bqejni4kxgifs77jtnwwneci/";

interface StringByString {
  [key: string]: string;
}

const audio_urls: StringByString = {
  clubs:
    "ipfs://bafybeifls2hcjuzrl7vitn7tw22xmzrp7gjrxuw55263nblj5ech6es2ty/Audio_Clubs_Queen.mp3",
  diamonds:
    "ipfs://bafybeig5yrn4s5pnfjoc4aovfs5l3x2eqo6iiv7lww4wpl37negb4jal5y/Audio_Diamonds_Queen.mp3",
  hearts:
    "ipfs://bafybeibmne3hp7nhqdagleawopzkmmrbviux2upwqoaqludbywopaznj3m/Audio_Hearts_Queen.mp3",
  spades:
    "ipfs://bafybeigmfdb5xxakgfpddzbpsmscsa44qppmmgbdhgipt3lvsdj67c7lyq/Audio_Spades_Queen.mp3",
};
const video_urls: StringByString = {
  clubs:
    "ipfs://bafybeie2k5fjanhq5wpdemoe3w3mtninpw4ewlsugqofoiqp6jq4yvj454/Video_Clubs_Queen.mp4",
  diamonds:
    "ipfs://bafybeidkzhqquonsecq75esti2mbdma36ht5k63pyurgtr3ia5ev3hrejm/Video_Diamonds_Queen.mp4",
  hearts:
    "ipfs://bafybeic22xavrpqucdosu7tklaly5opezaholsnyqdcm62jvwtj4qidubm/Video_Hearts_Queen.mp4",
  spades:
    "ipfs://bafybeie64cw4cibkn3a6l5artkcbekkiulnaammlyfiqrfdab3plhbdqqq/Video_Spades_Queen.mp4",
};
const youtube_urls: StringByString = {
  clubs: "https://www.youtube.com/watch?v=uh9zEAwNn-4",
  diamonds: "https://www.youtube.com/watch?v=E1fXUl7lG3U",
  hearts: "https://www.youtube.com/watch?v=0B0ge4TWaJs",
  spades: "https://www.youtube.com/watch?v=QF9pDrBbDjM",
};

interface metaData {
  name: string;
  description: string;
  image: string;
  attributes: any[];
}

interface metaDataQueen {
  name: string;
  description: string;
  image: string;
  external_url: string;
  attributes: any[];
  animation_url: string;
  youtube_url: string;
}

function shuffle(array: string[]) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  return array;
}

async function getFileList(dirName: string) {
  let files: string[] = [];
  const items = await readdir(dirName, { withFileTypes: true });

  for (const item of items) {
    if (item.isDirectory()) {
      files = [...files, ...(await getFileList(`${dirName}/${item.name}`))];
    } else {
      files.push(`${dirName}/${item.name}`);
    }
  }

  return files;
}

async function readDir(dirName: string) {
  let files: string[] = [];
  const fileList = await getFileList(dirName);
  for (let index = 0; index < fileList.length; index++) {
    const file = fileList[index];
    const relPath = file.replace(dirName + "/", "");
    files.push(relPath);
  }
  return files;
}

async function main() {
  const imageList = await readDir("images");

  // write logs
  fs.writeFile("./logs.txt", "", function (err) {});

  for (let index = 0; index < imageList.length; index++) {
    const file = imageList[index];
    const [folder, filename] = file.split("/");
    const [name, format] = filename.split(".");
    const [suit, card] = name.split("_");

    const nft_name = card + " of " + suit;
    const nft_description =
      "One unique, firey and unforgettable Flameling Queen!";
    // write logs
    fs.appendFileSync("./logs.txt", index + ": " + file + "\n");

    let audio_url: string;
    let video_url: string;
    let youtube_url: string;

    if (card == "Queen") {
      audio_url = audio_urls[suit.toLowerCase()];
      video_url = video_urls[suit.toLowerCase()];
      youtube_url = youtube_urls[suit.toLowerCase()];
      console.log(video_url);

      // write metadata file
      let json: metaDataQueen;
      json = {
        name: nft_name,
        description: nft_description,
        image: img_url + folder + "/" + filename,
        external_url: audio_url,
        attributes: [
          {
            trait_type: "Suit",
            value: suit,
          },
          {
            trait_type: "Card",
            value: card,
          },
        ],
        animation_url: video_url,
        youtube_url: youtube_url,
      };
      fs.writeFileSync("./metadata/" + index, JSON.stringify(json));
    } else {
      // write metadata file
      let json: metaData;
      json = {
        name: nft_name,
        description: nft_description,
        image: img_url + folder + "/" + filename,
        attributes: [
          {
            trait_type: "Suit",
            value: suit,
          },
          {
            trait_type: "Card",
            value: card,
          },
        ],
      };
      fs.writeFileSync("./metadata/" + index, JSON.stringify(json));
    }
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
