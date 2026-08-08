import Header from './components/Header'
import RepoGrid from './components/RepoGrid'
import WorkflowDiagram from './components/WorkflowDiagram'

export default function App() {
  return (
    <div className="min-h-screen bg-surface font-sans">
      <Header />
      <main>
        <RepoGrid />
        <WorkflowDiagram />
      </main>
      <footer className="border-t border-surface-border py-8 text-center text-xs text-gray-600">
        Authored by Julian Wong in 2026.
      </footer>
    </div>
  )
}
