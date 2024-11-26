import { Router } from "express";
import { GetCouponDataByUserID, GetEventDataByEventID, GetEventDataByOrganizerID, GetEventDiscountDataByEventID, GetHistoryDataByUserID, GetOrganizerNameByID, GetPointDataByUserID, GetTransactionDataByTransactionID, LoginOrganizer, LoginUser, RegisterEventByOrganizerID, RegisterOrganizer, RegisterUser, VerifyOrganizer, VerifyUser } from "../controllers/auth_controllers";
import { RegisterValidationOrganizer, RegisterValidationUser } from "../middlewares/validations/auth_validation";
import { VerifyTokenOrganizerSignup, VerifyTokenUserSignup } from "../middlewares/auth_middleware";

const router = Router();

router.post("/registeruser", RegisterValidationUser, RegisterUser);
router.post("/verifyuser", VerifyTokenUserSignup, VerifyUser);
router.post("/loginuser", LoginUser);
router.get("/couponsuser/:id", GetCouponDataByUserID);
router.get("/pointsuser/:id", GetPointDataByUserID);
router.get("/historyuser/:id", GetHistoryDataByUserID);
router.get("/eventevent/:id", GetEventDataByEventID);
router.get("/eventorganizer/:id", GetEventDataByOrganizerID);
router.get("/transactiontransaction/:id", GetTransactionDataByTransactionID);
router.get("/eventdiscount/:id", GetEventDiscountDataByEventID);
// router.post("/upload", VerifyToken, SingleUploader("AVT", "/thisfolder"), UploadUpdate);
router.post("/registerorganizer", RegisterValidationOrganizer, RegisterOrganizer);
router.post("/verify", VerifyTokenOrganizerSignup, VerifyOrganizer);
router.post("/loginorganizer", LoginOrganizer);
router.get("/getorganizername/:id", GetOrganizerNameByID);
router.post("/registerevent/:id", RegisterEventByOrganizerID);

export default router;