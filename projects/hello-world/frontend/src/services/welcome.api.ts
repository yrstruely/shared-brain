export interface WelcomeResponse {
  message: string;
}

export async function fetchWelcomeMessage(): Promise<WelcomeResponse> {
  const response = await fetch('/api/welcome');
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
}
