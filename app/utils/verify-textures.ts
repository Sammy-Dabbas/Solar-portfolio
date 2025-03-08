"use client"

export async function verifyTextures() {
  const texturePaths = [
    "https://tm2whnkyymobwcvl.public.blob.vercel-storage.com/textures/Terrestrial3-NvvxkCTeFKfOSwvMgb9Pjgzv0CMiZ4.png",
    "https://tm2whnkyymobwcvl.public.blob.vercel-storage.com/textures/Terrestrial3-NvvxkCTeFKfOSwvMgb9Pjgzv0CMiZ4.png",
    "https://tm2whnkyymobwcvl.public.blob.vercel-storage.com/textures/Terrestrial3-NvvxkCTeFKfOSwvMgb9Pjgzv0CMiZ4.png",
    "https://tm2whnkyymobwcvl.public.blob.vercel-storage.com/textures/Terrestrial3-NvvxkCTeFKfOSwvMgb9Pjgzv0CMiZ4.png",
    "https://tm2whnkyymobwcvl.public.blob.vercel-storage.com/textures/Terrestrial3-NvvxkCTeFKfOSwvMgb9Pjgzv0CMiZ4.png",
    "https://tm2whnkyymobwcvl.public.blob.vercel-storage.com/textures/Terrestrial3-NvvxkCTeFKfOSwvMgb9Pjgzv0CMiZ4.png",
  ]

  for (const path of texturePaths) {
    try {
      const response = await fetch(path)
      if (!response.ok) {
        console.error(`Texture not found: ${path}`)
      } else {
        console.log(`Texture verified: ${path}`)
      }
    } catch (error) {
      console.error(`Error checking texture ${path}:`, error)
    }
  }
}

