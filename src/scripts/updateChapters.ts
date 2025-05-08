import * as fs from 'fs';
import * as path from 'path';
import { generateChapterPages } from '../app/utils/comicUtils';

// Type pour un chapitre
interface Chapter {
  id: string;
  comic_id: string;
  chapter_number: number;
  title: string;
  created_at: string;
  is_protected: boolean;
  is_pdf: boolean;
  pdf_url: string | null;
  pages: Array<{ page_number: number; image_url: string }>;
}

// Chemins des fichiers
const chaptersFilePath = path.join(__dirname, '../app/data/chapters.json');

// Lire le fichier chapters.json existant
const chapters: Chapter[] = JSON.parse(fs.readFileSync(chaptersFilePath, 'utf8'));

// Trouver le chapitre Caroline chapitre 1
const carolineChapter = chapters.find((chapter: Chapter) => chapter.id === 'caroline-ch1');

if (carolineChapter) {
  // Générer toutes les pages du chapitre
  const baseUrl = 'https://res.cloudinary.com/dh8f5kqra/image/upload/v1746236406/mesBD/Categorie/3D/CrazyDad3D%20Caroline/Chapitre%2001';
  
  carolineChapter.pages = generateChapterPages(
    baseUrl,
    '01-',
    1,
    152 // Nombre total de pages
  );
  
  // Écrire le fichier mis à jour
  fs.writeFileSync(chaptersFilePath, JSON.stringify(chapters, null, 2));
  console.log('Chapitre Caroline mis à jour avec succès !');
} else {
  console.error('Chapitre Caroline introuvable dans le fichier chapters.json');
}

// Ajouter un deuxième chapitre Caroline
if (!chapters.find((chapter: Chapter) => chapter.id === 'caroline-ch2')) {
  const carolineChapter2: Chapter = {
    "id": "caroline-ch2",
    "comic_id": "caroline",
    "chapter_number": 2,
    "title": "Chapitre 2",
    "created_at": "2025-05-10",
    "is_protected": false,
    "is_pdf": true,
    "pdf_url": "https://online.pubhtml5.com/exemple/exemple/",
    "pages": []
  };
  
  chapters.push(carolineChapter2);
  
  // Écrire le fichier mis à jour
  fs.writeFileSync(chaptersFilePath, JSON.stringify(chapters, null, 2));
  console.log('Chapitre 2 de Caroline ajouté avec succès !');
}

console.log('Mise à jour des chapitres terminée !'); 