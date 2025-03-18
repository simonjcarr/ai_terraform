"use client"

import { useState } from "react"
import { useChat } from "@ai-sdk/react"
import { Sparkles, Copy, Download, Send, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function Home() {
  const [code, setCode] = useState("")
  const { messages, input, handleInputChange, handleSubmit, isLoading, setMessages } = useChat({
    onFinish: (message) => {
      if (message && message.content) {
        const codeBlockRegex = /```(?:terraform|hcl)?\s*([\s\S]*?)```/g
        const matches = [...message.content.matchAll(codeBlockRegex)]
        if (matches.length > 0) {
          const lastMatch = matches[matches.length - 1];
          if (lastMatch && lastMatch[1]) {
            setCode(lastMatch[1].trim());
          }
        }
      }
    },
  })


  const copyToClipboard = () => {
    navigator.clipboard.writeText(code)
  }

  const downloadCode = () => {
    const blob = new Blob([code], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "terraform.tf"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const clearChat = () => {
    setMessages([])
    setCode("")
  }

  return (
    <div className="flex flex-col min-h-screen dark">
      <header className="border-b">
        <div className="container flex items-center h-14 px-4">
          <h1 className="text-xl font-bold flex items-center">
            <Sparkles className="mr-2 h-5 w-5 text-blue-500" />
            AI-Terraform
          </h1>
          <div className="ml-auto">
            <Button variant="outline" size="sm" onClick={clearChat}>
              <Trash2 className="h-4 w-4 mr-2" />
              Clear
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 container grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
        <div className="flex flex-col h-[calc(100vh-8rem)]">
          <h2 className="text-lg font-semibold mb-4">AI Assistant</h2>
          <Card className="flex-1 overflow-hidden">
            <CardContent className="p-4 h-full flex flex-col">
              <div className="flex-1 overflow-y-auto mb-4">
                {messages.length === 0 ? (
                  <div className="h-full flex items-center justify-center text-center p-8 text-muted-foreground">
                    <div>
                      <Sparkles className="h-8 w-8 mb-2 mx-auto" />
                      <p>Ask the AI to generate Terraform scripts for your infrastructure needs.</p>
                      <p className="text-sm mt-2">
                        Example: "Create a Terraform script for an AWS EC2 instance with an S3 bucket"
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4 pt-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`rounded-lg px-4 py-2 max-w-[80%] ${
                            message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                          }`}
                        >
                          <div className="whitespace-pre-wrap">{message.content}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <form onSubmit={handleSubmit} className="flex items-end gap-2">
                <Textarea
                  placeholder="Ask for Terraform scripts..."
                  value={input}
                  onChange={handleInputChange}
                  className="min-h-[80px] resize-none"
                />
                <Button type="submit" size="icon" disabled={isLoading || !input.trim()}>
                  <Send className="h-4 w-4" />
                  <span className="sr-only">Send</span>
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col h-[calc(100vh-8rem)]">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Terraform Code</h2>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={copyToClipboard} disabled={!code}>
                <Copy className="h-4 w-4 mr-2" />
                Copy
              </Button>
              <Button variant="outline" size="sm" onClick={downloadCode} disabled={!code}>
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
            </div>
          </div>
          <Card className="flex-1 overflow-hidden">
            <Tabs defaultValue="editor">
              <div className="border-b px-4">
                <TabsList className="h-10">
                  <TabsTrigger value="editor">Editor</TabsTrigger>
                  <TabsTrigger value="preview">Preview</TabsTrigger>
                </TabsList>
              </div>
              <TabsContent value="editor" className="h-[calc(100%-40px)] p-0">
                <div className="h-full">
                  <textarea
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="w-full h-full p-4 font-mono text-sm bg-background resize-none focus:outline-none"
                    placeholder="Terraform code will appear here..."
                  />
                </div>
              </TabsContent>
              <TabsContent value="preview" className="h-[calc(100%-40px)] p-0">
                <div className="h-full overflow-auto p-4">
                  <pre className="font-mono text-sm whitespace-pre-wrap">{code}</pre>
                </div>
              </TabsContent>
            </Tabs>
          </Card>
        </div>
      </main>
    </div>
  )
}
