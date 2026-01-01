import logger from "@/config/logger";
import { generateCode, timeToMinute } from "@/utils/common";
import { RestaurantDocType, RestaurantImageType } from "prisma/generated/enums";
import prisma from './../config/prisma';


type RestaurantDetailsInput = {
  name: string;
  ownerId: number;
  address: string;
  landmark?: string;
  countryId: number;
  stateId: number;
  cityId: number;
  pincode: string;
  categoryId: number;
  description?: string;
  voiceNoteDirection?: string;
  workingDays: number[];
  openTiming: string[];
  closeTiming: string[];
}

type RestaurantImagesImput = {
  restaurantId: number;
  imageType: RestaurantImageType;
  path: string;
};


type RestaurantDocsInput = {
  restaurantId: number;
  docType: RestaurantDocType;
  path: string;
}

type RestaurantMenuInput = {
  restaurantId: number;
  foodCategoryId: number;
  name: string;
  price: number;
  servingSize?: string;
  dieteryTag: string;
  description?: string;
}

class RestaurantService {
  /**
   * Update the form step number for a given user ID
   * @param {number} userId - The user ID to update the form step number for
   * @param {number} stepNumber - The new form step number to set
   * @returns {Promise<boolean>} True if the form step number was updated successfully
   * @throws {Error} If an error occurs while updating the form step number
   */
  async updateFormStepNumber(userId: number, stepNumber: number) {
    try {
      logger.debug(`Updating form step number for user ID: ${userId} to ${stepNumber}`);
      const stepUpdate = await prisma.user.update({
        where: { id: userId },
        data: { formStepCompleted: stepNumber }
      });

      if (!stepUpdate) {
        logger.error('Form step number not updated');
        throw new Error('Form step number not updated');
      }

      return true;
    } catch (err: any) {
      logger.error('Error updating form step number:', err);
      throw new Error('An error occurred while updating form step number: ' + err.message);
    }
  }

  /**
   * Saves the details of a restaurant
   * @param {RestaurantDetailsInput} input - The input containing the details of the restaurant to save
   * @returns {Promise<Restaurant>} The newly created restaurant object
   * @throws {Error} If an error occurs while saving the restaurant details
   */
  async saveDetailsInfo(input: RestaurantDetailsInput) {
    try {
      const {
        name,
        ownerId,
        address,
        landmark,
        countryId,
        stateId,
        cityId,
        pincode,
        categoryId,
        description,
        voiceNoteDirection,
        workingDays,
        openTiming,
        closeTiming,
      } = input;

      if (
        workingDays.length !== openTiming.length ||
        workingDays.length !== closeTiming.length
      ) {
        logger.error('Working days and timings length mismatch');
        throw new Error("Working days and timings length mismatch");
      }

      const code = await generateCode('RESTAURANT');

      // creating new restaurant
      const newRestaurant = await prisma.restaurant.create({
        data: {
          ownerId,
          name,
          code,
          address,
          landmark,
          countryId,
          stateId,
          cityId,
          pincode,
          categoryId,
          description,
          voiceNoteDirection,
        },
      });

      if (!newRestaurant) {
        logger.error('Restaurant not created');
        throw new Error('Restaurant not created');
      }

      const restaurantId = newRestaurant.id;

      const saveResposneTiming = await prisma.restaurantTiming.createMany({
        data: workingDays.map((day, index) => ({
          restaurantId,
          workingDayId: day,
          openMinute: timeToMinute(openTiming[index]),
          closeMinute: timeToMinute(closeTiming[index]),
        })),
      });

      if (!saveResposneTiming) {
        logger.error('Restaurant timings not saved');
        throw new Error('Restaurant timings not saved');
      }

      return newRestaurant;
    } catch (error: any) {
      logger.error(`Error to register restaurant:${error}`);
      throw new Error(`An error occurred while saving restaurant details: ${error.message}`);
    }
  }


  async saveRestaurantImages(input: RestaurantImagesImput) {
    try {
      const { restaurantId, imageType, path } = input;

      const saveResponse = await prisma.restaurantImage.create({
        data: {
          restaurantId,
          imageType,
          path,
        },
      });

      if (!saveResponse) {
        logger.error('Restaurant image not saved');
        throw new Error('Restaurant image not saved');
      }

      return saveResponse;
    } catch (error: any) {
      logger.error(`Error to register restaurant:${error}`);
      throw new Error(`An error occurred while saving restaurant image: ${error.message}`);
    }
  }

  async saveRestaurantDocs(input: RestaurantDocsInput) {
    try {
      const { restaurantId, docType, path } = input;

      const saveResponse = await prisma.restaurantDoc.create({
        data: {
          restaurantId,
          docType,
          path,
        },
      });

      if (!saveResponse) {
        logger.error('Restaurant image not saved');
        throw new Error('Restaurant image not saved');
      }

      return saveResponse;
    } catch (error: any) {
      logger.error(`Error to register restaurant:${error}`);
      throw new Error(`An error occurred while saving restaurant docs: ${error.message}`);
    }
  }
}

export default new RestaurantService();