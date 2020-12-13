import multer from 'multer';
import {v1 as uuid} from 'uuid';

const MIME_TYPE_MAP: any = {
    'image/png': 'png',
    'image/jpeg': 'jpeg',
    'image/jpg': 'jpg'
};

export const fileUpload = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb: any) => {
            cb(null, 'uploads/images');
        },
        filename: (req, file, cb) => {
            const ext: string = MIME_TYPE_MAP[file.mimetype];
            cb(null, uuid() + '.' + ext);
        }
    }),
    fileFilter: (req, file, cb) => {
        const isValid = !!MIME_TYPE_MAP[file.mimetype];
        let error: any = isValid ? null : new Error('Invalid mime type!');
        cb(error, isValid);
    }
});


