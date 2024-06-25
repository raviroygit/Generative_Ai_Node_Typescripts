import { readFileSync, writeFileSync } from "fs";
import OpenAI from "openai";
import { join } from "path";

const openAi = new OpenAI();

export async function  generateEmbedding(input:string | string[]) {
    const response = await openAi.embeddings.create({
        input:input,
        model:"text-embedding-3-small"
    })

    // console.log('response', response.data[0].embedding)
    return response;
}

export function loadJsonData<T>(filename:string):T{
    const path=join(__dirname,filename);
    const rawData = readFileSync(path);

    return JSON.parse(rawData.toString());
}

export type DataWithEmbeddings ={
    input:string,
    embedding:number[]
}

export function saveDataToJsonFile (data:any,filename:string){

    const dataString = JSON.stringify(data);
    const dataBuffer= Buffer.from(dataString);
    const path = join(__dirname,filename);

    writeFileSync(path,dataBuffer);
    // console.log(`Saved data to ${filename}`)
}

async function main(){
    const data = loadJsonData<string[]>('ravi.json');
    const embeddings= await generateEmbedding(data);
    const dataWithEmbeddings:DataWithEmbeddings[]=[];

    for(let i=0; i<data.length; i++){
        dataWithEmbeddings.push({
            input:data[i],
            embedding:embeddings.data[i].embedding
        })
    }

    saveDataToJsonFile(dataWithEmbeddings,"RaviDataWithEmbeddings.json");

}

main()