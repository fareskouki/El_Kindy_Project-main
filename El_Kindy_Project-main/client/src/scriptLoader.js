// scriptLoader.js
export async function loadScripts(scripts) {
  try {
    const loadedScripts = await Promise.all(scripts.map(loadScript));
    console.log('All scripts loaded');
    return loadedScripts;
  } catch (error) {
    console.error('Failed to load scripts', error);
    throw error;
  }
}

function loadScript(src) {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = src;
    script.onload = () => resolve(script);
    script.onerror = () => reject(new Error(`Script load error for ${src}`));
    document.head.appendChild(script);
  });
}
