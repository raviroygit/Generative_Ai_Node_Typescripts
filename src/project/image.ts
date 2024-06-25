import OpenAI from "openai";
import { writeFileSync, createReadStream } from "fs";

const openAi= new OpenAI();

const generateImage= async()=>{
    const response =await openAi.images.generate({
        prompt:"Generate image of a girl with small scurt ",
        model:"dall-e-2",
        style:'vivid',
        size:"256x256",
        quality:"standard",
        n:1
    });

    console.log('response', response)
}

const generateImageAndWriteLocal= async()=>{
    const response =await openAi.images.generate({
        prompt:"Generate image of a girl with small scurt ",
        model:"dall-e-2",
        style:'vivid',
        size:"256x256",
        quality:"standard",
        n:1,
        response_format:"b64_json"
    });
const rawImage =  response.data[0].b64_json;
if(rawImage){
    writeFileSync("girl.png",Buffer.from(rawImage,"base64"))
}
    // console.log('response', response)
}

const generateImageAndWriteLocalWithAdvancedDalle3= async()=>{
    const response =await openAi.images.generate({
        prompt:"Generate image of a girl with small scurt ",
        model:"dall-e-3",
        style:'vivid',
        size:"1024x1024",
        quality:"hd",
        n:1,
        response_format:"b64_json"
    });
const rawImage =  response.data[0].b64_json;
if(rawImage){
    writeFileSync("girlAdvancedDalle-3.png",Buffer.from(rawImage,"base64"))
}
    // console.log('response', response)
}


const variationImageAndWriteLocal= async()=>{
    const response =await openAi.images.createVariation({
        image:createReadStream("girlAdvancedDalle-3.png"),
        model:"dall-e-2",
        size:"256x256",
        n:1,
        response_format:"b64_json"
    });
const rawImage =  response.data[0].b64_json;
if(rawImage){
    writeFileSync("girlVariation.png",Buffer.from(rawImage,"base64"))
}
    // console.log('response', response)
}

const editImageAndWriteLocal= async()=>{
    const response =await openAi.images.edit({
        image:createReadStream("girl_transparent.png"),
        prompt:"add thunderstorms with raining",
        model:"dall-e-2",
        size:"256x256",
        n:1,
        response_format:"b64_json"
    });
const rawImage =  response.data[0].b64_json;
if(rawImage){
    writeFileSync("girlInThunderWithRain.png",Buffer.from(rawImage,"base64"))
}
    // console.log('response', response)
}

editImageAndWriteLocal()