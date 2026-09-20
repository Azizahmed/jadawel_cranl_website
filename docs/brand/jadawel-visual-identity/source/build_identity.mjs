import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { Presentation, PresentationFile } from "@oai/artifact-tool";

// The kit is normally installed at <checkout>/docs/brand/jadawel-visual-identity
// with its assets in <kit>/assets. Set JADAWEL_ROOT to a Jadawel checkout to read
// that checkout's docs/brand/.../assets instead, or override JADAWEL_ASSETS and
// JADAWEL_BUILD directly.
const KIT_DIR = path.dirname(fileURLToPath(import.meta.url));
const KIT_ROOT = path.resolve(KIT_DIR, "..");
const ROOT = process.env.JADAWEL_ROOT ?? "";
const BUILD = process.env.JADAWEL_BUILD ?? (ROOT
  ? path.join(ROOT, ".codex-build/jadawel-identity")
  : path.join(KIT_ROOT, ".build"));
const ASSETS = process.env.JADAWEL_ASSETS ?? (ROOT
  ? path.join(ROOT, "docs/brand/jadawel-visual-identity/assets")
  : path.join(KIT_ROOT, "assets"));
const RAW = path.join(BUILD, "Jadawel_Visual_Identity_Guidelines_AR_v1.0_raw.pptx");

const W = 1280;
const H = 720;
const FONT = "thmanyah sans";
const C = {
  ink: "#0B0F19",
  black: "#000000",
  blue: "#2563EB",
  blueDark: "#1746B5",
  blueLight: "#DCE7FF",
  cloud: "#F6F7FB",
  white: "#FFFFFF",
  slate: "#566072",
  line: "#D9DEE8",
  mint: "#83D7C2",
  amber: "#F6C85F",
  red: "#E35D6A",
  green: "#23856D",
};

await fs.mkdir(BUILD, { recursive: true });
const img = {};
for (const [key, file] of Object.entries({
  logoBlack: "jadawel-logo-black-transparent.png",
  logoWhite: "jadawel-logo-white-transparent.png",
  logoCloud: "jadawel-logo-black-on-cloud.png",
  logoBlue: "jadawel-logo-white-on-blue.png",
  logoInk: "jadawel-logo-white-on-ink.png",
  diamondBlack: "jadawel-diamond-black.png",
  diamondBlue: "jadawel-diamond-blue.png",
})) {
  img[key] = new Uint8Array(await fs.readFile(path.join(ASSETS, file)));
}

const deck = Presentation.create({ slideSize: { width: W, height: H } });

function rect(slide, x, y, w, h, fill, radius = 0, line = "none") {
  return slide.shapes.add({
    geometry: radius ? "roundRect" : "rect",
    position: { left: x, top: y, width: w, height: h },
    fill,
    line: line === "none" ? { fill: "none", width: 0 } : line,
    ...(radius ? { borderRadius: radius } : {}),
  });
}

function line(slide, x, y, w, h, color = C.line, width = 1) {
  return slide.shapes.add({
    geometry: "line",
    position: { left: x, top: y, width: w, height: h },
    fill: "none",
    line: { style: "solid", fill: color, width },
  });
}

function text(slide, value, x, y, w, h, opts = {}) {
  const box = slide.shapes.add({
    geometry: "textbox",
    position: { left: x, top: y, width: w, height: h },
    fill: "none",
    line: { fill: "none", width: 0 },
  });
  box.text = value;
  box.text.style = {
    typeface: opts.typeface ?? FONT,
    fontSize: opts.size ?? 26,
    bold: opts.bold ?? false,
    color: opts.color ?? C.ink,
    alignment: opts.align ?? "right",
    verticalAlignment: opts.valign ?? "middle",
    autoFit: opts.autoFit ?? "shrinkText",
    wrap: "square",
    lineSpacing: opts.lineSpacing ?? 1.05,
    insets: opts.insets ?? { top: 4, right: 4, bottom: 4, left: 4 },
  };
  return box;
}

function bulletList(slide, items, x, y, w, h, opts = {}) {
  const box = slide.shapes.add({
    geometry: "textbox",
    position: { left: x, top: y, width: w, height: h },
    fill: "none",
    line: { fill: "none", width: 0 },
  });
  box.text.set(items.map((item) => ({
    bulletCharacter: "•",
    marginLeft: 22 * 12700,
    indent: -12 * 12700,
    spaceAfter: 500,
    runs: [item],
  })));
  box.text.style = {
    typeface: FONT,
    fontSize: opts.size ?? 21,
    color: opts.color ?? C.ink,
    alignment: "right",
    verticalAlignment: "top",
    autoFit: "shrinkText",
    wrap: "square",
    lineSpacing: 1.08,
    insets: { top: 6, right: 8, bottom: 4, left: 8 },
  };
  return box;
}

function addImage(slide, bytes, x, y, w, h, alt, fit = "contain") {
  return slide.images.add({
    blob: bytes,
    contentType: "image/png",
    alt,
    fit,
    position: { left: x, top: y, width: w, height: h },
  });
}

function footer(slide, n, dark = false) {
  text(slide, String(n).padStart(2, "0"), 54, 666, 55, 24, {
    size: 13,
    color: dark ? "#FFFFFF99" : C.slate,
    align: "left",
  });
  text(slide, "دليل الهوية البصرية لجداول", 920, 666, 306, 24, {
    size: 13,
    color: dark ? "#FFFFFF99" : C.slate,
  });
}

function title(slide, value, n, opts = {}) {
  text(slide, value, 660, 42, 566, 70, {
    size: opts.size ?? 35,
    bold: true,
    color: opts.color ?? C.ink,
  });
  if (!opts.noRule) line(slide, 54, 120, 1172, 0, opts.ruleColor ?? C.line, 1);
  footer(slide, n, opts.dark ?? false);
}

function note(slide, value) {
  slide.speakerNotes.textFrame.setText(value);
}

function newSlide(bg = C.white) {
  const slide = deck.slides.add();
  slide.background.fill = bg;
  return slide;
}

// 01 Cover
{
  const s = newSlide(C.blue);
  addImage(s, img.logoWhite, 194, 188, 892, 280, "شعار جداول باللون الأبيض");
  text(s, "دليل الهوية البصرية", 720, 500, 366, 56, { size: 28, bold: true, color: C.white });
  text(s, "الإصدار", 954, 558, 132, 34, { size: 16, color: "#FFFFFFCC" });
  text(s, "1.0", 884, 558, 64, 34, { size: 16, color: "#FFFFFFCC", align: "center" });
  text(s, "سبتمبر", 782, 558, 94, 34, { size: 16, color: "#FFFFFFCC", align: "center" });
  text(s, "2026", 720, 558, 62, 34, { size: 16, color: "#FFFFFFCC", align: "center" });
  addImage(s, img.diamondBlack, 68, 54, 54, 54, "النقطة الماسية", "contain");
  note(s, "المصدر: الشعار الذي اعتمده المستخدم في 19 سبتمبر 2026. جميع قواعد هذا الدليل مبنية على الأصل المرفق دون إعادة تصميمه.");
}

// 02 Guide purpose
{
  const s = newSlide(C.cloud);
  title(s, "وظيفة الدليل", 2);
  text(s, "مرجع واحد يحافظ على اتساق العلامة في المنتج والاتصال المؤسسي", 620, 156, 606, 92, { size: 31, bold: true });
  bulletList(s, [
    "يحدد الاستخدام الصحيح للشعار ومساحاته وأحجامه.",
    "يوحّد الألوان والخطوط والتخطيط عبر العربية والإنجليزية.",
    "يترجم شخصية جداول إلى واجهات ومستندات وعروض قابلة للتوسع.",
    "يفصل الأصول المعتمدة عن العناصر التي تحتاج اعتمادًا لاحقًا.",
  ], 642, 278, 584, 250, { size: 22 });
  rect(s, 54, 158, 450, 408, C.ink, 26);
  addImage(s, img.logoWhite, 94, 245, 370, 154, "شعار جداول على خلفية داكنة");
  text(s, "العربية أولًا\nوالإنجليزية مساندة", 88, 422, 376, 86, { size: 23, bold: true, color: C.white, align: "center" });
}

// 03 Foundation
{
  const s = newSlide(C.white);
  title(s, "أساس العلامة", 3);
  text(s, "التموضع", 1018, 156, 208, 36, { size: 19, bold: true, color: C.blue });
  text(s, "الطريق الموثوق والبسيط لتحويل البيانات المتفرقة إلى أنظمة عمل تبنيها الفرق بنفسها", 590, 196, 636, 108, { size: 29, bold: true });
  line(s, 590, 326, 636, 0, C.blue, 4);
  text(s, "الفكرة الداخلية", 1018, 358, 208, 36, { size: 19, bold: true, color: C.blue });
  text(s, "من البيانات تُبنى الإمكانات", 590, 398, 636, 70, { size: 34, bold: true });
  rect(s, 54, 154, 454, 430, C.blueLight, 30);
  text(s, "موثوقة", 92, 196, 154, 48, { size: 24, bold: true, align: "center" });
  text(s, "سعودية", 296, 196, 154, 48, { size: 24, bold: true, align: "center" });
  text(s, "سهلة", 92, 286, 154, 48, { size: 24, bold: true, align: "center" });
  text(s, "مرنة", 296, 286, 154, 48, { size: 24, bold: true, align: "center" });
  text(s, "قوية تقنيًا", 92, 376, 154, 48, { size: 22, bold: true, align: "center" });
  text(s, "عربية أصيلة", 296, 376, 154, 48, { size: 22, bold: true, align: "center" });
  text(s, "حديثة", 194, 480, 154, 48, { size: 24, bold: true, color: C.blue, align: "center" });
  note(s, "مصدر المحتوى: ملخص استراتيجية جداول الذي قدمه المستخدم في المحادثة الحالية.");
}

// 04 Visual principle
{
  const s = newSlide(C.ink);
  title(s, "المبدأ البصري", 4, { color: C.white, ruleColor: "#FFFFFF2D", dark: true });
  text(s, "الكتلة الواضحة تمنح الثقة. الفراغ المدروس يفتح المجال. اللمسة الزرقاء توجه الانتباه دون أن تسيطر.", 646, 176, 580, 150, { size: 30, bold: true, color: C.white });
  text(s, "يظهر النظام من خلال توازن الاستقامة والانحناء في الشعار، مع استخدام محدود للخط الرأسي والنقطة الماسية كعناصر مساندة.", 646, 350, 580, 130, { size: 21, color: "#FFFFFFC9" });
  rect(s, 92, 168, 76, 356, C.blue, 0);
  addImage(s, img.diamondBlue, 224, 378, 126, 126, "النقطة الماسية الزرقاء");
  rect(s, 394, 218, 76, 306, C.white, 0);
}

// 05 System overview
{
  const s = newSlide(C.cloud);
  title(s, "مكونات النظام", 5);
  const items = [
    ["01", "الشعار", "الأصل الثابت للهوية"],
    ["02", "اللون", "الأسود أساس والأزرق للإبراز"],
    ["03", "الخط", "Thmanyah Sans للعربية واللاتينية"],
    ["04", "التكوين", "مساحات هادئة ومحاور واضحة"],
    ["05", "الصورة", "المنتج أولًا والسياق الإنساني عند الحاجة"],
  ];
  let y = 152;
  for (const [num, name, desc] of items) {
    text(s, num, 70, y, 70, 54, { size: 18, bold: true, color: C.blue, align: "left" });
    text(s, name, 950, y, 276, 54, { size: 24, bold: true });
    text(s, desc, 290, y, 620, 54, { size: 20, color: C.slate });
    line(s, 70, y + 62, 1156, 0, C.line, 1);
    y += 92;
  }
}

// 06 Approved logo
{
  const s = newSlide(C.white);
  title(s, "الشعار المعتمد", 6);
  addImage(s, img.logoBlack, 130, 192, 1020, 352, "شعار جداول الأسود المعتمد");
  text(s, "يستخدم الشعار كاملًا بوصفه العلامة الأساسية. لا يعاد رسمه ولا تفصل حروفه ولا تُستبدل بخط جاهز.", 282, 566, 716, 62, { size: 20, color: C.slate, align: "center" });
  note(s, "الأصل: ملف الشعار المرفق من المستخدم. هذه الصفحة تثبت الشعار دون تعديل.");
}

// 07 Anatomy
{
  const s = newSlide(C.cloud);
  title(s, "خصائص الشعار", 7);
  addImage(s, img.logoBlack, 72, 205, 760, 310, "شعار جداول مع شرح خصائصه");
  line(s, 770, 180, 125, 80, C.blue, 2);
  line(s, 610, 396, 285, 0, C.blue, 2);
  line(s, 320, 456, 575, 94, C.blue, 2);
  text(s, "تباين الاستقامة والانحناء", 900, 146, 326, 56, { size: 21, bold: true });
  text(s, "الواو مركز إيقاع بصري", 900, 364, 326, 56, { size: 21, bold: true });
  text(s, "النقطة الماسية توقيع مساند", 900, 526, 326, 56, { size: 21, bold: true });
  text(s, "الخصائص تشرح البناء ولا تبرر تعديله.", 900, 586, 326, 40, { size: 17, color: C.slate });
}

// 08 Clear space
{
  const s = newSlide(C.white);
  title(s, "المساحة الآمنة", 8);
  rect(s, 104, 164, 1072, 424, C.cloud, 16, { style: "solid", fill: C.blueLight, width: 2 });
  addImage(s, img.logoBlack, 264, 256, 752, 250, "الشعار داخل المساحة الآمنة");
  text(s, "X", 106, 358, 72, 48, { size: 24, bold: true, color: C.blue, align: "center" });
  text(s, "X", 1104, 358, 72, 48, { size: 24, bold: true, color: C.blue, align: "center" });
  text(s, "X", 604, 164, 72, 48, { size: 24, bold: true, color: C.blue, align: "center" });
  text(s, "X", 604, 540, 72, 48, { size: 24, bold: true, color: C.blue, align: "center" });
  text(s, "X يساوي ارتفاع النقطة الماسية. اترك هذه المسافة خالية حول الشعار في جميع التطبيقات.", 260, 610, 760, 42, { size: 19, color: C.slate, align: "center" });
}

// 09 Minimum size
{
  const s = newSlide(C.cloud);
  title(s, "الحجم الأدنى", 9);
  text(s, "رقمي", 1020, 150, 206, 40, { size: 20, bold: true, color: C.blue });
  addImage(s, img.logoBlack, 726, 212, 500, 176, "الشعار بالحجم الرقمي");
  text(s, "العرض الأدنى الموصى به: مئة وعشرون بكسل", 726, 400, 500, 38, { size: 19, color: C.slate });
  text(s, "مطبوع", 432, 150, 206, 40, { size: 20, bold: true, color: C.blue });
  addImage(s, img.logoBlack, 138, 246, 500, 176, "الشعار بالحجم المطبوع");
  text(s, "العرض الأدنى الموصى به: ثلاثون مليمترًا", 138, 434, 500, 38, { size: 19, color: C.slate });
  line(s, 662, 158, 0, 390, C.line, 1);
  text(s, "إذا فقدت النقطة الماسية وضوحها أو اندمجت الفراغات الداخلية، استخدم مساحة أكبر.", 264, 564, 752, 58, { size: 20, bold: true, align: "center" });
}

// 10 Variants
{
  const s = newSlide(C.white);
  title(s, "نسخ الشعار", 10);
  rect(s, 54, 158, 558, 200, C.cloud, 18);
  addImage(s, img.logoBlack, 102, 206, 462, 108, "الشعار الأسود");
  text(s, "النسخة الأساسية", 396, 358, 216, 36, { size: 17, bold: true });
  rect(s, 668, 158, 558, 200, C.blue, 18);
  addImage(s, img.logoWhite, 716, 206, 462, 108, "الشعار الأبيض على الأزرق");
  text(s, "خلفية زرقاء", 1010, 358, 216, 36, { size: 17, bold: true });
  rect(s, 54, 426, 558, 178, C.ink, 18);
  addImage(s, img.logoWhite, 112, 464, 442, 100, "الشعار الأبيض على الأسود");
  text(s, "خلفية داكنة", 396, 604, 216, 36, { size: 17, bold: true });
  rect(s, 668, 426, 558, 178, C.white, 18, { style: "solid", fill: C.line, width: 1 });
  addImage(s, img.logoBlack, 726, 464, 442, 100, "الشعار الأسود على الأبيض");
  text(s, "خلفية بيضاء", 1010, 604, 216, 36, { size: 17, bold: true });
}

// 11 Misuse
{
  const s = newSlide(C.cloud);
  title(s, "الاستخدامات غير الصحيحة", 11);
  const labels = ["لا تمدد الشعار", "لا تغيّر التناسب", "لا تضف مؤثرات", "لا تفصل الحروف", "لا تستخدم تدرجًا", "لا تضعه على خلفية ضعيفة"];
  const xs = [54, 450, 846];
  for (let r = 0; r < 2; r++) {
    for (let c = 0; c < 3; c++) {
      const i = r * 3 + c;
      const x = xs[c], y = 154 + r * 236;
      rect(s, x, y, 350, 178, C.white, 16, { style: "solid", fill: C.line, width: 1 });
      if (i === 0) addImage(s, img.logoBlack, x + 44, y + 28, 262, 68, labels[i]);
      if (i === 1) addImage(s, img.logoBlack, x + 108, y + 18, 134, 94, labels[i]);
      if (i === 2) {
        addImage(s, img.logoBlack, x + 54, y + 26, 242, 78, labels[i]);
        rect(s, x + 50, y + 22, 250, 86, "#2563EB22", 12);
      }
      if (i === 3) addImage(s, img.diamondBlack, x + 122, y + 18, 106, 106, labels[i]);
      if (i === 4) {
        rect(s, x + 74, y + 32, 202, 62, { type: "gradient", gradientKind: "linear", angleDeg: 0, stops: [{ offset: 0, color: C.blue }, { offset: 100000, color: C.mint }] }, 8);
      }
      if (i === 5) {
        rect(s, x + 42, y + 22, 266, 92, C.blueLight, 8);
        addImage(s, img.logoBlack, x + 62, y + 44, 226, 54, labels[i]);
      }
      line(s, x + 18, y + 120, 314, 0, C.red, 2);
      text(s, labels[i], x + 28, y + 128, 294, 38, { size: 16, bold: true, color: C.red, align: "center" });
    }
  }
}

// 12 Core palette
{
  const s = newSlide(C.white);
  title(s, "لوحة الألوان الأساسية", 12);
  const swatches = [
    [C.ink, "حبر جداول", "#0B0F19", C.white],
    [C.blue, "أزرق جداول", "#2563EB", C.white],
    [C.cloud, "السحابة", "#F6F7FB", C.ink],
    [C.white, "الأبيض", "#FFFFFF", C.ink],
  ];
  swatches.forEach(([fill, name, hex, fg], i) => {
    const x = 54 + i * 294;
    rect(s, x, 158, 264, 344, fill, 18, i === 3 ? { style: "solid", fill: C.line, width: 1 } : "none");
    text(s, name, x + 22, 384, 220, 42, { size: 22, bold: true, color: fg });
    text(s, hex, x + 22, 430, 220, 32, { size: 16, color: fg, align: "left" });
  });
  text(s, "الأسود يثبت العلامة. الأزرق يوجه الانتباه. المساحات الفاتحة تدعم القراءة وكثافة البيانات.", 222, 548, 836, 62, { size: 22, bold: true, align: "center" });
}

// 13 Supporting palette
{
  const s = newSlide(C.cloud);
  title(s, "ألوان الدعم والحالات", 13);
  const colors = [
    [C.blueLight, "أزرق فاتح", "خلفيات مرتبطة بالعلامة", C.ink],
    [C.mint, "نعناعي", "نجاح وتقدم", C.ink],
    [C.amber, "كهرماني", "تنبيه يحتاج انتباهًا", C.ink],
    [C.red, "مرجاني", "خطأ أو إجراء خطير", C.white],
    [C.slate, "رمادي أردوازي", "نص ثانوي وحدود", C.white],
  ];
  colors.forEach(([fill, name, use, fg], i) => {
    const x = 54 + i * 234;
    rect(s, x, 170, 204, 250, fill, 16);
    text(s, name, x + 18, 270, 168, 36, { size: 19, bold: true, color: fg, align: "center" });
    text(s, use, x + 18, 320, 168, 68, { size: 15, color: fg, align: "center" });
  });
  text(s, "ألوان الحالات تخدم الواجهة والبيانات. لا تستخدم كبدائل للون العلامة الرئيسي.", 260, 494, 760, 58, { size: 21, bold: true, align: "center" });
  text(s, "احفظ تباينًا لا يقل عن WCAG AA للنصوص الأساسية.", 260, 558, 760, 42, { size: 18, color: C.slate, align: "center" });
}

// 14 Color proportions
{
  const s = newSlide(C.white);
  title(s, "نسب استخدام اللون", 14);
  rect(s, 78, 196, 702, 204, C.cloud, 18);
  rect(s, 780, 196, 260, 204, C.ink, 0);
  rect(s, 1040, 196, 162, 204, C.blue, 18);
  text(s, "60%", 246, 246, 240, 70, { size: 44, bold: true, color: C.ink, align: "center" });
  text(s, "25%", 790, 246, 240, 70, { size: 44, bold: true, color: C.white, align: "center" });
  text(s, "15%", 1000, 246, 190, 70, { size: 40, bold: true, color: C.white, align: "center" });
  text(s, "مساحات فاتحة", 246, 320, 240, 38, { size: 19, color: C.slate, align: "center" });
  text(s, "حبر", 790, 320, 240, 38, { size: 19, color: C.white, align: "center" });
  text(s, "إبراز", 1000, 320, 190, 38, { size: 18, color: C.white, align: "center" });
  bulletList(s, [
    "تزيد نسبة الأزرق في الحملات وصفحات التسويق.",
    "تنخفض داخل جداول البيانات حتى تبقى القراءة مريحة.",
    "يظهر الأسود في الشعار والعناوين والمعلومات ذات الأولوية.",
  ], 334, 466, 820, 144, { size: 20 });
}

// 15 Typography
{
  const s = newSlide(C.cloud);
  title(s, "النظام الطباعي", 15);
  text(s, "Thmanyah Sans Black", 690, 150, 536, 40, { size: 18, bold: true, color: C.blue, align: "left" });
  text(s, "من البيانات تُبنى الإمكانات", 454, 190, 772, 86, { size: 44, bold: true });
  text(s, "Thmanyah Sans Bold", 690, 304, 536, 40, { size: 18, bold: true, color: C.blue, align: "left" });
  text(s, "منصة عربية لبناء أنظمة العمل", 454, 344, 772, 66, { size: 31, bold: true });
  text(s, "Thmanyah Sans Regular", 690, 438, 536, 40, { size: 18, bold: true, color: C.blue, align: "left" });
  text(s, "ينظم الفريق بياناته ويحوّلها إلى نماذج وعمليات قابلة للتطوير.", 454, 478, 772, 68, { size: 23 });
  rect(s, 54, 152, 322, 420, C.ink, 24);
  text(s, "أبجد هوز\n0123456789\nABC abc", 90, 218, 250, 254, { size: 38, bold: true, color: C.white, align: "center" });
  text(s, "العناوين Black أو Bold\nالنصوص Regular\nالتسميات Medium", 88, 488, 254, 72, { size: 17, color: "#FFFFFFC9", align: "center" });
  note(s, "يعتمد ظهور الخط في PPTX على تثبيت عائلة Thmanyah Sans. توفر نسخة PDF مظهرًا ثابتًا.");
}

// 16 Bilingual typesetting
{
  const s = newSlide(C.white);
  title(s, "العربية والإنجليزية", 16);
  rect(s, 54, 160, 558, 420, C.cloud, 20);
  text(s, "العربية تقود التكوين", 92, 198, 482, 52, { size: 29, bold: true });
  text(s, "نبدأ من اليمين، ونحافظ على سطر قصير ومسافة واضحة بين العنوان والنص.", 92, 270, 482, 96, { size: 21 });
  text(s, "آخر تحديث: التاسع عشر من سبتمبر، عام ألفين وستة وعشرين", 92, 398, 482, 46, { size: 18, color: C.slate });
  text(s, "تُكتب المصطلحات التقنية الإنجليزية بحروفها الأصلية.", 92, 462, 482, 46, { size: 18, color: C.slate });
  rect(s, 668, 160, 558, 420, C.ink, 20);
  text(s, "English supports the system", 704, 198, 486, 52, { size: 28, bold: true, color: C.white, align: "left" });
  text(s, "Use clear sentence case, short lines and consistent spacing. Keep long English passages in separate left-to-right text boxes.", 704, 270, 486, 122, { size: 20, color: "#FFFFFFD9", align: "left" });
  text(s, "Updated: 19 September 2026", 704, 420, 486, 46, { size: 17, color: "#FFFFFFAA", align: "left" });
  text(s, "Product terms remain consistent.", 704, 484, 486, 46, { size: 17, color: "#FFFFFFAA", align: "left" });
}

// 17 Graphic device
{
  const s = newSlide(C.ink);
  title(s, "العنصر البصري المساند", 17, { color: C.white, ruleColor: "#FFFFFF2D", dark: true });
  rect(s, 92, 182, 72, 338, C.blue, 0);
  rect(s, 224, 258, 72, 262, C.white, 0);
  addImage(s, img.diamondBlue, 356, 392, 120, 120, "النقطة الماسية الزرقاء");
  text(s, "الخط الرأسي", 688, 176, 538, 46, { size: 27, bold: true, color: C.white });
  text(s, "مستمد من الألف واللام. يستخدم كحافة أو فاصل أو نقطة ارتكاز، ولا يتحول إلى نمط متكرر كثيف.", 688, 230, 538, 92, { size: 20, color: "#FFFFFFC9" });
  text(s, "النقطة الماسية", 688, 360, 538, 46, { size: 27, bold: true, color: C.white });
  text(s, "مستمدة من نقطة الجيم. تشير إلى قرار أو نقطة تركيز. لا تستخدم منفردة بدل الشعار.", 688, 414, 538, 92, { size: 20, color: "#FFFFFFC9" });
}

// 18 Layout grid
{
  const s = newSlide(C.cloud);
  title(s, "شبكة التكوين", 18);
  rect(s, 54, 152, 760, 454, C.white, 18);
  for (let i = 1; i < 6; i++) line(s, 54 + i * 126.7, 152, 0, 454, "#2563EB33", 1);
  for (let i = 1; i < 4; i++) line(s, 54, 152 + i * 113.5, 760, 0, "#2563EB33", 1);
  rect(s, 560, 188, 218, 72, C.blue, 0);
  rect(s, 92, 286, 452, 64, C.ink, 0);
  rect(s, 92, 384, 686, 156, C.blueLight, 0);
  text(s, "6 أعمدة", 916, 166, 310, 50, { size: 29, bold: true });
  bulletList(s, [
    "المحتوى العربي يبدأ من اليمين.",
    "يتغير عرض الأعمدة حسب كثافة المعلومات.",
    "تسبق المساحات البيضاء الزخرفة.",
    "العنصر الأزرق يحدد مركز الانتباه.",
  ], 858, 238, 368, 240, { size: 20 });
  text(s, "يمكن للواجهة استخدام شبكة أدق، لكن يبقى الإيقاع العام هادئًا وواضحًا.", 858, 510, 368, 72, { size: 18, color: C.slate });
}

// 19 Imagery
{
  const s = newSlide(C.white);
  title(s, "أسلوب الصور", 19);
  rect(s, 54, 156, 520, 410, C.blueLight, 24);
  text(s, "المنتج هو البطل", 94, 198, 440, 58, { size: 32, bold: true });
  text(s, "تُظهر الصور مهمة واضحة داخل جداول، مع بيانات تجريبية ومقتطف مقروء من الواجهة.", 94, 280, 440, 110, { size: 22 });
  text(s, "عند استخدام الأشخاص، يظهر السياق السعودي طبيعيًا في بيئة العمل. لا نستخدم المصافحات أو غرف الخوادم أو الأقفال.", 94, 406, 440, 120, { size: 20, color: C.slate });
  rect(s, 640, 156, 586, 410, C.cloud, 24);
  rect(s, 686, 204, 494, 276, C.white, 14, { style: "solid", fill: C.line, width: 1 });
  rect(s, 706, 228, 110, 228, C.ink, 10);
  rect(s, 836, 232, 316, 32, C.blueLight, 6);
  rect(s, 836, 286, 262, 24, C.line, 4);
  rect(s, 836, 330, 306, 24, C.line, 4);
  rect(s, 836, 374, 214, 24, C.mint, 4);
  addImage(s, img.diamondBlue, 1096, 414, 52, 52, "إشارة تركيز");
  text(s, "نموذج إخراج واجهة", 834, 488, 318, 34, { size: 17, color: C.slate, align: "center" });
}

// 20 Iconography
{
  const s = newSlide(C.cloud);
  title(s, "الأيقونات والرسوم", 20);
  text(s, "وظيفية، بسيطة، ومتجانسة مع وزن الخط", 606, 154, 620, 64, { size: 30, bold: true });
  bulletList(s, [
    "زوايا مدروسة تجمع الاستقامة والانحناء.",
    "سُمك موحد داخل المجموعة الواحدة.",
    "أشكال مفهومة دون استعارات تقنية مستهلكة.",
    "نسخة ممتلئة للحالات النشطة وخطية للحالات العادية.",
  ], 664, 250, 562, 230, { size: 21 });
  rect(s, 54, 152, 472, 414, C.ink, 26);
  const ix = [104, 218, 332, 446];
  ix.forEach((x, i) => {
    rect(s, x, 220, 70, 70, i === 1 ? C.blue : C.white, 14);
    addImage(s, i === 1 ? img.diamondBlack : img.diamondBlue, x + 18, 238, 34, 34, "مثال أيقونة");
    rect(s, x, 340, 70, 70, i === 2 ? C.blueLight : "#FFFFFF18", 14);
    addImage(s, img.diamondBlue, x + 20, 360, 30, 30, "مثال أيقونة");
  });
  text(s, "هذه أمثلة على الوزن والإيقاع، وليست مكتبة أيقونات نهائية.", 664, 514, 562, 50, { size: 18, color: C.slate });
}

// 21 Data visualization
{
  const s = newSlide(C.white);
  title(s, "البيانات والمخططات", 21);
  rect(s, 54, 154, 748, 430, C.cloud, 20);
  line(s, 108, 514, 630, 0, C.slate, 1);
  const vals = [128, 216, 174, 302, 246];
  vals.forEach((v, i) => {
    rect(s, 130 + i * 116, 514 - v, 64, v, i === 3 ? C.blue : C.blueLight, 6);
    text(s, ["يناير", "فبراير", "مارس", "أبريل", "مايو"][i], 112 + i * 116, 528, 100, 28, { size: 14, color: C.slate, align: "center" });
  });
  text(s, "حجم الطلبات", 100, 174, 260, 42, { size: 22, bold: true, align: "left" });
  text(s, "رقم توضيحي", 100, 218, 260, 30, { size: 14, color: C.slate, align: "left" });
  bulletList(s, [
    "استخدم الأزرق لإبراز سلسلة أو قيمة واحدة.",
    "لا تعتمد على اللون وحده لتمييز الحالات.",
    "اكتب الوحدات والمصادر بوضوح.",
    "تجنب الزخرفة والمؤثرات ثلاثية الأبعاد.",
  ], 858, 178, 368, 240, { size: 20 });
  text(s, "المخطط مثال بصري ولا يمثل بيانات تشغيلية حقيقية.", 858, 490, 368, 56, { size: 17, color: C.slate });
}

// 22 Product and web
{
  const s = newSlide(C.cloud);
  title(s, "المنتج والموقع", 22);
  rect(s, 54, 152, 760, 456, C.white, 22, { style: "solid", fill: C.line, width: 1 });
  rect(s, 54, 152, 760, 42, C.ink, 22);
  addImage(s, img.logoWhite, 606, 158, 164, 32, "شعار جداول في شريط المنتج");
  rect(s, 54, 194, 160, 414, C.ink, 0);
  rect(s, 84, 236, 100, 16, "#FFFFFF33", 5);
  rect(s, 84, 278, 100, 16, C.blue, 5);
  rect(s, 84, 320, 100, 16, "#FFFFFF33", 5);
  rect(s, 244, 230, 530, 54, C.blueLight, 10);
  for (let i = 0; i < 5; i++) {
    line(s, 244, 320 + i * 48, 530, 0, C.line, 1);
    rect(s, 268, 334 + i * 48, 130 + (i % 2) * 90, 16, i === 2 ? C.mint : "#C8CFDB", 4);
  }
  text(s, "واجهة المنتج", 858, 160, 368, 48, { size: 27, bold: true });
  bulletList(s, [
    "يحافظ الأسود على ثبات الإطار العام.",
    "يحدد الأزرق الإجراء النشط فقط.",
    "تستخدم الخلفيات الفاتحة لكثافة البيانات.",
    "يبقى الشعار واضحًا دون منافسة المحتوى.",
  ], 858, 232, 368, 244, { size: 20 });
  text(s, "النموذج يوضح تطبيق الهوية ولا يمثل تصميم واجهة نهائيًا.", 858, 520, 368, 56, { size: 17, color: C.slate });
}

// 23 Documents and sales
{
  const s = newSlide(C.white);
  title(s, "المستندات وعروض المبيعات", 23);
  rect(s, 54, 158, 326, 430, C.ink, 18);
  addImage(s, img.logoWhite, 88, 196, 258, 96, "شعار جداول على غلاف تقرير");
  rect(s, 88, 354, 54, 174, C.blue, 0);
  text(s, "تقرير\nالتحول الرقمي", 166, 350, 164, 116, { size: 29, bold: true, color: C.white });
  text(s, "2026", 166, 484, 164, 36, { size: 18, color: "#FFFFFF99", align: "left" });
  rect(s, 448, 158, 778, 430, C.cloud, 18);
  addImage(s, img.logoBlack, 898, 190, 278, 80, "شعار جداول في عرض مبيعات");
  text(s, "عنوان مباشر يشرح الموضوع", 624, 284, 552, 64, { size: 32, bold: true });
  text(s, "استخدم جملة قصيرة، ثم اعرض المنتج أو الدليل الذي يدعمها. تتبع الشرائح شبكة ثابتة مع تنوع محسوب في المساحات.", 624, 362, 552, 112, { size: 21 });
  rect(s, 488, 272, 74, 226, C.blue, 0);
  addImage(s, img.diamondBlue, 500, 510, 52, 52, "النقطة الماسية");
}

// 24 Governance
{
  const s = newSlide(C.blue);
  title(s, "الحوكمة والتسليم", 24, { color: C.white, ruleColor: "#FFFFFF33", dark: true });
  text(s, "الأصول المعتمدة", 842, 158, 384, 48, { size: 27, bold: true, color: C.white });
  bulletList(s, [
    "الشعار الأسود الشفاف.",
    "الشعار الأبيض الشفاف.",
    "نسخ العرض على الأزرق والأسود والفاتح.",
    "لوحة الألوان والخطوط وقواعد الاستخدام.",
  ], 690, 224, 536, 214, { size: 20, color: C.white });
  text(s, "قرارات تحتاج اعتمادًا لاحقًا", 842, 470, 384, 48, { size: 27, bold: true, color: C.white });
  text(s, "أيقونة التطبيق، الرمز المستقل، مكتبة الأيقونات الكاملة، الحركة، وقوالب المنتج التفصيلية.", 690, 526, 536, 72, { size: 20, color: "#FFFFFFD9" });
  rect(s, 54, 156, 522, 442, C.white, 24);
  addImage(s, img.logoBlack, 102, 218, 426, 140, "شعار جداول المعتمد");
  text(s, "مالك الهوية", 104, 410, 420, 38, { size: 18, bold: true, color: C.blue, align: "center" });
  text(s, "فريق العلامة والتصميم", 104, 452, 420, 46, { size: 25, bold: true, align: "center" });
  text(s, "الإصدار 1.0", 104, 518, 420, 34, { size: 17, color: C.slate, align: "center" });
}

await (await PresentationFile.exportPptx(deck)).save(RAW);
console.log(JSON.stringify({ raw: RAW, slides: deck.slides.length }));
