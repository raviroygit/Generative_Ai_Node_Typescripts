import { OpenAI} from "openai";
import { encoding_for_model } from "tiktoken";

const openAi = new OpenAI();

// simply ask a question
async function mainFunction(){
    const prompt='How tall is mount Everest?'
    const response= await openAi.chat.completions.create({
        model:"gpt-3.5-turbo",
        messages:[
        //     {
        //     role:"system",
        //     content:`you respond like a cool bro, and you respond in JSON format, like
        //     coolnessLevel:1-10,
        //     answer:your answer
        //     `
        // },
        {
            role:"user",
            content:prompt
        },]
        ,
        // max_tokens:100,
        // n:1,
        // frequency_penalty:1.5,
        // seed:5555
    })

    console.log("Tokens: ",encodePrompt(prompt),'Result:========= ',response.choices[0].message.content,"==========" )
}

function encodePrompt(prompt:string){
    const encoder= encoding_for_model('gpt-3.5-turbo');
    const words = encoder.encode(prompt);
    return words.length
}

// mainFunction()