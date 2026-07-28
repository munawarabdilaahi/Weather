import { Link } from 'react-router-dom';
import { useTranslation } from '@/hooks/useTranslation';

export default function NotFoundPage() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-8">
      <div className="text-center max-w-md">
        <h1 className="text-8xl font-bold text-blue-500 mb-4">404</h1>
        <h2 className="text-2xl font-bold text-foreground mb-2">{t('notFound.title')}</h2>
        <p className="text-muted-foreground mb-6">{t('notFound.description')}</p>
        <Link
          to="/"
          className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition"
        >
          {t('notFound.backHome')}
        </Link>
      </div>
    </div>
  );
}
