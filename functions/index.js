const functions = require("firebase-functions");
const admin = require("firebase-admin");
const twilio = require("twilio");

admin.initializeApp();

// Twilio credentials from environment variables
const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
const TWILIO_WHATSAPP_NUMBER = process.env.TWILIO_WHATSAPP_NUMBER;

const twilioClient = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

// Cloud Function triggered when tokenSendRequest is set to true
exports.sendWhatsAppToken = functions.firestore
  .document("voters/{voterId}")
  .onWrite(async (change, context) => {
    const newData = change.after.data();
    const oldData = change.before.data();

    // Only trigger when tokenSendRequest changes from false/undefined to true
    if (!newData?.tokenSendRequest || oldData?.tokenSendRequest === true) {
      return null;
    }

    const voterId = context.params.voterId;
    const nama = newData.nama;
    const nomorHP = newData.nomorHP;
    const token = newData.token;

    if (!nama || !nomorHP || !token) {
      console.error("[v0] Missing required fields for sending WhatsApp");
      return null;
    }

    try {
      // Format phone number for WhatsApp
      let phoneNumber = nomorHP;
      if (!phoneNumber.startsWith("+62")) {
        if (phoneNumber.startsWith("0")) {
          phoneNumber = "+62" + phoneNumber.substring(1);
        } else if (!phoneNumber.startsWith("62")) {
          phoneNumber = "+62" + phoneNumber;
        } else {
          phoneNumber = "+" + phoneNumber;
        }
      }

      // Prepare login number (without + for display)
      const loginNumber = nomorHP.startsWith("0")
        ? "62" + nomorHP.substring(1)
        : nomorHP.replace("+", "");

      const votingLink = "http://localhost:3000/vote";

      // Prepare message
      const message = `Halo ${nama},\n\n*Informasi Pemilihan Online*\n\nNomor Login: ${loginNumber}\nToken/Password: ${token}\n\nLink Voting: ${votingLink}\n\n⚠️ *Penting:*\n• Jangan bagikan token ini kepada siapa pun\n• Simpan nomor login dan token dengan baik\n• Gunakan link di atas untuk memilih\n\nTerima kasih.`;

      // Send WhatsApp message via Twilio
      const response = await twilioClient.messages.create({
        from: `whatsapp:${TWILIO_WHATSAPP_NUMBER}`,
        to: `whatsapp:${phoneNumber}`,
        body: message,
      });

      console.log(`[v0] WhatsApp sent to ${phoneNumber}. SID: ${response.sid}`);

      // Update Firestore to mark as sent and reset flag
      await admin.firestore().collection("voters").doc(voterId).update({
        tokenSendRequest: false,
        tokenSentAt: new Date().toISOString(),
        tokenSentVia: "whatsapp",
      });

      return { success: true, messageSid: response.sid };
    } catch (error) {
      console.error("[v0] Error sending WhatsApp:", error);

      // Update Firestore to mark as failed
      await admin.firestore().collection("voters").doc(voterId).update({
        tokenSendRequest: false,
        tokenSendError: error.message,
      });

      throw error;
    }
  });
