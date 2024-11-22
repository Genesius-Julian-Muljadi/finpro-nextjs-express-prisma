import { Router } from "express";
import { GetCouponDataByUserID, GetEventDataByEventID, GetHistoryDataByUserID, GetOrganizerNameByID, GetPointDataByUserID, GetTransactionDataByTransactionID, LoginOrganizer, LoginUser, RegisterOrganizer, RegisterUser, VerifyOrganizer } from "../controllers/auth_controllers";
import { RegisterValidationOrganizer, RegisterValidationUser } from "../middlewares/validations/auth_validation";
import { VerifyTokenOrganizerSignup } from "../middlewares/auth_middleware";

const router = Router();

router.post("/registeruser", RegisterValidationUser, RegisterUser);
router.post("/loginuser", LoginUser);
router.get("/couponsuser/:id", GetCouponDataByUserID);
router.get("/pointsuser/:id", GetPointDataByUserID);
router.get("/historyuser/:id", GetHistoryDataByUserID);
router.get("/eventevent/:id", GetEventDataByEventID);
router.get("/transactiontransaction/:id", GetTransactionDataByTransactionID);
// router.post("/upload", VerifyToken, SingleUploader("AVT", "/thisfolder"), UploadUpdate);
router.post("/registerorganizer", RegisterValidationOrganizer, RegisterOrganizer);
router.post("/verify", VerifyTokenOrganizerSignup, VerifyOrganizer);
router.post("/loginorganizer", LoginOrganizer);
router.get("/getorganizername/:id", GetOrganizerNameByID);

export default router;