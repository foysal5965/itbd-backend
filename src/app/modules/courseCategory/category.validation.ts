import { z } from "zod";
const createCategoryValidation= z.object({
    categoryName: z.string({required_error:'category name required??'})
})

export const courseCategoryValidation={
    createCategoryValidation
}