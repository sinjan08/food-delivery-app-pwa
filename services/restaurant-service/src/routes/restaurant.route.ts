import {
  registerRestaurant,
  saveRestaurantDetails,
  uploadRestaurantDocs,
  uploadRestaurantImages,
} from '@/controller/restaurant.controller';
import { docUploader, imageUploader } from '@/middleware/docUpload.middileware';
import validate from '@/middleware/validate.middleware';
import { registerSchema, restaurantDetailsSchema } from '@/schemas/restaurant.schemas';
import { createUploader } from '@/utils/fileUploader';
import { Router } from 'express';

const router = Router();

// Single reusable uploader (disk, dayjs + nanoid handled inside)
const uploader = createUploader();

// register and save details
router.post('/create', validate(registerSchema), registerRestaurant);
router.post('/save/details', validate(restaurantDetailsSchema), saveRestaurantDetails);

// upload restaurant images (MULTIPLE)
router.post(
  '/upload/images',
  imageUploader,                    // sets uploadPath
  uploader.array('images', 10),     // multiple files
  uploadRestaurantImages
);

// upload restaurant documents (SINGLE)
router.post(
  '/upload/doc',
  docUploader,                      // sets uploadPath
  uploader.single('doc'),           // ✅ single file
  uploadRestaurantDocs
);

export default router;
