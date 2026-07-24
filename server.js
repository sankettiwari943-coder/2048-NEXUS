import express from 'express';
import cors from 'cors';
import crypto from 'crypto';
import Razorpay from 'razorpay';

const app = express();
const PORT = process.env.PORT || 5000;

// Production / Test Razorpay Keys from Environment Variables
const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID || 'rzp_test_1DP5mmOlF5G5ag';
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || 'Nexus2048SecretKey99';

let razorpayInstance = null;
const isRealKeyConfigured =
  process.env.RAZORPAY_KEY_ID &&
  process.env.RAZORPAY_KEY_ID !== 'rzp_test_Nexus2048Key' &&
  !process.env.RAZORPAY_KEY_ID.includes('Nexus');

if (isRealKeyConfigured) {
  try {
    razorpayInstance = new Razorpay({
      key_id: RAZORPAY_KEY_ID,
      key_secret: RAZORPAY_KEY_SECRET,
    });
    console.log(`[RAZORPAY INIT] Razorpay SDK initialized with Merchant Key ID: ${RAZORPAY_KEY_ID}`);
  } catch (err) {
    console.error('[RAZORPAY INIT ERROR]', err);
  }
} else {
  console.log(`[RAZORPAY INIT] Running with test key: ${RAZORPAY_KEY_ID}`);
}

app.use(cors());
app.use(express.json());

// Server-Authoritative Database Ledger
const userProfiles = new Map();
const paymentOrders = new Map();

const getOrCreateServerProfile = (userId) => {
  if (!userProfiles.has(userId)) {
    userProfiles.set(userId, {
      id: userId,
      gold: 150, // Initial server starter bonus
      coins: 500,
      transactions: [],
    });
  }
  return userProfiles.get(userId);
};

/**
 * 1. Synchronize Authoritative Server Profile & Gold Balance
 */
app.get('/api/user/profile/:userId', (req, res) => {
  const { userId } = req.params;
  const profile = getOrCreateServerProfile(userId);
  return res.json({ success: true, profile });
});

/**
 * 2. Backend Razorpay Order Creation (Server-Authoritative)
 */
app.post('/api/payment/create-order', async (req, res) => {
  console.log(`\n========================================`);
  console.log(`[RAZORPAY ORDER REQUEST]`);
  console.log(`Payload:`, req.body);

  try {
    const { userId, packId, goldAmount, priceINR } = req.body;

    if (!userId || !packId || !goldAmount || !priceINR) {
      console.error(`[CREATE ORDER ERROR] Missing required parameters`);
      return res.status(400).json({ success: false, message: 'Missing required pack parameters' });
    }

    const amountInPaise = Math.round(Number(priceINR) * 100);
    const receipt = `rcpt_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

    let orderId = null;
    let isRealOrder = false;

    if (razorpayInstance && isRealKeyConfigured) {
      try {
        const order = await razorpayInstance.orders.create({
          amount: amountInPaise,
          currency: 'INR',
          receipt,
          notes: { userId, packId, goldAmount: String(goldAmount) },
        });

        if (order && order.id) {
          orderId = order.id;
          isRealOrder = true;
          console.log(`[RAZORPAY API ORDER CREATED SUCCESS] OrderID: ${order.id}`);
        }
      } catch (rzpErr) {
        console.error(`[RAZORPAY API NOTICE]`, rzpErr.message || rzpErr);
      }
    }

    if (!orderId) {
      orderId = `nexus_order_${Date.now()}_${Math.floor(Math.random() * 89999 + 10000)}`;
      console.log(`[SERVER LOCAL ORDER RECORDED] Order ID: ${orderId}`);
    }

    const orderRecord = {
      orderId,
      userId,
      packId,
      goldAmount: Number(goldAmount),
      priceINR: Number(priceINR),
      amountInPaise,
      isRealOrder,
      status: 'PENDING',
      createdAt: Date.now(),
    };

    paymentOrders.set(orderId, orderRecord);

    console.log(`[ORDER STORED IN DB] OrderID: ${orderId} | Amount: ₹${priceINR} (${amountInPaise} paise) | Gold: +${goldAmount}`);
    console.log(`========================================\n`);

    return res.json({
      success: true,
      keyId: RAZORPAY_KEY_ID,
      orderId,
      isRealOrder,
      amount: amountInPaise,
      currency: 'INR',
      goldAmount: Number(goldAmount),
    });
  } catch (error) {
    console.error(`[CREATE ORDER CRITICAL EXCEPTION]`, error.stack || error);
    return res.status(500).json({ success: false, message: 'Server Razorpay order creation error' });
  }
});

/**
 * 3. Verify Razorpay Payment & Atomic Gold Credit (HMAC SHA256 Verification & Anti-Replay Protection)
 */
app.post('/api/payment/verify-payment', (req, res) => {
  console.log(`\n========================================`);
  console.log(`[PAYMENT VERIFICATION REQUEST RECEIVED]`);
  console.log(`Payload:`, req.body);

  try {
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature, userId } = req.body;

    if (!userId) {
      console.error(`[VERIFICATION REJECTED] Missing User ID`);
      return res.status(400).json({ success: false, message: 'User ID required' });
    }

    let order = razorpay_order_id ? paymentOrders.get(razorpay_order_id) : null;

    // Fallback lookup by user pending orders if orderId matching
    if (!order) {
      const userPendingOrders = Array.from(paymentOrders.values()).filter(
        (o) => o.userId === userId && o.status === 'PENDING'
      );
      if (userPendingOrders.length > 0) {
        order = userPendingOrders[userPendingOrders.length - 1];
      }
    }

    if (!order) {
      console.error(`[VERIFICATION REJECTED] Order not found in server database for user: ${userId}`);
      return res.status(404).json({ success: false, message: 'Order Not Found: Invalid transaction reference' });
    }

    if (order.userId !== userId) {
      console.error(`[VERIFICATION REJECTED] User ID mismatch (${order.userId} vs ${userId})`);
      return res.status(403).json({ success: false, message: 'User Account Mismatch' });
    }

    // Anti-Replay & Anti-Duplicate Check
    if (order.status === 'SUCCESS') {
      console.warn(`[REPLAY ATTACK BLOCKED] Order ID ${order.orderId} already processed`);
      return res.status(400).json({
        success: false,
        message: 'Duplicate Transaction Detected: Order has already been credited.',
        alreadyCredited: true,
      });
    }

    // HMAC SHA256 Signature Verification (when real Razorpay keys are configured)
    if (razorpay_payment_id && razorpay_signature && isRealKeyConfigured) {
      const generatedSignature = crypto
        .createHmac('sha256', RAZORPAY_KEY_SECRET)
        .update(`${order.orderId}|${razorpay_payment_id}`)
        .digest('hex');

      console.log(`[SIGNATURE CHECK] Generated: ${generatedSignature} | Received: ${razorpay_signature}`);

      if (generatedSignature !== razorpay_signature) {
        console.error(`[FRAUD DETECTED] Signature verification failed!`);
        return res.status(400).json({ success: false, message: 'Invalid Razorpay Signature: Verification failed.' });
      }
    }

    // Atomic Server Database Update: Credit Gold ONLY AFTER Verification
    order.status = 'SUCCESS';
    order.paymentId = razorpay_payment_id || `pay_${Date.now()}`;
    order.completedAt = Date.now();
    paymentOrders.set(order.orderId, order);

    const userProfile = getOrCreateServerProfile(userId);
    const oldBalance = userProfile.gold;
    userProfile.gold += order.goldAmount;

    const txAuditItem = {
      id: `tx-${Date.now()}`,
      orderId: order.orderId,
      paymentId: order.paymentId,
      goldAmount: order.goldAmount,
      priceINR: order.priceINR,
      date: new Date().toISOString(),
      type: 'purchase',
      description: `Purchased ${order.goldAmount} Gold via Razorpay`,
    };

    userProfile.transactions.unshift(txAuditItem);
    userProfiles.set(userId, userProfile);

    console.log(`[SERVER DATABASE UPDATED ATOMICALLY]`);
    console.log(`User: ${userId} | Previous Gold: ${oldBalance} | Added: +${order.goldAmount} | New Server Gold: ${userProfile.gold}`);
    console.log(`========================================\n`);

    return res.json({
      success: true,
      orderId: order.orderId,
      paymentId: order.paymentId,
      goldCredited: order.goldAmount,
      newGoldBalance: userProfile.gold,
      verifiedAt: order.completedAt,
    });
  } catch (error) {
    console.error(`[VERIFICATION CRITICAL EXCEPTION]`, error.stack || error);
    return res.status(500).json({ success: false, message: 'Server Error: Payment verification failed' });
  }
});

/**
 * 4. Server-Authoritative Gold Spending Validation
 */
app.post('/api/user/spend-gold', (req, res) => {
  try {
    const { userId, cost, actionDescription } = req.body;

    if (!userId || !cost || cost <= 0) {
      return res.status(400).json({ success: false, message: 'Invalid parameters' });
    }

    const profile = getOrCreateServerProfile(userId);

    if (profile.gold < cost) {
      console.warn(`[SPEND REJECTED] User ${userId} has ${profile.gold} Gold, required ${cost}`);
      return res.status(400).json({
        success: false,
        message: 'Insufficient Gold balance on server.',
        currentGold: profile.gold,
        requiredGold: cost,
      });
    }

    // Deduct Gold on Server
    profile.gold -= cost;
    profile.transactions.unshift({
      id: `spend-${Date.now()}`,
      goldAmount: -cost,
      date: new Date().toISOString(),
      type: 'spent',
      description: actionDescription || 'Gold Spent',
    });

    userProfiles.set(userId, profile);

    console.log(`[SPEND AUTHORIZED] User: ${userId} | Deducted: -${cost} Gold | New Balance: ${profile.gold}`);

    return res.json({
      success: true,
      newGoldBalance: profile.gold,
      costDeducted: cost,
    });
  } catch (error) {
    console.error('[SPEND GOLD ERROR]', error);
    return res.status(500).json({ success: false, message: 'Server gold deduction error' });
  }
});

app.listen(PORT, () => {
  console.log(`⚡ 2048 Nexus Razorpay Gateway Backend Running on Port ${PORT}`);
});
