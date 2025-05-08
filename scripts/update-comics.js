const fs = require('fs');
const path = require('path');

try {
  // Load the images data
  console.log('Loading data files...');
  const imagesDataPath = path.join(__dirname, '../images_telechargees.json');
  const comicsDataPath = path.join(__dirname, '../src/app/data/comics.json');
  const chaptersDataPath = path.join(__dirname, '../src/app/data/chapters.json');

  if (!fs.existsSync(imagesDataPath)) {
    throw new Error(`Images data file not found: ${imagesDataPath}`);
  }
  if (!fs.existsSync(comicsDataPath)) {
    throw new Error(`Comics data file not found: ${comicsDataPath}`);
  }
  if (!fs.existsSync(chaptersDataPath)) {
    throw new Error(`Chapters data file not found: ${chaptersDataPath}`);
  }

  const imagesData = require(imagesDataPath);
  const comicsData = require(comicsDataPath);
  const chaptersData = require(chaptersDataPath);

  console.log(`Loaded ${imagesData.length} images, ${comicsData.length} comics, ${chaptersData.length} chapters`);

  // Map to store unique comics and their chapters
  const comicsMap = new Map();

  // Process the images data to identify unique comics and their chapters
  console.log('Processing images data...');
  imagesData.forEach((image, index) => {
    // Extract comic and chapter info from the path
    const pathParts = image.chemin.split('\\');
    if (pathParts.length >= 3) {
      const category = pathParts[0];
      const comicFullName = pathParts[1];
      const chapterFolder = pathParts[2];
      
      // Extract author and title more carefully
      // Format is typically "Author Title" but we need to be careful with spaces
      const firstSpaceIndex = comicFullName.indexOf(' ');
      if (firstSpaceIndex === -1) {
        console.log(`Skipping invalid comic name: ${comicFullName}`);
        return;
      }
      
      const author = comicFullName.substring(0, firstSpaceIndex);
      const title = comicFullName.substring(firstSpaceIndex + 1);
      
      if (!title) {
        console.log(`Skipping comic with empty title: ${comicFullName}`);
        return;
      }
      
      // Create a slug for the comic ID - only use alphanumeric and hyphens
      const comicId = title.toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')  // Replace non-alphanumeric with hyphens
        .replace(/^-+|-+$/g, '')      // Remove leading/trailing hyphens
        .replace(/-+/g, '-');         // Replace multiple hyphens with single hyphen
      
      // Extract chapter number
      const chapterMatch = chapterFolder.match(/Chapitre\s+(\d+)/i);
      const chapterNumber = chapterMatch ? parseInt(chapterMatch[1], 10) : 0;
      
      if (chapterNumber === 0) {
        console.log(`Warning: Could not extract chapter number from ${chapterFolder}`);
      }
      
      if (!comicsMap.has(comicId)) {
        comicsMap.set(comicId, {
          id: comicId,
          title,
          author,
          categories: [category],
          description: `L'histoire captivante de ${title}`,
          cover_image: '', // Will be filled with the first image of the first chapter
          created_at: new Date().toISOString().split('T')[0],
          chapters: new Map()
        });
      }
      
      const comic = comicsMap.get(comicId);
      
      // Only use the first image as cover if not set yet
      if (!comic.cover_image && image.url) {
        comic.cover_image = image.url;
      }
      
      // Add chapter if not exists
      if (!comic.chapters.has(chapterNumber)) {
        const chapterId = `${comicId}-chapter-${chapterNumber}`;
        comic.chapters.set(chapterNumber, {
          id: chapterId,
          comic_id: comicId,
          chapter_number: chapterNumber,
          title: `Chapitre ${chapterNumber}`,
          created_at: new Date().toISOString().split('T')[0],
          is_protected: false,
          is_pdf: false,
          pdf_url: null,
          pages: []
        });
      }
      
      // Extract page number from the image filename using various potential formats
      let pageNumber = null;
      
      // Format pattern 1: "01-001.jpg", "02-015.jpg" - chapter-page
      const pattern1 = /(\d+)-(\d+)\.jpg/;
      // Format pattern 2: "001.jpg", "015.jpg" - just page number
      const pattern2 = /^(\d+)\.jpg$/;
      // Format pattern 3: "02 -001.jpg" - space after chapter
      const pattern3 = /(\d+)\s+-(\d+)\.jpg/;
      // Format pattern 4: "9Cloud.us_0001-0053 P 2 01.jpg" - more complex format
      const pattern4 = /.*?(\d+)\.jpg$/;
      
      const imageNameMatch1 = image.nom.match(pattern1);
      const imageNameMatch2 = image.nom.match(pattern2);
      const imageNameMatch3 = image.nom.match(pattern3);
      const imageNameMatch4 = image.nom.match(pattern4);
      
      if (imageNameMatch1 && imageNameMatch1.length >= 3) {
        pageNumber = parseInt(imageNameMatch1[2], 10);
      } else if (imageNameMatch2 && imageNameMatch2.length >= 2) {
        pageNumber = parseInt(imageNameMatch2[1], 10);
      } else if (imageNameMatch3 && imageNameMatch3.length >= 3) {
        pageNumber = parseInt(imageNameMatch3[2], 10);
      } else if (imageNameMatch4 && imageNameMatch4.length >= 2) {
        pageNumber = parseInt(imageNameMatch4[1], 10);
        // Fallback: if we can't determine the page number, use the image index + 1
        if (isNaN(pageNumber) || pageNumber === 0) {
          pageNumber = index + 1;
        }
      } else {
        // If we can't determine the page number, use the image index + 1
        pageNumber = index + 1;
        console.log(`Using index for page number for ${image.nom}: ${pageNumber}`);
      }
      
      // If we have a valid page number, add the page to the chapter
      if (pageNumber > 0) {
        const chapter = comic.chapters.get(chapterNumber);
        
        // Check if this page already exists to avoid duplicates
        const existingPage = chapter.pages.find(p => p.page_number === pageNumber);
        if (!existingPage) {
          chapter.pages.push({
            page_number: pageNumber,
            image_url: image.url
          });
        }
      } else {
        console.log(`Warning: Invalid page number ${pageNumber} for ${image.nom}`);
      }
    }
  });

  console.log(`Processed ${comicsMap.size} comics from images data`);
  
  // Print found comics for debugging
  comicsMap.forEach((comic, id) => {
    console.log(`Found comic: ${id} (${comic.title}) by ${comic.author} with ${comic.chapters.size} chapters`);
    comic.chapters.forEach((chapter, num) => {
      console.log(`  Chapter ${num}: ${chapter.pages.length} pages`);
    });
  });

  // Convert the Maps to arrays and sort the pages by page number
  const newComics = [];
  const newChapters = [];

  comicsMap.forEach(comic => {
    // Skip comics that already exist in comicsData
    const existingComic = comicsData.find(c => c.id === comic.id);
    
    // Only process comics with actual pages
    let hasPages = false;
    comic.chapters.forEach(chapter => {
      if (chapter.pages.length > 0) {
        hasPages = true;
      }
    });
    
    if (!hasPages) {
      console.log(`Skipping comic without pages: ${comic.id}`);
      return;
    }
    
    if (!existingComic) {
      console.log(`Adding new comic: ${comic.id}`);
      // Add the comic to the new comics array
      const { chapters, ...comicInfo } = comic;
      newComics.push(comicInfo);
      
      // Add the chapters to the new chapters array
      comic.chapters.forEach(chapter => {
        if (chapter.pages.length > 0) {
          // Sort pages by page number
          chapter.pages.sort((a, b) => a.page_number - b.page_number);
          newChapters.push(chapter);
        } else {
          console.log(`  Skipping empty chapter ${chapter.chapter_number}`);
        }
      });
    } else {
      console.log(`Comic already exists: ${comic.id}`);
      // Check for new chapters for existing comics
      comic.chapters.forEach((chapter, chapterNumber) => {
        const existingChapter = chaptersData.find(
          c => c.comic_id === comic.id && c.chapter_number === chapterNumber
        );
        
        if (!existingChapter) {
          if (chapter.pages.length > 0) {
            console.log(`Adding new chapter ${chapterNumber} for comic ${comic.id}`);
            // Sort pages by page number
            chapter.pages.sort((a, b) => a.page_number - b.page_number);
            newChapters.push(chapter);
          } else {
            console.log(`  Skipping empty chapter ${chapterNumber}`);
          }
        } else {
          console.log(`Chapter ${chapterNumber} already exists for comic ${comic.id}`);
        }
      });
    }
  });

  if (newComics.length > 0 || newChapters.length > 0) {
    console.log(`Found ${newComics.length} new comics and ${newChapters.length} new chapters`);
    
    // Update comics.json with new comics
    if (newComics.length > 0) {
      const updatedComics = [...comicsData, ...newComics];
      fs.writeFileSync(
        comicsDataPath,
        JSON.stringify(updatedComics, null, 2),
        'utf8'
      );
      console.log('Updated comics.json successfully!');
    }
    
    // Update chapters.json with new chapters
    if (newChapters.length > 0) {
      const updatedChapters = [...chaptersData, ...newChapters];
      fs.writeFileSync(
        chaptersDataPath,
        JSON.stringify(updatedChapters, null, 2),
        'utf8'
      );
      console.log('Updated chapters.json successfully!');
    }
  } else {
    console.log('No new comics or chapters found.');
  }
} catch (error) {
  console.error('Error:', error.message);
  console.error(error.stack);
} 