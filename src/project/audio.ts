import OpenAI from "openai";
import { writeFileSync, createReadStream } from "fs";

const openAi = new OpenAI();

const textToAudio = async () => {
  const response = await openAi.audio.speech.create({
    model: "tts-1",
    input: "India is a great and very fast developing country, just become #1 populated country.",
    voice: "alloy",
    response_format: "mp3",
  });

  const buffer = Buffer.from(await response.arrayBuffer());
  if (buffer) {
    writeFileSync("india.mp3", buffer);
  }
};


const audioTranscribe = async () => {
    const response = await openAi.audio.transcriptions.create({
      model: "whisper-1",
      file:createReadStream("india.mp3"),
      language:"fr"
    });
  
   console.log('response',response)
  };

  const speechToText = async () => {
    const response = await openAi.audio.translations.create({
      model: "whisper-1",
      file:createReadStream("france.mp3"),
    });
  
   console.log('response',response)
  };

//   speechToText();
