// Script pour générer automatiquement les comics et chapitres à partir de images_telechargees.json
const fs = require('fs');
const path = require('path');

// Chemins des fichiers
const imagesFilePath = path.join(process.cwd(), 'images_telechargees.json');
const comicsFilePath = path.join(process.cwd(), 'src', 'app', 'data', 'comics.json');
const chaptersFilePath = path.join(process.cwd(), 'src', 'app', 'data', 'chapters.json');
const patternsFilePath = path.join(process.cwd(), 'scripts', 'comicPatterns.json');

// Configuration pour la génération des IDs
function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-')           // Remplace les espaces par -
    .replace(/[^\w\-]+/g, '')       // Supprime tous les caractères non-word
    .replace(/\-\-+/g, '-')         // Remplace multiple - par un seul -
    .replace(/^-+/, '')             // Supprime les - au début
    .replace(/-+$/, '');            // Supprime les - à la fin
}

// Fonction pour extraire les infos d'une URL Cloudinary
function extractInfoFromUrl(url) {
  // Identifier le chemin à partir de mesBD/Categorie/
  const match = url.match(/mesBD\/Categorie\/([^/]+)\/([^/]+)\/([^/]+)\/([^/]+)/);
  
  if (!match) return null;
  
  const [, category, comicFolder, chapterFolder, filename] = match;
  
  // Extraire l'auteur et le titre du comic
  // Utiliser décodeURIComponent pour gérer les caractères URL-encodés
  let decodedComicFolder = decodeURIComponent(comicFolder.replace(/\%20/g, ' '));
  
  // Trouver la première espace qui sépare l'auteur du titre
  const spaceIndex = decodedComicFolder.indexOf(' ');
  if (spaceIndex === -1) return null;
  
  const author = decodedComicFolder.substring(0, spaceIndex);
  const title = decodedComicFolder.substring(spaceIndex + 1);
  
  if (!author || !title) return null;
  
  // Extraire le numéro du chapitre
  const chapterMatch = chapterFolder.match(/Chapitre\s+(\d+)/i);
  const chapterNumber = chapterMatch ? parseInt(chapterMatch[1]) : null;
  
  // Extraire le numéro de page et le préfixe
  const fileMatch = filename.match(/(\d+)-(\d+)\.\w+/);
  const chapterPrefix = fileMatch ? fileMatch[1] : null;
  const pageNumber = fileMatch ? parseInt(fileMatch[2]) : null;
  
  return {
    category,
    author,
    title,
    chapterNumber,
    chapterFolder,
    pageNumber,
    chapterPrefix,
    filename,
    url
  };
}

// Fonction principale pour générer les comics et chapitres à partir d'images_telechargees.json
async function generateComicsAndChapters() {
  try {
    // Lire les fichiers existants
    const imagesData = JSON.parse(fs.readFileSync(imagesFilePath, 'utf8'));
    let comics = [];
    let chapters = [];
    
    try {
      comics = JSON.parse(fs.readFileSync(comicsFilePath, 'utf8'));
      chapters = JSON.parse(fs.readFileSync(chaptersFilePath, 'utf8'));
    } catch (err) {
      console.log('Impossible de lire les fichiers existants, création depuis zéro.');
    }
    
    // Structure pour organiser les données
    const comicsMap = new Map(); // Map des comics par titre/auteur
    const chaptersMap = new Map(); // Map des chapitres par comic+numéro de chapitre
    const existingComicIds = new Set(comics.map(c => c.id));
    
    // Première passe: extraire les informations et organiser les données
    for (const image of imagesData) {
      const info = extractInfoFromUrl(image.url);
      if (!info || !info.title || !info.author) continue;
      
      // Ignorer les entrées qui correspondent à des schémas dans comicPatterns.json
      // car ces comics seront gérés par generatePatternBasedComics
      const comicId = slugify(info.title);
      if (comicsMap.has(comicId)) continue;
      
      const comicKey = `${info.author} ${info.title}`;
      const chapterKey = `${comicKey}_ch${info.chapterNumber}`;
      
      // Créer l'entrée comic si elle n'existe pas
      if (!comicsMap.has(comicKey) && info.title && info.author) {
        // Vérifier s'il existe déjà dans la liste des comics
        const existingComic = comics.find(c => c.id === comicId);
        
        if (existingComic) {
          comicsMap.set(comicKey, existingComic);
        } else {
          const newComic = {
            id: comicId,
            title: info.title,
            author: info.author,
            categories: [info.category],
            description: `L'histoire captivante de ${info.title}`,
            cover_image: image.url, // Utiliser première image comme couverture
            created_at: new Date().toISOString().split('T')[0].replace(/-/g, '/')
          };
          
          comicsMap.set(comicKey, newComic);
        }
      }
      
      // Créer l'entrée chapitre si elle n'existe pas
      if (!chaptersMap.has(chapterKey) && info.chapterNumber) {
        const comic = comicsMap.get(comicKey);
        if (!comic) continue; // Skip if no valid comic found
        
        const chapterId = `${comic.id}-chapter-${info.chapterNumber}`;
        
        // Vérifier s'il existe déjà dans la liste des chapitres
        const existingChapter = chapters.find(ch => ch.id === chapterId);
        
        if (existingChapter) {
          chaptersMap.set(chapterKey, existingChapter);
        } else {
          const newChapter = {
            id: chapterId,
            comic_id: comic.id,
            chapter_number: info.chapterNumber,
            title: `Chapitre ${info.chapterNumber}`,
            created_at: new Date().toISOString().split('T')[0].replace(/-/g, '/'),
            is_protected: false,
            is_pdf: false,
            pdf_url: null,
            pages: []
          };
          
          chaptersMap.set(chapterKey, newChapter);
        }
      }
      
      // Ajouter la page au chapitre si c'est une page valide
      if (chaptersMap.has(chapterKey) && info.pageNumber) {
        const chapter = chaptersMap.get(chapterKey);
        
        // Éviter les doublons de pages
        if (!chapter.pages.some(p => p.page_number === info.pageNumber)) {
          chapter.pages.push({
            page_number: info.pageNumber,
            image_url: image.url
          });
        }
      }
    }
    
    // Trier les pages par numéro pour chaque chapitre
    for (const chapter of chaptersMap.values()) {
      chapter.pages.sort((a, b) => a.page_number - b.page_number);
    }
    
    // Filtrer les comics pour ne conserver que ceux qui ont un ID et un titre valides
    const validComics = Array.from(comicsMap.values()).filter(comic => 
      comic.id && comic.title && comic.author
    );
    
    // Fusionner les nouveaux comics avec les existants
    const newComics = validComics.filter(comic => !existingComicIds.has(comic.id));
    
    // Nettoyer les comics existants - supprimer ceux qui ont des IDs vides
    const cleanedComics = comics.filter(comic => comic.id && comic.title);
    
    // Mettre à jour les comics
    const updatedComics = cleanedComics.concat(newComics);
    
    // Fusionner les nouveaux chapitres avec les existants
    const existingChapterIds = new Set(chapters.map(ch => ch.id));
    const validChapters = Array.from(chaptersMap.values()).filter(chapter => 
      chapter.id && chapter.comic_id
    );
    const newChapters = validChapters.filter(chapter => !existingChapterIds.has(chapter.id));
    
    // Mettre à jour les chapitres
    const updatedChapters = chapters.concat(newChapters);
    
    // Sauvegarder les comics et chapitres
    fs.writeFileSync(comicsFilePath, JSON.stringify(updatedComics, null, 2));
    fs.writeFileSync(chaptersFilePath, JSON.stringify(updatedChapters, null, 2));
    
    console.log(`Comics mis à jour: ${updatedComics.length} (${newComics.length} nouveaux)`);
    console.log(`Chapitres mis à jour: ${updatedChapters.length} (${newChapters.length} nouveaux)`);
    
    return { comics: updatedComics, chapters: updatedChapters };
  } catch (err) {
    console.error('Erreur lors de la génération des comics et chapitres:', err);
    return null;
  }
}

// Fonction pour générer les URL basées sur les patterns définis dans comicPatterns.json
function generatePatternBasedComics(existingComics = [], existingChapters = []) {
  try {
    // Lire le fichier de patterns
    const patterns = JSON.parse(fs.readFileSync(patternsFilePath, 'utf8'));
    
    // Préparer les tableaux pour les nouvelles/mises à jour
    let updatedComics = [...existingComics];
    let updatedChapters = [...existingChapters];
    let comicsModified = false;
    let chaptersModified = false;
    
    // Traiter chaque pattern de comic
    for (const comicPattern of patterns) {
      // Vérifier si le comic existe déjà
      const existingComic = existingComics.find(c => c.id === comicPattern.comicId);
      
      if (!existingComic) {
        // Créer un nouveau comic
        const newComic = {
          id: comicPattern.comicId,
          title: comicPattern.title,
          author: comicPattern.author,
          categories: comicPattern.categories,
          description: comicPattern.description,
          cover_image: comicPattern.cover_image,
          created_at: comicPattern.created_at || new Date().toISOString().split('T')[0].replace(/-/g, '/')
        };
        
        updatedComics.push(newComic);
        comicsModified = true;
        console.log(`Nouveau comic ajouté: ${newComic.title}`);
      }
      
      // Traiter chaque chapitre du pattern
      for (const chapterPattern of comicPattern.chapters) {
        const chapterId = `${comicPattern.comicId}-chapter-${chapterPattern.chapterNumber}`;
        const existingChapter = existingChapters.find(ch => ch.id === chapterId);
        
        if (!existingChapter) {
          // Créer un nouveau chapitre
          const newChapter = {
            id: chapterId,
            comic_id: comicPattern.comicId,
            chapter_number: chapterPattern.chapterNumber,
            title: chapterPattern.title || `Chapitre ${chapterPattern.chapterNumber}`,
            created_at: chapterPattern.created_at || new Date().toISOString().split('T')[0].replace(/-/g, '/'),
            is_protected: chapterPattern.is_protected || false,
            is_pdf: chapterPattern.is_pdf || false,
            pdf_url: chapterPattern.pdf_url || null,
            pages: []
          };
          
          // Générer les pages si ce n'est pas un PDF
          if (!newChapter.is_pdf && chapterPattern.baseUrl && chapterPattern.filenamePattern && chapterPattern.totalPages) {
            console.log(`Génération de pages pour ${comicPattern.comicId}, chapitre ${chapterPattern.chapterNumber}`);
            
            for (let pageNumber = 1; pageNumber <= chapterPattern.totalPages; pageNumber++) {
              const formattedPageNumber = String(pageNumber).padStart(3, '0');
              const imageUrl = `${chapterPattern.baseUrl}/${chapterPattern.filenamePattern.replace('{n}', formattedPageNumber)}`;
              
              newChapter.pages.push({
                page_number: pageNumber,
                image_url: imageUrl
              });
            }
          }
          
          updatedChapters.push(newChapter);
          chaptersModified = true;
          console.log(`Nouveau chapitre ajouté: ${newChapter.title} (Comic: ${comicPattern.title})`);
        } else if (!existingChapter.is_pdf && chapterPattern.baseUrl && chapterPattern.filenamePattern && chapterPattern.totalPages) {
          // Mettre à jour les pages d'un chapitre existant
          console.log(`Mise à jour des pages pour ${comicPattern.comicId}, chapitre ${chapterPattern.chapterNumber}`);
          
          const updatedPages = [];
          for (let pageNumber = 1; pageNumber <= chapterPattern.totalPages; pageNumber++) {
            const formattedPageNumber = String(pageNumber).padStart(3, '0');
            const imageUrl = `${chapterPattern.baseUrl}/${chapterPattern.filenamePattern.replace('{n}', formattedPageNumber)}`;
            
            updatedPages.push({
              page_number: pageNumber,
              image_url: imageUrl
            });
          }
          
          // Trouver l'index du chapitre et le mettre à jour
          const chapterIndex = updatedChapters.findIndex(ch => ch.id === chapterId);
          if (chapterIndex !== -1) {
            updatedChapters[chapterIndex].pages = updatedPages;
            chaptersModified = true;
            console.log(`Chapitre mis à jour: ${updatedChapters[chapterIndex].title} (${updatedPages.length} pages)`);
          }
        }
      }
    }
    
    // Sauvegarder les modifications si nécessaire
    if (comicsModified) {
      fs.writeFileSync(comicsFilePath, JSON.stringify(updatedComics, null, 2));
      console.log('Comics basés sur patterns générés avec succès');
    }
    
    if (chaptersModified) {
      fs.writeFileSync(chaptersFilePath, JSON.stringify(updatedChapters, null, 2));
      console.log('Chapitres basés sur patterns générés avec succès');
    }
    
    return { comicsModified, chaptersModified };
  } catch (err) {
    console.error('Erreur lors de la génération des comics basés sur patterns:', err);
    return { comicsModified: false, chaptersModified: false };
  }
}

// Exécuter les fonctions
async function main() {
  console.log('=== Génération des comics et chapitres depuis images_telechargees.json ===');
  const result = await generateComicsAndChapters();
  
  console.log('\n=== Génération des comics et chapitres depuis les patterns ===');
  if (result) {
    generatePatternBasedComics(result.comics, result.chapters);
  } else {
    const existingComics = JSON.parse(fs.readFileSync(comicsFilePath, 'utf8'));
    const existingChapters = JSON.parse(fs.readFileSync(chaptersFilePath, 'utf8'));
    generatePatternBasedComics(existingComics, existingChapters);
  }
  
  console.log('\nTraitement terminé.');
}

main().catch(console.error); 