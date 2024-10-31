import { z } from "zod";
const createCategoryValidation= z.object({
    categoryName: z.string({required_error:'category name required??'})
})
const updateCategoryValidation= z.object({
    categoryName: z.string().optional()
})

export const courseCategoryValidation={
    createCategoryValidation,
    updateCategoryValidation
}