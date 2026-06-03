import type { ProblemDef, ProblemEditorial, SeedProblem } from './types.js';

/** Python Judge0 wrapper — reads JSON from stdin into `data`. */
export function py(body: string): string {
  const indented = body
    .split('\n')
    .map((line) => (line.length ? `    ${line}` : line))
    .join('\n');
  return `import json, sys

if __name__ == "__main__":
    data = json.loads(sys.stdin.read())
${indented}
`;
}

/** Node Judge0 wrapper — parses JSON stdin into `data`. */
export function js(body: string): string {
  return `const fs = require('fs');
const data = JSON.parse(fs.readFileSync(0, 'utf-8'));

${body}
`;
}

export function editorial(
  bruteForce: string,
  better: string,
  optimal: string,
  timeComplexity: string,
  spaceComplexity: string,
): ProblemEditorial {
  return { bruteForce, better, optimal, timeComplexity, spaceComplexity };
}

/** Java template — implement logic mirroring the Python solution. */
export function javaStub(note = 'Mirror the Python solution using the same algorithm.'): string {
  return `import java.util.*;
// ${note}
// Read JSON from stdin and print the answer (no external JSON libs).
public class Main {
    public static void main(String[] args) throws Exception {
        String raw = new String(System.in.readAllBytes()).trim();
        // TODO: parse raw JSON and solve
        System.out.print("0");
    }
}
`;
}

/** C++ template — implement logic mirroring the Python solution. */
export function cppStub(note = 'Mirror the Python solution using the same algorithm.'): string {
  return `#include <bits/stdc++.h>
using namespace std;
// ${note}
int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    string raw, line;
    while (getline(cin, line)) raw += line;
    // TODO: parse raw JSON and solve
    cout << 0;
    return 0;
}
`;
}

export function starters(
  pyBody: string,
  jsBody: string,
  java?: string,
  cpp?: string,
): Record<'PYTHON' | 'JAVASCRIPT' | 'JAVA' | 'CPP', string> {
  const pyWrapped = pyBody.includes('print(json.dumps')
    ? py(pyBody)
    : py(`${pyBody}\nprint(json.dumps(result))`);
  const jsWrapped = jsBody.includes('console.log(JSON.stringify')
    ? js(jsBody)
    : js(`${jsBody}\nconsole.log(JSON.stringify(result));`);
  return {
    PYTHON: pyWrapped,
    JAVASCRIPT: jsWrapped,
    JAVA: java ?? javaStub(),
    CPP: cpp ?? cppStub(),
  };
}

export function createProblem(def: ProblemDef): SeedProblem {
  return {
    slug: def.slug,
    title: def.title,
    difficulty: def.difficulty,
    topic: def.topic,
    tags: def.tags,
    companies: def.companies,
    description: def.description,
    fullDescription: def.fullDescription,
    constraints: def.constraints,
    examples: def.examples,
    edgeCases: def.edgeCases,
    hints: def.hints,
    followUp: def.followUp,
    editorial: def.editorial,
    relatedSlugs: def.relatedSlugs,
    orderIndex: def.orderIndex,
    starterCode: starters(def.py, def.js, def.java, def.cpp),
    testCases: def.testCases,
  };
}

// ─── Java / C++ JSON helpers for classic problems (no Gson / nlohmann) ─────

export const JAVA_JSON_UTIL = `
import java.util.*;
import java.io.*;

class Json {
    static String s;
    static int i;
    static void init(String raw) { s = raw.trim(); i = 0; }
    static void skip() { while (i < s.length() && (Character.isWhitespace(s.charAt(i)) || s.charAt(i)==',' || s.charAt(i)==':' )) i++; }
    static boolean peek(char c) { skip(); return i < s.length() && s.charAt(i) == c; }
    static void expect(char c) { skip(); if (s.charAt(i)==c) i++; }
    static String parseString() {
        skip(); expect('"'); StringBuilder b = new StringBuilder();
        while (i < s.length() && s.charAt(i) != '"') {
            if (s.charAt(i) == '\\\\') { i++; if (i < s.length()) b.append(s.charAt(i++)); }
            else b.append(s.charAt(i++));
        }
        expect('"'); return b.toString();
    }
    static int parseInt() {
        skip(); int sign = 1; if (peek('-')) { sign = -1; i++; }
        int v = 0; while (i < s.length() && Character.isDigit(s.charAt(i))) v = v * 10 + (s.charAt(i++) - '0');
        return v * sign;
    }
    static double parseDouble() {
        skip(); if (peek('"')) return Double.parseDouble(parseString());
        int sign = 1; if (peek('-')) { sign = -1; i++; }
        long whole = 0; while (i < s.length() && Character.isDigit(s.charAt(i))) whole = whole * 10 + (s.charAt(i++) - '0');
        double frac = 0, base = 0.1;
        if (peek('.')) { i++; while (i < s.length() && Character.isDigit(s.charAt(i))) { frac += (s.charAt(i++) - '0') * base; base /= 10; } }
        return sign * (whole + frac);
    }
    static boolean parseBool() { skip(); if (s.startsWith("true", i)) { i += 4; return true; } i += 5; return false; }
    static int[] parseIntArray() {
        List<Integer> list = new ArrayList<>();
        expect('[');
        if (!peek(']')) do { list.add(parseInt()); skip(); } while (peek(','));
        expect(']');
        int[] a = new int[list.size()]; for (int j = 0; j < list.size(); j++) a[j] = list.get(j);
        return a;
    }
    static String[] parseStringArray() {
        List<String> list = new ArrayList<>();
        expect('[');
        if (!peek(']')) do { list.add(parseString()); skip(); } while (peek(','));
        expect(']');
        return list.toArray(new String[0]);
    }
    static List<int[]> parseNestedIntArrays() {
        List<int[]> out = new ArrayList<>();
        expect('[');
        if (!peek(']')) do { out.add(parseIntArray()); skip(); } while (peek(','));
        expect(']');
        return out;
    }
    static Map<String, Object> parseObject() {
        Map<String, Object> m = new LinkedHashMap<>();
        expect('{');
        if (!peek('}')) do {
            String key = parseString(); skip(); expect(':');
            skip();
            if (peek('"')) m.put(key, parseString());
            else if (peek('[')) {
                if (i + 1 < s.length() && s.charAt(i + 1) == '[') m.put(key, parseNestedIntArrays());
                else if (i + 1 < s.length() && s.charAt(i + 1) == '"') m.put(key, parseStringArray());
                else m.put(key, parseIntArray());
            } else if (peek('{')) m.put(key, parseObject());
            else if (s.startsWith("true", i) || s.startsWith("false", i)) m.put(key, parseBool());
            else m.put(key, parseInt());
            skip();
        } while (peek(','));
        expect('}');
        return m;
    }
}
`;

export const CPP_JSON_UTIL = `
#include <bits/stdc++.h>
using namespace std;

static string raw;
static size_t pos = 0;

void skipWs() {
    while (pos < raw.size() && (isspace(raw[pos]) || raw[pos] == ',' || raw[pos] == ':'))
        pos++;
}

bool peek(char c) {
    skipWs();
    return pos < raw.size() && raw[pos] == c;
}

void expect(char c) {
    skipWs();
    if (pos < raw.size() && raw[pos] == c)
        pos++;
}

string parseStr() {
    skipWs();
    expect('"');
    string out;
    while (pos < raw.size() && raw[pos] != '"') {
        if (raw[pos] == '\\\\')
            pos++;
        if (pos < raw.size())
            out += raw[pos++];
    }
    expect('"');
    return out;
}

long long parseNum() {
    skipWs();
    int sign = 1;
    if (peek('-')) {
        sign = -1;
        pos++;
    }
    long long v = 0;
    while (pos < raw.size() && isdigit(raw[pos]))
        v = v * 10 + (raw[pos++] - '0');
    return v * sign;
}

vector<int> parseIntArr() {
    vector<int> a;
    expect('[');
    if (!peek(']'))
        do {
            a.push_back((int)parseNum());
            skipWs();
        } while (peek(','));
    expect(']');
    return a;
}

vector<string> parseStrArr() {
    vector<string> a;
    expect('[');
    if (!peek(']'))
        do {
            a.push_back(parseStr());
            skipWs();
        } while (peek(','));
    expect(']');
    return a;
}
`;
