import axios from "axios";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
const app = express();
const PORT = 3820;
app.use(express.json());

app.use(cors());
// PayU EMI Calculator API credentials and endpoint
// Replace with your actual username

// Function to calculate EMI
app.post("/emicalculator", async (req, res) => {
  console.log(req.body);
  const { tenure, paymentMode, amount } = req.body;
  const txnAmount = amount;
  console.log(req.body);

  if (!txnAmount) {
    return res.status(400).json({
      message: "Transaction amount is required",
    });
  }

  try {
    // Prepare the request payload
    const payload = {
      txnAmount,
      additionalCharges: 0,
      offerKeys: null,
      autoApplyOffer: true,
      bankCodes: null,
      emiCodes: null,
      disableOverrideNceConfig: true,
    };

    // Make the API request
    const response = await axios.post(
      "https://api.payu.in/calculateEmi/v2",
      payload,
      {
        headers: {
          "x-credential-username": "smsplus",
          "Content-Type": "application/json",
        },
      }
    );

    // Handle the response
    if (response.data.result) {
      // console.log(response.data.result)
      for (let key in response.data.result) {
        if (
          response.data.result.hasOwnProperty(key) &&
          String(key) === paymentMode
        ) {
          let findMonth = response.data.result[key];
          console.log(findMonth);
          for (let [key, value] of Object.entries(findMonth)) {
            if (key.includes(tenure)) {
              console.log(key, value);
              return res.json({
                message: "EMI Calculation Successful",
                result: value,
              });
            }
          }
          return res.json({ error: "Select another one" });
        }
      }
    } else {
      res.json({
        message: "EMI Calculation Failed",
        error: response.data,
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "Error calculating EMI",
      error: error.message,
    });
  }
});
app.get("/praveen", (req, res) => {
  return res.send("hi");
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}/emicalculator`);
});
