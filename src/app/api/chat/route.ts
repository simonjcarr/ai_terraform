import { openai } from "@ai-sdk/openai"
import { streamText } from "ai"

export async function POST(req: Request) {
  const { messages } = await req.json()

  // Add system message if not present
  const systemMessage = {
    role: "system",
    content: `You are an AI assistant specialized in generating Terraform scripts. 
    When asked to create infrastructure, respond with well-commented Terraform code.
    Always wrap code in triple backticks with the terraform language identifier.
    Example: \`\`\`terraform
    # Your code here
    \`\`\`
    Provide explanations of what the code does along with the code.`,
  }

  const augmentedMessages = messages[0]?.role === "system" ? messages : [systemMessage, ...messages]

  const result = streamText({
    model: openai("gpt-4o"),
    messages: augmentedMessages,
  })

  return result.toDataStreamResponse()
}

