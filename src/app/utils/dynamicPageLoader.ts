/**
 * Utilitaire pour charger dynamiquement les pages de BD sans avoir à définir manuellement chaque page
 */

/**
 * Interface pour les pages d'un chapitre
 */
export interface ChapterPage {
  page_number: number;
  image_url: string;
}

/**
 * Génère dynamiquement les URLs des pages à partir d'un modèle
 * @param baseUrl - URL de base pour les images (sans le nom de fichier)
 * @param filenamePattern - Motif du nom de fichier avec {n} comme placeholder pour le numéro
 * @param start - Numéro de la première page
 * @param end - Numéro de la dernière page
 * @param padZeros - Nombre de zéros pour le padding (défaut: 3)
 */
export function generatePageUrls(
  baseUrl: string,
  filenamePattern: string,
  start: number,
  end: number,
  padZeros: number = 3
): ChapterPage[] {
  const pages: ChapterPage[] = [];
  
  for (let i = start; i <= end; i++) {
    // Formater le numéro avec des zéros de remplissage
    const paddedNumber = i.toString().padStart(padZeros, '0');
    
    // Remplacer {n} dans le motif par le numéro formaté
    const filename = filenamePattern.replace('{n}', paddedNumber);
    
    // Ajouter la page au tableau
    pages.push({
      page_number: i - start + 1,
      image_url: `${baseUrl}/${filename}`
    });
  }
  
  return pages;
}

/**
 * Récupère toutes les pages d'un chapitre en utilisant un motif d'URL
 * À utiliser dans les composants de page pour charger dynamiquement les images
 * 
 * Exemple d'utilisation:
 * const pages = useChapterPages({
 *   baseUrl: 'https://res.cloudinary.com/dh8f5kqra/image/upload/v1746236406/mesBD/Categorie/3D/CrazyDad3D%20Caroline/Chapitre%2001',
 *   filenamePattern: '01-{n}.jpg',
 *   totalPages: 152
 * });
 */
export function useChapterPages(options: {
  baseUrl: string;
  filenamePattern: string;
  totalPages: number;
  startPage?: number;
  padZeros?: number;
}): ChapterPage[] {
  const { baseUrl, filenamePattern, totalPages, startPage = 1, padZeros = 3 } = options;
  
  return generatePageUrls(
    baseUrl,
    filenamePattern,
    startPage,
    totalPages,
    padZeros
  );
} 