import OpenAi from "openai";
import { encoding_for_model } from "tiktoken";

const openAi = new OpenAi();
const MAX_TOKENS = 200;
const encoder = encoding_for_model("gpt-3.5-turbo");

const context: OpenAi.Chat.Completions.ChatCompletionMessageParam[] = [
  {
    role: "system",
    content: "You are a Roy a virtual assistant",
  },
];

async function createChatCompletion() {
  const response = await openAi.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: context,
  });

  const responseMsg = response.choices[0].message;
  context.push(responseMsg);

  if(response.usage && response.usage.total_tokens > MAX_TOKENS){
    deleteOlderMessage();
  }
  console.log(
    "responseMsg:===========",
    responseMsg.content,
    " ================"
  );
}

process.stdin.addListener("data", async function (input) {
  const userInput = input.toString().trim();
  context.push({
    role: "user",
    content: userInput,
  });
  await createChatCompletion();
});

function deleteOlderMessage() {
  let contextLength = getContextLength();

  while (contextLength > MAX_TOKENS) {
    for (let i = 0; i < context.length; i++) {
      const message = context[i];
      if (message.role != "system") {
        context.splice(i, 1);
        contextLength = getContextLength();
        console.log("New context length: " + contextLength);
      }
    }
  }
}

function getContextLength() {
  let length = 0;

  context.forEach((msg) => {
    if (typeof msg.content === "string") {
      length += encoder.encode(msg.content).length;
    } else if (Array.isArray(msg.content)) {
      msg.content.forEach((msgContent) => {
        if (msgContent.type == "text") {
          length += encoder.encode(msgContent.text).length;
        }
      });
    }
  });

  return length;
}
