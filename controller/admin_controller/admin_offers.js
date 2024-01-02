const productCollection = require('../../models/products_schema');
const catgoryCollection = require('../../models/category_schema');
const offerCollection = require('../../models/offer_schema');


module.exports.getOffers = async (req, res)=>{
  try{
    const offers = await offerCollection.find();
    res.render('offer-page', {offers});
  }catch(error){
    console.error(error);
  }
}
module.exports.getAddOffer = async (req, res)=>{
  try{
    const products = await productCollection.find()
    // const categories = await catgoryCollection.find();
    res.render('offer-add', {products});
  }catch(error){
    console.error(error);
  }
}

module.exports.postAddOffer = async (req, res)=>{
  try{
    const { offerType, offerName, discountPercentage, offerStatus, startDate, endDate } = req.body;
    if (!offerType || !offerName || !discountPercentage || !offerStatus || !startDate || !endDate) {
      return res.status(200).json({ error: "Missing required fields" });
    }
    const ifExist = await offerCollection.findOne({offerName});
    if(ifExist){
     return res.status(200).json({error: "Offer for this product already exists"});
    }
    await offerCollection.create({
      offerType, 
      offerName,
      discountPercentage,
      offerStatus,
      startDate,
      endDate
    });
    res.status(200).json({ success: true });
    
  }catch(error){
    console.error(error);
  }
}

module.exports.getEditOffer = async (req, res)=>{
  try{
    const offer = await offerCollection.findById(req.params.offerId);
    const products = await productCollection.find()
    // const categories = await catgoryCollection.find();
    res.render('offer-edit', {offer, products});
  }catch(error){
    console.error(error);
  }
}

module.exports.postEditOffer = async (req, res)=>{
  try{
    const { offerType, offerName, discountPercentage, offerStatus, startDate, endDate } = req.body;
    if (!offerType || !offerName || !discountPercentage || !offerStatus || !startDate || !endDate) {
      return res.status(200).json({ error: "Missing required fields" });
    }
    const ifExist = await offerCollection.findOne({ offerName, _id: { $ne: req.params.offerId } });
    if(ifExist){
     return res.status(200).json({error: "Offer for this product already exists"});
    }
    await offerCollection.findByIdAndUpdate(req.params.offerId, {
      offerType, 
      offerName,
      discountPercentage,
      offerStatus,
      startDate,
      endDate
  });
  res.status(200).json({ success: true });
  }catch(error){
    console.error(error);
  }
}

module.exports.blockOffer = async (req, res)=>{
  try{
    await offerCollection.findByIdAndUpdate(req.params.offerId, {
      offerStatus: 'Inactive'
    });
    res.redirect('/admin/offers')
  }catch(error){
    console.error(error);
  }
}

module.exports.unblockOffer = async (req, res)=>{
  try{
    await offerCollection.findByIdAndUpdate(req.params.offerId, {
      offerStatus: 'Active'
    });
    res.redirect('/admin/offers')
  }catch(error){
    console.error(error);
  }
}