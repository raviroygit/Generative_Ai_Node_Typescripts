import OpenAI from "openai";

const openAI = new OpenAI();

// function of time

function getTimeOfDay() {
  const now = new Date();

  let hours: any = now.getHours();
  let minutes: any = now.getMinutes();
  let seconds: any = now.getSeconds();

  // Pad single digits with leading zeros
  hours = String(hours).padStart(2, "0");
  minutes = String(minutes).padStart(2, "0");
  seconds = String(seconds).padStart(2, "0");

  return `${hours}:${minutes}:${seconds}`;
}

function getOrderStatus(orderId: string) {
  console.log(`Getting the status of order ${orderId}`);

  const orderAsNumber = parseInt(orderId);

  if (orderAsNumber % 2 === 0) {
    return "IN_PROGRESS";
  } else {
    return "COMPLETED";
  }
}

const context: OpenAI.Chat.ChatCompletionMessageParam[] = [
  {
    role: "system",
    content:
      "You are a helpful assistant to give information about date and time",
  },
  {
    role: "user",
    content: "What is time now?",
  },
];

async function callOpenAiWithTools() {
  const response = await openAI.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: context,
    tools: [
      {
        type: "function",
        function: {
          name: "getTimeOfDay",
          description: "get the time of day",
        },
      },
      {
        type: "function",
        function: {
          name: "getOrderStatus",
          description: "get the status of order",
          parameters: {
            type: "object",
            properties: {
              orderId: {
                type: "string",
                description: "the id of order to get the status",
              },
            },
            required: ["orderId"],
          },
        },
      },
    ],
    tool_choice: "auto",
  });

  /// Decide to call tool(function) is required
  const willInvokeFunction = response.choices[0].finish_reason == "tool_calls";
  const toolCall = response.choices[0].message.tool_calls![0];

  if (willInvokeFunction) {
    const toolName = toolCall.function.name;
    if (toolName == "getTimeOfDay") {
      const toolResponse = getTimeOfDay();

      context.push(response.choices[0].message);
      context.push({
        role: "tool",
        content: toolResponse,
        tool_call_id: toolCall.id,
      });
    }

    if (toolName == "getOrderStatus") {
      const rawArguments = toolCall.function.arguments;
      const parsedArgument = JSON.parse(rawArguments);
      const toolResponse = getOrderStatus(parsedArgument.orderId);

      context.push(response.choices[0].message);
      context.push({
        role: "tool",
        content: toolResponse,
        tool_call_id: toolCall.id,
      });
    }
  }

  const secondResponse = await openAI.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: context,
  });

  console.log(
    "========",
    secondResponse.choices[0].message.content,
    " ========"
  );
}

callOpenAiWithTools();
