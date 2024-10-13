const Prize = require('../Models/prizeModel');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');
const ErrorHandler = require('../utils/errorHandler');


exports.getPrizes = catchAsyncErrors(async(req, res, next)=>{
    const prizes = Prize.find({});

    if(!prizes){
        return next(new ErrorHandler("prize not found", 404))
    }

    res.status(200).json({
        success: ture,
        prizes
    })
})

exports.updatePrize = catchAsyncErrors(async(req, res, next) =>{
    const prize = await Prize.findById(req.params.id)

    if(!prize){
        return next(new ErrorHandler("prize not found", 404))
    }

    const updatedPrize = await Prize.findByIdAndUpdate(req.prams.id, req.body, {
        new:true,
        runValidator:true
    })

    res.status(201).json({
        success:ture,
        message:"updated",
        updatedPrize
    })
})

exports.deletePrize = catchAsyncErrors(async(req, res, next) =>{
    const prize = await Prize.findById(req.params.id)

    if(!prize){
        return next(new ErrorHandler("prize not found", 404))
    }

    await prize.remove();
    res.status(201).json({
        success:ture,
        message:"deleted successfully",
        prize
    })
})