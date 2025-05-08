import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export async function GET() {
  try {
    // Chemin vers le fichier JSON
    const comicsFilePath = path.join(process.cwd(), 'src/app/data/comics.json');
    
    // Lire le contenu du fichier
    const comicsJsonData = await fs.readFile(comicsFilePath, 'utf8');
    
    // Parser le contenu en JSON
    const comics = JSON.parse(comicsJsonData);
    
    // Retourner les données au format JSON
    return NextResponse.json(comics);
  } catch (error) {
    console.error('Error loading comics data:', error);
    return NextResponse.json(
      { error: 'Failed to load comics data' },
      { status: 500 }
    );
  }
} 