import { Router } from "express";
import { LoginUser, RegisterOrganizer, RegisterUser, VerifyOrganizer } from "../controllers/auth_controllers";
import { RegisterValidationOrganizer, RegisterValidationUser } from "../middlewares/validations/auth_validation";
import { VerifyTokenOrganizerSignup } from "../middlewares/auth_middleware";

const router = Router();

router.post("/registeruser", RegisterValidationUser, RegisterUser);
router.post("/loginuser", LoginUser);
// router.post("/upload", VerifyToken, SingleUploader("AVT", "/thisfolder"), UploadUpdate);
router.post("/registerorganizer", RegisterValidationOrganizer, RegisterOrganizer);
router.post("/verify", VerifyTokenOrganizerSignup, VerifyOrganizer);

export default router;