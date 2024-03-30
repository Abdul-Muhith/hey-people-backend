import { Types } from "mongoose";

const validateMogodbId = (id) => { 
    const isValid = Types.ObjectId.isValid(id);

    if (!isValid) { 
        throw new Error("This ID is not a valid or Not Found");
    };
};

export default validateMogodbId;