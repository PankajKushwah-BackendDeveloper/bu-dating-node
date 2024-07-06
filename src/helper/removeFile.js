import fs from 'fs'

export const deleteFile = async (filePath) => {
    try {
        if (filePath) {
            await fs.promises.unlink(filePath);
        }
    } catch (error) {
        if (error.code === 'ENOENT') {
            // console.log(`File not found: ${filePath}`);
            return;
        }
        console.error(`Error deleting file ${filePath}:`, error);
    }
};
