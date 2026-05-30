#!/usr/bin/env node
/**
 * Eaglercraft 1.5.2 Code Translator
 * Makes deobfuscated TeaVM/Eaglercraft runtime code more readable.
 * Usage: node eaglercraft_translator.js input.js output.js
 */

const fs = require('fs');
const path = require('path');

// ─── CONFIG ──────────────────────────────────────────────────────────────────

const INPUT  = process.argv[2] || 'eaglercraft.js';
const OUTPUT = process.argv[3] || 'eaglercraft_readable.js';

// ─── RENAME MAP ──────────────────────────────────────────────────────────────
// TeaVM runtime prefix patterns → human-readable equivalents.
// Add your own entries as you discover more patterns in the 300k lines.

const RENAME_MAP = [
    [/\$rt_isInstance\b/g,'runtime_isInstance'],
    [/\$rt_isAssignable\b/g,'runtime_isAssignable'],
    [/\$rt_classWithoutFields\b/g,'runtime_createSimpleClass'],
    [/\$rt_cls\b/g,'runtime_getClass'],
    [/\$rt_erasedCls\b/g,'runtime_getRawClass'],
    [/\$rt_createArray\b/g,'runtime_createArray'],
    [/\$rt_createMultiArray\b/g,'runtime_createMultiArray'],
    [/\$rt_wrapArray\b/g,'runtime_wrapArray'],
    [/\$rt_arraycls\b/g,'runtime_getArrayClass'],
    [/\$rt_objcls\b/g,'runtime_objectClass'],
    [/\$rt_voidcls\b/g,'runtime_voidClass'],
    [/\$rt_booleancls\b/g,'runtime_booleanClass'],
    [/\$rt_bytecls\b/g,'runtime_byteClass'],
    [/\$rt_shortcls\b/g,'runtime_shortClass'],
    [/\$rt_intcls\b/g,'runtime_intClass'],
    [/\$rt_longcls\b/g,'runtime_longClass'],
    [/\$rt_floatcls\b/g,'runtime_floatClass'],
    [/\$rt_doublecls\b/g,'runtime_doubleClass'],
    [/\$rt_charcls\b/g,'runtime_charClass'],
    [/\$rt_createUnfilledArray\b/g,'runtime_createUnfilledArray'],
    [/\$rt_createLongArray\b/g,'runtime_createLongArray'],
    [/\$rt_createNumericArray\b/g,'runtime_createNumericArray'],
    [/\$rt_createCharArray\b/g,'runtime_createCharArray'],
    [/\$rt_createByteArray\b/g,'runtime_createByteArray'],
    [/\$rt_createShortArray\b/g,'runtime_createShortArray'],
    [/\$rt_createIntArray\b/g,'runtime_createIntArray'],
    [/\$rt_createBooleanArray\b/g,'runtime_createBooleanArray'],
    [/\$rt_createFloatArray\b/g,'runtime_createFloatArray'],
    [/\$rt_createDoubleArray\b/g,'runtime_createDoubleArray'],
    [/\$rt_str\b/g,'runtime_javaStringToJS'],
    [/\$rt_ustr\b/g,'runtime_jsStringToJava'],
    [/\$rt_s\b/g,'runtime_stringConstant'],
    [/\$rt_throw\b/g,'runtime_throw'],
    [/\$rt_exception\b/g,'runtime_exception'],
    [/\$rt_createException\b/g,'runtime_createException'],
    [/\$rt_compare\b/g,'runtime_compare'],
    [/\$rt_imul\b/g,'runtime_intMultiply'],
    [/\$rt_udiv\b/g,'runtime_unsignedDivide'],
    [/\$rt_umod\b/g,'runtime_unsignedMod'],
    [/\$rt_truncateByte\b/g,'runtime_truncateByte'],
    [/\$rt_truncateShort\b/g,'runtime_truncateShort'],
    [/\$rt_truncateChar\b/g,'runtime_truncateChar'],
    [/\$rt_castToByte\b/g,'runtime_castToByte'],
    [/\$rt_castToShort\b/g,'runtime_castToShort'],
    [/\$rt_castToChar\b/g,'runtime_castToChar'],
    [/\$rt_castToInt\b/g,'runtime_castToInt'],
    [/\$rt_long\b/g,'runtime_makeLong'],
    [/\$rt_llong\b/g,'runtime_longFromNumber'],
    [/\$rt_longToNumber\b/g,'runtime_longToNumber'],
    [/\$rt_suspend\b/g,'runtime_suspend'],
    [/\$rt_resume\b/g,'runtime_resume'],
    [/\$rt_nativeThread\b/g,'runtime_nativeThread'],
    [/\$rt_rootThread\b/g,'runtime_rootThread'],
    [/\$rt_init\b/g,'runtime_init'],
    [/\$rt_seed\b/g,'runtime_seed'],
    [/\$rt_nextId\b/g,'runtime_nextId'],
    [/\$rt_array\b/g,'runtime_array'],
    [/\$rt_fillStack\b/g,'runtime_fillStack'],
    [/\$rt_decodeStack\b/g,'runtime_decodeStack'],
    [/\$rt_createStackElement\b/g,'runtime_createStackElement'],
    [/\$rt_setStack\b/g,'runtime_setStack'],
    [/\$rt_createByteMultiArray\b/g,'runtime_createByteMultiArray'],
    [/\$rt_createCharMultiArray\b/g,'runtime_createCharMultiArray'],
    [/\$rt_createBooleanMultiArray\b/g,'runtime_createBooleanMultiArray'],
    [/\$rt_createShortMultiArray\b/g,'runtime_createShortMultiArray'],
    [/\$rt_createIntMultiArray\b/g,'runtime_createIntMultiArray'],
    [/\$rt_createLongMultiArray\b/g,'runtime_createLongMultiArray'],
    [/\$rt_createFloatMultiArray\b/g,'runtime_createFloatMultiArray'],
    [/\$rt_createDoubleMultiArray\b/g,'runtime_createDoubleMultiArray'],
    [/\$rt_primitiveArrayCount\b/g,'runtime_primitiveArrayCount'],
    [/\$rt_createMultiArrayImpl\b/g,'runtime_createMultiArrayImpl'],
    [/\$rt_assertNotNaN\b/g,'runtime_assertNotNaN'],
    [/\$rt_stdoutBuffer\b/g,'runtime_stdoutBuffer'],
    [/\$rt_putStdout\b/g,'runtime_putStdout'],
    [/\$rt_putStdoutCustom\b/g,'runtime_putStdoutCustom'],
    [/\$rt_stderrBuffer\b/g,'runtime_stderrBuffer'],
    [/\$rt_putStderr\b/g,'runtime_putStderr'],
    [/\$rt_putStderrCustom\b/g,'runtime_putStderrCustom'],
    [/\$rt_packageData\b/g,'runtime_packageData'],
    [/\$rt_packages\b/g,'runtime_packages'],
    [/\$rt_metadata\b/g,'runtime_metadata'],
    [/\$rt_threadStarter\b/g,'runtime_threadStarter'],
    [/\$rt_mainStarter\b/g,'runtime_mainStarter'],
    [/\$rt_stringPool_instance\b/g,'runtime_stringPool_instance'],
    [/\$rt_stringPool\b/g,'runtime_stringPool'],
    [/\$rt_eraseClinit\b/g,'runtime_eraseClinit'],
    [/\$rt_numberConversionView\b/g,'runtime_numberConversionView'],
    [/\$rt_doubleToLongBits\b/g,'runtime_doubleToLongBits'],
    [/\$rt_longBitsToDouble\b/g,'runtime_longBitsToDouble'],
    [/\$rt_floatToIntBits\b/g,'runtime_floatToIntBits'],
    [/\$rt_intBitsToFloat\b/g,'runtime_intBitsToFloat'],
    [/\$rt_javaException\b/g,'runtime_javaException'],
    [/\$rt_jsException\b/g,'runtime_jsException'],
    [/\$rt_wrapException\b/g,'runtime_wrapException'],
    [/\$dbg_class\b/g,'debug_class'],
    [/\$rt_setCloneMethod\b/g,'runtime_setCloneMethod'],
    [/\$rt_nullCheck\b/g,'runtime_nullCheck'],
    [/\$rt_intern\b/g,'runtime_intern'],
    [/\$rt_getThread\b/g,'runtime_getThread'],
    [/\$rt_setThread\b/g,'runtime_setThread'],
    [/\$rt_createStackElement\b/g,'runtime_createStackElement'],
    [/\$rt_setStack\b/g,'runtime_setStack'],
    [/\$java\b/g,'java'],
    [/\$meta\b/g,'__classMeta__'],
    [/\bjl_Object\b/g,'Java_Object'],
    [/\bjl_String\b/g,'Java_String'],
    [/\bjl_Class\b/g,'Java_Class'],
    [/\bjl_System\b/g,'Java_System'],
    [/\bjl_Math\b/g,'Java_Math'],
    [/\bjl_Integer\b/g,'Java_Integer'],
    [/\bjl_Long\b/g,'Java_Long'],
    [/\bjl_Float\b/g,'Java_Float'],
    [/\bjl_Double\b/g,'Java_Double'],
    [/\bjl_Boolean\b/g,'Java_Boolean'],
    [/\bjl_Character\b/g,'Java_Character'],
    [/\bjl_Byte\b/g,'Java_Byte'],
    [/\bjl_Short\b/g,'Java_Short'],
    [/\bjl_Throwable\b/g,'Java_Throwable'],
    [/\bjl_RuntimeException\b/g,'Java_RuntimeException'],
    [/\bjl_NullPointerException\b/g,'Java_NullPointerException'],
    [/\bjl_ArrayIndexOutOfBoundsException\b/g,'Java_ArrayIndexOutOfBoundsException'],
    [/\bjl_StringBuilder\b/g,'Java_StringBuilder'],
    [/\bjl_Thread\b/g,'Java_Thread'],
    [/\bjl_Runnable\b/g,'Java_Runnable'],
    [/\bjl_Iterable\b/g,'Java_Iterable'],
    [/\bjl_Comparable\b/g,'Java_Comparable'],
    [/\bju_ArrayList\b/g,'Java_ArrayList'],
    [/\bju_HashMap\b/g,'Java_HashMap'],
    [/\bju_HashSet\b/g,'Java_HashSet'],
    [/\bju_LinkedList\b/g,'Java_LinkedList'],
    [/\bju_Iterator\b/g,'Java_Iterator'],
    [/\bju_Arrays\b/g,'Java_Arrays'],
    [/\bju_Collections\b/g,'Java_Collections'],
    [/\bju_List\b/g,'Java_List'],
    [/\bju_Map\b/g,'Java_Map'],
    [/\bju_Set\b/g,'Java_Set'],
    [/\bnm_/g,'MC_'],// net.minecraft.*
    [/\bamu\b/g,'MC_World'],
    [/\banh\b/g,'MC_Entity'],
    [/\bvar\$\b/g,'localVar'],
    [/\$rt_createPrimitiveCls\b/g,'runtime_createPrimitiveClass'],
    [/\$rt_createcls\b/g,'runtime_createClass'],
    [/\$rt_booleanclsCache\b/g,'runtime_booleanclassCache'],
    [/\$rt_byteclsCache\b/g,'runtime_byteclassCache'],
    [/\$rt_shortclsCache\b/g,'runtime_shortclassCache'],
    [/\$rt_intclsCache\b/g,'runtime_intclassCache'],
    [/\$rt_longclsCache\b/g,'runtime_longclassCache'],
    [/\$rt_floatclsCache\b/g,'runtime_floatclassCache'],
    [/\$rt_doubleclsCache\b/g,'runtime_doubleclassCache'],
    [/\$rt_charclsCache\b/g,'runtime_charclassCache'],
    [/\$rt_voidclsCache\b/g,'runtime_voidclassCache'],
    [/\obj\b/g,'object'],
    [/\cls\b/g,'class'],
    [/\arr\b/g,'array'],
    [/\$array\b/g,'classArray'],
];

// ─── COMMENT INJECTOR ────────────────────────────────────────────────────────
// Patterns that trigger an explanatory comment above the matched line.

const COMMENT_MAP = [
    [/runtime_isInstance/,   '// [Runtime] Equivalent to Java instanceof check'],
    [/runtime_isAssignable/, '// [Runtime] Checks if one class is assignable to another (class hierarchy)'],
    [/__classMeta__/,        '// [Runtime] Class metadata object (name, superclass, interfaces, etc.)'],
    [/runtime_throw/,        '// [Runtime] Throws a Java exception into the JS runtime'],
    [/runtime_suspend/,      '// [Coroutine] Suspends the current Java "thread" (TeaVM async)'],
    [/runtime_resume/,       '// [Coroutine] Resumes a suspended Java thread'],
    [/runtime_makeLong/,     '// [Long] Creates a 64-bit integer emulated as {lo, hi}'],
    [/runtime_javaStringToJS/, '// [String] Converts Java char[] string → native JS string'],
    [/runtime_jsStringToJava/, '// [String] Converts native JS string → Java char[] string'],
    [/runtime_stringConstant/, '// [String] Interned string constant from the string pool'],
];

// ─── HELPERS ─────────────────────────────────────────────────────────────────

function applyRenames(code) {
    let result = code;
    let totalReplaced = 0;
    for (const [pattern, replacement] of RENAME_MAP) {
        const before = result;
        result = result.replace(pattern, replacement);
        // Count approximate replacements (pattern may not be global-only)
        if (before !== result) totalReplaced++;
    }
    console.log(`  → Applied ${totalReplaced} rename rule(s).`);
    return result;
}

function injectComments(code) {
    const lines = code.split('\n');
    const out   = [];
    let   added = 0;

    for (const line of lines) {
        let commented = false;
        for (const [pattern, comment] of COMMENT_MAP) {
            if (pattern.test(line) && !out[out.length - 1]?.startsWith('//')) {
                out.push(comment);
                commented = true;
                added++;
                break;
            }
        }
        out.push(line);
    }

    console.log(`  → Injected ${added} inline comment(s).`);
    return out.join('\n');
}

function addFileHeader(code, inputFile) {
    const header = `/**
 * ============================================================
 *  Eaglercraft 1.5.2 — Translated Source
 *  Generated by eaglercraft_translator.js
 *  Original file : ${path.basename(inputFile)}
 *  Translated on : ${new Date().toISOString()}
 *
 *  Naming conventions used:
 *    runtime_*   →  TeaVM JS runtime helpers  ($rt_*)
 *    Java_*      →  Java standard library classes (jl_*, ju_*)
 *    MC_*        →  Minecraft / Eaglercraft classes (nm_*)
 *    __classMeta__  →  $meta (class reflection metadata)
 * ============================================================
 */\n\n`;
    return header + code;
}

// ─── MAIN ────────────────────────────────────────────────────────────────────

(function main() {
    if (!fs.existsSync(INPUT)) {
        console.error(`[ERROR] Input file not found: ${INPUT}`);
        console.error('Usage: node eaglercraft_translator.js <input.js> <output.js>');
        process.exit(1);
    }

    const stat = fs.statSync(INPUT);
    console.log(`\n📂 Reading "${INPUT}" (${(stat.size / 1024 / 1024).toFixed(1)} MB)…`);
    const raw = fs.readFileSync(INPUT, 'utf8');
    console.log(`   ${raw.split('\n').length.toLocaleString()} lines loaded.\n`);

    console.log('🔤 Step 1 — Applying identifier renames…');
    let code = applyRenames(raw);

    console.log('\n💬 Step 2 — Injecting explanatory comments…');
    code = injectComments(code);

    console.log('\n📝 Step 3 — Adding file header…');
    code = addFileHeader(code, INPUT);

    console.log(`\n💾 Writing output to "${OUTPUT}"…`);
    fs.writeFileSync(OUTPUT, code, 'utf8');

    const outStat = fs.statSync(OUTPUT);
    console.log(`✅ Done! Output: ${(outStat.size / 1024 / 1024).toFixed(1)} MB\n`);
})();