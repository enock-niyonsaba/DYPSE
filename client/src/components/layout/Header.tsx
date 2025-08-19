import { Link } from 'react-router-dom';
import { Button } from '@/components/ui';

export function Header() {
  return (
    <header className="border-b">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="font-bold text-xl text-primary">
          DYSEM
        </Link>
        <nav className="flex items-center space-x-4">
          <Button variant="ghost" asChild>
            <Link to="/login">Login</Link>
          </Button>
          <Button asChild>
            <Link to="/register">Get Started</Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}
