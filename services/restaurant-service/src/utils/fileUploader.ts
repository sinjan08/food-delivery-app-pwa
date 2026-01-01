import dayjs from "dayjs";
import { Request } from "express";
import fs from "fs";
import multer, { FileFilterCallback } from "multer";
import { nanoid } from "nanoid";
import path from "path";


/* ---------------------------------------------
   TYPES
--------------------------------------------- */
type MulterOptions = {
  folder?: string;                     // upload folder
  maxSizeMB?: number;                  // file size limit
  allowedMimeTypes?: string[];         // allowed mimetypes
  prefix?: string;                     // filename prefix
};

/* ---------------------------------------------
   DEFAULTS
--------------------------------------------- */
const DEFAULT_MAX_SIZE = 5; // MB
const DEFAULT_MIME = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "application/pdf",
  "audio/mpeg",
  "video/mp4",
];

/* ---------------------------------------------
   ENSURE DIRECTORY EXISTS
--------------------------------------------- */
const ensureDir = (dir: string) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

/* ---------------------------------------------
   FILE FILTER
--------------------------------------------- */
const fileFilter =
  (allowedMimeTypes: string[]) =>
    (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
      if (!allowedMimeTypes.includes(file.mimetype)) {
        return cb(new Error(`Invalid file type: ${file.mimetype}`));
      }
      cb(null, true);
    };

/* ---------------------------------------------
   STORAGE ENGINE
--------------------------------------------- */
const storageEngine = (baseFolder: string, prefix?: string) =>
  multer.diskStorage({
    destination: (req, file, cb) => {
      /**
       * Expecting:
       * req.uploadPath = "restaurant/<code>/images"
       */
      const dynamicPath = (req as any).uploadPath;

      if (!dynamicPath) {
        return cb(new Error("Upload path not defined"), "");
      }

      const uploadPath = path.join("uploads", baseFolder, dynamicPath);
      ensureDir(uploadPath);
      cb(null, uploadPath);
    },

    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname).toLowerCase();

      const uniqueName = [
        dayjs().format("YYYYMMDD-HHmmss"),
        nanoid(10),
      ].join("-");

      cb(null, `${uniqueName}${ext}`);
    },

  });


/* ---------------------------------------------
   MAIN UPLOADER FACTORY
--------------------------------------------- */
export const createUploader = ({
  folder = "",
  maxSizeMB = DEFAULT_MAX_SIZE,
  allowedMimeTypes = DEFAULT_MIME,
  prefix,
}: MulterOptions = {}) =>
  multer({
    storage: storageEngine(folder, prefix),
    limits: { fileSize: maxSizeMB * 1024 * 1024 },
    fileFilter: fileFilter(allowedMimeTypes),
  });

