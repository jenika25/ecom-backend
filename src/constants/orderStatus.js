 const ITEM_STATUS = ['placed', 'confirmed', 'shipped', 'delivered', 'cancelled', 'returned'];

 const ORDER_STATUS = ['pending_payment', 'confirmed', 'completed', 'cancelled'];

 const PAYMENT_METHODS = ['cod', 'razorpay'];
 const PAYMENT_STATUS = ['pending', 'paid', 'failed'];

 const ALLOWED_ITEM_TRANSITIONS = {
  placed: ['confirmed', 'cancelled'],
  confirmed: ['shipped', 'cancelled'],
  shipped: ['delivered'],
  delivered: [],      
  cancelled: [],
  returned: [],
};
 const CANCELLABLE_ITEM_STATUS = ['placed', 'confirmed'];

 const RETURN_WINDOW_MS = 2 * 24 * 60 * 60 * 1000;

 module.exports={RETURN_WINDOW_MS,CANCELLABLE_ITEM_STATUS,ALLOWED_ITEM_TRANSITIONS,PAYMENT_STATUS,PAYMENT_METHODS,ORDER_STATUS,ITEM_STATUS}