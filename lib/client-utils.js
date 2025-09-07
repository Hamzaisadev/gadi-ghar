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

// Upload logo to Supabase storage
export async function uploadLogo(file, folderPath = 'dealership-logos') {
  try {
    // Convert file to base64
    const base64 = await fileToBase64(file);
    const base64Data = base64.split(',')[1];
    
    // Get file extension
    const mimeMatch = base64.match(/data:image\/([a-zA-Z0-9]+);/);
    const fileExtension = mimeMatch ? mimeMatch[1] : 'jpeg';
    
    // Generate unique filename
    const filename = `logo-${Date.now()}.${fileExtension}`;
    let filePath = `${folderPath}/${filename}`;
    
    // Import Supabase client dynamically
    const { createClient } = await import('@supabase/supabase-js');
    
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );
    
    // Convert base64 to blob
    const response = await fetch(base64);
    const blob = await response.blob();
    
    // Upload to Supabase storage
    const { data, error } = await supabase.storage
      .from('dealership-logos')
      .upload(filePath, blob, {
        contentType: `image/${fileExtension}`,
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
