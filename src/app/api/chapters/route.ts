import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

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

export async function GET() {
  try {
    // Chemin vers le fichier JSON
    const chaptersFilePath = path.join(process.cwd(), 'src/app/data/chapters.json');
    
    // Lire le contenu du fichier
    const chaptersJsonData = await fs.readFile(chaptersFilePath, 'utf8');
    
    // Parser le contenu en JSON
    const chapters = JSON.parse(chaptersJsonData) as Chapter[];
    
    // Log pour le débogage
    console.log(`API: Chapitres chargés: ${chapters.length}`);
    console.log(`API: IDs des chapitres: ${chapters.slice(0, 3).map(ch => ch.id).join(', ')}...`);
    
    // Afficher les comics_id uniques
    const comicIds = [...new Set(chapters.map(ch => ch.comic_id))];
    console.log(`API: Comics IDs uniques: ${comicIds.join(', ')}`);
    
    // Retourner les données au format JSON
    return NextResponse.json(chapters);
  } catch (error) {
    console.error('Error loading chapters data:', error);
    return NextResponse.json(
      { error: 'Failed to load chapters data' },
      { status: 500 }
    );
  }
} 