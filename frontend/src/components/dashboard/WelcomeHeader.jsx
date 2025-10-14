//nữa gắn user từ backend vào
export default function WelcomeHeader({ userName = "Alex" }) {
  return (
    <div className="bg-blue-800 rounded-lg p-6 text-white mb-6">
      <h1 className="text-2xl font-bold mb-2">Good morning, {userName}</h1>
      <p className="text-blue-100">Ready for your next journey?</p>
    </div>
  )
}