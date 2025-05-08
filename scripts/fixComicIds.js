// Script pour harmoniser les IDs entre comics.json et chapters.json
const fs = require('fs');
const path = require('path');

// Chemins des fichiers
const comicsFilePath = path.join(process.cwd(), 'src', 'app', 'data', 'comics.json');
const chaptersFilePath = path.join(process.cwd(), 'src', 'app', 'data', 'chapters.json');

// Fonction pour nettoyer les IDs
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

// Fonction principale pour harmoniser les IDs
async function fixIds() {
  try {
    // Lire les fichiers existants
    const comics = JSON.parse(fs.readFileSync(comicsFilePath, 'utf8'));
    const chapters = JSON.parse(fs.readFileSync(chaptersFilePath, 'utf8'));
    
    console.log(`Comics avant: ${comics.length}`);
    console.log(`Chapitres avant: ${chapters.length}`);
    
    // 1. Supprimer les doublons dans comics.json (vérifier par title + author)
    const uniqueComics = [];
    const comicKeys = new Set();
    
    for (const comic of comics) {
      // Ignorer les entrées vides ou invalides
      if (!comic.id || !comic.title || !comic.author) continue;
      
      const key = `${comic.title}|${comic.author}`;
      
      if (!comicKeys.has(key)) {
        comicKeys.add(key);
        uniqueComics.push(comic);
      }
    }

    // Enregistrer les IDs des comics valides pour référence
    const validComicIds = uniqueComics.map(comic => comic.id);
    console.log("IDs de comics valides:", validComicIds);
    
    // 2. Normaliser tous les IDs des comics
    const idMapping = {};
    
    for (const comic of uniqueComics) {
      const newId = slugify(comic.title);
      if (comic.id !== newId) {
        console.log(`Comic ID modifié: ${comic.id} -> ${newId}`);
        idMapping[comic.id] = newId;
        comic.id = newId;
      }
    }
    
    // 3. Compter les chapitres par comic avant correction
    const chaptersByComicBefore = {};
    for (const chapter of chapters) {
      chaptersByComicBefore[chapter.comic_id] = (chaptersByComicBefore[chapter.comic_id] || 0) + 1;
    }
    console.log("Chapitres par comic avant:", chaptersByComicBefore);
    
    // 4. Mettre à jour les IDs dans chapters.json
    const updatedChapters = [];
    
    for (const chapter of chapters) {
      // Mettre à jour le comic_id si nécessaire
      if (idMapping[chapter.comic_id]) {
        console.log(`Chapitre ${chapter.id}: comic_id ${chapter.comic_id} -> ${idMapping[chapter.comic_id]}`);
        chapter.comic_id = idMapping[chapter.comic_id];
        
        // Mettre à jour l'ID du chapitre également
        const oldChapterId = chapter.id;
        chapter.id = `${chapter.comic_id}-chapter-${chapter.chapter_number}`;
        console.log(`  ID chapitre mis à jour: ${oldChapterId} -> ${chapter.id}`);
      }
      
      // Vérification supplémentaire: forcer l'ID au bon format si nécessaire
      if (!chapter.id.startsWith(chapter.comic_id)) {
        const oldChapterId = chapter.id;
        chapter.id = `${chapter.comic_id}-chapter-${chapter.chapter_number}`;
        console.log(`  Correction forcée de l'ID chapitre: ${oldChapterId} -> ${chapter.id}`);
      }
      
      // Vérifier que le comic_id existe dans la liste des comics
      if (validComicIds.includes(chapter.comic_id)) {
        updatedChapters.push(chapter);
      } else {
        console.log(`❌ Chapitre supprimé (comic_id inexistant): ${chapter.id} (${chapter.comic_id})`);
        console.log(`  IDs comics disponibles: ${validComicIds.join(', ')}`);
      }
    }
    
    // 5. Compter les chapitres par comic après correction
    const chaptersByComicAfter = {};
    for (const chapter of updatedChapters) {
      chaptersByComicAfter[chapter.comic_id] = (chaptersByComicAfter[chapter.comic_id] || 0) + 1;
    }
    console.log("Chapitres par comic après:", chaptersByComicAfter);
    
    console.log(`Comics après: ${uniqueComics.length}`);
    console.log(`Chapitres après: ${updatedChapters.length}`);
    
    // 6. Vérification finale: Pour chaque comic, s'assurer qu'il a des chapitres
    for (const comic of uniqueComics) {
      const chapterCount = updatedChapters.filter(ch => ch.comic_id === comic.id).length;
      console.log(`Comic "${comic.title}" (${comic.id}): ${chapterCount} chapitres`);
    }
    
    // Sauvegarder les fichiers mis à jour
    fs.writeFileSync(comicsFilePath, JSON.stringify(uniqueComics, null, 2));
    fs.writeFileSync(chaptersFilePath, JSON.stringify(updatedChapters, null, 2));
    
    console.log('Fix terminé avec succès !');
  } catch (err) {
    console.error('Erreur lors de la correction des IDs:', err);
  }
}

// Exécuter la fonction
fixIds().catch(console.error); 