import Link from "next/link";

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-primary-light">
      <div className="bg-card rounded-xl shadow-lg p-8 w-full max-w-md flex flex-col items-center">
        <div className="mb-6">
          <svg width="120" height="90" viewBox="0 0 120 90" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="10" y="20" width="100" height="60" rx="8" fill="#7C3AED"/>
            <text x="60" y="60" textAnchor="middle" fontSize="40" fill="#F59E42" fontWeight="bold">404</text>
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-text mb-2 text-center">Looks like you&apos;ve got lost....</h2>
        <Link href="/" className="mt-4 w-full bg-primary text-white py-2 rounded-lg font-semibold text-center hover:bg-primary-dark transition">Back to Dashboard</Link>
      </div>
    </div>
  );
}
