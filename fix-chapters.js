const fs = require('fs');
const path = require('path');

// Chemin vers le fichier JSON
const chaptersFilePath = path.join(process.cwd(), 'src/app/data/chapters.json');
const comicsFilePath = path.join(process.cwd(), 'src/app/data/comics.json');

// Lire le contenu des fichiers
try {
  const chaptersData = fs.readFileSync(chaptersFilePath, 'utf8');
  const comicsData = fs.readFileSync(comicsFilePath, 'utf8');
  
  // Parser les JSON
  const chapters = JSON.parse(chaptersData);
  const comics = JSON.parse(comicsData);
  
  // Obtenir les IDs valides
  const validComicIds = comics.map(c => c.id);
  console.log('IDs valides:', validComicIds.join(', '));
  
  // Trouver les ID non valides dans chapters.json
  const chaptersComicIds = chapters.map(ch => ch.comic_id);
  const uniqueChaptersComicIds = [...new Set(chaptersComicIds)];
  console.log('IDs dans chapters.json:', uniqueChaptersComicIds.join(', '));
  
  // Correction des IDs
  let modified = false;
  chapters.forEach(chapter => {
    if (chapter.comic_id === 'emma-s-corruption') {
      chapter.comic_id = 'emmas-corruption';
      modified = true;
      console.log(`Corrigé: emma-s-corruption -> emmas-corruption dans chapitre ${chapter.id}`);
    }
    
    if (chapter.comic_id === 'daddy--crazy-desire') {
      chapter.comic_id = 'daddy-crazy-desire';
      modified = true;
      console.log(`Corrigé: daddy--crazy-desire -> daddy-crazy-desire dans chapitre ${chapter.id}`);
    }
  });
  
  // Écrire les changements
  if (modified) {
    fs.writeFileSync(chaptersFilePath, JSON.stringify(chapters, null, 2), 'utf8');
    console.log('Fichier chapters.json mis à jour avec succès.');
  } else {
    console.log('Aucune correction nécessaire.');
  }
  
  // Vérification finale
  const invalidIds = chapters.filter(ch => !validComicIds.includes(ch.comic_id)).map(ch => ch.comic_id);
  if (invalidIds.length > 0) {
    console.log('ATTENTION: Il reste des IDs non valides:', [...new Set(invalidIds)].join(', '));
  } else {
    console.log('Tous les IDs de chapitre font référence à des comics valides.');
  }
  
} catch (error) {
  console.error('Erreur:', error.message);
} 