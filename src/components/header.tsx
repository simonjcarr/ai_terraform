import { Button } from "@/components/ui/button"
import { Sparkles } from "lucide-react"
import { Trash2 } from "lucide-react"

const Header = ({ clearChat }: { clearChat: () => void }) => {
  return (
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
  )
}

export default Header