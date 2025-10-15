import { Sun, Moon, Cloud } from "lucide-react"

//nữa gắn user từ backend vào
export default function WelcomeHeader({ userName = "Alex" }) {
  const currentHour = new Date().getHours()
  const greeting = currentHour < 12 ? "Good morning" : currentHour < 18 ? "Good afternoon" : "Good evening"
  const GreetingIcon = currentHour < 12 ? Sun : currentHour < 18 ? Cloud : Moon

  return (
    <div className="bg-blue-800 rounded-lg p-6 text-white mb-6">
      <div className="flex items-center gap-3 mb-2">
        <GreetingIcon className="w-8 h-8" />
        <h1 className="text-2xl font-bold">{greeting}, {userName}</h1>
      </div>
      <p className="text-blue-100">Ready for your next journey?</p>
    </div>
  )
}