import Header from './components/Header'
import RepoGrid from './components/RepoGrid'

export default function App() {
  return (
    <div className="min-h-screen bg-surface font-sans">
      <Header />
      <main>
        <RepoGrid />
      </main>
      <footer className="border-t border-surface-border py-8 text-center text-xs text-gray-600">
        &copy; {new Date().getFullYear()} Julian Wong &mdash; Investment AI Suite
      </footer>
    </div>
  )
}
