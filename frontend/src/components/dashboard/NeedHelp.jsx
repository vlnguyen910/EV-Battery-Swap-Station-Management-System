import { Card, CardContent, CardHeader } from "../ui/card"
import { Button } from "../ui/button"

const helpOptions = [
  {
    icon: "📞",
    title: "Contact Support",
    description: "Get immediate help from our support team",
    bgColor: "bg-blue-50",
    hoverColor: "hover:bg-blue-100",
    textColor: "text-blue-700"
  },
  {
    icon: "❓", 
    title: "FAQ",
    description: "Find answers to common questions",
    bgColor: "bg-green-50",
    hoverColor: "hover:bg-green-100", 
    textColor: "text-green-700"
  },
  {
    icon: "💬",
    title: "Send Feedback", 
    description: "Help us improve our service",
    bgColor: "bg-purple-50",
    hoverColor: "hover:bg-purple-100",
    textColor: "text-purple-700"
  }
]

export default function NeedHelp() {
  return (
    <Card className="bg-white shadow-lg border border-gray-200">
      <CardHeader className="bg-blue-800 text-white rounded-lg pt-2">
        <h2 className="text-lg font-bold">Need Help?</h2>
      </CardHeader>
      <CardContent className="p-4">
        <div className="space-y-3">
          {helpOptions.map((option, index) => (
            <Button
              key={index}
              variant="ghost"
              className={`w-full justify-start text-left p-4 h-auto bg-indigo-200 hover:bg-indigo-300 shadow-lg border border-gray-200`}
            >
              <div className="flex items-center space-x-3">
                {/* <span className="text-2xl">{option.icon}</span> */}
                <div>
                  <p className={`font-semibold text-sm text-indigo-800`}>{option.title}</p>
                  <p className="text-gray-600 text-xs">{option.description}</p>
                </div>
              </div>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}