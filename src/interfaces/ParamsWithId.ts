import { ObjectID } from 'bson';
import * as z from 'zod';
export const ParamsWithId = z.object({
    id: z.string().min(1).refine((val) => {
        try {
            return new ObjectID(val);
        } catch (error) {
            return false;
        }
    }, {
        message: 'Invalid Input Id'
    })
})

export type ParamsWithId = z.infer<typeof ParamsWithId>;
