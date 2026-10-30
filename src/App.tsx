import Header from './components/Header'
import RepoGrid from './components/RepoGrid'
import WorkflowDiagram from './components/WorkflowDiagram'
import BuyVsBuild from './components/BuyVsBuild'

export default function App() {
  return (
    <div className="min-h-screen font-sans">
      <div className="aurora" aria-hidden="true">
        <div className="orb -left-40 -top-40 h-[34rem] w-[34rem] bg-gold" />
        <div className="orb -right-48 top-1/3 h-[38rem] w-[38rem] bg-[#2b6cb0]" style={{ animationDelay: '-9s' }} />
        <div className="orb -bottom-60 left-1/4 h-[30rem] w-[30rem] bg-mint-deep" style={{ animationDelay: '-17s' }} />
      </div>
      <Header />
      <main>
        <RepoGrid />
        <WorkflowDiagram />
        <BuyVsBuild />
      </main>
      <footer className="mx-auto max-w-6xl px-6 pb-12 pt-4">
        <div className="h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />
        <p className="pt-8 text-center font-serif text-sm text-slate-400">Authored by Julian Wong in 2026.</p>
      </footer>
    </div>
  )
}
