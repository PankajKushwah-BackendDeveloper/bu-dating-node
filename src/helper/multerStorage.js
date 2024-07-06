import multer from 'multer';
import fs from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const FILE_TYPE_MAP = {
    'image/png': 'png',
    'image/jpeg': 'jpeg',
    'image/jpg': 'jpg',
};

const generateStorage = (destination) => {
    if (!fs.existsSync(destination)) {
        fs.mkdirSync(destination, { recursive: true });
    }

    return multer.diskStorage({
        destination: function (req, file, cb) {
            const isValid = FILE_TYPE_MAP[file.mimetype];
            let uploadError = new Error('Invalid Image Type');
            if (isValid) {
                uploadError = null;
            }
            cb(uploadError, destination);
        },
        filename: function (req, file, cb) {
            const date = new Date();
            const year = date.getFullYear();
            const month = (date.getMonth() + 1).toString().padStart(2, '0');
            const day = date.getDate().toString().padStart(2, '0');
            const time = date.getMilliseconds();
            const originalname = file.originalname;
            const fileName = `${time}-${originalname}`;
            cb(null, fileName);
        },
    });
};

export default generateStorage;
