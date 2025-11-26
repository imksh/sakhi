import express from "express";

const router = express.Router();

router.get("/health", (req, res) => {
  console.log("OK");
  
  res.send("OK");
});

export default router;