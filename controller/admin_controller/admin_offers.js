const productCollection = require('../../models/products_schema');
// const catgoryCollection = require('../../models/category_schema');


const getOffers = async (req, res)=>{
  try{
    const offers = await productCollection.find({ offerStatus: { $exists: true } });
    res.render('offer-page', {offers});
  }catch(error){
    console.error(error);
  }
}

const getAddOffer = async (req, res)=>{
  try{
    const products = await productCollection.find({
      $or: [
        { offerStatus: { $ne: 'Active' } },
        { endDate: { $lt: new Date() } }
      ]
    });
    // const categories = await catgoryCollection.find();
    res.render('offer-add', {products});
  }catch(error){
    console.error(error);
  }
}

const postAddOffer = async (req, res)=>{
  try{
    const { productId, discountPercentage, offerStatus, startDate, endDate } = req.body;
    if (!discountPercentage || !offerStatus || !startDate || !endDate) {
      return res.status(200).json({ error: "Missing required fields" });
    }
    const ifExist = await productCollection.findOne({
      _id: productId,
      offerStatus: 'Active',
      endDate: { $gte: new Date() } 
    });
    if(ifExist){
     return res.status(200).json({error: "An active Offer for this product already exists"});
    }
    await productCollection.findByIdAndUpdate(productId,{ 
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

const getEditOffer = async (req, res)=>{
  try{
    const offerProduct = await productCollection.findById(req.params.offerId);
    res.render('offer-edit', {offerProduct});
  }catch(error){
    console.error(error);
  }
}

const postEditOffer = async (req, res)=>{
  try{
    const { productId, discountPercentage, offerStatus, startDate, endDate } = req.body;
    if (!discountPercentage || !offerStatus || !startDate || !endDate) {
      return res.status(200).json({ error: "Missing required fields" });
    }
    await productCollection.findByIdAndUpdate(productId,{ 
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

const blockOffer = async (req, res)=>{
  try{
    await productCollection.findByIdAndUpdate(req.params.offerId, {
      offerStatus: 'Inactive'
    });
    res.redirect('/admin/offers')
  }catch(error){
    console.error(error);
  }
}

const unblockOffer = async (req, res)=>{
  try{
    await productCollection.findByIdAndUpdate(req.params.offerId, {
      offerStatus: 'Active'
    });
    res.redirect('/admin/offers')
  }catch(error){
    console.error(error);
  }
}

module.exports = {
  getOffers,
  getAddOffer,
  postAddOffer,
  getEditOffer,
  postEditOffer,
  blockOffer,
  unblockOffer
}