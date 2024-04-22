import fs from "fs";
import process from "process";
import { readdir } from "fs/promises";

const img_url =
  "ipfs://bafybeiclopxmp43iwj6zpkoli26dcmqr63bqejni4kxgifs77jtnwwneci/";

interface StringByString {
  [key: string]: string;
}

const audio_urls: StringByString = {
  clubs: "audio clubs",
  diamonds: "audio diamonds",
  hearts: "audio hearts",
  spades: "audio spades",
};
const video_urls: StringByString = {
  clubs: "video clubs",
  diamonds: "video diamonds",
  hearts: "video hearts",
  spades: "video spades",
};
const youtube_urls: StringByString = {
  clubs: "youtube clubs",
  diamonds: "youtube diamonds",
  hearts: "youtube hearts",
  spades: "youtube spades",
};

interface metaData {
  name: string;
  description: string;
  external_url: string;
  image: string;
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

  const randomizedList = shuffle(imageList);
  let index = 0;

  for (let index = 0; index < imageList.length; index++) {
    const file = randomizedList[index];
    const [folder, filename] = file.split("/");
    const [name, format] = filename.split(".");
    const [suit, card] = name.split("_");

    let audio_url: string;
    let video_url: string;
    let youtube_url: string;

    if (card == "Queen") {
      audio_url = audio_urls[suit.toLowerCase()];
      video_url = video_urls[suit.toLowerCase()];
      youtube_url = youtube_urls[suit.toLowerCase()];
    } else {
      audio_url = "";
      video_url = "";
      youtube_url = "";
    }
    // write logs
    fs.appendFileSync("./logs.txt", index + ": " + file + "\n");

    // write metadata file
    let json: metaData;
    json = {
      name: "Flameling Queen: " + card + " of " + suit,
      description: "One unique, firey and unforgettable Flameling Queen!",
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
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
