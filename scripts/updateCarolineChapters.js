// Script pour mettre à jour les chapitres de Caroline
const fs = require('fs');
const path = require('path');

// Fonction pour générer des URLs de pages
function generatePageUrls(baseUrl, filenamePattern, startPage, endPage) {
  const pages = [];
  
  for (let pageNumber = startPage; pageNumber <= endPage; pageNumber++) {
    // Formater le numéro de page avec des zéros en préfixe si nécessaire
    const formattedPageNumber = String(pageNumber).padStart(3, '0');
    
    // Construire l'URL de l'image en remplaçant {n} par le numéro de page formaté
    const imageUrl = baseUrl + '/' + filenamePattern.replace('{n}', formattedPageNumber);
    
    // Ajouter la page au tableau
    pages.push({
      page_number: pageNumber,
      image_url: imageUrl
    });
  }
  
  return pages;
}

// Définition des chapitres de Caroline
const carolineChapters = [
  {
    chapter_number: 1,
    title: "Chapitre 1",
    baseUrl: "https://res.cloudinary.com/dh8f5kqra/image/upload/v1746236406/mesBD/Categorie/3D/CrazyDad3D%20Caroline/Chapitre%2001",
    filenamePattern: "01-{n}.jpg",
    totalPages: 152
  },
  {
    chapter_number: 2,
    title: "Chapitre 2",
    baseUrl: "https://res.cloudinary.com/dh8f5kqra/image/upload/v1746236406/mesBD/Categorie/3D/CrazyDad3D%20Caroline/Chapitre%2002",
    filenamePattern: "02-{n}.jpg",
    totalPages: 158
  }
];

// Chemin vers le fichier JSON des chapitres
const chaptersFilePath = path.join(process.cwd(), 'src', 'app', 'data', 'chapters.json');

// Fonction principale pour mettre à jour les chapitres
async function updateCarolineChapters() {
  try {
    // Lire le fichier JSON existant
    const chaptersData = fs.readFileSync(chaptersFilePath, 'utf8');
    const chapters = JSON.parse(chaptersData);
    
    let chaptersModified = false;
    
    // Mettre à jour ou ajouter chaque chapitre de Caroline
    for (const chapterInfo of carolineChapters) {
      const existingChapter = chapters.find(
        c => c.comic_id === 'caroline' && c.chapter_number === chapterInfo.chapter_number
      );
      
      if (existingChapter) {
        // Mettre à jour un chapitre existant avec toutes les pages
        console.log(`Mise à jour du chapitre ${chapterInfo.chapter_number} de Caroline...`);
        existingChapter.pages = generatePageUrls(
          chapterInfo.baseUrl,
          chapterInfo.filenamePattern,
          1,
          chapterInfo.totalPages
        );
        chaptersModified = true;
      } else {
        // Créer un nouveau chapitre
        console.log(`Ajout du chapitre ${chapterInfo.chapter_number} de Caroline...`);
        
        // Générer un identifiant unique
        const newId = `caroline-chapter-${chapterInfo.chapter_number}`;
        
        // Générer les pages pour ce chapitre
        const pages = generatePageUrls(
          chapterInfo.baseUrl,
          chapterInfo.filenamePattern,
          1,
          chapterInfo.totalPages
        );
        
        // Créer le nouvel objet chapitre
        const newChapter = {
          id: newId,
          comic_id: 'caroline',
          chapter_number: chapterInfo.chapter_number,
          title: chapterInfo.title,
          created_at: new Date().toISOString(),
          is_protected: false,
          is_pdf: false,
          pdf_url: null,
          pages: pages
        };
        
        // Ajouter le nouveau chapitre à la liste
        chapters.push(newChapter);
        chaptersModified = true;
      }
    }
    
    // Enregistrer les modifications si nécessaire
    if (chaptersModified) {
      fs.writeFileSync(chaptersFilePath, JSON.stringify(chapters, null, 2));
      console.log('Fichier chapters.json mis à jour avec succès.');
    } else {
      console.log('Aucune modification n\'a été apportée au fichier chapters.json.');
    }
    
  } catch (error) {
    console.error('Erreur lors de la mise à jour des chapitres:', error);
  }
}

// Exécuter la fonction
updateCarolineChapters()
  .then(() => console.log('Traitement terminé.'))
  .catch(error => console.error('Erreur pendant l\'exécution:', error)); 