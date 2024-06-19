import slugify from "slugify"
import categoryModel from "../../../DB/models/category.model.js"
import { catchError } from "../../Middleware/global-response.middleware.js"
import cloudinaryConnection from "../../Utils/cloudinary.js"
import medicineModel from "../../../DB/models/medicine.model.js"
import generateUniqueString from "../../Utils/generate-Unique-String.js"
import { appError } from "../../Utils/app.Error.js"
import { apiFeature } from "../../Service/api_feature.js"



//=================================== Create Medicine Controller ===================================//
/*
    * destruct required data
    * check if found category 
    * generate slug
    * loop images 
    * upload image in cloudinary
    * store data medicine in object 
    * create medicine in bd 

*/
const createMedicineController = catchError(
    async (req, res, next) => {

        // destruct required data
        const {
            name,
            description
        } = req.body
        const { _id } = req.user

        // if not found image 
        if (!req.files?.length) return next(new appError('must be send image', 400))

        // generate slug
        const slug = slugify(name)

        let imagesArr = []

        // unique folderId
        const folderId = generateUniqueString(4) + '__' + `${name}`;

        // loop images 
        for (const file of req.files) {
            // upload image from cloudinary
            const { secure_url, public_id } = await cloudinaryConnection().uploader.upload(
                file.path,
                {
                    folder: `/medicine/${folderId}`
                })
            imagesArr.push({ secure_url, public_id })
        }

        // if error rollback upload file 
        req.folder =  `/medicine/${folderId}`

        const medicineObj = {
            name,
            slug,
            description,
            folderId,
            Images: imagesArr,
            addedBy: _id
        }

        const newMedicine = await medicineModel.create(medicineObj)

        // if error rollback document to remove to db 
        req.document = { model: medicineModel, modelId: newMedicine._id }

        res.json({ success: true, message: "create Medicine successfully", data: newMedicine })
    }
)


//=================================== Update Medicine Controller ===================================//
/* 
    // destruct data 
    // check medicine if found
    // update medicine 
    // if found file 
    // delete old image from cloudinary
    // upload new image
    // replace old image to new image in db
    // save medicine in db 
*/
const updateMedicineController = catchError(
    async (req, res, next) => {
        // destruct data 
        const {
            name,
            description,
            quantity,
            expiryDate,
            categoryId,
            oldPublicId
        } = req.body
        const { id } = req.params
        const { _id } = req.user

        // check medicine if found
        const medicine = await medicineModel.findById(id)
        if (!medicine) return next(new appError('!not found medicine', 401))

        // check if user allowedTo
        if (medicine.addedBy.toString() !== _id.toString()) return next({ cause: 404, message: 'you are not allowedTo' })

        if (name) {
            if (!name) return next(new appError('!not found name you need update', 400))
            medicine.name = name
            medicine.slug = slugify(name)
        }

        if (description) {
            if (!description) return next(new appError('!not found description you need update', 400))
            medicine.description = description
        }

        if (quantity) {
            if (!quantity) return next(new appError('!not found quantity you need update', 400))
            medicine.quantity = quantity
        }

        if (expiryDate) {
            if (!expiryDate) return next(new appError('!not found expiryDate you need update', 400))
            medicine.expiryDate = expiryDate
        }

        if (categoryId) {
            if (!categoryId) return next(new appError('!not found categoryId you need update', 400))

            const category = await categoryModel.findById(categoryId)
            if (!category) return next(new appError('!not found category', 401))

            medicine.categoryId = categoryId
        }

        // if need update image
        if (oldPublicId) {
            if (!req.file) return next({ cause: 400, message: 'Image is required' })

            const endFolder = oldPublicId.split(`${medicine.folderId}/`)[1]
            const startFolder = oldPublicId.split(`${medicine.folderId}/`)[0]

            const newPublicId = startFolder + `${medicine.folderId}/` + endFolder

            const { secure_url, public_id } = await cloudinaryConnection().uploader.upload(req.file.path, {

                public_id: newPublicId
            })

            medicine.Images.map(img => {
                if (img.public_id == oldPublicId) img.secure_url = secure_url
            })
            console.log("{ secure_url ,public_id}  : ", { secure_url, public_id });
        }
        medicine.updatedBy = _id
        await medicine.save()

        res.status(401).json({ success: true, message: "medicine update successfully", data: medicine })


    }
)


//=================================== Delete Medicine By User Controller ===================================//
/* 
    * destruct required data  
    * find medicine and delete by id 
    * loop Images find public_id
    * path folder in cloudinary
    * delete folder to cloudinary
*/
const deleteMedicineByUserController = catchError(
    async (req, res, next) => {
        // destruct required data
        const { _id } = req.user
        const { id } = req.params

        // find medicine and delete by id 
        let medicine = await medicineModel.findById(id)
        if (!medicine) return next(new appError('!not found medicine', 401))

        // check if user allowedTo
        if (medicine.addedBy.toString() !== _id.toString()) return next({ cause: 404, message: 'you are not allowedTo' })

        await medicine.deleteOne({ _id: id })

        // loop Images find public_id
        const srcFolderId = medicine.Images.map(img => {
            let image = img.public_id
            return image
        })

        // split before medicine
        let startUrl = srcFolderId[1].split('/medicine/')[0]

        // split before medicine
        let endUrl = srcFolderId[1].split('/medicine/')[1].split('/')[0]

        // folder path delete
        const folderDelete = startUrl + "/medicine/" + endUrl

        // delete folder to cloudinary
        await cloudinaryConnection().api.delete_resources_by_prefix(folderDelete);
        await cloudinaryConnection().api.delete_folder(folderDelete)


        return res.json({ success: true, message: "delete medicine successfully" })

    }
)

//=================================== Delete Medicine By Admin Controller ===================================//
/* 
    * destruct required data  
    * find medicine and delete by id 
    * loop Images find public_id
    * path folder in cloudinary
    * delete folder to cloudinary
*/
const deleteMedicineByAdminController = catchError(
    async (req, res, next) => {
        // destruct required data
        const { id } = req.params

        // find medicine and delete by id 
        let medicine = await medicineModel.findByIdAndDelete(id)
        if (!medicine) return next(new appError('!not found medicine', 401))

        // loop Images find public_id
        const srcFolderId = medicine.Images.map(img => {
            let image = img.public_id
            return image
        })

        // split before medicine
        let startUrl = srcFolderId[1].split('/medicine/')[0]

        // split before medicine
        let endUrl = srcFolderId[1].split('/medicine/')[1].split('/')[0]

        // folder path delete
        const folderDelete = startUrl + "/medicine/" + endUrl

        // delete folder to cloudinary
        await cloudinaryConnection().api.delete_resources_by_prefix(folderDelete);
        await cloudinaryConnection().api.delete_folder(folderDelete)
        return res.json({ success: true, message: "delete medicine successfully" })
    }
)


//=================================== get All  Medicine Controller ===================================//
/*
    * find Medicine model

*/
const getAllMedicineController = catchError(
    async (req, res, next) => {
        const { page, size, sort, ...query } = req.query

        const ApiFeature = new apiFeature(req.query, medicineModel.find())
            .pagination()
            .sort()
            .search(query)
            .filter(query)

        const medicine = await ApiFeature.mongooseQuery
            .populate([
                { path: 'addedBy', select: 'name' },
                { path: 'updatedBy', select: 'name' },
                { path: 'categoryId' },
            ])
        if (!medicine) return next(new appError('!not found medicine', 401))

        res.json({ success: true, message: "successfully", medicine })
    }
)

//=================================== get Specific Medicine Controller ===================================//
/*
    * find medicine model

*/
const getSpecificMedicineController = catchError(
    async (req, res, next) => {
        // destruct required data  
        const { id } = req.params

        const medicine = await medicineModel.findOne({ _id: id })
            .populate(
                { path: 'addedBy', select: 'name' },

            )

        if (!medicine) return next(new appError('!not found medicine', 401))

        res.json({ success: true, message: "successfully", medicine })
    }
)







export {
    createMedicineController,
    updateMedicineController,
    deleteMedicineByUserController,
    deleteMedicineByAdminController,
    getAllMedicineController,
    getSpecificMedicineController
}