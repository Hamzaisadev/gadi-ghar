// Client-side utility functions for logo handling

// Convert file to base64
export function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

// Upload logo to Supabase storage (CSP-safe: no fetch to data: URLs)
export async function uploadLogo(file, folderPath = 'dealership-logos') {
  try {
    // Determine source blob and content type
    let blob;
    let contentType;

    if (typeof file === 'string' && file.startsWith('data:image/')) {
      // Handle base64 data URL without using fetch (avoids connect-src CSP)
      const [meta, base64Data] = file.split(',');
      const match = meta.match(/data:(.*?);/);
      contentType = match ? match[1] : 'image/jpeg';
      const byteChars = atob(base64Data);
      const byteNumbers = new Array(byteChars.length);
      for (let i = 0; i < byteChars.length; i++) {
        byteNumbers[i] = byteChars.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      blob = new Blob([byteArray], { type: contentType });
    } else if (file instanceof Blob) {
      // File or Blob from an <input type="file" />
      blob = file;
      contentType = file.type || 'image/jpeg';
    } else {
      throw new Error('Invalid logo input: expected File/Blob or data URL string');
    }

    // Derive file extension
    const extFromType = (contentType.split('/')[1] || 'jpeg').toLowerCase();

    // Generate unique filename
    const filename = `logo-${Date.now()}.${extFromType}`;
    const filePath = `${folderPath}/${filename}`;

    // Import Supabase client dynamically
    const { createClient } = await import('@supabase/supabase-js');

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );

    // Upload to Supabase storage
    const { error } = await supabase.storage
      .from('dealership-logos')
      .upload(filePath, blob, {
        contentType,
        upsert: false,
      });

    if (error) {
      throw new Error(`Error uploading logo: ${error.message}`);
    }

    // Return public URL
    return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/dealership-logos/${filePath}`;
  } catch (error) {
    console.error('Error uploading logo:', error);
    throw error;
  }
}
