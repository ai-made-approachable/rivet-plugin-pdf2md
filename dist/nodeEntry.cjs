"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/nodeEntry.ts
var nodeEntry_exports = {};
__export(nodeEntry_exports, {
  convertHTMLToMd: () => convertHTMLToMd,
  convertPdfToMd: () => convertPdfToMd
});
module.exports = __toCommonJS(nodeEntry_exports);

// src/impl/runPdf2md.ts
var import_fs = __toESM(require("fs"), 1);
var import_pdf2md = __toESM(require("@opendocsg/pdf2md"), 1);
async function convertPdfToMd(filePath) {
  const pdfBuffer = import_fs.default.readFileSync(filePath);
  try {
    const text = await (0, import_pdf2md.default)(pdfBuffer);
    return text;
  } catch (err) {
    console.error(err);
    return "";
  }
}

// src/impl/runHTML2md.ts
var import_fs2 = __toESM(require("fs"), 1);
var import_node_html_markdown = require("node-html-markdown");
async function convertHTMLToMd(filePath) {
  const htmlBuffer = import_fs2.default.readFileSync(filePath);
  try {
    const text = import_node_html_markdown.NodeHtmlMarkdown.translate(
      /* html */
      htmlBuffer.toString(),
      // Convert htmlBuffer to string
      /* options (optional) */
      {},
      /* customTranslators (optional) */
      void 0,
      /* customCodeBlockTranslators (optional) */
      void 0
    );
    return text;
  } catch (err) {
    console.error(err);
    return "";
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  convertHTMLToMd,
  convertPdfToMd
});
