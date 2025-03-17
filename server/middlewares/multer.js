import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Function to delete existing profile images
const deleteExistingProfileImages = (userId) => {
  const profileImagesPath = path.join(__dirname, "../uploads/profileImages/");

  fs.readdir(profileImagesPath, (err, files) => {
    if (err) {
      console.error("Error reading profile images directory:", err);

      return;
    }

    const filesToDelete = files.filter(
      (file) => file.startsWith("profile-") && file.includes(`-${userId}-`)
    );

    if (filesToDelete.length === 0) {
      return;
    }

    filesToDelete.forEach((file) => {
      const filePath = path.join(profileImagesPath, file);

      fs.unlink(filePath, (unlinkErr) => {
        if (unlinkErr) {
          console.error(`Error deleting file ${file}:`, unlinkErr);
        }
      });
    });
  });
};

// Configure storage for multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let uploadPath = "";

    // Determine the folder based on the field name
    if (file.fieldname === "profileImage") {
      uploadPath = path.join(__dirname, "../uploads/profileImages/");
      console.log("Multer: Profile image upload destination:", uploadPath);
      deleteExistingProfileImages(req.params.id); // Delete existing profile images before saving new ones
    } else if (file.fieldname === "attachment") {
      uploadPath = path.join(__dirname, "../uploads/ticketAttachments/");
      console.log("Multer: Ticket attachment upload destination:", uploadPath);
    } else {
      console.log("Multer: Unknown fieldname:", file.fieldname);
      return cb(new Error("Unknown fieldname"));
    }

    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const userId = req.params.id;
    const ticketId = req.params.id;

    let filename = "";

    if (file.fieldname === "profileImage") {
      filename = `profile-${userId}-${Date.now()}${path.extname(
        file.originalname
      )}`;
      console.log("Multer: Profile image filename:", filename);
    } else if (file.fieldname === "attachment") {
      filename = `attachment-${ticketId}-${Date.now()}${path.extname(
        file.originalname
      )}`;
      console.log("Multer: Ticket attachment filename:", filename);
    } else {
      console.log("Multer: Unknown fieldname:", file.fieldname);
      return cb(new Error("Unknown fieldname"));
    }

    cb(null, filename);
  },
});

// Create the multer instance
const upload = multer({ storage: storage });

export { upload };
