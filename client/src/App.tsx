import { Route, Switch } from 'wouter'
import SearchPage from './pages/SearchPage'
import SavedPage from './pages/SavedPage'

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <a href="/" className="text-xl font-bold text-gray-900">
            Event Explorer
          </a>
          <div className="flex gap-6">
            <a href="/" className="text-sm text-gray-600 hover:text-gray-900">
              Search
            </a>
            <a href="/saved" className="text-sm text-gray-600 hover:text-gray-900">
              Saved Events
            </a>
          </div>
        </div>
      </nav>
      <main className="max-w-5xl mx-auto min-h-screen px-6 py-8">
        <Switch>
          <Route path="/" component={SearchPage} />
          <Route path="/saved" component={SavedPage} />
        </Switch>
      </main>
      <footer className="bg-white border-t border-gray-200 px-6 py-4 mt-auto">
        <div className="max-w-5xl mx-auto text-center text-sm text-gray-600">
          &copy; {new Date().getFullYear()}  Mehmet Turan — Built with React, Vite, Tailwind CSS, and TypeScript
        </div>
      </footer>
    </div>
  )
}