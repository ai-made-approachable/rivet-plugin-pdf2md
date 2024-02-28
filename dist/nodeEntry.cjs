"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
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

// node_modules/@opendocsg/pdf2md/lib/util/string-functions.js
var require_string_functions = __commonJS({
  "node_modules/@opendocsg/pdf2md/lib/util/string-functions.js"(exports) {
    var MIN_DIGIT_CHAR_CODE = 48;
    var MAX_DIGIT_CHAR_CODE = 57;
    var WHITESPACE_CHAR_CODE = 32;
    var TAB_CHAR_CODE = 9;
    var DOT_CHAR_CODE = 46;
    exports.removeLeadingWhitespaces = function removeLeadingWhitespaces(string) {
      while (string.charCodeAt(0) === WHITESPACE_CHAR_CODE) {
        string = string.substring(1, string.length);
      }
      return string;
    };
    exports.removeTrailingWhitespaces = function removeTrailingWhitespaces(string) {
      while (string.charCodeAt(string.length - 1) === WHITESPACE_CHAR_CODE) {
        string = string.substring(0, string.length - 1);
      }
      return string;
    };
    exports.isDigit = function isDigit(charCode) {
      return charCode >= MIN_DIGIT_CHAR_CODE && charCode <= MAX_DIGIT_CHAR_CODE;
    };
    exports.isNumber = function isNumber(string) {
      for (var i = 0; i < string.length; i++) {
        const charCode = string.charCodeAt(i);
        if (!exports.isDigit(charCode)) {
          return false;
        }
      }
      return true;
    };
    exports.hasOnly = function hasOnly(string, char) {
      const charCode = char.charCodeAt(0);
      for (var i = 0; i < string.length; i++) {
        const aCharCode = string.charCodeAt(i);
        if (aCharCode !== charCode) {
          return false;
        }
      }
      return true;
    };
    exports.hasUpperCaseCharacterInMiddleOfWord = function hasUpperCaseCharacterInMiddleOfWord(text) {
      var beginningOfWord = true;
      for (var i = 0; i < text.length; i++) {
        const character = text.charAt(i);
        if (character === " ") {
          beginningOfWord = true;
        } else {
          if (!beginningOfWord && isNaN(character * 1) && character === character.toUpperCase() && character.toUpperCase() !== character.toLowerCase()) {
            return true;
          }
          beginningOfWord = false;
        }
      }
      return false;
    };
    exports.normalizedCharCodeArray = function normalizedCharCodeArray(string) {
      string = string.toUpperCase();
      return exports.charCodeArray(string).filter((charCode) => charCode !== WHITESPACE_CHAR_CODE && charCode !== TAB_CHAR_CODE && charCode !== DOT_CHAR_CODE);
    };
    exports.charCodeArray = function charCodeArray(string) {
      const charCodes = [];
      for (var i = 0; i < string.length; i++) {
        charCodes.push(string.charCodeAt(i));
      }
      return charCodes;
    };
    exports.prefixAfterWhitespace = function prefixAfterWhitespace(prefix, string) {
      if (string.charCodeAt(0) === WHITESPACE_CHAR_CODE) {
        string = exports.removeLeadingWhitespaces(string);
        return " " + prefix + string;
      } else {
        return prefix + string;
      }
    };
    exports.suffixBeforeWhitespace = function suffixBeforeWhitespace(string, suffix) {
      if (string.charCodeAt(string.length - 1) === WHITESPACE_CHAR_CODE) {
        string = exports.removeTrailingWhitespaces(string);
        return string + suffix + " ";
      } else {
        return string + suffix;
      }
    };
    exports.isListItemCharacter = function isListItemCharacter(string) {
      if (string.length > 1) {
        return false;
      }
      const char = string.charAt(0);
      return char === "-" || char === "\u2022" || char === "\u2013";
    };
    exports.isListItem = function isListItem(string) {
      return /^[\s]*[-•–][\s].*$/g.test(string);
    };
    exports.isNumberedListItem = function isNumberedListItem(string) {
      return /^[\s]*[\d]*[.][\s].*$/g.test(string);
    };
    exports.wordMatch = function wordMatch(string1, string2) {
      const words1 = new Set(string1.toUpperCase().split(" "));
      const words2 = new Set(string2.toUpperCase().split(" "));
      const intersection = new Set(
        [...words1].filter((x) => words2.has(x))
      );
      return intersection.size / Math.max(words1.size, words2.size);
    };
  }
});

// node_modules/@opendocsg/pdf2md/lib/util/page-number-functions.js
var require_page_number_functions = __commonJS({
  "node_modules/@opendocsg/pdf2md/lib/util/page-number-functions.js"(exports) {
    var { removeLeadingWhitespaces, removeTrailingWhitespaces, isNumber } = require_string_functions();
    var searchRange = (numerator, denominator, length) => {
      return Math.floor(numerator / denominator * length);
    };
    var searchArea = (range, pageIndexNumMap, pageIndex) => {
      for (const { str } of range) {
        const trimLeadingWhitespaces = removeLeadingWhitespaces(str);
        const trimWhitespaces = removeTrailingWhitespaces(trimLeadingWhitespaces);
        if (isNumber(trimWhitespaces)) {
          if (!pageIndexNumMap[pageIndex]) {
            pageIndexNumMap[pageIndex] = [];
          }
          pageIndexNumMap[pageIndex].push(Number(trimWhitespaces));
        }
      }
      return pageIndexNumMap;
    };
    exports.findPageNumbers = (pageIndexNumMap, pageIndex, items) => {
      const topArea = searchRange(1, 6, items.length);
      const bottomArea = searchRange(5, 6, items.length);
      const topAreaResult = searchArea(items.slice(0, topArea), pageIndexNumMap, pageIndex);
      return searchArea(items.slice(bottomArea), topAreaResult, pageIndex);
    };
    exports.findFirstPage = (pageIndexNumMap) => {
      let counter = 0;
      const keys = Object.keys(pageIndexNumMap);
      if (keys.length === 0 || keys.length === 1) {
        return;
      }
      for (let x = 0; x < keys.length - 1; x++) {
        const firstPage = pageIndexNumMap[keys[x]];
        const secondPage = pageIndexNumMap[keys[x + 1]];
        const prevCounter = counter;
        for (let y = 0; y < firstPage.length && counter < 2; y++) {
          for (let z = 0; z < secondPage.length && counter < 2; z++) {
            const pageDifference = keys[x + 1] - keys[x];
            if (firstPage[y] + 1 === secondPage[z]) {
              counter++;
            } else if (pageDifference > 1 && firstPage[y] + pageDifference === secondPage[z]) {
              counter++;
            }
          }
        }
        let pageDetails = x > 0 ? Object.entries(pageIndexNumMap)[x - 1] : Object.entries(pageIndexNumMap)[x];
        if (prevCounter === counter) {
          counter = 0;
          pageDetails = Object.entries(pageIndexNumMap)[x];
        } else if (counter >= 2) {
          return { pageIndex: Number(pageDetails[0]), pageNum: pageDetails[1][0] };
        }
      }
    };
    exports.removePageNumber = (textContent, pageNum) => {
      const filteredContent = { items: [...textContent.items] };
      const topArea = searchRange(1, 6, filteredContent.items.length);
      const bottomArea = searchRange(5, 6, filteredContent.items.length);
      filteredContent.items = filteredContent.items.filter((item, index) => {
        const isAtTop = index > 0 && index < topArea;
        const isAtBottom = index > bottomArea && index < filteredContent.items.length;
        return isAtTop || isAtBottom ? Number(item.str) !== Number(pageNum) : item;
      });
      return filteredContent;
    };
  }
});

// node_modules/@opendocsg/pdf2md/lib/models/PageItem.js
var require_PageItem = __commonJS({
  "node_modules/@opendocsg/pdf2md/lib/models/PageItem.js"(exports, module2) {
    module2.exports = class PageItem {
      constructor(options) {
        if (this.constructor === PageItem) {
          throw new TypeError("Can not construct abstract class.");
        }
        this.type = options.type;
        this.annotation = options.annotation;
        this.parsedElements = options.parsedElements;
      }
    };
  }
});

// node_modules/@opendocsg/pdf2md/lib/models/TextItem.js
var require_TextItem = __commonJS({
  "node_modules/@opendocsg/pdf2md/lib/models/TextItem.js"(exports, module2) {
    var PageItem = require_PageItem();
    module2.exports = class TextItem extends PageItem {
      constructor(options) {
        super(options);
        this.x = options.x;
        this.y = options.y;
        this.width = options.width;
        this.height = options.height;
        this.text = options.text;
        this.font = options.font;
        this.lineFormat = options.lineFormat;
        this.unopenedFormat = options.unopenedFormat;
        this.unclosedFormat = options.unclosedFormat;
      }
    };
  }
});

// node_modules/@opendocsg/pdf2md/lib/models/Page.js
var require_Page = __commonJS({
  "node_modules/@opendocsg/pdf2md/lib/models/Page.js"(exports, module2) {
    module2.exports = class Page {
      constructor(options) {
        this.index = options.index;
        this.items = options.items || [];
      }
    };
  }
});

// node_modules/@opendocsg/pdf2md/lib/util/pdf.js
var require_pdf = __commonJS({
  "node_modules/@opendocsg/pdf2md/lib/util/pdf.js"(exports) {
    var path = require("path");
    var pdfjs = require("pdfjs-dist/legacy/build/pdf");
    pdfjs.GlobalWorkerOptions.workerSrc = `pdfjs-dist/legacy/build/pdf.worker`;
    var { findPageNumbers, findFirstPage, removePageNumber } = require_page_number_functions();
    var TextItem = require_TextItem();
    var Page = require_Page();
    var NO_OP = () => {
    };
    exports.parse = async function parse(docOptions, callbacks) {
      const { metadataParsed, pageParsed, fontParsed, documentParsed } = {
        metadataParsed: NO_OP,
        pageParsed: NO_OP,
        fontParsed: NO_OP,
        documentParsed: NO_OP,
        ...callbacks || {}
      };
      const fontDataPath = path.join(path.resolve(require.resolve("pdfjs-dist"), "../../standard_fonts"), "/");
      const pdfDocument = await pdfjs.getDocument(
        {
          data: docOptions,
          standardFontDataUrl: fontDataPath
        }
      ).promise;
      const metadata = await pdfDocument.getMetadata();
      metadataParsed(metadata);
      const pages = [...Array(pdfDocument.numPages).keys()].map(
        (index) => new Page({ index })
      );
      documentParsed(pdfDocument, pages);
      const fonts = {
        ids: /* @__PURE__ */ new Set(),
        map: /* @__PURE__ */ new Map()
      };
      let pageIndexNumMap = {};
      let firstPage;
      for (let j = 1; j <= pdfDocument.numPages; j++) {
        const page = await pdfDocument.getPage(j);
        const textContent = await page.getTextContent();
        if (Object.keys(pageIndexNumMap).length < 10) {
          pageIndexNumMap = findPageNumbers(pageIndexNumMap, page.pageNumber - 1, textContent.items);
        } else {
          firstPage = findFirstPage(pageIndexNumMap);
          break;
        }
      }
      let pageNum = firstPage ? firstPage.pageNum : 0;
      for (let j = 1; j <= pdfDocument.numPages; j++) {
        const page = await pdfDocument.getPage(j);
        await page.getOperatorList();
        const scale = 1;
        const viewport = page.getViewport({ scale });
        let textContent = await page.getTextContent();
        if (firstPage && page.pageIndex >= firstPage.pageIndex) {
          textContent = removePageNumber(textContent, pageNum);
          pageNum++;
        }
        const textItems = textContent.items.map((item) => {
          const tx = pdfjs.Util.transform(
            viewport.transform,
            item.transform
          );
          const fontHeight = Math.sqrt(tx[2] * tx[2] + tx[3] * tx[3]);
          const dividedHeight = item.height / fontHeight;
          return new TextItem({
            x: Math.round(item.transform[4]),
            y: Math.round(item.transform[5]),
            width: Math.round(item.width),
            height: Math.round(dividedHeight <= 1 ? item.height : dividedHeight),
            text: item.str,
            font: item.fontName
          });
        });
        pages[page.pageNumber - 1].items = textItems;
        pageParsed(pages);
        const fontIds = new Set(textItems.map((t) => t.font));
        for (const fontId of fontIds) {
          if (!fonts.ids.has(fontId) && fontId.startsWith("g_d")) {
            const transport = pdfDocument.transport || pdfDocument._transport;
            const font = await new Promise(
              (resolve) => transport.commonObjs.get(fontId, resolve)
            );
            fonts.ids.add(fontId);
            fonts.map.set(fontId, font);
            fontParsed(fonts);
          }
        }
      }
      return {
        fonts,
        metadata,
        pages,
        pdfDocument
      };
    };
  }
});

// node_modules/@opendocsg/pdf2md/lib/models/transformations/Transformation.js
var require_Transformation = __commonJS({
  "node_modules/@opendocsg/pdf2md/lib/models/transformations/Transformation.js"(exports, module2) {
    module2.exports = class Transformation {
      constructor(name, itemType) {
        if (this.constructor === Transformation) {
          throw new TypeError("Can not construct abstract class.");
        }
        if (this.transform === Transformation.prototype.transform) {
          throw new TypeError("Please implement abstract method 'transform()'.");
        }
        this.name = name;
        this.itemType = itemType;
      }
      // Transform an incoming ParseResult into an outgoing ParseResult
      transform(parseResult) {
        throw new TypeError("Do not call abstract method foo from child.");
      }
      // Sometimes the transform() does only visualize a change. This methods then does the actual change.
      completeTransform(parseResult) {
        parseResult.messages = [];
        return parseResult;
      }
    };
  }
});

// node_modules/@opendocsg/pdf2md/lib/models/Annotation.js
var require_Annotation = __commonJS({
  "node_modules/@opendocsg/pdf2md/lib/models/Annotation.js"(exports) {
    var Annotation = class {
      constructor(options) {
        this.category = options.category;
        this.color = options.color;
      }
    };
    exports.default = Annotation;
    exports.ADDED_ANNOTATION = new Annotation({
      category: "Added",
      color: "green"
    });
    exports.REMOVED_ANNOTATION = new Annotation({
      category: "Removed",
      color: "red"
    });
    exports.UNCHANGED_ANNOTATION = new Annotation({
      category: "Unchanged",
      color: "brown"
    });
    exports.DETECTED_ANNOTATION = new Annotation({
      category: "Detected",
      color: "green"
    });
    exports.MODIFIED_ANNOTATION = new Annotation({
      category: "Modified",
      color: "green"
    });
  }
});

// node_modules/@opendocsg/pdf2md/lib/models/transformations/ToTextItemTransformation.js
var require_ToTextItemTransformation = __commonJS({
  "node_modules/@opendocsg/pdf2md/lib/models/transformations/ToTextItemTransformation.js"(exports, module2) {
    var Transformation = require_Transformation();
    var TextItem = require_TextItem();
    var { REMOVED_ANNOTATION } = require_Annotation();
    module2.exports = class ToTextItemTransformation extends Transformation {
      constructor(name) {
        super(name, TextItem.name);
        if (this.constructor === ToTextItemTransformation) {
          throw new TypeError("Can not construct abstract class.");
        }
      }
      completeTransform(parseResult) {
        parseResult.messages = [];
        parseResult.pages.forEach((page) => {
          page.items = page.items.filter((item) => !item.annotation || item.annotation !== REMOVED_ANNOTATION);
          page.items.forEach((item) => item.annotation = null);
        });
        return parseResult;
      }
    };
  }
});

// node_modules/@opendocsg/pdf2md/lib/models/ParseResult.js
var require_ParseResult = __commonJS({
  "node_modules/@opendocsg/pdf2md/lib/models/ParseResult.js"(exports, module2) {
    module2.exports = class ParseResult {
      constructor(options) {
        this.pages = options.pages;
        this.globals = options.globals;
        this.messages = options.messages;
      }
    };
  }
});

// node_modules/enumify/lib/enumify.js
var require_enumify = __commonJS({
  "node_modules/enumify/lib/enumify.js"(exports) {
    "use strict";
    var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function(obj) {
      return typeof obj;
    } : function(obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj;
    };
    var _createClass = function() {
      function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
          var descriptor = props[i];
          descriptor.enumerable = descriptor.enumerable || false;
          descriptor.configurable = true;
          if ("value" in descriptor)
            descriptor.writable = true;
          Object.defineProperty(target, descriptor.key, descriptor);
        }
      }
      return function(Constructor, protoProps, staticProps) {
        if (protoProps)
          defineProperties(Constructor.prototype, protoProps);
        if (staticProps)
          defineProperties(Constructor, staticProps);
        return Constructor;
      };
    }();
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.copyProperties = copyProperties;
    function _classCallCheck(instance, Constructor) {
      if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
      }
    }
    var INITIALIZED = Symbol();
    var Enum = exports.Enum = function() {
      function Enum2() {
        var instanceProperties = arguments.length <= 0 || arguments[0] === void 0 ? void 0 : arguments[0];
        _classCallCheck(this, Enum2);
        if ({}.hasOwnProperty.call(this.constructor, INITIALIZED)) {
          throw new Error("Enum classes can\u2019t be instantiated");
        }
        if ((typeof instanceProperties === "undefined" ? "undefined" : _typeof(instanceProperties)) === "object" && instanceProperties !== null) {
          copyProperties(this, instanceProperties);
        }
      }
      _createClass(Enum2, [{
        key: "toString",
        /**
         * Default `toString()` method for enum constant.
         */
        value: function toString() {
          return this.constructor.name + "." + this.name;
        }
      }], [{
        key: "initEnum",
        value: function initEnum(arg) {
          Object.defineProperty(this, "enumValues", {
            value: [],
            configurable: false,
            writable: false,
            enumerable: true
          });
          if (Array.isArray(arg)) {
            this._enumValuesFromArray(arg);
          } else {
            this._enumValuesFromObject(arg);
          }
          Object.freeze(this.enumValues);
          this[INITIALIZED] = true;
          return this;
        }
      }, {
        key: "_enumValuesFromArray",
        value: function _enumValuesFromArray(arr) {
          var _iteratorNormalCompletion = true;
          var _didIteratorError = false;
          var _iteratorError = void 0;
          try {
            for (var _iterator = arr[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
              var key = _step.value;
              this._pushEnumValue(new this(), key);
            }
          } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion && _iterator.return) {
                _iterator.return();
              }
            } finally {
              if (_didIteratorError) {
                throw _iteratorError;
              }
            }
          }
        }
      }, {
        key: "_enumValuesFromObject",
        value: function _enumValuesFromObject(obj) {
          var _iteratorNormalCompletion2 = true;
          var _didIteratorError2 = false;
          var _iteratorError2 = void 0;
          try {
            for (var _iterator2 = Object.keys(obj)[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
              var key = _step2.value;
              var value = new this(obj[key]);
              this._pushEnumValue(value, key);
            }
          } catch (err) {
            _didIteratorError2 = true;
            _iteratorError2 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion2 && _iterator2.return) {
                _iterator2.return();
              }
            } finally {
              if (_didIteratorError2) {
                throw _iteratorError2;
              }
            }
          }
        }
      }, {
        key: "_pushEnumValue",
        value: function _pushEnumValue(enumValue, name) {
          enumValue.name = name;
          enumValue.ordinal = this.enumValues.length;
          Object.defineProperty(this, name, {
            value: enumValue,
            configurable: false,
            writable: false,
            enumerable: true
          });
          this.enumValues.push(enumValue);
        }
        /**
         * Given the name of an enum constant, return its value.
         */
      }, {
        key: "enumValueOf",
        value: function enumValueOf(name) {
          return this.enumValues.find(function(x) {
            return x.name === name;
          });
        }
        /**
         * Make enum classes iterable
         */
      }, {
        key: Symbol.iterator,
        value: function value() {
          return this.enumValues[Symbol.iterator]();
        }
      }]);
      return Enum2;
    }();
    function copyProperties(target, source) {
      var _iteratorNormalCompletion3 = true;
      var _didIteratorError3 = false;
      var _iteratorError3 = void 0;
      try {
        for (var _iterator3 = Object.getOwnPropertyNames(source)[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
          var key = _step3.value;
          var desc = Object.getOwnPropertyDescriptor(source, key);
          Object.defineProperty(target, key, desc);
        }
      } catch (err) {
        _didIteratorError3 = true;
        _iteratorError3 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion3 && _iterator3.return) {
            _iterator3.return();
          }
        } finally {
          if (_didIteratorError3) {
            throw _iteratorError3;
          }
        }
      }
      return target;
    }
  }
});

// node_modules/@opendocsg/pdf2md/lib/models/markdown/WordFormat.js
var require_WordFormat = __commonJS({
  "node_modules/@opendocsg/pdf2md/lib/models/markdown/WordFormat.js"(exports, module2) {
    var { Enum } = require_enumify();
    var WordFormat = class extends Enum {
    };
    module2.exports = WordFormat;
    WordFormat.initEnum({
      BOLD: {
        startSymbol: "**",
        endSymbol: "**"
      },
      OBLIQUE: {
        startSymbol: "_",
        endSymbol: "_"
      },
      BOLD_OBLIQUE: {
        startSymbol: "**_",
        endSymbol: "_**"
      }
    });
  }
});

// node_modules/@opendocsg/pdf2md/lib/models/transformations/text-item/CalculateGlobalStats.js
var require_CalculateGlobalStats = __commonJS({
  "node_modules/@opendocsg/pdf2md/lib/models/transformations/text-item/CalculateGlobalStats.js"(exports, module2) {
    var ToTextItemTransformation = require_ToTextItemTransformation();
    var ParseResult = require_ParseResult();
    var WordFormat = require_WordFormat();
    module2.exports = class CalculateGlobalStats extends ToTextItemTransformation {
      constructor(fontMap) {
        super("$1");
        this.fontMap = fontMap;
      }
      transform(parseResult) {
        const heightToOccurrence = {};
        const fontToOccurrence = {};
        var maxHeight = 0;
        var maxHeightFont;
        parseResult.pages.forEach((page) => {
          page.items.forEach((item) => {
            if (!item.height)
              return;
            heightToOccurrence[item.height] = heightToOccurrence[item.height] ? heightToOccurrence[item.height] + 1 : 1;
            fontToOccurrence[item.font] = fontToOccurrence[item.font] ? fontToOccurrence[item.font] + 1 : 1;
            if (item.height > maxHeight) {
              maxHeight = item.height;
              maxHeightFont = item.font;
            }
          });
        });
        const mostUsedHeight = parseInt(getMostUsedKey(heightToOccurrence));
        const mostUsedFont = getMostUsedKey(fontToOccurrence);
        const distanceToOccurrence = {};
        parseResult.pages.forEach((page) => {
          var lastItemOfMostUsedHeight;
          page.items.forEach((item) => {
            if (item.height === mostUsedHeight && item.text.trim().length > 0) {
              if (lastItemOfMostUsedHeight && item.y !== lastItemOfMostUsedHeight.y) {
                const distance = lastItemOfMostUsedHeight.y - item.y;
                if (distance > 0) {
                  distanceToOccurrence[distance] = distanceToOccurrence[distance] ? distanceToOccurrence[distance] + 1 : 1;
                }
              }
              lastItemOfMostUsedHeight = item;
            } else {
              lastItemOfMostUsedHeight = null;
            }
          });
        });
        const mostUsedDistance = parseInt(getMostUsedKey(distanceToOccurrence));
        const fontIdToName = [];
        const fontToFormats = /* @__PURE__ */ new Map();
        this.fontMap.forEach(function(value, key) {
          fontIdToName.push(key + " = " + value.name);
          const fontName = value.name.toLowerCase();
          var format;
          if (key === mostUsedFont) {
            format = null;
          } else if (fontName.includes("bold") && (fontName.includes("oblique") || fontName.includes("italic"))) {
            format = WordFormat.BOLD_OBLIQUE;
          } else if (fontName.includes("bold")) {
            format = WordFormat.BOLD;
          } else if (fontName.includes("oblique") || fontName.includes("italic")) {
            format = WordFormat.OBLIQUE;
          } else if (fontName === maxHeightFont) {
            format = WordFormat.BOLD;
          }
          if (format) {
            fontToFormats.set(key, format.name);
          }
        });
        fontIdToName.sort();
        const newPages = parseResult.pages.map((page) => {
          return {
            ...page,
            items: page.items.map((textItem) => ({ ...textItem }))
          };
        });
        return new ParseResult({
          ...parseResult,
          pages: newPages,
          globals: {
            mostUsedHeight,
            mostUsedFont,
            mostUsedDistance,
            maxHeight,
            maxHeightFont,
            fontToFormats
          },
          messages: [
            "Items per height: " + JSON.stringify(heightToOccurrence),
            "Items per font: " + JSON.stringify(fontToOccurrence),
            "Items per distance: " + JSON.stringify(distanceToOccurrence),
            "Fonts:" + JSON.stringify(fontIdToName)
          ]
        });
      }
    };
    function getMostUsedKey(keyToOccurrence) {
      var maxOccurence = 0;
      var maxKey;
      Object.keys(keyToOccurrence).map((element) => {
        if (!maxKey || keyToOccurrence[element] > maxOccurence) {
          maxOccurence = keyToOccurrence[element];
          maxKey = element;
        }
      });
      return maxKey;
    }
  }
});

// node_modules/@opendocsg/pdf2md/lib/models/Word.js
var require_Word = __commonJS({
  "node_modules/@opendocsg/pdf2md/lib/models/Word.js"(exports, module2) {
    module2.exports = class Word {
      constructor(options) {
        this.string = options.string;
        this.type = options.type;
        this.format = options.format;
      }
    };
  }
});

// node_modules/@opendocsg/pdf2md/lib/models/LineItem.js
var require_LineItem = __commonJS({
  "node_modules/@opendocsg/pdf2md/lib/models/LineItem.js"(exports, module2) {
    var PageItem = require_PageItem();
    var Word = require_Word();
    module2.exports = class LineItem extends PageItem {
      constructor(options) {
        super(options);
        this.x = options.x;
        this.y = options.y;
        this.width = options.width;
        this.height = options.height;
        this.words = options.words || [];
        if (options.text && !options.words) {
          this.words = options.text.split(" ").filter((string) => string.trim().length > 0).map((wordAsString) => new Word({
            string: wordAsString
          }));
        }
      }
      text() {
        return this.wordStrings().join(" ");
      }
      wordStrings() {
        return this.words.map((word) => word.string);
      }
    };
  }
});

// node_modules/@opendocsg/pdf2md/lib/models/transformations/ToLineItemTransformation.js
var require_ToLineItemTransformation = __commonJS({
  "node_modules/@opendocsg/pdf2md/lib/models/transformations/ToLineItemTransformation.js"(exports, module2) {
    var Transformation = require_Transformation();
    var LineItem = require_LineItem();
    var { REMOVED_ANNOTATION } = require_Annotation();
    module2.exports = class ToLineItemTransformation extends Transformation {
      constructor(name) {
        super(name, LineItem.name);
        if (this.constructor === ToLineItemTransformation) {
          throw new TypeError("Can not construct abstract class.");
        }
      }
      completeTransform(parseResult) {
        parseResult.messages = [];
        parseResult.pages.forEach((page) => {
          page.items = page.items.filter((item) => !item.annotation || item.annotation !== REMOVED_ANNOTATION);
          page.items.forEach((item) => item.annotation = null);
        });
        return parseResult;
      }
    };
  }
});

// node_modules/@opendocsg/pdf2md/lib/util/page-item-functions.js
var require_page_item_functions = __commonJS({
  "node_modules/@opendocsg/pdf2md/lib/util/page-item-functions.js"(exports) {
    exports.minXFromBlocks = function minXFromBlocks(blocks) {
      var minX = 999;
      blocks.forEach((block) => {
        block.items.forEach((item) => {
          minX = Math.min(minX, item.x);
        });
      });
      if (minX === 999) {
        return null;
      }
      return minX;
    };
    exports.minXFromPageItems = function minXFromPageItems(items) {
      var minX = 999;
      items.forEach((item) => {
        minX = Math.min(minX, item.x);
      });
      if (minX === 999) {
        return null;
      }
      return minX;
    };
    exports.sortByX = function sortByX(items) {
      items.sort((a, b) => a.x - b.x);
    };
  }
});

// node_modules/@opendocsg/pdf2md/lib/models/TextItemLineGrouper.js
var require_TextItemLineGrouper = __commonJS({
  "node_modules/@opendocsg/pdf2md/lib/models/TextItemLineGrouper.js"(exports, module2) {
    var { sortByX } = require_page_item_functions();
    module2.exports = class TextItemLineGrouper {
      constructor(options) {
        this.mostUsedDistance = options.mostUsedDistance || 12;
      }
      // returns a CombineResult
      group(textItems) {
        const lines = [];
        var currentLine = [];
        textItems.forEach((item) => {
          if (currentLine.length > 0 && Math.abs(currentLine[0].y - item.y) >= this.mostUsedDistance / 2) {
            lines.push(currentLine);
            currentLine = [];
          }
          currentLine.push(item);
        });
        lines.push(currentLine);
        lines.forEach((textItems2) => {
          sortByX(textItems2);
        });
        return lines;
      }
    };
  }
});

// node_modules/@opendocsg/pdf2md/lib/models/markdown/WordType.js
var require_WordType = __commonJS({
  "node_modules/@opendocsg/pdf2md/lib/models/markdown/WordType.js"(exports, module2) {
    var { Enum } = require_enumify();
    var WordType = class extends Enum {
    };
    module2.exports = WordType;
    WordType.initEnum({
      LINK: {
        toText(string) {
          return `[${string}](${string})`;
        }
      },
      FOOTNOTE_LINK: {
        attachWithoutWhitespace: true,
        plainTextFormat: true,
        toText(string) {
          return `^${string}`;
        }
      },
      FOOTNOTE: {
        toText(string) {
          return `(^${string})`;
        }
      }
    });
  }
});

// node_modules/@opendocsg/pdf2md/lib/models/StashingStream.js
var require_StashingStream = __commonJS({
  "node_modules/@opendocsg/pdf2md/lib/models/StashingStream.js"(exports, module2) {
    module2.exports = class StashingStream {
      constructor() {
        if (this.constructor === StashingStream) {
          throw new TypeError("Can not construct abstract class.");
        }
        this.results = [];
        this.stash = [];
      }
      consumeAll(items) {
        items.forEach((item) => this.consume(item));
      }
      consume(item) {
        if (this.shouldStash(item)) {
          if (!this.matchesStash(item)) {
            this.flushStash();
          }
          this.pushOnStash(item);
        } else {
          if (this.stash.length > 0) {
            this.flushStash();
          }
          this.results.push(item);
        }
      }
      pushOnStash(item) {
        this.onPushOnStash(item);
        this.stash.push(item);
      }
      complete() {
        if (this.stash.length > 0) {
          this.flushStash();
        }
        return this.results;
      }
      // return true if the item matches the items of the stack
      matchesStash(item) {
        if (this.stash.length === 0) {
          return true;
        }
        const lastItem = this.stash[this.stash.length - 1];
        return this.doMatchesStash(lastItem, item);
      }
      flushStash() {
        if (this.stash.length > 0) {
          this.doFlushStash(this.stash, this.results);
          this.stash = [];
        }
      }
      onPushOnStash(item) {
      }
      shouldStash(item) {
        throw new TypeError(" Do not call abstract method foo from child." + item);
      }
      doMatchesStash(lastItem, item) {
        throw new TypeError(" Do not call abstract method foo from child." + lastItem + item);
      }
      doFlushStash(stash, results) {
        throw new TypeError(" Do not call abstract method foo from child." + stash + results);
      }
    };
  }
});

// node_modules/@opendocsg/pdf2md/lib/models/ParsedElements.js
var require_ParsedElements = __commonJS({
  "node_modules/@opendocsg/pdf2md/lib/models/ParsedElements.js"(exports, module2) {
    module2.exports = class ParsedElements {
      constructor(options) {
        this.footnoteLinks = options.footnoteLinks || [];
        this.footnotes = options.footnotes || [];
        this.containLinks = options.containLinks;
        this.formattedWords = options.formattedWords;
      }
      add(parsedElements) {
        this.footnoteLinks = this.footnoteLinks.concat(parsedElements.footnoteLinks);
        this.footnotes = this.footnotes.concat(parsedElements.footnotes);
        this.containLinks = this.containLinks || parsedElements.containLinks;
        this.formattedWords += parsedElements.formattedWords;
      }
    };
  }
});

// node_modules/@opendocsg/pdf2md/lib/models/LineConverter.js
var require_LineConverter = __commonJS({
  "node_modules/@opendocsg/pdf2md/lib/models/LineConverter.js"(exports, module2) {
    var TextItem = require_TextItem();
    var Word = require_Word();
    var WordType = require_WordType();
    var WordFormat = require_WordFormat();
    var LineItem = require_LineItem();
    var StashingStream = require_StashingStream();
    var ParsedElements = require_ParsedElements();
    var { isNumber, isListItemCharacter } = require_string_functions();
    var { sortByX } = require_page_item_functions();
    module2.exports = class LineConverter {
      constructor(fontToFormats) {
        this.fontToFormats = fontToFormats;
      }
      // returns a CombineResult
      compact(textItems) {
        sortByX(textItems);
        const wordStream = new WordDetectionStream(this.fontToFormats);
        wordStream.consumeAll(textItems.map((item) => new TextItem({ ...item })));
        const words = wordStream.complete();
        var maxHeight = 0;
        var widthSum = 0;
        textItems.forEach((item) => {
          maxHeight = Math.max(maxHeight, item.height);
          widthSum += item.width;
        });
        return new LineItem({
          x: textItems[0].x,
          y: textItems[0].y,
          height: maxHeight,
          width: widthSum,
          words,
          parsedElements: new ParsedElements({
            footnoteLinks: wordStream.footnoteLinks,
            footnotes: wordStream.footnotes,
            containLinks: wordStream.containLinks,
            formattedWords: wordStream.formattedWords
          })
        });
      }
    };
    var WordDetectionStream = class extends StashingStream {
      constructor(fontToFormats) {
        super();
        this.fontToFormats = fontToFormats;
        this.footnoteLinks = [];
        this.footnotes = [];
        this.formattedWords = 0;
        this.containLinks = false;
        this.stashedNumber = false;
      }
      shouldStash(item) {
        if (!this.firstY) {
          this.firstY = item.y;
        }
        this.currentItem = item;
        return true;
      }
      onPushOnStash(item) {
        this.stashedNumber = isNumber(item.text.trim());
      }
      doMatchesStash(lastItem, item) {
        const lastItemFormat = this.fontToFormats.get(lastItem.font);
        const itemFormat = this.fontToFormats.get(item.font);
        if (lastItemFormat !== itemFormat) {
          return false;
        }
        const itemIsANumber = isNumber(item.text.trim());
        return this.stashedNumber === itemIsANumber;
      }
      doFlushStash(stash, results) {
        if (this.stashedNumber) {
          const joinedNumber = stash.map((item) => item.text).join("").trim();
          if (stash[0].y > this.firstY) {
            results.push(new Word({
              string: `${joinedNumber}`,
              type: WordType.FOOTNOTE_LINK
            }));
            this.footnoteLinks.push(parseInt(joinedNumber));
          } else if (this.currentItem && this.currentItem.y < stash[0].y) {
            results.push(new Word({
              string: `${joinedNumber}`,
              type: WordType.FOOTNOTE
            }));
            this.footnotes.push(joinedNumber);
          } else {
            this.copyStashItemsAsText(stash, results);
          }
        } else {
          this.copyStashItemsAsText(stash, results);
        }
      }
      copyStashItemsAsText(stash, results) {
        const format = this.fontToFormats.get(stash[0].font);
        results.push(...this.itemsToWords(stash, format));
      }
      itemsToWords(items, formatName) {
        const combinedText = combineText(items);
        const words = combinedText.split(" ");
        const format = formatName ? WordFormat.enumValueOf(formatName) : null;
        return words.filter((w) => w.trim().length > 0).map((word) => {
          var type = null;
          if (word.startsWith("http:")) {
            this.containLinks = true;
            type = WordType.LINK;
          } else if (word.startsWith("www.")) {
            this.containLinks = true;
            word = `http://${word}`;
            type = WordType.LINK;
          }
          if (format) {
            this.formattedWords++;
          }
          return new Word({ string: word, type, format });
        });
      }
    };
    function combineText(textItems) {
      var text = "";
      var lastItem;
      textItems.forEach((textItem) => {
        var textToAdd = textItem.text;
        if (!text.endsWith(" ") && !textToAdd.startsWith(" ")) {
          if (lastItem) {
            const xDistance = textItem.x - lastItem.x - lastItem.width;
            if (xDistance > 5) {
              text += " ";
            }
          } else {
            if (isListItemCharacter(textItem.text)) {
              textToAdd += " ";
            }
          }
        }
        text += textToAdd;
        lastItem = textItem;
      });
      return text;
    }
  }
});

// node_modules/@opendocsg/pdf2md/lib/models/markdown/BlockType.js
var require_BlockType = __commonJS({
  "node_modules/@opendocsg/pdf2md/lib/models/markdown/BlockType.js"(exports, module2) {
    var { Enum } = require_enumify();
    function firstFormat(lineItem) {
      if (lineItem.words.length === 0) {
        return null;
      }
      return lineItem.words[0].format;
    }
    function isPunctationCharacter(string) {
      if (string.length !== 1) {
        return false;
      }
      return string[0] === "." || string[0] === "!" || string[0] === "?";
    }
    function linesToText(lineItems, disableInlineFormats) {
      var text = "";
      var openFormat;
      const closeFormat = () => {
        text += openFormat.endSymbol;
        openFormat = null;
      };
      lineItems.forEach((line, lineIndex) => {
        line.words.forEach((word, i) => {
          const wordType = word.type;
          const wordFormat = word.format;
          if (openFormat && (!wordFormat || wordFormat !== openFormat)) {
            closeFormat();
          }
          if (i > 0 && !(wordType && wordType.attachWithoutWhitespace) && !isPunctationCharacter(word.string)) {
            text += " ";
          }
          if (wordFormat && !openFormat && !disableInlineFormats) {
            openFormat = wordFormat;
            text += openFormat.startSymbol;
          }
          if (wordType && (!disableInlineFormats || wordType.plainTextFormat)) {
            text += wordType.toText(word.string);
          } else {
            text += word.string;
          }
        });
        if (openFormat && (lineIndex === lineItems.length - 1 || firstFormat(lineItems[lineIndex + 1]) !== openFormat)) {
          closeFormat();
        }
        text += "\n";
      });
      return text;
    }
    var BlockType = class extends Enum {
    };
    module2.exports = BlockType;
    BlockType.initEnum({
      H1: {
        headline: true,
        headlineLevel: 1,
        toText(block) {
          return "# " + linesToText(block.items, true);
        }
      },
      H2: {
        headline: true,
        headlineLevel: 2,
        toText(block) {
          return "## " + linesToText(block.items, true);
        }
      },
      H3: {
        headline: true,
        headlineLevel: 3,
        toText(block) {
          return "### " + linesToText(block.items, true);
        }
      },
      H4: {
        headline: true,
        headlineLevel: 4,
        toText(block) {
          return "#### " + linesToText(block.items, true);
        }
      },
      H5: {
        headline: true,
        headlineLevel: 5,
        toText(block) {
          return "##### " + linesToText(block.items, true);
        }
      },
      H6: {
        headline: true,
        headlineLevel: 6,
        toText(block) {
          return "###### " + linesToText(block.items, true);
        }
      },
      TOC: {
        mergeToBlock: true,
        toText(block) {
          return linesToText(block.items, true);
        }
      },
      FOOTNOTES: {
        mergeToBlock: true,
        mergeFollowingNonTypedItems: true,
        toText(block) {
          return linesToText(block.items, false);
        }
      },
      CODE: {
        mergeToBlock: true,
        toText(block) {
          return "```\n" + linesToText(block.items, true) + "```";
        }
      },
      LIST: {
        mergeToBlock: false,
        mergeFollowingNonTypedItemsWithSmallDistance: true,
        toText(block) {
          return linesToText(block.items, false);
        }
      },
      PARAGRAPH: {
        toText(block) {
          return linesToText(block.items, false);
        }
      }
    });
    module2.exports.isHeadline = function isHeadline(type) {
      return type && type.name.length === 2 && type.name[0] === "H";
    };
    module2.exports.blockToText = function blockToText(block) {
      if (!block.type) {
        return linesToText(block.items, false);
      }
      return block.type.toText(block);
    };
    module2.exports.headlineByLevel = function headlineByLevel(level) {
      if (level === 1) {
        return BlockType.H1;
      } else if (level === 2) {
        return BlockType.H2;
      } else if (level === 3) {
        return BlockType.H3;
      } else if (level === 4) {
        return BlockType.H4;
      } else if (level === 5) {
        return BlockType.H5;
      } else if (level === 6) {
        return BlockType.H6;
      } else {
        console.warn("Unsupported headline level: " + level + " (supported are 1-6), defaulting to level 6");
        return BlockType.H6;
      }
    };
  }
});

// node_modules/@opendocsg/pdf2md/lib/models/transformations/line-item/CompactLines.js
var require_CompactLines = __commonJS({
  "node_modules/@opendocsg/pdf2md/lib/models/transformations/line-item/CompactLines.js"(exports, module2) {
    var ToLineItemTransformation = require_ToLineItemTransformation();
    var ParseResult = require_ParseResult();
    var LineItem = require_LineItem();
    var TextItemLineGrouper = require_TextItemLineGrouper();
    var LineConverter = require_LineConverter();
    var BlockType = require_BlockType();
    var { REMOVED_ANNOTATION, ADDED_ANNOTATION } = require_Annotation();
    module2.exports = class CompactLines extends ToLineItemTransformation {
      constructor() {
        super("Compact To Lines");
      }
      transform(parseResult) {
        const { mostUsedDistance, fontToFormats } = parseResult.globals;
        const foundFootnotes = [];
        const foundFootnoteLinks = [];
        var linkCount = 0;
        var formattedWords = 0;
        const lineGrouper = new TextItemLineGrouper({
          mostUsedDistance
        });
        const lineCompactor = new LineConverter(fontToFormats);
        parseResult.pages.forEach((page) => {
          if (page.items.length > 0) {
            const lineItems = [];
            const textItemsGroupedByLine = lineGrouper.group(page.items);
            textItemsGroupedByLine.forEach((lineTextItems) => {
              const lineItem = lineCompactor.compact(lineTextItems);
              if (lineTextItems.length > 1) {
                lineItem.annotation = ADDED_ANNOTATION;
                lineTextItems.forEach((item) => {
                  item.annotation = REMOVED_ANNOTATION;
                  lineItems.push(new LineItem({
                    ...item
                  }));
                });
              }
              if (lineItem.words.length === 0) {
                lineItem.annotation = REMOVED_ANNOTATION;
              }
              lineItems.push(lineItem);
              if (lineItem.parsedElements.formattedWords) {
                formattedWords += lineItem.parsedElements.formattedWords;
              }
              if (lineItem.parsedElements.containLinks > 0) {
                linkCount++;
              }
              if (lineItem.parsedElements.footnoteLinks.length > 0) {
                const footnoteLinks = lineItem.parsedElements.footnoteLinks.map((footnoteLink) => ({ footnoteLink, page: page.index + 1 }));
                foundFootnoteLinks.push.apply(foundFootnoteLinks, footnoteLinks);
              }
              if (lineItem.parsedElements.footnotes.length > 0) {
                lineItem.type = BlockType.FOOTNOTES;
                const footnotes = lineItem.parsedElements.footnotes.map((footnote) => ({ footnote, page: page.index + 1 }));
                foundFootnotes.push.apply(foundFootnotes, footnotes);
              }
            });
            page.items = lineItems;
          }
        });
        return new ParseResult({
          ...parseResult,
          messages: [
            "Detected " + formattedWords + " formatted words",
            "Found " + linkCount + " links",
            "Detected " + foundFootnoteLinks.length + " footnotes links",
            "Detected " + foundFootnotes.length + " footnotes"
          ]
        });
      }
    };
  }
});

// node_modules/@opendocsg/pdf2md/lib/models/transformations/line-item/RemoveRepetitiveElements.js
var require_RemoveRepetitiveElements = __commonJS({
  "node_modules/@opendocsg/pdf2md/lib/models/transformations/line-item/RemoveRepetitiveElements.js"(exports, module2) {
    var ToLineItemTransformation = require_ToLineItemTransformation();
    var ParseResult = require_ParseResult();
    var { REMOVED_ANNOTATION } = require_Annotation();
    var { isDigit } = require_string_functions();
    function hashCodeIgnoringSpacesAndNumbers(string) {
      var hash = 0;
      if (string.trim().length === 0)
        return hash;
      for (var i = 0; i < string.length; i++) {
        const charCode = string.charCodeAt(i);
        if (!isDigit(charCode) && charCode !== 32 && charCode !== 160) {
          hash = (hash << 5) - hash + charCode;
          hash |= 0;
        }
      }
      return hash;
    }
    module2.exports = class RemoveRepetitiveElements extends ToLineItemTransformation {
      constructor() {
        super("Remove Repetitive Elements");
      }
      // The idea is the following:
      // - For each page, collect all items of the first, and all items of the last line
      // - Calculate how often these items occur accros all pages (hash ignoring numbers, whitespace, upper/lowercase)
      // - Delete items occuring on more then 2/3 of all pages
      transform(parseResult) {
        const pageStore = [];
        const minLineHashRepetitions = {};
        const maxLineHashRepetitions = {};
        parseResult.pages.forEach((page) => {
          const minMaxItems = page.items.reduce((itemStore, item) => {
            if (item.y < itemStore.minY) {
              itemStore.minElements = [item];
              itemStore.minY = item.y;
            } else if (item.y === itemStore.minY) {
              itemStore.minElements.push(item);
            }
            if (item.y > itemStore.maxY) {
              itemStore.maxElements = [item];
              itemStore.maxY = item.y;
            } else if (item.y === itemStore.maxY) {
              itemStore.maxElements.push(item);
            }
            return itemStore;
          }, {
            minY: 999,
            maxY: 0,
            minElements: [],
            maxElements: []
          });
          const minLineHash = hashCodeIgnoringSpacesAndNumbers(minMaxItems.minElements.reduce((combinedString, item) => combinedString + item.text().toUpperCase(), ""));
          const maxLineHash = hashCodeIgnoringSpacesAndNumbers(minMaxItems.maxElements.reduce((combinedString, item) => combinedString + item.text().toUpperCase(), ""));
          pageStore.push({
            minElements: minMaxItems.minElements,
            maxElements: minMaxItems.maxElements,
            minLineHash,
            maxLineHash
          });
          minLineHashRepetitions[minLineHash] = minLineHashRepetitions[minLineHash] ? minLineHashRepetitions[minLineHash] + 1 : 1;
          maxLineHashRepetitions[maxLineHash] = maxLineHashRepetitions[maxLineHash] ? maxLineHashRepetitions[maxLineHash] + 1 : 1;
        });
        var removedHeader = 0;
        var removedFooter = 0;
        parseResult.pages.forEach((page, i) => {
          if (minLineHashRepetitions[pageStore[i].minLineHash] >= Math.max(3, parseResult.pages.length * 2 / 3)) {
            pageStore[i].minElements.forEach((item) => {
              item.annotation = REMOVED_ANNOTATION;
            });
            removedFooter++;
          }
          if (maxLineHashRepetitions[pageStore[i].maxLineHash] >= Math.max(3, parseResult.pages.length * 2 / 3)) {
            pageStore[i].maxElements.forEach((item) => {
              item.annotation = REMOVED_ANNOTATION;
            });
            removedHeader++;
          }
        });
        return new ParseResult({
          ...parseResult,
          messages: [
            "Removed Header: " + removedHeader,
            "Removed Footers: " + removedFooter
          ]
        });
      }
    };
  }
});

// node_modules/@opendocsg/pdf2md/lib/models/transformations/line-item/VerticalToHorizontal.js
var require_VerticalToHorizontal = __commonJS({
  "node_modules/@opendocsg/pdf2md/lib/models/transformations/line-item/VerticalToHorizontal.js"(exports, module2) {
    var ToLineItemTransformation = require_ToLineItemTransformation();
    var ParseResult = require_ParseResult();
    var LineItem = require_LineItem();
    var StashingStream = require_StashingStream();
    var { REMOVED_ANNOTATION, ADDED_ANNOTATION } = require_Annotation();
    module2.exports = class VerticalToHorizontal extends ToLineItemTransformation {
      constructor() {
        super("Vertical to Horizontal Text");
      }
      transform(parseResult) {
        var foundVerticals = 0;
        parseResult.pages.forEach((page) => {
          const stream = new VerticalsStream();
          stream.consumeAll(page.items);
          page.items = stream.complete();
          foundVerticals += stream.foundVerticals;
        });
        return new ParseResult({
          ...parseResult,
          messages: ["Converted " + foundVerticals + " verticals"]
        });
      }
    };
    var VerticalsStream = class extends StashingStream {
      constructor() {
        super();
        this.foundVerticals = 0;
      }
      shouldStash(item) {
        return item.words.length === 1 && item.words[0].string.length === 1;
      }
      doMatchesStash(lastItem, item) {
        return lastItem.y - item.y > 5 && lastItem.words[0].type === item.words[0].type;
      }
      doFlushStash(stash, results) {
        if (stash.length > 5) {
          var combinedWords = [];
          var minX = 999;
          var maxY = 0;
          var sumWidth = 0;
          var maxHeight = 0;
          stash.forEach((oneCharacterLine) => {
            oneCharacterLine.annotation = REMOVED_ANNOTATION;
            results.push(oneCharacterLine);
            combinedWords.push(oneCharacterLine.words[0]);
            minX = Math.min(minX, oneCharacterLine.x);
            maxY = Math.max(maxY, oneCharacterLine.y);
            sumWidth += oneCharacterLine.width;
            maxHeight = Math.max(maxHeight, oneCharacterLine.height);
          });
          results.push(new LineItem({
            ...stash[0],
            x: minX,
            y: maxY,
            width: sumWidth,
            height: maxHeight,
            words: combinedWords,
            annotation: ADDED_ANNOTATION
          }));
          this.foundVerticals++;
        } else {
          results.push(...stash);
        }
      }
    };
  }
});

// node_modules/@opendocsg/pdf2md/lib/models/HeadlineFinder.js
var require_HeadlineFinder = __commonJS({
  "node_modules/@opendocsg/pdf2md/lib/models/HeadlineFinder.js"(exports, module2) {
    var { normalizedCharCodeArray } = require_string_functions();
    module2.exports = class HeadlineFinder {
      constructor(options) {
        this.headlineCharCodes = normalizedCharCodeArray(options.headline);
        this.stackedLineItems = [];
        this.stackedChars = 0;
      }
      consume(lineItem) {
        const normalizedCharCodes = normalizedCharCodeArray(lineItem.text());
        const matchAll = this.matchAll(normalizedCharCodes);
        if (matchAll) {
          this.stackedLineItems.push(lineItem);
          this.stackedChars += normalizedCharCodes.length;
          if (this.stackedChars === this.headlineCharCodes.length) {
            return this.stackedLineItems;
          }
        } else {
          if (this.stackedChars > 0) {
            this.stackedChars = 0;
            this.stackedLineItems = [];
            this.consume(lineItem);
          }
        }
        return null;
      }
      matchAll(normalizedCharCodes) {
        for (var i = 0; i < normalizedCharCodes.length; i++) {
          const headlineChar = this.headlineCharCodes[this.stackedChars + i];
          const textItemChar = normalizedCharCodes[i];
          if (textItemChar !== headlineChar) {
            return false;
          }
        }
        return true;
      }
    };
  }
});

// node_modules/@opendocsg/pdf2md/lib/models/transformations/line-item/DetectTOC.js
var require_DetectTOC = __commonJS({
  "node_modules/@opendocsg/pdf2md/lib/models/transformations/line-item/DetectTOC.js"(exports, module2) {
    var ToLineItemTransformation = require_ToLineItemTransformation();
    var ParseResult = require_ParseResult();
    var LineItem = require_LineItem();
    var Word = require_Word();
    var HeadlineFinder = require_HeadlineFinder();
    var { REMOVED_ANNOTATION, ADDED_ANNOTATION } = require_Annotation();
    var BlockType = require_BlockType();
    var { headlineByLevel } = require_BlockType();
    var { isDigit, isNumber, wordMatch, hasOnly } = require_string_functions();
    module2.exports = class DetectTOC extends ToLineItemTransformation {
      constructor() {
        super("Detect TOC");
      }
      transform(parseResult) {
        const tocPages = [];
        const maxPagesToEvaluate = Math.min(20, parseResult.pages.length);
        const linkLeveler = new LinkLeveler();
        var tocLinks = [];
        var lastTocPage;
        var headlineItem;
        parseResult.pages.slice(0, maxPagesToEvaluate).forEach((page) => {
          var lineItemsWithDigits = 0;
          const unknownLines = /* @__PURE__ */ new Set();
          const pageTocLinks = [];
          var lastWordsWithoutNumber;
          var lastLine;
          const tocLines = page.items.filter((line) => line.words.includes((word) => hasOnly(word.string, ".")));
          tocLines.forEach((line) => {
            var words = line.words.filter((word) => !hasOnly(word.string, "."));
            const digits = [];
            while (words.length > 0 && isNumber(words[words.length - 1].string)) {
              const lastWord = words.pop();
              digits.unshift(lastWord.string);
            }
            if (digits.length === 0 && words.length > 0) {
              const lastWord = words[words.length - 1];
              while (isDigit(lastWord.string.charCodeAt(lastWord.string.length - 1))) {
                digits.unshift(lastWord.string.charAt(lastWord.string.length - 1));
                lastWord.string = lastWord.string.substring(0, lastWord.string.length - 1);
              }
            }
            var endsWithDigit = digits.length > 0;
            if (endsWithDigit) {
              endsWithDigit = true;
              if (lastWordsWithoutNumber) {
                words.push(...lastWordsWithoutNumber);
                lastWordsWithoutNumber = null;
              }
              pageTocLinks.push(new TocLink({
                pageNumber: parseInt(digits.join("")),
                lineItem: new LineItem({ ...line, words })
              }));
              lineItemsWithDigits++;
            } else {
              if (!headlineItem) {
                headlineItem = line;
              } else {
                if (lastWordsWithoutNumber) {
                  unknownLines.add(lastLine);
                }
                lastWordsWithoutNumber = words;
                lastLine = line;
              }
            }
          });
          if (lineItemsWithDigits * 100 / page.items.length > 75) {
            tocPages.push(page.index + 1);
            lastTocPage = page;
            linkLeveler.levelPageItems(pageTocLinks);
            tocLinks.push(...pageTocLinks);
            const newBlocks = [];
            page.items.forEach((line) => {
              if (!unknownLines.has(line)) {
                line.annotation = REMOVED_ANNOTATION;
              }
              newBlocks.push(line);
              if (line === headlineItem) {
                newBlocks.push(new LineItem({
                  ...line,
                  type: BlockType.H2,
                  annotation: ADDED_ANNOTATION
                }));
              }
            });
            page.items = newBlocks;
          } else {
            headlineItem = null;
          }
        });
        var foundHeadlines = tocLinks.length;
        const notFoundHeadlines = [];
        const foundBySize = [];
        const headlineTypeToHeightRange = {};
        if (tocPages.length > 0) {
          tocLinks.forEach((tocLink) => {
            lastTocPage.items.push(new LineItem({
              words: [new Word({
                string: " ".repeat(tocLink.level * 3) + "-"
              })].concat(tocLink.lineItem.words),
              type: BlockType.TOC,
              annotation: ADDED_ANNOTATION
            }));
          });
          const pageMapping = detectPageMappingNumber(parseResult.pages.filter((page) => page.index > lastTocPage.index), tocLinks);
          tocLinks.forEach((tocLink) => {
            var linkedPage = parseResult.pages[tocLink.pageNumber + pageMapping];
            var foundHealineItems;
            if (linkedPage) {
              foundHealineItems = findHeadlineItems(linkedPage, tocLink.lineItem.text());
              if (!foundHealineItems) {
                linkedPage = parseResult.pages[tocLink.pageNumber + pageMapping + 1];
                if (linkedPage) {
                  foundHealineItems = findHeadlineItems(linkedPage, tocLink.lineItem.text());
                }
              }
            }
            if (foundHealineItems) {
              addHeadlineItems(linkedPage, tocLink, foundHealineItems, headlineTypeToHeightRange);
            } else {
              notFoundHeadlines.push(tocLink);
            }
          });
          var fromPage = lastTocPage.index + 2;
          var lastNotFound = [];
          const rollupLastNotFound = (currentPageNumber) => {
            if (lastNotFound.length > 0) {
              lastNotFound.forEach((notFoundTocLink) => {
                const headlineType = headlineByLevel(notFoundTocLink.level + 2);
                const heightRange = headlineTypeToHeightRange[headlineType.name];
                if (heightRange) {
                  const [pageIndex, lineIndex] = findPageAndLineFromHeadline(parseResult.pages, notFoundTocLink, heightRange, fromPage, currentPageNumber);
                  if (lineIndex > -1) {
                    const page = parseResult.pages[pageIndex];
                    page.items[lineIndex].annotation = REMOVED_ANNOTATION;
                    page.items.splice(lineIndex + 1, 0, new LineItem({
                      ...notFoundTocLink.lineItem,
                      type: headlineType,
                      annotation: ADDED_ANNOTATION
                    }));
                    foundBySize.push(notFoundTocLink);
                  }
                }
              });
              lastNotFound = [];
            }
          };
          if (notFoundHeadlines.length > 0) {
            tocLinks.forEach((tocLink) => {
              if (notFoundHeadlines.includes(tocLink)) {
                lastNotFound.push(tocLink);
              } else {
                rollupLastNotFound(tocLink.pageNumber);
                fromPage = tocLink.pageNumber;
              }
            });
            if (lastNotFound.length > 0) {
              rollupLastNotFound(parseResult.pages.length);
            }
          }
        }
        const messages = [];
        messages.push("Detected " + tocPages.length + " table of content pages");
        if (tocPages.length > 0) {
          messages.push("TOC headline heights: " + JSON.stringify(headlineTypeToHeightRange));
          messages.push("Found TOC headlines: " + (foundHeadlines - notFoundHeadlines.length + foundBySize.length) + "/" + foundHeadlines);
        }
        if (notFoundHeadlines.length > 0) {
          messages.push("Found TOC headlines (by size): " + foundBySize.map((tocLink) => tocLink.lineItem.text()));
          messages.push("Missing TOC headlines: " + notFoundHeadlines.filter((fTocLink) => !foundBySize.includes(fTocLink)).map((tocLink) => tocLink.lineItem.text() + "=>" + tocLink.pageNumber));
        }
        return new ParseResult({
          ...parseResult,
          globals: {
            ...parseResult.globals,
            tocPages,
            headlineTypeToHeightRange
          },
          messages
        });
      }
    };
    function detectPageMappingNumber(pages, tocLinks) {
      for (var tocLink of tocLinks) {
        const page = findPageWithHeadline(pages, tocLink.lineItem.text());
        if (page) {
          return page.index - tocLink.pageNumber;
        }
      }
      return null;
    }
    function findPageWithHeadline(pages, headline) {
      for (var page of pages) {
        if (findHeadlineItems(page, headline)) {
          return page;
        }
      }
      return null;
    }
    function findHeadlineItems(page, headline) {
      const headlineFinder = new HeadlineFinder({ headline });
      var lineIndex = 0;
      for (var line of page.items) {
        const headlineItems = headlineFinder.consume(line);
        if (headlineItems) {
          return { lineIndex, headlineItems };
        }
        lineIndex++;
      }
      return null;
    }
    function addHeadlineItems(page, tocLink, foundItems, headlineTypeToHeightRange) {
      foundItems.headlineItems.forEach((item) => item.annotation = REMOVED_ANNOTATION);
      const headlineType = headlineByLevel(tocLink.level + 2);
      const headlineHeight = foundItems.headlineItems.reduce((max, item) => Math.max(max, item.height), 0);
      page.items.splice(foundItems.lineIndex + 1, 0, new LineItem({
        ...foundItems.headlineItems[0],
        words: tocLink.lineItem.words,
        height: headlineHeight,
        type: headlineType,
        annotation: ADDED_ANNOTATION
      }));
      var range = headlineTypeToHeightRange[headlineType.name];
      if (range) {
        range.min = Math.min(range.min, headlineHeight);
        range.max = Math.max(range.max, headlineHeight);
      } else {
        range = {
          min: headlineHeight,
          max: headlineHeight
        };
        headlineTypeToHeightRange[headlineType.name] = range;
      }
    }
    function findPageAndLineFromHeadline(pages, tocLink, heightRange, fromPage, toPage) {
      const linkText = tocLink.lineItem.text().toUpperCase();
      for (var i = fromPage; i <= toPage; i++) {
        const page = pages[i - 1];
        if (page) {
          const lineIndex = page.items.findIndex((line) => {
            if (!line.type && !line.annotation && line.height >= heightRange.min && line.height <= heightRange.max) {
              const match = wordMatch(linkText, line.text());
              return match >= 0.5;
            }
            return false;
          });
          if (lineIndex > -1)
            return [i - 1, lineIndex];
        }
      }
      return [-1, -1];
    }
    var LinkLeveler = class {
      constructor() {
        this.levelByMethod = null;
        this.uniqueFonts = [];
      }
      levelPageItems(tocLinks) {
        if (!this.levelByMethod) {
          const uniqueX = this.calculateUniqueX(tocLinks);
          if (uniqueX.length > 1) {
            this.levelByMethod = this.levelByXDiff;
          } else {
            const uniqueFonts = this.calculateUniqueFonts(tocLinks);
            if (uniqueFonts.length > 1) {
              this.uniqueFonts = uniqueFonts;
              this.levelByMethod = this.levelByFont;
            } else {
              this.levelByMethod = this.levelToZero;
            }
          }
        }
        this.levelByMethod(tocLinks);
      }
      levelByXDiff(tocLinks) {
        const uniqueX = this.calculateUniqueX(tocLinks);
        tocLinks.forEach((link) => {
          link.level = uniqueX.indexOf(link.lineItem.x);
        });
      }
      levelByFont(tocLinks) {
        tocLinks.forEach((link) => {
          link.level = this.uniqueFonts.indexOf(link.lineItem.font);
        });
      }
      levelToZero(tocLinks) {
        tocLinks.forEach((link) => {
          link.level = 0;
        });
      }
      calculateUniqueX(tocLinks) {
        var uniqueX = tocLinks.reduce(function(uniquesArray, link) {
          if (uniquesArray.indexOf(link.lineItem.x) < 0)
            uniquesArray.push(link.lineItem.x);
          return uniquesArray;
        }, []);
        uniqueX.sort((a, b) => {
          return a - b;
        });
        return uniqueX;
      }
      calculateUniqueFonts(tocLinks) {
        var uniqueFont = tocLinks.reduce(function(uniquesArray, link) {
          if (uniquesArray.indexOf(link.lineItem.font) < 0)
            uniquesArray.push(link.lineItem.font);
          return uniquesArray;
        }, []);
        return uniqueFont;
      }
    };
    var TocLink = class {
      constructor(options) {
        this.lineItem = options.lineItem;
        this.pageNumber = options.pageNumber;
        this.level = 0;
      }
    };
  }
});

// node_modules/@opendocsg/pdf2md/lib/models/transformations/line-item/DetectListItems.js
var require_DetectListItems = __commonJS({
  "node_modules/@opendocsg/pdf2md/lib/models/transformations/line-item/DetectListItems.js"(exports, module2) {
    var ToLineItemTransformation = require_ToLineItemTransformation();
    var ParseResult = require_ParseResult();
    var LineItem = require_LineItem();
    var Word = require_Word();
    var { REMOVED_ANNOTATION, ADDED_ANNOTATION, DETECTED_ANNOTATION } = require_Annotation();
    var BlockType = require_BlockType();
    var { isListItemCharacter, isNumberedListItem } = require_string_functions();
    module2.exports = class DetectListItems extends ToLineItemTransformation {
      constructor() {
        super("Detect List Items");
      }
      transform(parseResult) {
        var foundListItems = 0;
        var foundNumberedItems = 0;
        parseResult.pages.forEach((page) => {
          const newItems = [];
          page.items.forEach((item) => {
            newItems.push(item);
            if (!item.type) {
              var text = item.text();
              if (isListItemCharacter(item.words[0].string)) {
                foundListItems++;
                if (item.words[0].string === "-") {
                  item.annotation = DETECTED_ANNOTATION;
                  item.type = BlockType.LIST;
                } else {
                  item.annotation = REMOVED_ANNOTATION;
                  const newWords = item.words.map((word) => new Word({
                    ...word
                  }));
                  newWords[0].string = "-";
                  newItems.push(new LineItem({
                    ...item,
                    words: newWords,
                    annotation: ADDED_ANNOTATION,
                    type: BlockType.LIST
                  }));
                }
              } else if (isNumberedListItem(text)) {
                foundNumberedItems++;
                item.annotation = DETECTED_ANNOTATION;
                item.type = BlockType.LIST;
              }
            }
          });
          page.items = newItems;
        });
        return new ParseResult({
          ...parseResult,
          messages: [
            "Detected " + foundListItems + " plain list items.",
            "Detected " + foundNumberedItems + " numbered list items."
          ]
        });
      }
    };
  }
});

// node_modules/@opendocsg/pdf2md/lib/models/transformations/line-item/DetectHeaders.js
var require_DetectHeaders = __commonJS({
  "node_modules/@opendocsg/pdf2md/lib/models/transformations/line-item/DetectHeaders.js"(exports, module2) {
    var ToLineItemTransformation = require_ToLineItemTransformation();
    var ParseResult = require_ParseResult();
    var { DETECTED_ANNOTATION } = require_Annotation();
    var BlockType = require_BlockType();
    var { headlineByLevel } = require_BlockType();
    var { isListItem } = require_string_functions();
    module2.exports = class DetectHeaders extends ToLineItemTransformation {
      constructor() {
        super("Detect Headers");
      }
      transform(parseResult) {
        const { tocPages, headlineTypeToHeightRange, mostUsedHeight, mostUsedDistance, mostUsedFont, maxHeight } = parseResult.globals;
        const hasToc = tocPages.length > 0;
        var detectedHeaders = 0;
        const pagesWithMaxHeight = findPagesWithMaxHeight(parseResult.pages, maxHeight);
        const min2ndLevelHeaderHeigthOnMaxPage = mostUsedHeight + (maxHeight - mostUsedHeight) / 4;
        pagesWithMaxHeight.forEach((titlePage) => {
          titlePage.items.forEach((item) => {
            const height = item.height;
            if (!item.type && height > min2ndLevelHeaderHeigthOnMaxPage) {
              if (height === maxHeight) {
                item.type = BlockType.H1;
              } else {
                item.type = BlockType.H2;
              }
              item.annotation = DETECTED_ANNOTATION;
              detectedHeaders++;
            }
          });
        });
        if (hasToc) {
          const headlineTypes = Object.keys(headlineTypeToHeightRange);
          headlineTypes.forEach((headlineType) => {
            var range = headlineTypeToHeightRange[headlineType];
            if (range.max > mostUsedHeight) {
              parseResult.pages.forEach((page) => {
                page.items.forEach((item) => {
                  if (!item.type && item.height === range.max) {
                    item.annotation = DETECTED_ANNOTATION;
                    item.type = BlockType.enumValueOf(headlineType);
                    detectedHeaders++;
                  }
                });
              });
            }
          });
        } else {
          const heights = [];
          var lastHeight;
          parseResult.pages.forEach((page) => {
            page.items.forEach((item) => {
              if (!item.type && item.height > mostUsedHeight && !isListItem(item.text())) {
                if (!heights.includes(item.height) && (!lastHeight || lastHeight > item.height)) {
                  heights.push(item.height);
                }
              }
            });
          });
          heights.sort((a, b) => b - a);
          heights.forEach((height, i) => {
            const headlineLevel = i + 2;
            if (headlineLevel <= 6) {
              const headlineType = headlineByLevel(2 + i);
              parseResult.pages.forEach((page) => {
                page.items.forEach((item) => {
                  if (!item.type && item.height === height && !isListItem(item.text())) {
                    detectedHeaders++;
                    item.annotation = DETECTED_ANNOTATION;
                    item.type = headlineType;
                  }
                });
              });
            }
          });
        }
        var smallesHeadlineLevel = 1;
        parseResult.pages.forEach((page) => {
          page.items.forEach((item) => {
            if (item.type && item.type.headline) {
              smallesHeadlineLevel = Math.max(smallesHeadlineLevel, item.type.headlineLevel);
            }
          });
        });
        if (smallesHeadlineLevel < 6) {
          const nextHeadlineType = headlineByLevel(smallesHeadlineLevel + 1);
          parseResult.pages.forEach((page) => {
            var lastItem;
            page.items.forEach((item) => {
              if (!item.type && item.height === mostUsedHeight && item.font !== mostUsedFont && (!lastItem || lastItem.y < item.y || lastItem.type && lastItem.type.headline || lastItem.y - item.y > mostUsedDistance * 2) && item.text() === item.text().toUpperCase()) {
                detectedHeaders++;
                item.annotation = DETECTED_ANNOTATION;
                item.type = nextHeadlineType;
              }
              lastItem = item;
            });
          });
        }
        return new ParseResult({
          ...parseResult,
          messages: [
            "Detected " + detectedHeaders + " headlines."
          ]
        });
      }
    };
    function findPagesWithMaxHeight(pages, maxHeight) {
      const maxHeaderPagesSet = /* @__PURE__ */ new Set();
      pages.forEach((page) => {
        page.items.forEach((item) => {
          if (!item.type && item.height === maxHeight) {
            maxHeaderPagesSet.add(page);
          }
        });
      });
      return maxHeaderPagesSet;
    }
  }
});

// node_modules/@opendocsg/pdf2md/lib/models/LineItemBlock.js
var require_LineItemBlock = __commonJS({
  "node_modules/@opendocsg/pdf2md/lib/models/LineItemBlock.js"(exports, module2) {
    var PageItem = require_PageItem();
    var LineItem = require_LineItem();
    module2.exports = class LineItemBlock extends PageItem {
      constructor(options) {
        super(options);
        this.items = [];
        if (options.items) {
          options.items.forEach((item) => this.addItem(item));
        }
      }
      addItem(item) {
        if (this.type && item.type && this.type !== item.type) {
          throw new Error(`Adding item of type ${item.type} to block of type ${this.type}`);
        }
        if (!this.type) {
          this.type = item.type;
        }
        if (item.parsedElements) {
          if (this.parsedElements) {
            this.parsedElements.add(item.parsedElements);
          } else {
            this.parsedElements = item.parsedElements;
          }
        }
        const copiedItem = new LineItem({ ...item });
        copiedItem.type = null;
        this.items.push(copiedItem);
      }
    };
  }
});

// node_modules/@opendocsg/pdf2md/lib/models/transformations/ToLineItemBlockTransformation.js
var require_ToLineItemBlockTransformation = __commonJS({
  "node_modules/@opendocsg/pdf2md/lib/models/transformations/ToLineItemBlockTransformation.js"(exports, module2) {
    var Transformation = require_Transformation();
    var LineItemBlock = require_LineItemBlock();
    var { REMOVED_ANNOTATION } = require_Annotation();
    module2.exports = class ToLineItemBlockTransformation extends Transformation {
      constructor(name) {
        super(name, LineItemBlock.name);
        if (this.constructor === ToLineItemBlockTransformation) {
          throw new TypeError("Can not construct abstract class.");
        }
      }
      completeTransform(parseResult) {
        parseResult.messages = [];
        parseResult.pages.forEach((page) => {
          page.items = page.items.filter((item) => !item.annotation || item.annotation !== REMOVED_ANNOTATION);
          page.items.forEach((item) => item.annotation = null);
        });
        return parseResult;
      }
    };
  }
});

// node_modules/@opendocsg/pdf2md/lib/models/transformations/line-item-block/GatherBlocks.js
var require_GatherBlocks = __commonJS({
  "node_modules/@opendocsg/pdf2md/lib/models/transformations/line-item-block/GatherBlocks.js"(exports, module2) {
    var ToLineItemBlockTransformation = require_ToLineItemBlockTransformation();
    var ParseResult = require_ParseResult();
    var LineItemBlock = require_LineItemBlock();
    var { DETECTED_ANNOTATION } = require_Annotation();
    var { minXFromPageItems } = require_page_item_functions();
    module2.exports = class GatherBlocks extends ToLineItemBlockTransformation {
      constructor() {
        super("Gather Blocks");
      }
      transform(parseResult) {
        const { mostUsedDistance } = parseResult.globals;
        var createdBlocks = 0;
        var lineItemCount = 0;
        parseResult.pages.map((page) => {
          lineItemCount += page.items.length;
          const blocks = [];
          var stashedBlock = new LineItemBlock({});
          const flushStashedItems = () => {
            if (stashedBlock.items.length > 1) {
              stashedBlock.annotation = DETECTED_ANNOTATION;
            }
            blocks.push(stashedBlock);
            stashedBlock = new LineItemBlock({});
            createdBlocks++;
          };
          var minX = minXFromPageItems(page.items);
          page.items.forEach((item) => {
            if (stashedBlock.items.length > 0 && shouldFlushBlock(stashedBlock, item, minX, mostUsedDistance)) {
              flushStashedItems();
            }
            stashedBlock.addItem(item);
          });
          if (stashedBlock.items.length > 0) {
            flushStashedItems();
          }
          page.items = blocks;
        });
        return new ParseResult({
          ...parseResult,
          messages: ["Gathered " + createdBlocks + " blocks out of " + lineItemCount + " line items"]
        });
      }
    };
    function shouldFlushBlock(stashedBlock, item, minX, mostUsedDistance) {
      if (stashedBlock.type && stashedBlock.type.mergeFollowingNonTypedItems && !item.type) {
        return false;
      }
      const lastItem = stashedBlock.items[stashedBlock.items.length - 1];
      const hasBigDistance = bigDistance(lastItem, item, minX, mostUsedDistance);
      if (stashedBlock.type && stashedBlock.type.mergeFollowingNonTypedItemsWithSmallDistance && !item.type && !hasBigDistance) {
        return false;
      }
      if (item.type !== stashedBlock.type) {
        return true;
      }
      if (item.type) {
        return !item.type.mergeToBlock;
      } else {
        return hasBigDistance;
      }
    }
    function bigDistance(lastItem, item, minX, mostUsedDistance) {
      const distance = lastItem.y - item.y;
      if (distance < 0 - mostUsedDistance / 2) {
        return true;
      }
      var allowedDisctance = mostUsedDistance + 1;
      if (lastItem.x > minX && item.x > minX) {
        allowedDisctance = mostUsedDistance + mostUsedDistance / 2;
      }
      if (distance > allowedDisctance) {
        return true;
      }
      return false;
    }
  }
});

// node_modules/@opendocsg/pdf2md/lib/models/transformations/line-item-block/DetectCodeQuoteBlocks.js
var require_DetectCodeQuoteBlocks = __commonJS({
  "node_modules/@opendocsg/pdf2md/lib/models/transformations/line-item-block/DetectCodeQuoteBlocks.js"(exports, module2) {
    var ToLineItemBlockTransformation = require_ToLineItemBlockTransformation();
    var ParseResult = require_ParseResult();
    var { DETECTED_ANNOTATION } = require_Annotation();
    var BlockType = require_BlockType();
    var { minXFromBlocks } = require_page_item_functions();
    module2.exports = class DetectCodeQuoteBlocks extends ToLineItemBlockTransformation {
      constructor() {
        super("$1");
      }
      transform(parseResult) {
        const { mostUsedHeight } = parseResult.globals;
        var foundCodeItems = 0;
        parseResult.pages.forEach((page) => {
          var minX = minXFromBlocks(page.items);
          page.items.forEach((block) => {
            if (!block.type && looksLikeCodeBlock(minX, block.items, mostUsedHeight)) {
              block.annotation = DETECTED_ANNOTATION;
              block.type = BlockType.CODE;
              foundCodeItems++;
            }
          });
        });
        return new ParseResult({
          ...parseResult,
          messages: [
            "Detected " + foundCodeItems + " code/quote items."
          ]
        });
      }
    };
    function looksLikeCodeBlock(minX, items, mostUsedHeight) {
      if (items.length === 0) {
        return false;
      }
      if (items.length === 1) {
        return items[0].x > minX && items[0].height <= mostUsedHeight + 1;
      }
      for (var item of items) {
        if (item.x === minX) {
          return false;
        }
      }
      return true;
    }
  }
});

// node_modules/@opendocsg/pdf2md/lib/models/transformations/line-item-block/DetectListLevels.js
var require_DetectListLevels = __commonJS({
  "node_modules/@opendocsg/pdf2md/lib/models/transformations/line-item-block/DetectListLevels.js"(exports, module2) {
    var ToLineItemBlockTransformation = require_ToLineItemBlockTransformation();
    var ParseResult = require_ParseResult();
    var Word = require_Word();
    var { MODIFIED_ANNOTATION, UNCHANGED_ANNOTATION } = require_Annotation();
    var BlockType = require_BlockType();
    module2.exports = class DetectListLevels extends ToLineItemBlockTransformation {
      constructor() {
        super("Level Lists");
      }
      transform(parseResult) {
        var listBlocks = 0;
        var modifiedBlocks = 0;
        parseResult.pages.forEach((page) => {
          page.items.filter((block) => block.type === BlockType.LIST).forEach((listBlock) => {
            var lastItemX;
            var currentLevel = 0;
            const xByLevel = {};
            var modifiedBlock = false;
            listBlock.items.forEach((item) => {
              const isListItem = true;
              if (lastItemX && isListItem) {
                if (item.x > lastItemX) {
                  currentLevel++;
                  xByLevel[item.x] = currentLevel;
                } else if (item.x < lastItemX) {
                  currentLevel = xByLevel[item.x];
                }
              } else {
                xByLevel[item.x] = 0;
              }
              if (currentLevel > 0) {
                item.words = [
                  new Word({ string: " ".repeat(currentLevel * 3) })
                ].concat(item.words);
                modifiedBlock = true;
              }
              lastItemX = item.x;
            });
            listBlocks++;
            if (modifiedBlock) {
              modifiedBlocks++;
              listBlock.annotation = MODIFIED_ANNOTATION;
            } else {
              listBlock.annotation = UNCHANGED_ANNOTATION;
            }
          });
        });
        return new ParseResult({
          ...parseResult,
          messages: ["Modified " + modifiedBlocks + " / " + listBlocks + " list blocks."]
        });
      }
    };
  }
});

// node_modules/@opendocsg/pdf2md/lib/models/transformations/ToTextBlocks.js
var require_ToTextBlocks = __commonJS({
  "node_modules/@opendocsg/pdf2md/lib/models/transformations/ToTextBlocks.js"(exports, module2) {
    var Transformation = require_Transformation();
    var ParseResult = require_ParseResult();
    var { blockToText } = require_BlockType();
    module2.exports = class ToTextBlocks extends Transformation {
      constructor() {
        super("To Text Blocks", "TextBlock");
      }
      transform(parseResult) {
        parseResult.pages.forEach((page) => {
          const textItems = [];
          page.items.forEach((block) => {
            const category = block.type ? block.type.name : "Unknown";
            textItems.push({
              category,
              text: blockToText(block)
            });
          });
          page.items = textItems;
        });
        return new ParseResult({
          ...parseResult
        });
      }
    };
  }
});

// node_modules/@opendocsg/pdf2md/lib/models/transformations/ToMarkdown.js
var require_ToMarkdown = __commonJS({
  "node_modules/@opendocsg/pdf2md/lib/models/transformations/ToMarkdown.js"(exports, module2) {
    var Transformation = require_Transformation();
    var ParseResult = require_ParseResult();
    module2.exports = class ToMarkdown extends Transformation {
      constructor() {
        super("To Markdown", "String");
      }
      transform(parseResult) {
        parseResult.pages.forEach((page) => {
          var text = "";
          page.items.forEach((block) => {
            let concatText;
            if (block.category === "TOC") {
              concatText = block.text;
            } else {
              concatText = block.text.replace(/(\r\n|\n|\r)/gm, " ");
            }
            if (block.category !== "LIST") {
              concatText = concatText.split("- ").join("");
            }
            if (block.category === "CODE") {
              concatText = concatText.split("`").join("");
            }
            text += concatText + "\n\n";
          });
          page.items = [text];
        });
        return new ParseResult({
          ...parseResult
        });
      }
    };
  }
});

// node_modules/@opendocsg/pdf2md/lib/util/transformations.js
var require_transformations = __commonJS({
  "node_modules/@opendocsg/pdf2md/lib/util/transformations.js"(exports) {
    var CalculateGlobalStats = require_CalculateGlobalStats();
    var CompactLines = require_CompactLines();
    var RemoveRepetitiveElements = require_RemoveRepetitiveElements();
    var VerticalToHorizontal = require_VerticalToHorizontal();
    var DetectTOC = require_DetectTOC();
    var DetectListItems = require_DetectListItems();
    var DetectHeaders = require_DetectHeaders();
    var GatherBlocks = require_GatherBlocks();
    var DetectCodeQuoteBlocks = require_DetectCodeQuoteBlocks();
    var DetectListLevels = require_DetectListLevels();
    var ToTextBlocks = require_ToTextBlocks();
    var ToMarkdown = require_ToMarkdown();
    var ParseResult = require_ParseResult();
    exports.makeTransformations = (fontMap) => [
      new CalculateGlobalStats(fontMap),
      new CompactLines(),
      new RemoveRepetitiveElements(),
      new VerticalToHorizontal(),
      new DetectTOC(),
      new DetectHeaders(),
      new DetectListItems(),
      new GatherBlocks(),
      new DetectCodeQuoteBlocks(),
      new DetectListLevels(),
      new ToTextBlocks(),
      new ToMarkdown()
    ];
    exports.transform = (pages, transformations) => {
      var parseResult = new ParseResult({ pages });
      let lastTransformation;
      transformations.forEach((transformation) => {
        if (lastTransformation) {
          parseResult = lastTransformation.completeTransform(parseResult);
        }
        parseResult = transformation.transform(parseResult);
        lastTransformation = transformation;
      });
      return parseResult;
    };
  }
});

// node_modules/@opendocsg/pdf2md/lib/util/dom-stubs.js
var require_dom_stubs = __commonJS({
  "node_modules/@opendocsg/pdf2md/lib/util/dom-stubs.js"(exports) {
    function xmlEncode(s) {
      var i = 0, ch;
      s = String(s);
      while (i < s.length && (ch = s[i]) !== "&" && ch !== "<" && ch !== '"' && ch !== "\n" && ch !== "\r" && ch !== "	") {
        i++;
      }
      if (i >= s.length) {
        return s;
      }
      var buf = s.substring(0, i);
      while (i < s.length) {
        ch = s[i++];
        switch (ch) {
          case "&":
            buf += "&amp;";
            break;
          case "<":
            buf += "&lt;";
            break;
          case '"':
            buf += "&quot;";
            break;
          case "\n":
            buf += "&#xA;";
            break;
          case "\r":
            buf += "&#xD;";
            break;
          case "	":
            buf += "&#x9;";
            break;
          default:
            buf += ch;
            break;
        }
      }
      return buf;
    }
    function DOMElement(name) {
      this.nodeName = name;
      this.childNodes = [];
      this.attributes = {};
      this.textContent = "";
      if (name === "style") {
        this.sheet = {
          cssRules: [],
          insertRule: function(rule) {
            this.cssRules.push(rule);
          }
        };
      }
    }
    DOMElement.prototype = {
      getAttribute: function DOMElement_getAttribute(name) {
        if (name in this.attributes) {
          return this.attributes[name];
        }
        return null;
      },
      getAttributeNS: function DOMElement_getAttributeNS(NS, name) {
        if (name in this.attributes) {
          return this.attributes[name];
        }
        if (NS) {
          var suffix = ":" + name;
          for (var fullName in this.attributes) {
            if (fullName.slice(-suffix.length) === suffix) {
              return this.attributes[fullName];
            }
          }
        }
        return null;
      },
      setAttribute: function DOMElement_setAttribute(name, value) {
        value = value || "";
        value = xmlEncode(value);
        this.attributes[name] = value;
      },
      setAttributeNS: function DOMElement_setAttributeNS(NS, name, value) {
        this.setAttribute(name, value);
      },
      appendChild: function DOMElement_appendChild(element) {
        var childNodes = this.childNodes;
        if (!childNodes.includes(element)) {
          childNodes.push(element);
        }
      },
      hasChildNodes: function DOMElement_hasChildNodes() {
        return this.childNodes.length !== 0;
      },
      cloneNode: function DOMElement_cloneNode() {
        var newNode = new DOMElement(this.nodeName);
        newNode.childNodes = this.childNodes;
        newNode.attributes = this.attributes;
        newNode.textContent = this.textContent;
        return newNode;
      },
      // This method is offered for convenience. It is recommended to directly use
      // getSerializer because that allows you to process the chunks as they come
      // instead of requiring the whole image to fit in memory.
      toString: function DOMElement_toString() {
        var buf = [];
        var serializer = this.getSerializer();
        var chunk;
        while ((chunk = serializer.getNext()) !== null) {
          buf.push(chunk);
        }
        return buf.join("");
      },
      getSerializer: function DOMElement_getSerializer() {
        return new DOMElementSerializer(this);
      }
    };
    function DOMElementSerializer(node) {
      this._node = node;
      this._state = 0;
      this._loopIndex = 0;
      this._attributeKeys = null;
      this._childSerializer = null;
    }
    DOMElementSerializer.prototype = {
      /**
       * Yields the next chunk in the serialization of the element.
       *
       * @returns {string|null} null if the element has fully been serialized.
       */
      getNext: function DOMElementSerializer_getNext() {
        var node = this._node;
        switch (this._state) {
          case 0:
            ++this._state;
            return "<" + node.nodeName;
          case 1:
            ++this._state;
            if (node.nodeName === "svg:svg") {
              return ' xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:svg="http://www.w3.org/2000/svg"';
            }
          case 2:
            ++this._state;
            this._loopIndex = 0;
            this._attributeKeys = Object.keys(node.attributes);
          case 3:
            if (this._loopIndex < this._attributeKeys.length) {
              var name = this._attributeKeys[this._loopIndex++];
              return " " + name + '="' + xmlEncode(node.attributes[name]) + '"';
            }
            ++this._state;
            return ">";
          case 4:
            if (node.nodeName === "svg:tspan" || node.nodeName === "svg:style") {
              this._state = 6;
              return xmlEncode(node.textContent);
            }
            ++this._state;
            this._loopIndex = 0;
          case 5:
            var value;
            while (true) {
              value = this._childSerializer && this._childSerializer.getNext();
              if (value !== null) {
                return value;
              }
              var nextChild = node.childNodes[this._loopIndex++];
              if (nextChild) {
                this._childSerializer = new DOMElementSerializer(nextChild);
              } else {
                this._childSerializer = null;
                ++this._state;
                break;
              }
            }
          case 6:
            ++this._state;
            return "</" + node.nodeName + ">";
          case 7:
            return null;
          default:
            throw new Error("Unexpected serialization state: " + this._state);
        }
      }
    };
    var document2 = {
      childNodes: [],
      get currentScript() {
        return { src: "" };
      },
      get documentElement() {
        return this;
      },
      createElementNS: function(NS, element) {
        var elObject = new DOMElement(element);
        return elObject;
      },
      createElement: function(element) {
        return this.createElementNS("", element);
      },
      getElementsByTagName: function(element) {
        if (element === "head") {
          return [this.head || (this.head = new DOMElement("head"))];
        }
        return [];
      }
    };
    function Image() {
      this._src = null;
      this.onload = null;
    }
    Image.prototype = {
      get src() {
        return this._src;
      },
      set src(value) {
        this._src = value;
        if (this.onload) {
          this.onload();
        }
      }
    };
    exports.document = document2;
    exports.Image = Image;
    var exported_symbols = Object.keys(exports);
    exports.setStubs = function(namespace) {
      exported_symbols.forEach(function(key) {
        console.assert(!(key in namespace), "property should not be set: " + key);
        namespace[key] = exports[key];
      });
    };
    exports.unsetStubs = function(namespace) {
      exported_symbols.forEach(function(key) {
        console.assert(key in namespace, "property should be set: " + key);
        delete namespace[key];
      });
    };
  }
});

// node_modules/@opendocsg/pdf2md/lib/pdf2md.js
var require_pdf2md = __commonJS({
  "node_modules/@opendocsg/pdf2md/lib/pdf2md.js"(exports, module2) {
    var { parse } = require_pdf();
    var { makeTransformations, transform } = require_transformations();
    if (typeof document === "undefined") {
      require_dom_stubs().setStubs(global);
    }
    module2.exports = async function(pdfBuffer, callbacks) {
      const result = await parse(pdfBuffer, callbacks);
      const { fonts, pages } = result;
      const transformations = makeTransformations(fonts.map);
      const parseResult = transform(pages, transformations);
      const text = parseResult.pages.map((page) => page.items.join("\n") + "\n").join("");
      return text;
    };
  }
});

// src/nodeEntry.ts
var nodeEntry_exports = {};
__export(nodeEntry_exports, {
  convertPdfToMd: () => convertPdfToMd
});
module.exports = __toCommonJS(nodeEntry_exports);

// src/impl/runPdf2md.ts
var import_fs = __toESM(require("fs"), 1);
var import_pdf2md = __toESM(require_pdf2md(), 1);
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  convertPdfToMd
});
