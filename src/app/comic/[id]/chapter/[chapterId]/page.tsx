import { notFound } from 'next/navigation';
import Link from 'next/link';
import { fetchApi } from '@/app/utils/fetchUtils';
import { generatePageUrls } from '@/app/utils/dynamicPageLoader';

type Comic = {
  id: string;
  title: string;
  author: string;
  description: string;
  cover_image: string;
  categories: string[];
  created_at: string;
};

type Page = {
  page_number: number;
  image_url: string;
};

type Chapter = {
  id: string;
  comic_id: string;
  chapter_number: number;
  title: string;
  created_at: string;
  pages: Page[];
  is_protected: boolean;
  is_pdf: boolean;
  pdf_url: string | null;
};

type ChapterData = {
  comic: Comic;
  currentChapter: Chapter;
  previousChapter: Chapter | null;
  nextChapter: Chapter | null;
};

async function getChapterData(comicId: string, chapterId: string): Promise<ChapterData | null> {
  try {
    // Utiliser fetchApi pour récupérer les données
    const comics = await fetchApi<Comic[]>('comics');
    const comic = comics.find((c) => c.id === comicId);
    
    if (!comic) {
      return null;
    }
    
    const chapters = await fetchApi<Chapter[]>('chapters');
    const comicChapters = chapters.filter((c) => c.comic_id === comicId);
    const currentChapter = comicChapters.find((c) => c.id === chapterId);
    
    if (!currentChapter) {
      return null;
    }
    
    // Trier les chapitres par numéro
    comicChapters.sort((a, b) => a.chapter_number - b.chapter_number);
    
    const currentIndex = comicChapters.findIndex((c) => c.id === chapterId);
    const previousChapter = currentIndex > 0 ? comicChapters[currentIndex - 1] : null;
    const nextChapter = currentIndex < comicChapters.length - 1 ? comicChapters[currentIndex + 1] : null;
    
    // Générer dynamiquement les pages pour le comic "caroline" si nécessaire
    if (comicId === 'caroline' || comicId === 'smith-timmy-strikes-back') {
      comicChapters.forEach(chapter => {
        // Si c'est un chapitre sans pages et que ce n'est pas un PDF
        if (chapter.pages.length === 0 && !chapter.is_pdf) {
          // Déterminer le bon motif d'URL basé sur le chapitre
          let baseUrl = '';
          let filenamePattern = '';
          let totalPages = 0;
          let padZeros = 3;
          
          if (comicId === 'caroline') {
            if (chapter.chapter_number === 1) {
              baseUrl = 'https://res.cloudinary.com/dh8f5kqra/image/upload/v1746236406/mesBD/Categorie/3D/CrazyDad3D%20Caroline/Chapitre%2001';
              filenamePattern = '01-{n}.jpg';
              totalPages = 152;
            } else if (chapter.chapter_number === 2) {
              baseUrl = 'https://res.cloudinary.com/dh8f5kqra/image/upload/v1746236406/mesBD/Categorie/3D/CrazyDad3D%20Caroline/Chapitre%2002';
              filenamePattern = '02-{n}.jpg';
              totalPages = 158;
            }
          } else if (comicId === 'smith-timmy-strikes-back') {
            padZeros = 3;
            if (chapter.chapter_number === 1) {
              baseUrl = 'https://res.cloudinary.com/dh8f5kqra/image/upload/v1746424164/mesBD/Categorie/3D/Pegasus%20Smith%20Timmy%20Strikes%20Back/Chapitre%2001';
              filenamePattern = '{n}.jpg';
              totalPages = 50;
            } else if (chapter.chapter_number === 2) {
              baseUrl = 'https://res.cloudinary.com/dh8f5kqra/image/upload/v1746424164/mesBD/Categorie/3D/Pegasus%20Smith%20Timmy%20Strikes%20Back/Chapitre%2002';
              filenamePattern = '{n}.jpg';
              totalPages = 50;
            }
          }
          
          if (baseUrl && filenamePattern && totalPages > 0) {
            chapter.pages = generatePageUrls(
              baseUrl,
              filenamePattern,
              1,
              totalPages,
              padZeros
            );
          }
        }
      });
    }
    
    return {
      comic,
      currentChapter,
      previousChapter,
      nextChapter
    };
  } catch (error) {
    console.error('Error fetching chapter data:', error);
    return null;
  }
}

export default async function ChapterPage({ 
  params 
}: { 
  params: { id: string; chapterId: string } 
}) {
  const id = params.id;
  const chapterId = params?.chapterId;
  
  if (!id || !chapterId) {
    notFound();
  }
  
  const chapterData = await getChapterData(id, chapterId);
  
  if (!chapterData) {
    notFound();
  }
  
  const { comic, currentChapter, previousChapter, nextChapter } = chapterData;
  
  // Rediriger vers la page de connexion si le chapitre est protégé et n'est PAS un PDF
  if (currentChapter.is_protected && !currentChapter.is_pdf) {
    // Simuler un message de redirection pour le moment
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
          <div className="bg-gray-200 p-4 rounded-full inline-flex mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Contenu Premium</h1>
          <p className="text-gray-600 mb-6">Ce chapitre est disponible uniquement pour les membres avec un abonnement.</p>
          <Link 
            href={`/comic/${comic.id}`}
            className="bg-purple-600 text-white px-6 py-2 rounded-md font-medium hover:bg-purple-700 transition-colors inline-block"
          >
            Retour à la BD
          </Link>
        </div>
      </div>
    );
  }
  
  // Afficher le PDF intégré si c'est un chapitre PDF
  if (currentChapter.is_pdf && currentChapter.pdf_url) {
    return (
      <div className="bg-gray-100 min-h-screen pb-16">
        {/* En-tête avec titre de la BD et du chapitre */}
        <header className="bg-white shadow-sm py-3 px-4 sticky top-0 z-10">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <h1 className="text-xl font-bold text-gray-800">
              {comic.title} - {currentChapter.title} (PDF)
            </h1>
            <Link 
              href={`/comic/${comic.id}`}
              className="text-purple-600 hover:text-purple-800 transition-colors"
            >
              Infos BD
            </Link>
          </div>
        </header>
        
        {/* Iframe pour le PDF */}
        <div className="w-full h-[calc(100vh-120px)] py-4 px-0">
          <iframe 
            src={currentChapter.pdf_url} 
            className="w-full h-full border-0" 
            allowFullScreen
          ></iframe>
        </div>
        
        {/* Footer fixe avec navigation */}
        <footer className="fixed bottom-0 left-0 right-0 bg-gray-900 text-white shadow-lg py-3 px-4 z-20">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            {previousChapter ? (
              <Link 
                href={`/comic/${comic.id}/chapter/${previousChapter.id}`}
                className="flex items-center justify-center bg-gray-800 px-4 py-2 rounded"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
                </svg>
                Précédent
              </Link>
            ) : (
              <span className="text-gray-600 px-4 py-2 cursor-not-allowed flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
                </svg>
                Précédent
              </span>
            )}
            
            <Link 
              href={`/comic/${comic.id}`}
              className="bg-gray-700 px-6 py-2 rounded-md font-medium hover:bg-gray-600 transition-colors flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
              </svg>
              Menu
            </Link>
            
            {nextChapter ? (
              <Link 
                href={`/comic/${comic.id}/chapter/${nextChapter.id}`}
                className="flex items-center justify-center bg-gray-800 px-4 py-2 rounded"
              >
                Suivant
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </Link>
            ) : (
              <span className="text-gray-600 px-4 py-2 cursor-not-allowed flex items-center">
                Suivant
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </span>
            )}
          </div>
        </footer>
      </div>
    );
  }
  
  // Affichage standard des images pour les chapitres normaux
  return (
    <div className="bg-gray-100 min-h-screen pb-16">
      {/* En-tête avec titre de la BD et du chapitre */}
      <header className="bg-white shadow-sm py-3 px-4 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-800">
            {comic.title} - {currentChapter.title}
          </h1>
          <Link 
            href={`/comic/${comic.id}`}
            className="text-purple-600 hover:text-purple-800 transition-colors"
          >
            Infos BD
          </Link>
        </div>
      </header>
      
      {/* Contenu du chapitre - Les images verticalement sans bordure ni espacement */}
      <main className="max-w-4xl mx-auto px-0">
        <div className="flex flex-col">
          {currentChapter.pages.map((page) => (
            <img
              key={page.page_number}
              src={page.image_url}
              alt={`Page ${page.page_number}`}
              className="w-full h-auto border-0 outline-none"
              style={{ display: 'block', margin: 0, padding: 0, border: 0 }}
              loading="lazy"
            />
          ))}
        </div>
      </main>
      
      {/* Footer fixe avec navigation */}
      <footer className="fixed bottom-0 left-0 right-0 bg-gray-900 text-white shadow-lg py-3 px-4 z-20">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          {previousChapter ? (
            <Link 
              href={`/comic/${comic.id}/chapter/${previousChapter.id}`}
              className="flex items-center justify-center bg-gray-800 px-4 py-2 rounded"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
              Précédent
            </Link>
          ) : (
            <span className="text-gray-600 px-4 py-2 cursor-not-allowed flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
              Précédent
            </span>
          )}
          
          <Link 
            href={`/comic/${comic.id}`}
            className="bg-gray-700 px-6 py-2 rounded-md font-medium hover:bg-gray-600 transition-colors flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
            </svg>
            Menu
          </Link>
          
          {nextChapter ? (
            <Link 
              href={`/comic/${comic.id}/chapter/${nextChapter.id}`}
              className="flex items-center justify-center bg-gray-800 px-4 py-2 rounded"
            >
              Suivant
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </Link>
          ) : (
            <span className="text-gray-600 px-4 py-2 cursor-not-allowed flex items-center">
              Suivant
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </span>
          )}
        </div>
      </footer>
    </div>
  );
} 