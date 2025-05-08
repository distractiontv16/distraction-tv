import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
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

type Chapter = {
  id: string;
  comic_id: string;
  chapter_number: number;
  title: string;
  created_at: string;
  is_protected: boolean;
  is_pdf: boolean;
  pdf_url: string | null;
  pages: { page_number: number; image_url: string }[];
};

async function getComicData(id: string): Promise<{ comic: Comic; chapters: Chapter[] } | null> {
  try {
    const comics = await fetchApi<Comic[]>('comics');
    const comic = comics.find((c) => c.id === id);
    
    if (!comic) {
      console.error(`Comic non trouvé avec l'ID: ${id}`);
      console.log('Comics disponibles:', comics.map(c => ({ id: c.id, title: c.title })));
      return null;
    }
    
    const chapters = await fetchApi<Chapter[]>('chapters');
    console.log(`Total des chapitres disponibles: ${chapters.length}`);
    
    // Filtrer les chapitres pour ce comic
    const comicChapters = chapters.filter((c) => c.comic_id === id);
    console.log(`Chapitres trouvés pour le comic "${comic.title}" (${id}): ${comicChapters.length}`);
    
    if (comicChapters.length === 0) {
      console.log(`Aucun chapitre trouvé pour le comic "${comic.title}" (${id})`);
      console.log('IDs des comics dans les chapitres:', [...new Set(chapters.map(c => c.comic_id))]);
    }
    
    // Trier les chapitres par numéro
    comicChapters.sort((a, b) => a.chapter_number - b.chapter_number);
      
    // Générer dynamiquement les pages pour les comics qui en ont besoin
    if (id === 'caroline' || id === 'smith-timmy-strikes-back') {
      comicChapters.forEach(chapter => {
        // Si c'est un chapitre sans pages et que ce n'est pas un PDF
        if (chapter.pages.length === 0 && !chapter.is_pdf) {
          // Déterminer le bon motif d'URL basé sur le chapitre et le comic
          let baseUrl = '';
          let filenamePattern = '';
          let totalPages = 0;
          
          if (id === 'caroline') {
            if (chapter.chapter_number === 1) {
              baseUrl = 'https://res.cloudinary.com/dh8f5kqra/image/upload/v1746236406/mesBD/Categorie/3D/CrazyDad3D%20Caroline/Chapitre%2001';
              filenamePattern = '01-{n}.jpg';
              totalPages = 152;
            } else if (chapter.chapter_number === 2) {
              baseUrl = 'https://res.cloudinary.com/dh8f5kqra/image/upload/v1746236406/mesBD/Categorie/3D/CrazyDad3D%20Caroline/Chapitre%2002';
              filenamePattern = '02-{n}.jpg';
              totalPages = 158;
            }
          } else if (id === 'smith-timmy-strikes-back') {
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
            // Pour la page de détail, générer seulement les 3 premières pages pour l'aperçu
            chapter.pages = generatePageUrls(
              baseUrl,
              filenamePattern,
              1,
              3,
              3 // Padding pour Smith Timmy Strikes Back
            );
          }
        }
      });
    }
    
    return { comic, chapters: comicChapters };
  } catch (error) {
    console.error('Error fetching comic data:', error);
    return null;
  }
}

export default async function ComicDetailPage({ 
  params 
}: { 
  params: { id: string } 
}) {
  // Récupérer l'ID de manière sécurisée
  const id = params.id;
  
  if (!id) {
    notFound();
  }
  
  const comicData = await getComicData(id);
  
  if (!comicData) {
    notFound();
  }
  
  const { comic, chapters } = comicData;
  
  return (
    <div className="min-h-screen bg-gray-100">
      {/* En-tête avec l'image et les informations de la BD */}
      <div className="bg-gradient-to-b from-purple-800 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Image de couverture */}
            <div className="flex-shrink-0 relative w-full md:w-64 h-96 overflow-hidden rounded-lg shadow-lg">
              <Image
                src={comic.cover_image}
                alt={comic.title}
                fill
                sizes="(max-width: 768px) 100vw, 256px"
                style={{ objectFit: 'cover' }}
                priority
              />
            </div>
            
            {/* Informations de la BD */}
            <div className="flex-1">
              <h1 className="text-3xl font-bold tracking-tight">{comic.title}</h1>
              <p className="mt-2 text-xl text-purple-200">Par {comic.author}</p>
              
              <div className="mt-4 flex flex-wrap gap-2">
                {comic.categories.map((category) => (
                  <span 
                    key={category} 
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-700 text-purple-100"
                  >
                    {category}
                  </span>
                ))}
              </div>
              
              <div className="mt-6 text-lg">
                <p className="text-purple-100">{comic.description}</p>
              </div>
              
              <div className="mt-8 flex flex-wrap gap-4">
                {chapters.length > 0 && (
                  <Link
                    href={`/comic/${comic.id}/chapter/${chapters[0].id}`}
                    className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600 shadow-md transition-all"
                  >
                    Commencer la lecture
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </Link>
                )}
                
                <Link
                  href="/"
                  className="inline-flex items-center justify-center px-6 py-3 border border-purple-300 text-base font-medium rounded-md text-purple-100 hover:bg-purple-700 transition-all"
                >
                  Retour
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Liste des chapitres */}
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Chapitres ({chapters.length})</h2>
        
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {chapters.map((chapter) => (
            <div 
              key={chapter.id} 
              className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-[1.02] hover:shadow-lg"
            >
              <Link href={`/comic/${comic.id}/chapter/${chapter.id}`}>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold text-gray-800">
                      {chapter.title}
                    </h3>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                      Chapitre {chapter.chapter_number}
                    </span>
                  </div>
                  
                  <div className="text-sm text-gray-500 mb-4">
                    {new Date(chapter.created_at).toLocaleDateString()}
                  </div>
                  
                  {/* Badge pour les chapitres protégés ou PDF */}
                  {(chapter.is_protected || chapter.is_pdf) && (
                    <div className="flex gap-2 mb-4">
                      {chapter.is_protected && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                          </svg>
                          Premium
                        </span>
                      )}
                      
                      {chapter.is_pdf && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                          </svg>
                          PDF
                        </span>
                      )}
                    </div>
                  )}
                  
                  {/* Aperçu des 3 premières pages du chapitre */}
                  {chapter.pages.length > 0 && !chapter.is_pdf && (
                    <div className="flex gap-1 mb-4 overflow-hidden h-24">
                      {chapter.pages.slice(0, 3).map((page, index) => (
                        <div key={`${chapter.id}-page-${page.page_number}-${index}`} className="flex-1 overflow-hidden rounded-md relative">
                          <img
                            src={page.image_url}
                            alt={`Aperçu page ${page.page_number}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {/* Bouton Lire */}
                  <div className="mt-4">
                    <div
                      className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 transition-colors"
                    >
                      {chapter.is_pdf ? "Ouvrir le PDF" : "Lire le chapitre"}
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
        
        {/* Section des recommandations */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Recommandations</h2>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {Array.from({ length: 6 }).map((_, index) => (
              <div 
                key={index}
                className="bg-white rounded-lg shadow overflow-hidden cursor-pointer transition-transform hover:scale-105"
              >
                <div className="relative h-48 bg-gray-200">
                  <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>
                <div className="p-4">
                  <div className="h-5 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-100 rounded w-2/3"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 