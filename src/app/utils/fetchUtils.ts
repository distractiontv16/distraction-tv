/**
 * Utilitaire pour générer l'URL de base de l'API
 * Gère correctement les environnements de développement, staging et production
 */
export function getApiBaseUrl(): string {
  // En environnement client (navigateur)
  if (typeof window !== 'undefined') {
    return `${window.location.origin}/api`;
  }
  
  // Pour Vercel
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}/api`;
  }
  
  // Pour les environnements de développement avec une URL personnalisée
  if (process.env.NEXT_PUBLIC_API_URL) {
    return `${process.env.NEXT_PUBLIC_API_URL}/api`;
  }
  
  // Fallback pour le développement local
  return 'http://localhost:3000/api';
}

/**
 * Récupérer les données de l'API avec gestion d'erreur
 * @param endpoint - Le point de terminaison de l'API sans le /api prefix
 * @param options - Options fetch supplémentaires
 */
export async function fetchApi<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const apiUrl = getApiBaseUrl();
  const url = `${apiUrl}/${endpoint}`;
  
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(options?.headers || {})
      }
    });
    
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Error fetching ${url}:`, error);
    throw error;
  }
} 