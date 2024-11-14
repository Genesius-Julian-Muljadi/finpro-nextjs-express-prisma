import { Router } from "express";
import { LoginUser, RegisterUser, VerifyOrganizer } from "../controllers/auth_controllers";
import { RegisterValidationUser } from "../middlewares/validations/auth_validation";
// import { SingleUploader } from "../config/uploader";
// import { VerifyToken, VerifyToken2 } from "../middlewares/auth_middleware";

const router = Router();

router.post("/registeruser", RegisterValidationUser, RegisterUser);
router.post("/loginuser", LoginUser);
// router.post("/upload", VerifyToken, SingleUploader("AVT", "/thisfolder"), UploadUpdate);
// router.post("/verify", VerifyToken2, VerifyUser);

export default router;