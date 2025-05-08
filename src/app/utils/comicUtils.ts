/**
 * Utilitaires pour la gestion des BD
 */

/**
 * Génère un tableau de pages pour un chapitre de BD basé sur un format d'URL
 * @param baseUrl - L'URL de base pour les images (jusqu'au dossier)
 * @param prefix - Le préfixe du nom de fichier (par exemple '01-')
 * @param startNumber - Le numéro de la première page
 * @param endNumber - Le numéro de la dernière page
 * @param padLength - Longueur du padding pour les numéros (par défaut 3 chiffres)
 * @param fileExtension - Extension du fichier (par défaut jpg)
 * @returns Tableau d'objets de pages au format { page_number, image_url }
 */
export function generateChapterPages(
  baseUrl: string,
  prefix: string,
  startNumber: number,
  endNumber: number,
  padLength: number = 3,
  fileExtension: string = 'jpg'
): { page_number: number; image_url: string }[] {
  const pages = [];
  
  for (let i = startNumber; i <= endNumber; i++) {
    const paddedNumber = i.toString().padStart(padLength, '0');
    const fileName = `${prefix}${paddedNumber}.${fileExtension}`;
    const imageUrl = `${baseUrl}/${fileName}`;
    
    pages.push({
      page_number: i - startNumber + 1, // Les numéros de page commencent à 1
      image_url: imageUrl
    });
  }
  
  return pages;
}

/**
 * Exemple d'utilisation pour la BD Caroline Chapitre 1:
 * const carolinePages = generateChapterPages(
 *   'https://res.cloudinary.com/dh8f5kqra/image/upload/v1746236406/mesBD/Categorie/3D/CrazyDad3D%20Caroline/Chapitre%2001',
 *   '01-',
 *   1,
 *   152
 * );
 */ 