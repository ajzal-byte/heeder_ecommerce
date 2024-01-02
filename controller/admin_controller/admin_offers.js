const productCollection = require('../../models/products_schema');
const catgoryCollection = require('../../models/category_schema');


module.exports.getOffers = async (req, res)=>{
  try{
    const offers = await productCollection.find({ offerStatus: { $exists: true } });
    res.render('offer-page', {offers});
  }catch(error){
    console.error(error);
  }
}

module.exports.getAddOffer = async (req, res)=>{
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

module.exports.postAddOffer = async (req, res)=>{
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

module.exports.getEditOffer = async (req, res)=>{
  try{
    const offerProduct = await productCollection.findById(req.params.offerId);
    const nonOfferProducts = await productCollection.find({
      $or: [
        { offerStatus: { $ne: 'Active' } },
        { endDate: { $lt: new Date() } }
      ]
    });
    const products = [offerProduct, ...nonOfferProducts];
    // const categories = await catgoryCollection.find();
    res.render('offer-edit', {offerProduct, products});
  }catch(error){
    console.error(error);
  }
}

module.exports.postEditOffer = async (req, res)=>{
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

module.exports.blockOffer = async (req, res)=>{
  try{
    await productCollection.findByIdAndUpdate(req.params.offerId, {
      offerStatus: 'Inactive'
    });
    res.redirect('/admin/offers')
  }catch(error){
    console.error(error);
  }
}

module.exports.unblockOffer = async (req, res)=>{
  try{
    await productCollection.findByIdAndUpdate(req.params.offerId, {
      offerStatus: 'Active'
    });
    res.redirect('/admin/offers')
  }catch(error){
    console.error(error);
  }
}