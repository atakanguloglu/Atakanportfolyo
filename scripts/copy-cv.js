/**
 * CV PDF'ini public klasörüne kopyalar.
 * Kullanım: node scripts/copy-cv.js
 * Kaynak: Masaüstündeki "Atakan Özgeçmiş cv sertifika" > "Atakan Güncel Cv ler" > Atakan_Guloglu_ATS_CV.pdf
 */
const fs = require("fs");
const path = require("path");

const sourcePath = path.join(
  process.env.USERPROFILE || process.env.HOME,
  "Desktop",
  "Atakan Özgeçmiş cv sertifika",
  "Atakan Güncel Cv ler",
  "Atakan_Guloglu_ATS_CV.pdf"
);
const projectRoot = path.join(__dirname, "..");
const destPath = path.join(projectRoot, "public", "Atakan_Guloglu_ATS_CV.pdf");

if (!fs.existsSync(sourcePath)) {
  console.error("Kaynak dosya bulunamadı:", sourcePath);
  console.error("Lütfen CV PDF'ini şu klasöre kopyalayın:", path.join(projectRoot, "public"));
  process.exit(1);
}

fs.copyFileSync(sourcePath, destPath);
