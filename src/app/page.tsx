import Link from "next/link";

export default function HomePage() {
    return (
        <div>
            <h1 className="text-red-500">HOME🏠</h1>
            <Link href="/sleep">睡眠ログ</Link>
        </div>
    );
}