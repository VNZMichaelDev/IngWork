import { createSupabaseBrowserClient } from "./supabase/client";

export interface FileUpload {
  file: File;
  path: string;
}

export interface UploadedFile {
  id: string;
  file_path: string;
  file_name: string;
  project_id: string;
  uploader_id: string;
  created_at: string;
  public_url?: string;
}

export const storageClient = {
  async uploadFile(projectId: string, file: File, userId: string): Promise<{ data: UploadedFile | null; error: any }> {
    try {
      const supabase = createSupabaseBrowserClient();
      
      // Generate unique file path
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `projects/${projectId}/${fileName}`;

      // Upload file to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('project-files')
        .upload(filePath, file);

      if (uploadError) {
        return { data: null, error: uploadError };
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('project-files')
        .getPublicUrl(filePath);

      // Save file metadata to database
      const { data: attachmentData, error: dbError } = await supabase
        .from('attachments')
        .insert({
          project_id: projectId,
          uploader_id: userId,
          file_path: filePath,
          file_name: file.name,
        })
        .select()
        .single();

      if (dbError) {
        // Clean up uploaded file if database insert fails
        await supabase.storage.from('project-files').remove([filePath]);
        return { data: null, error: dbError };
      }

      return {
        data: {
          ...attachmentData,
          public_url: publicUrl,
        },
        error: null,
      };
    } catch (err) {
      return { data: null, error: err };
    }
  },

  async getProjectFiles(projectId: string): Promise<{ data: UploadedFile[]; error: any }> {
    try {
      const supabase = createSupabaseBrowserClient();
      
      const { data, error } = await supabase
        .from('attachments')
        .select(`
          *,
          profiles:uploader_id (
            full_name
          )
        `)
        .eq('project_id', projectId)
        .order('created_at', { ascending: false });

      if (error) {
        return { data: [], error };
      }

      // Add public URLs
      const filesWithUrls = data.map(file => {
        const { data: { publicUrl } } = supabase.storage
          .from('project-files')
          .getPublicUrl(file.file_path);
        
        return {
          ...file,
          public_url: publicUrl,
        };
      });

      return { data: filesWithUrls, error: null };
    } catch (err) {
      return { data: [], error: err };
    }
  },

  async deleteFile(fileId: string, filePath: string): Promise<{ error: any }> {
    try {
      const supabase = createSupabaseBrowserClient();
      
      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from('project-files')
        .remove([filePath]);

      if (storageError) {
        return { error: storageError };
      }

      // Delete from database
      const { error: dbError } = await supabase
        .from('attachments')
        .delete()
        .eq('id', fileId);

      return { error: dbError };
    } catch (err) {
      return { error: err };
    }
  },

  getFileIcon(fileName: string): string {
    const ext = fileName.split('.').pop()?.toLowerCase();
    
    switch (ext) {
      case 'pdf':
        return '📄';
      case 'doc':
      case 'docx':
        return '📝';
      case 'xls':
      case 'xlsx':
        return '📊';
      case 'ppt':
      case 'pptx':
        return '📋';
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
      case 'webp':
        return '🖼️';
      case 'mp4':
      case 'avi':
      case 'mov':
        return '🎥';
      case 'mp3':
      case 'wav':
        return '🎵';
      case 'zip':
      case 'rar':
      case '7z':
        return '📦';
      case 'txt':
        return '📄';
      default:
        return '📎';
    }
  },

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  },
};
