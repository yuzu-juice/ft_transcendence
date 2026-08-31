import { Link } from '@tanstack/react-router'

export const Footer = () => {
  return (
    <footer className="w-full flex flex-col gap-2 border-t-2 border-brand-primary-soft px-6 py-3 justify-center items-center">
      <div className="flex flex-row gap-2.5 text-sm">
        <Link to="/terms" className="underline">
          利用規約
        </Link>
        <Link to="/privacy" className="underline">
          プライバシーポリシー
        </Link>
      </div>
      <small>&copy; 2026 Team Still Alive</small>
    </footer>
  )
}
