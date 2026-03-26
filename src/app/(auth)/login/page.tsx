import { Baby } from "lucide-react"
import LoginForm from "./_components/login-form"

export default function LoginPage() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-4">
            <div className="mb-8 flex items-center gap-2 text-2xl font-bold text-slate-800">
                <Baby className="h-7 w-7 text-pink-400" />
                mashiLog
            </div>
            <LoginForm />
        </main>
    )
}