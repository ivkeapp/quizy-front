import { Link } from 'react-router-dom';

import { Card } from '@/shared/ui/Card';
import { Button } from '@/shared/ui/Button';

export function LandingPage() {
  return (
    <div className="space-y-8">
      <Card className="space-y-6 bg-gradient-to-br from-slate-900 to-slate-800 text-white">
        <header className="space-y-2">
          <h1 className="text-4xl font-bold">Quizy</h1>
          <p className="text-lg text-slate-300">Test your knowledge with timed quizzes</p>
        </header>

        <div className="space-y-4">
          <section>
            <h2 className="mb-2 text-xl font-semibold">What is Quizy?</h2>
            <p className="text-slate-300">
              Quizy is an interactive quiz platform where you can test your knowledge in various categories. Answer multiple-choice questions within a time limit and compete with other players on the leaderboard.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-xl font-semibold">How it works</h2>
            <ol className="space-y-2 text-slate-300">
              <li className="flex gap-3">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-700 text-sm font-semibold">1</span>
                <span>Register for a free account</span>
              </li>
              <li className="flex gap-3">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-700 text-sm font-semibold">2</span>
                <span>Select the number of questions and difficulty</span>
              </li>
              <li className="flex gap-3">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-700 text-sm font-semibold">3</span>
                <span>Answer questions within the time limit</span>
              </li>
              <li className="flex gap-3">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-700 text-sm font-semibold">4</span>
                <span>View your score and climb the leaderboard</span>
              </li>
            </ol>
          </section>

          <section>
            <h2 className="mb-2 text-xl font-semibold">Key features</h2>
            <ul className="space-y-2 text-slate-300">
              <li className="flex gap-2">
                <span>✓</span>
                <span>Quick and challenging quizzes</span>
              </li>
              <li className="flex gap-2">
                <span>✓</span>
                <span>Multiple categories and difficulty levels</span>
              </li>
              <li className="flex gap-2">
                <span>✓</span>
                <span>Time-based scoring system</span>
              </li>
              <li className="flex gap-2">
                <span>✓</span>
                <span>Real-time leaderboards</span>
              </li>
            </ul>
          </section>
        </div>

        <div className="border-t border-slate-700 pt-6">
          <p className="mb-4 text-sm text-slate-400">
            Ready to start? Create an account to begin playing and competing with other quiz enthusiasts.
          </p>

          <div className="flex gap-3">
            <Link to="/register" className="flex-1">
              <Button className="w-full">Create Account</Button>
            </Link>
            <Link to="/login" className="flex-1">
              <Button variant="secondary" className="w-full">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </Card>

      <Card className="space-y-3">
        <h3 className="font-semibold">Browse publicly available content</h3>
        <p className="text-sm text-slate-600">
          You can view categories and the leaderboard without registering:
        </p>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Link to="/categories" className="flex-1">
            <Button variant="secondary" className="w-full">
              View Categories
            </Button>
          </Link>
          <Link to="/leaderboard" className="flex-1">
            <Button variant="secondary" className="w-full">
              View Leaderboard
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}
